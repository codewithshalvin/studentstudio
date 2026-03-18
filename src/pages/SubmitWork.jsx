import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

function SubmitWork() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ projectId in the URL, JSON body (not FormData)
      const res = await fetch(`https://studentstudio-1.onrender.com/${projectId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: user.email,
          description,
          link
        })
      })

      const data = await res.json()
      alert(data.message)
      navigate("/student")

    } catch (err) {
      console.log(err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f4f0; }

        .submit-root {
          min-height: 100vh;
          background: #f5f4f0;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .submit-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }

        .submit-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c8a96e, transparent);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #aaa;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 28px;
          transition: color 0.15s;
        }

        .back-btn:hover { color: #9b7c3a; }

        .submit-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #9b7c3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .submit-title {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #1a1a2e;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .submit-subtitle {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
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
          color: #ccc;
          pointer-events: none;
        }

        .field-icon.top { top: 13px; }
        .field-icon.middle { top: 50%; transform: translateY(-50%); }

        .field input, .field textarea {
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
          resize: none;
        }

        .field textarea {
          min-height: 120px;
          line-height: 1.6;
        }

        .field input:focus, .field textarea:focus {
          border-color: #c8a96e;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
          background: #fff;
        }

        .field input::placeholder, .field textarea::placeholder { color: #ccc; }

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
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) { background: #2e2e4e; border-color: #2e2e4e; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="submit-root">
        <div className="submit-card">

          <button className="back-btn" onClick={() => navigate("/student")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </button>

          <div className="submit-eyebrow">Project Submission</div>
          <h1 className="submit-title">Submit Your Work</h1>
          <p className="submit-subtitle">Share what you've built. Add a description and a link to your deliverable.</p>

          <form onSubmit={handleSubmit}>

            <div className="field">
              <label>Work Description</label>
              <div className="field-wrap">
                <svg className="field-icon top" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <textarea
                  placeholder="Describe what you've completed..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Deliverable Link</label>
              <div className="field-wrap">
                <svg className="field-icon middle" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <input
                  type="url"
                  placeholder="https://github.com/your-repo or drive link..."
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting…" : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Submit Work
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default SubmitWork