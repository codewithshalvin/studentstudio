import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("https://studentstudio-1.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        alert("Signup Successful")
        console.log(data)
      } else {
        alert(data.message || "Signup failed")
      }
    } catch (err) {
      console.log(err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: "student", label: "Student", desc: "Apply to client projects" },
    { value: "client", label: "Client", desc: "Post projects & hire students" },
    { value: "admin", label: "Admin", desc: "Platform administration" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f4f0; }

        .signup-root {
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .signup-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .signup-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }

        .signup-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c8a96e, transparent);
        }

        .signup-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #9b7c3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
          text-align: center;
        }

        .signup-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          color: #1a1a2e;
          letter-spacing: -0.5px;
          text-align: center;
          margin-bottom: 6px;
        }

        .signup-subtitle {
          font-size: 13px;
          color: #aaa;
          text-align: center;
          margin-bottom: 36px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }

        .field label {
          font-size: 11px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .field-wrap { position: relative; }

        .field-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #ccc;
          pointer-events: none;
        }

        .field input {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          padding: 11px 14px 11px 38px;
          border: 1px solid #e0ddd8;
          border-radius: 8px;
          background: #fafaf8;
          color: #1a1a2e;
          outline: none;
          transition: all 0.18s;
        }

        .field input:focus {
          border-color: #c8a96e;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
          background: #fff;
        }

        .field input::placeholder { color: #ccc; }

        /* ── Role selector ── */
        .role-label {
          font-size: 11px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .role-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .role-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border: 1px solid #e0ddd8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          background: #fafaf8;
        }

        .role-option:hover { border-color: #c8a96e55; background: #fdf8f0; }

        .role-option.selected {
          border-color: #c8a96e;
          background: #fdf8f0;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }

        .role-radio {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid #d0cdc8;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.18s;
        }

        .role-option.selected .role-radio {
          border-color: #c8a96e;
        }

        .role-radio-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #c8a96e;
          display: none;
        }

        .role-option.selected .role-radio-dot { display: block; }

        .role-text { flex: 1; }

        .role-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a2e;
        }

        .role-desc {
          font-size: 11px;
          color: #bbb;
          margin-top: 1px;
        }

        .submit-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          width: 100%;
          padding: 12px;
          background: #1a1a2e;
          border: 1px solid #1a1a2e;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) { background: #2e2e4e; border-color: #2e2e4e; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line { flex: 1; height: 1px; background: #f0ece4; }
        .divider-text { font-size: 12px; color: #ccc; }

        .login-prompt {
          text-align: center;
          font-size: 13px;
          color: #aaa;
        }

        .login-link {
          color: #9b7c3a;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .login-link:hover { opacity: 0.75; text-decoration: underline; }
      `}</style>

      <div className="signup-root">
        <Navbar />

        <div className="signup-body">
          <div className="signup-card">
            <div className="signup-eyebrow">Get started</div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join the platform as a student or client</p>

            <form onSubmit={handleSubmit}>

              <div className="field">
                <label>Full Name</label>
                <div className="field-wrap">
                  <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
                </div>
              </div>

              <div className="field">
                <label>Email</label>
                <div className="field-wrap">
                  <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="field-wrap">
                  <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                </div>
              </div>

              <div className="role-label">I am a</div>
              <div className="role-options">
                {roles.map(r => (
                  <div
                    key={r.value}
                    className={`role-option ${formData.role === r.value ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, role: r.value })}
                  >
                    <div className="role-radio">
                      <div className="role-radio-dot" />
                    </div>
                    <div className="role-text">
                      <div className="role-name">{r.label}</div>
                      <div className="role-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account…" : (
                  <>
                    Create Account
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <p className="login-prompt">
              Already have an account?{" "}
              <span className="login-link" onClick={() => navigate("/login")}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup