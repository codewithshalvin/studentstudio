import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Client() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [projects, setProjects] = useState([])
  const [approvedStudent, setApprovedStudent] = useState(null)
  const [activeProjectId, setActiveProjectId] = useState(null)

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    fetch("https://studentstudio-1.onrender.com")
      .then(res => res.json())
      .then(data => setProjects(data.filter(p => p.clientEmail === user.email)))
      .catch(err => console.log(err))
  }, [])

  const fetchStudentDetails = async (email, projectId) => {
    const res = await fetch(`https://studentstudio-1.onrender.com/api/student/${email}`)
    const data = await res.json()
    setApprovedStudent(data)
    setActiveProjectId(projectId)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f4f0; }

        .client-root {
          min-height: 100vh;
          background: #f5f4f0;
          color: #1a1a2e;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        /* ── Topbar ── */
        .topbar {
          background: #ffffff;
          border-bottom: 1px solid #e8e4dc;
          padding: 0 48px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .topbar-logo span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #9b7c3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-left: 10px;
          vertical-align: middle;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          background: #fdf8f0;
          border: 1px solid #ede4d0;
          border-radius: 8px;
        }

        .topbar-avatar {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #c8a96e, #8b6914);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }

        .topbar-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a2e;
        }

        .topbar-role {
          font-size: 11px;
          color: #9b7c3a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid #e0ddd8;
          color: #888;
        }

        .btn-ghost:hover { border-color: #c8a96e55; color: #9b7c3a; background: #fdf8f0; }

        .btn-danger {
          background: transparent;
          border: 1px solid #e0ddd8;
          color: #aaa;
        }

        .btn-danger:hover { border-color: #e05252; color: #e05252; background: #fff5f5; }

        .btn-primary {
          background: #c8a96e;
          border: 1px solid #c8a96e;
          color: #fff;
        }

        .btn-primary:hover { background: #b8994e; border-color: #b8994e; }

        .btn-green {
          background: #3a8a3a;
          border: 1px solid #3a8a3a;
          color: #fff;
        }

        .btn-green:hover { background: #2d6e2d; border-color: #2d6e2d; }

        /* ── Main ── */
        .main {
          padding: 40px 48px;
          max-width: 900px;
        }

        /* ── Company card ── */
        .company-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 36px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .company-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #c8a96e, transparent);
        }

        .company-icon {
          width: 52px; height: 52px;
          background: #fdf8f0;
          border: 1px solid #ede4d0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #c8a96e;
          flex-shrink: 0;
        }

        .company-info { flex: 1; }

        .company-name {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .company-industry {
          font-size: 13px;
          color: #aaa;
          margin-top: 3px;
        }

        /* ── Section header ── */
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .project-count {
          font-size: 12px;
          color: #aaa;
          background: #f0ede8;
          padding: 3px 10px;
          border-radius: 20px;
        }

        /* ── Project card ── */
        .project-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
          transition: all 0.18s;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        .project-card:hover { border-color: #c8a96e55; box-shadow: 0 4px 16px rgba(200,169,110,0.08); }

        .project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 12px;
        }

        .project-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1a2e;
          letter-spacing: -0.2px;
        }

        .project-desc {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 20px;
          flex-shrink: 0;
          letter-spacing: 0.5px;
          text-transform: capitalize;
        }

        .status-open { background: #edf7ed; color: #3a8a3a; border: 1px solid #c8e6c8; }
        .status-assigned { background: #fdf5e6; color: #9b7c3a; border: 1px solid #edd8a0; }
        .status-closed { background: #fdedf0; color: #c03030; border: 1px solid #f0c0c0; }
        .status-default { background: #f5f4f0; color: #aaa; border: 1px solid #e0ddd8; }

        .divider { height: 1px; background: #f0ece4; margin: 16px 0; }

        .assigned-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #edf7ed;
          border: 1px solid #c8e6c8;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 14px;
        }

        .assigned-banner-icon {
          font-size: 16px;
        }

        .assigned-banner-text {
          font-size: 13px;
          font-weight: 500;
          color: #3a8a3a;
          flex: 1;
        }

        .student-link {
          font-size: 13px;
          color: #5a78cc;
          cursor: pointer;
          transition: color 0.15s;
          font-weight: 500;
        }

        .student-link:hover { color: #9b7c3a; text-decoration: underline; }

        .project-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        /* ── Empty state ── */
        .empty-state {
          background: #ffffff;
          border: 1px dashed #e0ddd8;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1a2e;
          margin-bottom: 6px;
        }

        .empty-sub { font-size: 13px; color: #bbb; margin-bottom: 20px; }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30,25,20,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 16px;
          padding: 36px;
          width: 440px;
          max-width: 95vw;
          animation: slideUp 0.22s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0ece4;
        }

        .modal-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #fdf8f0;
          border: 1px solid #ede4d0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #c8a96e;
        }

        .modal-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1a1a2e; }
        .modal-subtitle { font-size: 13px; color: #bbb; margin-top: 2px; }

        .modal-field { display: flex; flex-direction: column; margin-bottom: 16px; }

        .modal-field-label {
          font-size: 10px;
          font-weight: 600;
          color: #ccc;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .modal-field-value {
          font-size: 14px;
          color: #3a3a4e;
          background: #fafaf8;
          border: 1px solid #eeebe4;
          border-radius: 8px;
          padding: 10px 14px;
          line-height: 1.5;
        }

        .resume-link {
          color: #9b7c3a;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
        }

        .resume-link:hover { opacity: 0.7; }

        .modal-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0ece4;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .close-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 24px;
          background: #f5f4f0;
          border: 1px solid #e0ddd8;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .close-btn:hover { background: #eee9e0; color: #1a1a2e; }
      `}</style>

      <div className="client-root">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-logo">
            ClientPanel <span>Dashboard</span>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Edit Profile
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/post-project")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Post Project
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">{user?.companyName?.[0]?.toUpperCase()}</div>
              <div>
                <div className="topbar-name">{user?.companyName}</div>
                <div className="topbar-role">Client</div>
              </div>
            </div>
            <button className="btn btn-danger" onClick={() => { localStorage.clear(); navigate("/login") }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="main">

          {/* Company card */}
          <div className="company-card">
            <div className="company-icon">{user?.companyName?.[0]?.toUpperCase()}</div>
            <div className="company-info">
              <div className="company-name">{user?.companyName}</div>
              <div className="company-industry">{user?.industry}</div>
            </div>
          </div>

          {/* Projects */}
          <div className="section-header">
            <div className="section-title">Your Projects</div>
            <span className="project-count">{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No projects posted yet</div>
              <div className="empty-sub">Post your first project to start receiving applications from students.</div>
              <button className="btn btn-primary" onClick={() => navigate("/post-project")}>
                Post a Project
              </button>
            </div>
          ) : projects.map(project => {
            const statusClass = { open: "status-open", assigned: "status-assigned", closed: "status-closed" }[project.status] || "status-default"
            return (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <div className="project-title">{project.title}</div>
                  <span className={`status-badge ${statusClass}`}>{project.status}</span>
                </div>
                <p className="project-desc">{project.description}</p>

                {project.status === "assigned" && (
                  <>
                    <div className="assigned-banner">
                      <span className="assigned-banner-icon">✅</span>
                      <span className="assigned-banner-text">Student confirmed for this project</span>
                      <span
                        className="student-link"
                        onClick={() => fetchStudentDetails(project.approvedStudent, project._id)}
                      >
                        {project.approvedStudent}
                      </span>
                    </div>
                    <div className="project-actions">
                      <button className="btn btn-green" onClick={() => navigate(`/chat/${project._id}`)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Open Chat
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}

        </main>

        {/* Student Modal */}
        {approvedStudent && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setApprovedStudent(null), setActiveProjectId(null))}>
            <div className="modal">
              <div className="modal-header">
                <div className="modal-avatar">{approvedStudent.name?.[0]?.toUpperCase()}</div>
                <div>
                  <div className="modal-title">{approvedStudent.name}</div>
                  <div className="modal-subtitle">{approvedStudent.email}</div>
                </div>
              </div>

              {[
                { label: "College", value: approvedStudent.college },
                { label: "Department", value: approvedStudent.department },
                { label: "Skills", value: approvedStudent.skills?.join(", ") || "—" },
              ].map(f => (
                <div key={f.label} className="modal-field">
                  <div className="modal-field-label">{f.label}</div>
                  <div className="modal-field-value">{f.value || "—"}</div>
                </div>
              ))}

              {approvedStudent.resume && (
                <div className="modal-field">
                  <div className="modal-field-label">Resume</div>
                  <div className="modal-field-value">
                    <a
                      href={`https://studentstudio-1.onrender.com/uploads/${approvedStudent.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      View Resume
                    </a>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button className="close-btn" onClick={() => { setApprovedStudent(null); setActiveProjectId(null) }}>Close</button>
                <button className="btn btn-green" onClick={() => navigate(`/chat/${activeProjectId}`)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Open Chat
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default Client