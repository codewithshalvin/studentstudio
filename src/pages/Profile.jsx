import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {

  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    navigate("/login")
  }

  const user = JSON.parse(storedUser)

  const [formData, setFormData] = useState({
    skills: []
  })
  const [resume, setResume] = useState(null)

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, e.target.value]
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          skills: prev.skills.filter(skill => skill !== e.target.value)
        }))
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append("email", user.email)

    Object.keys(formData).forEach(key => {
      if (key === "skills") {
        formData.skills.forEach(skill =>
          data.append("skills", skill)
        )
      } else {
        data.append(key, formData[key])
      }
    })

    if (resume) {
      data.append("resume", resume)
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        body: data
      })

      const result = await res.json()

      if (!res.ok) {
        alert("Error saving profile")
        return
      }

      alert(result.message)

      // ✅ Update user in localStorage
      localStorage.setItem("user", JSON.stringify(result.user))

      // ✅ Redirect to dashboard
      if (result.user.role === "admin") {
        navigate("/admin")
      } else if (result.user.role === "client") {
        navigate("/client")
      } else {
        navigate("/student")
      }

    } catch (err) {
      console.log(err)
      alert("Server error")
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Profile Setup</h2>

      <form onSubmit={handleSubmit}>

        {user.role === "student" && (
          <>
            <input name="year" placeholder="Year" onChange={handleChange} /><br/><br/>
            <input name="college" placeholder="College" onChange={handleChange} /><br/><br/>
            <input name="department" placeholder="Department" onChange={handleChange} /><br/><br/>
            <input name="address" placeholder="Address" onChange={handleChange} /><br/><br/>

            <label>Skills:</label><br/>
            <input type="checkbox" value="Logo Design" onChange={handleChange}/> Logo<br/>
            <input type="checkbox" value="Web Page" onChange={handleChange}/> Web Page<br/>
            <input type="checkbox" value="Web App" onChange={handleChange}/> Web App<br/>
            <input type="checkbox" value="Mobile App" onChange={handleChange}/> Mobile App<br/>
            <input type="checkbox" value="Posters" onChange={handleChange}/> Posters<br/><br/>

            <input name="github" placeholder="GitHub Link" onChange={handleChange} /><br/><br/>
            <input name="linkedin" placeholder="LinkedIn Link" onChange={handleChange} /><br/><br/>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
            /><br/><br/>
          </>
        )}

        {user.role === "client" && (
          <>
            <input name="companyName" placeholder="Company Name" onChange={handleChange} /><br/><br/>
            <input name="industry" placeholder="Industry" onChange={handleChange} /><br/><br/>
            <input name="companyAddress" placeholder="Company Address" onChange={handleChange} /><br/><br/>
            <input name="companyLinkedin" placeholder="Company LinkedIn" onChange={handleChange} /><br/><br/>
          </>
        )}

        <button type="submit">Save Profile</button>

      </form>
    </div>
  )
}

export default Profile
