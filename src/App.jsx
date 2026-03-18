import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Student from "./pages/Student"
import Client from "./pages/Client"
import Admin from "./pages/Admin"
import PostProject from "./pages/PostProject"
import Chat from "./pages/Chat"
import SubmitWork from "./pages/SubmitWork"

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Profile */}
      <Route path="/profile" element={<Profile />} />

      {/* Dashboards */}
      <Route path="/student" element={<Student />} />
      <Route path="/client" element={<Client />} />
      <Route path="/admin" element={<Admin />} />

      {/* Project */}
      <Route path="/post-project" element={<PostProject />} />
      <Route path="/submit/:projectId" element={<SubmitWork />} />

      {/* Chat */}
      <Route path="/chat/:projectId" element={<Chat />} />

    </Routes>
  )
}

export default App
