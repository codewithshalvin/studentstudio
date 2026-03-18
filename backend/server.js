const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const multer = require("multer")
require("dotenv").config()

// -------------------- APP + SERVER --------------------
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// -------------------- MONGODB --------------------
mongoose.connect(
  process.env.MONGO_URI ||
  "mongodb+srv://shalvinfelciaa:sample123@cluster0.ovqcdji.mongodb.net/campus?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

// -------------------- MODELS --------------------
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String,

  profileCompleted: {
    type: Boolean,
    default: false
  },

  year: String,
  college: String,
  department: String,
  address: String,
  resume: String,
  skills: [String],
  github: String,
  linkedin: String,

  companyName: String,
  industry: String,
  companyAddress: String,
  companyLinkedin: String
})

const Project = mongoose.model("Project", {
  title: String,
  description: String,
  days: Number,
  budget: Number,
  clientEmail: String,
  clientCompany: String,

  status: {
    type: String,
    default: "open"
    // open | assigned | submitted | verified | completed
  },

  approvedStudent: String,

  // ✅ applications array added to schema
  applications: [
    {
      studentEmail: String,
      status: { type: String, default: "pending" }
    }
  ],

  // ✅ submission now stores description + link (not file)
  submission: {
    description: String,
    link: String,
    submittedAt: Date,
    adminStatus: {
      type: String,
      default: "pending"   // pending | approved | rejected
    },
    clientStatus: {
      type: String,
      default: "waiting"   // waiting | approved | rejected
    }
  },

  paymentStatus: {
    type: String,
    default: "unpaid"   // unpaid | paidToAdmin | paidToStudent
  }
})

const Chat = mongoose.model("Chat", {
  projectId: String,
  senderEmail: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

// -------------------- MULTER (for resume uploads only) --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

// -------------------- SOCKET.IO --------------------
io.on("connection", (socket) => {

  console.log("User connected:", socket.id)

  socket.on("joinProject", (projectId) => {
    socket.join(projectId)
  })

  socket.on("sendMessage", async (data) => {

    const newMessage = new Chat({
      projectId: data.projectId,
      senderEmail: data.senderEmail,
      message: data.message
    })

    await newMessage.save()

    io.to(data.projectId).emit("receiveMessage", newMessage)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

// -------------------- AUTH --------------------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "User already exists" })

    const newUser = new User({ name, email, password, role })
    await newUser.save()

    res.json({ message: "User registered successfully" })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email, password })
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" })

    res.json({
      message: "Login successful",
      user
    })

  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// -------------------- PROFILE --------------------
app.post("/api/profile", upload.single("resume"), async (req, res) => {
  try {
    const email = req.body.email

    const updateData = {
      ...req.body,
      profileCompleted: true
    }

    if (req.file)
      updateData.resume = req.file.filename

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    )

    res.json({
      message: "Profile updated successfully",
      user
    })

  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// -------------------- PROJECT --------------------
app.post("/api/projects", async (req, res) => {
  try {
    const newProject = new Project(req.body)
    await newProject.save()
    res.json({ message: "Project Posted Successfully" })
  } catch {
    res.status(500).json({ message: "Server Error" })
  }
})

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 })
  res.json(projects)
})

app.post("/api/projects/:id/apply", async (req, res) => {
  try {
    const { studentEmail } = req.body
    const project = await Project.findById(req.params.id)

    const alreadyApplied = project.applications.find(
      app => app.studentEmail === studentEmail
    )

    if (alreadyApplied)
      return res.json({ message: "Already Applied" })

    project.applications.push({ studentEmail })
    await project.save()

    res.json({ message: "Application Submitted" })

  } catch {
    res.status(500).json({ message: "Server Error" })
  }
})

app.post("/api/projects/:id/approve", async (req, res) => {
  try {
    const { studentEmail } = req.body
    const project = await Project.findById(req.params.id)

    project.applications.forEach(app => {
      app.status =
        app.studentEmail === studentEmail
          ? "approved"
          : "rejected"
    })

    project.status = "assigned"
    project.approvedStudent = studentEmail

    await project.save()

    res.json({ message: "Student Approved" })

  } catch {
    res.status(500).json({ message: "Server Error" })
  }
})

// ✅ FIXED: accepts JSON (description + link), not file upload
app.post("/api/projects/:id/submit", async (req, res) => {
  try {
    const { studentEmail, description, link } = req.body
    const project = await Project.findById(req.params.id)

    if (!project)
      return res.status(404).json({ message: "Project not found" })

    if (project.approvedStudent !== studentEmail)
      return res.status(403).json({ message: "Not authorized to submit" })

    project.submission = {
      description,
      link,
      submittedAt: new Date(),
      adminStatus: "pending",
      clientStatus: "waiting"
    }

    project.status = "submitted"
    await project.save()

    res.json({ message: "Submitted to Admin" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// -------------------- GET STUDENT --------------------
app.get("/api/student/:email", async (req, res) => {
  const student = await User.findOne({ email: req.params.email })
  if (!student)
    return res.status(404).json({ message: "Student not found" })

  res.json(student)
})

// -------------------- CHAT --------------------
app.get("/api/chat/:projectId", async (req, res) => {
  const messages = await Chat.find({
    projectId: req.params.projectId
  }).sort({ createdAt: 1 })

  res.json(messages)
})

// -------------------- GET ALL USERS --------------------
app.get("/api/users", async (req, res) => {
  const users = await User.find()
  res.json(users)
})

// -------------------- SERVER START --------------------
server.listen(5000, () =>
  console.log("Server running on port 5000")
)