import { useState } from "react"
import { useNavigate } from "react-router-dom"

function PostProject() {

  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    days: "",
    budget: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        clientEmail: user.email,
        clientCompany: user.companyName
      })
    })

    const data = await res.json()
    alert(data.message)
    navigate("/client")
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Post New Project</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Project Title" onChange={handleChange} /><br/><br/>
        <textarea name="description" placeholder="Project Description" onChange={handleChange}></textarea><br/><br/>
        <input name="days" placeholder="Days Required" onChange={handleChange} /><br/><br/>
        <input name="budget" placeholder="Budget (₹)" onChange={handleChange} /><br/><br/>

        <button type="submit">Post Project</button>
      </form>
    </div>
  )
}

export default PostProject
