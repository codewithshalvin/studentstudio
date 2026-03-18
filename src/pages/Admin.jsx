import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Admin() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [activeTab, setActiveTab] = useState("projects")

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    fetch("https://studentstudio-1.onrender.com").then(r => r.json()).then(setProjects)
    fetch("https://studentstudio-1.onrender.com/api/users").then(r => r.json()).then(setUsers)
  }, [])

  const students = users.filter(u => u.role === "student")
  const clients = users.filter(u => u.role === "client")

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f4f0; }

        .admin-root {
          min-height: 100vh;
          background: #f5f4f0;
          color: #1a1a2e;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        /* ── Sidebar ── */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 260px; height: 100vh;
          background: #b1afaf;
          border-right: 1px solid #e8e4dc;
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          z-index: 100;
          box-shadow: 2px 0 16px rgba(0,0,0,0.04);
        }

        .sidebar-logo {
          padding: 0 28px 32px;
          border-bottom: 1px solid #eee9e0;
        }

        .sidebar-logo h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .sidebar-logo span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #9b7c3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-top: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #646464;
          transition: all 0.18s ease;
          border: none;
          background: transparent;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover { color: #1a1a2e; background: #f5f4f0; }

        .nav-item.active {
          background: #fdf8f0;
          color: #1a1a2e;
          font-weight: 500;
          border: 1px solid #e8d9b8;
        }

        .nav-item.active .nav-dot { background: #c8a96e; }

        .nav-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #d0cdc8;
          flex-shrink: 0;
          transition: background 0.18s;
        }

        .nav-count {
          margin-left: auto;
          font-size: 11px;
          background: #f0ede8;
          color: #aaa;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .nav-item.active .nav-count { background: #f5e8c8; color: #9b7c3a; }

        .sidebar-footer {
          padding: 20px 16px;
          border-top: 1px solid #eee9e0;
        }

        .admin-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #fdf8f0;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid #ede4d0;
        }

        .avatar {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #c8a96e, #8b6914);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .admin-info { flex: 1; min-width: 0; }

        .admin-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a2e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-role {
          font-size: 11px;
          color: #9b7c3a;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .commission-tag {
          font-size: 11px;
          color: #444343;
          text-align: center;
          padding: 6px 0;
        }

        .commission-tag strong { color: #9b7c3a; }

        .logout-btn {
          width: 100%;
          padding: 9px 14px;
          background: transparent;
          border: 1px solid #e0ddd8;
          border-radius: 8px;
          color: #aaa;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .logout-btn:hover { border-color: #e05252; color: #e05252; background: #fff5f5; }

        /* ── Main ── */
        .main {
          margin-left: 260px;
          padding: 40px 48px;
          min-height: 100vh;
        }

        .page-header { margin-bottom: 36px; }

        .page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #1a1a2e;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .page-subtitle {
          font-size: 14px;
          color: #363535;
          margin-top: 4px;
        }

        /* ── Stats row ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 22px 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c8a96e, transparent);
        }

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #4a4949;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          color: #1a1a2e;
          line-height: 1;
        }

        /* ── User grid ── */
        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
          margin-bottom: 40px;
        }

        .user-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.18s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }

        .user-card:hover { border-color: #c8a96e66; box-shadow: 0 2px 12px rgba(200,169,110,0.1); }

        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #fdf8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #c8a96e;
          flex-shrink: 0;
          border: 1px solid #ede4d0;
        }

        .user-info { flex: 1; min-width: 0; }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: #2a2a3e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 12px;
          color: #bbb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        .student-link { cursor: pointer; }
        .student-link:hover .user-name { color: #9b7c3a; }

        /* ── Project cards ── */
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
          margin-bottom: 12px;
          gap: 12px;
        }

        .project-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #1a1a2e;
          letter-spacing: -0.2px;
        }

        .project-company {
          font-size: 13px;
          color: #bbb;
          margin-top: 2px;
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
        .status-closed { background: #fdedf0; color: #c03030; border: 1px solid #f0c0c0; }
        .status-pending { background: #fdf5e6; color: #9b7c3a; border: 1px solid #edd8a0; }
        .status-default { background: #f5f4f0; color: #aaa; border: 1px solid #e0ddd8; }

        .divider { height: 1px; background: #f0ece4; margin: 16px 0; }

        .apps-label {
          font-size: 11px;
          font-weight: 600;
          color: #ccc;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .app-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #fafaf8;
          border: 1px solid #eeebe4;
          border-radius: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .app-email {
          font-size: 13px;
          color: #5a78cc;
          cursor: pointer;
          flex: 1;
          min-width: 160px;
          transition: color 0.15s;
        }

        .app-email:hover { color: #9b7c3a; text-decoration: underline; }

        .app-status {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .app-status.pending { background: #fdf5e6; color: #9b7c3a; border: 1px solid #edd8a0; }
        .app-status.approved { background: #edf7ed; color: #3a8a3a; border: 1px solid #c8e6c8; }
        .app-status.rejected { background: #fdedf0; color: #c03030; border: 1px solid #f0c0c0; }

        .approve-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          background: transparent;
          border: 1px solid #c8a96e;
          color: #9b7c3a;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.3px;
        }

        .approve-btn:hover { background: #c8a96e; color: #fff; border-color: #c8a96e; }

        .empty-state {
          font-size: 13px;
          color: #ccc;
          padding: 12px 0;
          font-style: italic;
        }

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

        .modal-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

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
        }

        .close-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 24px;
          background: #f5f4f0;
          border: 1px solid #e0ddd8;
          color: #636161;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .close-btn:hover { background: #eee9e0; color: #1a1a2e; }

        /* ── Tab content ── */
        .tab-content { display: none; }
        .tab-content.active { display: block; }
      `}</style>

      <div className="admin-root">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>AdminPanel</h1>
            <span>Control Center</span>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: "projects", label: "Projects", count: projects.length },
              { id: "students", label: "Students", count: students.length },
              { id: "clients", label: "Clients", count: clients.length },
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-dot" />
                {tab.label}
                <span className="nav-count">{tab.count}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="admin-badge">
              <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? "A"}</div>
              <div className="admin-info">
                <div className="admin-name">{user?.name}</div>
                <div className="admin-role">Administrator</div>
              </div>
            </div>
            <div className="commission-tag">Platform commission: <strong>30%</strong></div>
            <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/login") }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">

          {/* Projects tab */}
          <div className={`tab-content ${activeTab === "projects" ? "active" : ""}`}>
            <div className="page-header">
              <div className="page-title">Projects</div>
              <div className="page-subtitle">Review and manage all client projects</div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Total Projects</div>
                <div className="stat-value">{projects.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Applications</div>
                <div className="stat-value">{projects.reduce((s, p) => s + p.applications.length, 0)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">{projects.reduce((s, p) => s + p.applications.filter(a => a.status === "pending").length, 0)}</div>
              </div>
            </div>

            {projects.length === 0 && <p className="empty-state">No projects available</p>}

            {projects.map(project => {
              const statusClass = { open: "status-open", closed: "status-closed", pending: "status-pending" }[project.status] || "status-default"
              return (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <div>
                      <div className="project-title">{project.title}</div>
                      <div className="project-company">{project.clientCompany}</div>
                    </div>
                    <span className={`status-badge ${statusClass}`}>{project.status}</span>
                  </div>

                  <div className="divider" />

                  <div className="apps-label">Applications ({project.applications.length})</div>

                  {project.applications.length === 0
                    ? <p className="empty-state">No applications yet</p>
                    : project.applications.map(app => (
                      <div key={app.studentEmail} className="app-row">
                        <span
                          className="app-email"
                          onClick={() => setSelectedStudent(students.find(s => s.email === app.studentEmail))}
                        >
                          {app.studentEmail}
                        </span>
                        <span className={`app-status ${app.status}`}>{app.status}</span>
                        {app.status === "pending" && (
                          <button className="approve-btn" onClick={async () => {
                            await fetch(`https://studentstudio-1.onrender.com/${project._id}/approve`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ studentEmail: app.studentEmail })
                            })
                            window.location.reload()
                          }}>
                            Approve
                          </button>
                        )}
                      </div>
                    ))
                  }
                </div>
              )
            })}
          </div>

          {/* Students tab */}
          <div className={`tab-content ${activeTab === "students" ? "active" : ""}`}>
            <div className="page-header">
              <div className="page-title">Students</div>
              <div className="page-subtitle">{students.length} registered student{students.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="user-grid">
              {students.map(s => (
                <div key={s._id} className="user-card student-link" onClick={() => setSelectedStudent(s)}>
                  <div className="user-avatar">{s.name?.[0]?.toUpperCase()}</div>
                  <div className="user-info">
                    <div className="user-name">{s.name}</div>
                    <div className="user-email">{s.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clients tab */}
          <div className={`tab-content ${activeTab === "clients" ? "active" : ""}`}>
            <div className="page-header">
              <div className="page-title">Clients</div>
              <div className="page-subtitle">{clients.length} registered client{clients.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="user-grid">
              {clients.map(c => (
                <div key={c._id} className="user-card">
                  <div className="user-avatar" style={{ color: "#5a78cc" }}>{(c.companyName || c.name)?.[0]?.toUpperCase()}</div>
                  <div className="user-info">
                    <div className="user-name">{c.companyName || c.name}</div>
                    <div className="user-email">{c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedStudent(null)}>
            <div className="modal">
              <div className="modal-header">
                <div className="modal-avatar">{selectedStudent.name?.[0]?.toUpperCase()}</div>
                <div>
                  <div className="modal-title">{selectedStudent.name}</div>
                  <div className="modal-subtitle">{selectedStudent.email}</div>
                </div>
              </div>

              {[
                { label: "College", value: selectedStudent.college },
                { label: "Department", value: selectedStudent.department },
                { label: "Skills", value: selectedStudent.skills?.join(", ") || "—" },
              ].map(f => (
                <div key={f.label} className="modal-field">
                  <div className="modal-field-label">{f.label}</div>
                  <div className="modal-field-value">{f.value || "—"}</div>
                </div>
              ))}

              {selectedStudent.resume && (
                <div className="modal-field">
                  <div className="modal-field-label">Resume</div>
                  <div className="modal-field-value">
                    <a
                      href={`https://studentstudio-1.onrender.com/uploads/${selectedStudent.resume}`}
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
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default Admin