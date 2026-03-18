import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Student() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [projects, setProjects] = useState([])

  const fetchProjects = () => {
    fetch("https://studentstudio-1.onrender.com")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    fetchProjects()
  }, [])

  const myProjects = projects.filter(p =>
    p.applications?.some(a => a.studentEmail === user.email) ||
    (p.status === "assigned" && p.approvedStudent === user.email)
  )
  const openProjects = projects.filter(p =>
    !p.applications?.some(a => a.studentEmail === user.email) &&
    !(p.status === "assigned" && p.approvedStudent === user.email)
  )

  const ProjectCard = ({ project }) => {
    const myApplication = project.applications?.find(a => a.studentEmail === user.email)
    const isApproved = project.status === "assigned" && project.approvedStudent === user.email
    const statusClass = { pending: "app-pending", approved: "app-approved", rejected: "app-rejected" }[myApplication?.status] || ""

    return (
      <div className="project-card">
        <div className="project-header">
          <div>
            <div className="card-company">{project.clientCompany}</div>
            <div className="project-title">{project.title}</div>
          </div>
          {isApproved && <span className="status-badge status-confirmed">Confirmed</span>}
          {!isApproved && myApplication && (
            <span className={`status-badge ${statusClass}`}>{myApplication.status}</span>
          )}
          {!myApplication && <span className="status-badge status-open">Open</span>}
        </div>

        <p className="project-desc">{project.description}</p>

        <div className="project-meta">
          <div className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {project.days} days
          </div>
          <div className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ₹{project.budget}
          </div>
        </div>

        {isApproved && (
          <>
            <div className="confirmed-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              You are confirmed for this project!
              <button className="btn btn-green" style={{ marginLeft: "auto" }} onClick={() => navigate(`/chat/${project._id}`)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Open Chat
              </button>
            </div>
            <button className="btn btn-dark" style={{ marginTop: "10px" }} onClick={() => navigate(`/submit/${project._id}`)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Submit Work
            </button>
          </>
        )}

        {!isApproved && !myApplication && (
          <button className="btn btn-dark" onClick={async () => {
            const res = await fetch(`https://studentstudio-1.onrender.com/${project._id}/apply`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentEmail: user.email })
            })
            const data = await res.json()
            alert(data.message)
            fetchProjects()
          }}>
            Apply Now
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f4f0; }

        .student-root {
          min-height: 100vh;
          background: #f5f4f0;
          color: #1a1a2e;
          font-family: 'DM Sans', sans-serif;
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

        .topbar-actions { display: flex; align-items: center; gap: 10px; }

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

        .topbar-name { font-size: 13px; font-weight: 500; color: #1a1a2e; }
        .topbar-role { font-size: 11px; color: #9b7c3a; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ── Buttons ── */
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
          border: none;
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

        .btn-dark {
          background: #1a1a2e;
          border: 1px solid #1a1a2e;
          color: #fff;
          margin-top: 4px;
        }

        .btn-dark:hover { background: #2e2e4e; border-color: #2e2e4e; }

        .btn-green {
          background: #3a8a3a;
          border: 1px solid #3a8a3a;
          color: #fff;
          font-size: 12px;
          padding: 6px 14px;
        }

        .btn-green:hover { background: #2d6e2d; }

        /* ── Main ── */
        .main { padding: 40px 48px; max-width: 960px; }

        /* ── Profile card ── */
        .profile-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 40px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .profile-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #c8a96e, transparent);
        }

        .profile-avatar {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #c8a96e, #8b6914);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: #fff;
          flex-shrink: 0;
        }

        .profile-info { flex: 1; }

        .profile-name {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .profile-tags { display: flex; flex-wrap: wrap; gap: 6px; }

        .profile-tag {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 20px;
          background: #fdf8f0;
          border: 1px solid #ede4d0;
          color: #9b7c3a;
        }

        .profile-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #bbb;
          text-align: right;
        }

        /* ── Stats row ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 18px 22px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c8a96e, transparent);
        }

        .stat-label {
          font-size: 10px;
          font-weight: 600;
          color: #bbb;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #1a1a2e;
          line-height: 1;
        }

        /* ── Section ── */
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .count-badge {
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
          padding: 22px;
          margin-bottom: 14px;
          transition: all 0.18s;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        .project-card:hover { border-color: #c8a96e55; box-shadow: 0 4px 16px rgba(200,169,110,0.08); }

        .project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 12px;
        }

        .card-company {
          font-size: 11px;
          font-weight: 600;
          color: #9b7c3a;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .project-title {
          font-family: 'DM Serif Display', serif;
          font-size: 17px;
          color: #1a1a2e;
          letter-spacing: -0.2px;
        }

        .project-desc {
          font-size: 13px;
          color: #999;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .project-meta {
          display: flex;
          gap: 18px;
          margin-bottom: 14px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #bbb;
          font-weight: 500;
        }

        /* ── Status badges ── */
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
        .status-confirmed { background: #fdf5e6; color: #9b7c3a; border: 1px solid #edd8a0; }
        .app-pending { background: #fdf5e6; color: #9b7c3a; border: 1px solid #edd8a0; }
        .app-approved { background: #edf7ed; color: #3a8a3a; border: 1px solid #c8e6c8; }
        .app-rejected { background: #fdedf0; color: #c03030; border: 1px solid #f0c0c0; }

        /* ── Confirmed banner ── */
        .confirmed-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #edf7ed;
          border: 1px solid #c8e6c8;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #3a8a3a;
          margin-top: 4px;
        }

        /* ── Empty ── */
        .empty-state {
          background: #ffffff;
          border: 1px dashed #e0ddd8;
          border-radius: 12px;
          padding: 40px 24px;
          text-align: center;
          margin-bottom: 14px;
        }

        .empty-icon { font-size: 28px; margin-bottom: 10px; }
        .empty-title { font-family: 'DM Serif Display', serif; font-size: 16px; color: #1a1a2e; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: #bbb; }

        .section-gap { margin-top: 36px; }
      `}</style>

      <div className="student-root">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-logo">StudentPanel <span>Dashboard</span></div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Edit Profile
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="topbar-name">{user?.name}</div>
                <div className="topbar-role">Student</div>
              </div>
            </div>
            <button className="btn btn-danger" onClick={() => { localStorage.clear(); navigate("/login") }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        <main className="main">

          {/* Profile card */}
          <div className="profile-card">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="profile-info">
              <div className="profile-name">Welcome, {user?.name}</div>
              <div className="profile-tags">
                {user?.skills?.map(s => <span key={s} className="profile-tag">{s}</span>)}
              </div>
            </div>
            <div className="profile-meta">
              <span>{user?.college}</span>
              <span>{user?.department}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">{projects.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">My Applications</div>
              <div className="stat-value">{myProjects.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Confirmed</div>
              <div className="stat-value">
                {projects.filter(p => p.status === "assigned" && p.approvedStudent === user?.email).length}
              </div>
            </div>
          </div>

          {/* My Applications */}
          {myProjects.length > 0 && (
            <div>
              <div className="section-header">
                <div className="section-title">My Applications</div>
                <span className="count-badge">{myProjects.length}</span>
              </div>
              {myProjects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}

          {/* Open Projects */}
          <div className={myProjects.length > 0 ? "section-gap" : ""}>
            <div className="section-header">
              <div className="section-title">Available Projects</div>
              <span className="count-badge">{openProjects.length}</span>
            </div>
            {openProjects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <div className="empty-title">You've applied to everything!</div>
                <div className="empty-sub">Check back later for new projects.</div>
              </div>
            ) : openProjects.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>

        </main>

      </div>
    </>
  )
}

export default Student