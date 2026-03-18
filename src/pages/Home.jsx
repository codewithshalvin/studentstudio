import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

// Import your logo — adjust path as needed
import logo from "../assets/logo(2).png"

function Home() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    fetch("https://studentstudio-1.onrender.com")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.log(err))
  }, [])

  const handleApply = async (projectId) => {
    if (!user) { navigate("/login"); return }
    if (user.role !== "student") { alert("Only students can apply"); return }
    const res = await fetch(`https://studentstudio-1.onrender.com/${projectId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail: user.email })
    })
    const data = await res.json()
    alert(data.message)
    window.location.reload()
  }

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #c8a96e;
          --gold-dark: #9b7c3a;
          --teal: #3dbfb8;
          --navy: #1a1a2e;
          --navy-light: #2e2e4e;
          --green: #3a8a3a;
          --bg: #f5f4f0;
          --card-bg: #ffffff;
          --border: #e8e4dc;
          --muted: #aaa;
        }

        body { background: var(--bg); }

        .home-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Hero ── */
        .hero {
          background: var(--navy);
          padding: 64px 48px 56px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Decorative teal glow */
        .hero::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 120px;
          background: radial-gradient(ellipse, rgba(61,191,184,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Gold top accent line */
        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--teal), var(--gold), transparent);
        }

        /* ── Brand lockup ── */
        .brand-lockup {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .brand-logo {
          width: 110px;
          height: 110px;
          object-fit: contain;
          /* The logo has a black bg — we use mix-blend-mode to make it transparent-ish on dark bg */
          mix-blend-mode: lighten;
          filter: drop-shadow(0 0 12px rgba(200,169,110,0.4));
        }

        .brand-text {
          text-align: left;
        }

        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 44px;
          color: #ffffff;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .brand-name span {
          color: var(--gold);
        }

        .brand-tagline {
          font-size: 11px;
          font-weight: 500;
          color: var(--teal);
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Divider */
        .hero-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--teal));
          margin: 20px auto 20px;
          border-radius: 2px;
        }

        .hero-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 32px;
          font-weight: 300;
          letter-spacing: 0.2px;
        }

        .search-wrap {
          position: relative;
          display: inline-block;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          pointer-events: none;
        }

        .search-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 18px 12px 40px;
          width: 340px;
          border-radius: 10px;
          border: 1px solid rgba(200,169,110,0.3);
          background: rgba(255,255,255,0.06);
          color: #ffffff;
          outline: none;
          transition: all 0.18s;
          backdrop-filter: blur(8px);
        }

        .search-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
          background: rgba(255,255,255,0.1);
        }

        .search-input::placeholder { color: rgba(255,255,255,0.3); }

        /* ── Stats strip ── */
        .stats-strip {
          display: flex;
          justify-content: center;
          gap: 0;
          background: #ffffff;
          border-bottom: 1px solid var(--border);
        }

        .strip-stat {
          text-align: center;
          padding: 18px 40px;
          border-right: 1px solid var(--border);
        }

        .strip-stat:last-child { border-right: none; }

        .strip-value {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--navy);
        }

        .strip-label {
          font-size: 10px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 2px;
        }

        /* ── Section ── */
        .section {
          padding: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: var(--navy);
          letter-spacing: -0.4px;
        }

        .results-count {
          font-size: 12px;
          color: var(--muted);
          background: #f0ede8;
          padding: 3px 10px;
          border-radius: 20px;
        }

        /* ── Grid ── */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 16px;
        }

        /* ── Project card ── */
        .project-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 22px;
          transition: all 0.18s;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--teal));
          opacity: 0;
          transition: opacity 0.18s;
        }

        .project-card:hover {
          border-color: rgba(200,169,110,0.4);
          box-shadow: 0 4px 20px rgba(200,169,110,0.12);
          transform: translateY(-2px);
        }

        .project-card:hover::before { opacity: 1; }

        .card-company {
          font-size: 10px;
          font-weight: 600;
          color: var(--gold-dark);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 17px;
          color: var(--navy);
          letter-spacing: -0.2px;
          line-height: 1.3;
          margin: 2px 0 4px;
        }

        .card-budget {
          font-size: 16px;
          font-weight: 600;
          color: var(--green);
        }

        .card-footer { margin-top: auto; padding-top: 14px; }

        .apply-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 9px 20px;
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          width: 100%;
          letter-spacing: 0.2px;
        }

        .apply-btn:hover {
          background: var(--gold-dark);
          border-color: var(--gold-dark);
        }

        .applied-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 8px;
          width: 100%;
          justify-content: center;
        }

        .applied-badge.pending {
          background: #fdf5e6;
          color: var(--gold-dark);
          border: 1px solid #edd8a0;
        }

        .applied-badge.approved {
          background: #edf7ed;
          color: var(--green);
          border: 1px solid #c8e6c8;
        }

        /* ── Empty state ── */
        .empty-state {
          grid-column: 1 / -1;
          background: var(--card-bg);
          border: 1px dashed var(--border);
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-icon { font-size: 32px; margin-bottom: 12px; }
        .empty-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--navy); margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: #bbb; }
      `}</style>

      <div className="home-root">
        <Navbar />

        {/* Hero */}
        <section className="hero">
          {/* Brand lockup */}
          <div className="brand-lockup">
            <img src={logo} alt="Student Studio Logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">Student <span>Studio</span></div>
              <div className="brand-tagline">Student Studio</div>
            </div>
          </div>

          <div className="hero-divider" />

          <p className="hero-subtitle">Work with real clients, collaborate on live projects, and earn money</p>

          <div className="search-wrap">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="strip-stat">
            <div className="strip-value">{projects.length}</div>
            <div className="strip-label">Projects</div>
          </div>
          <div className="strip-stat">
            <div className="strip-value">{projects.filter(p => p.status === "open").length}</div>
            <div className="strip-label">Open</div>
          </div>
          <div className="strip-stat">
            <div className="strip-value">{projects.reduce((s, p) => s + (p.applications?.length || 0), 0)}</div>
            <div className="strip-label">Applications</div>
          </div>
        </div>

        {/* Projects */}
        <section className="section">
          <div className="section-header">
            <div className="section-title">Latest Client Requests</div>
            <span className="results-count">{filteredProjects.length} result{filteredProjects.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="grid">
            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No projects found</div>
                <div className="empty-sub">Try adjusting your search term</div>
              </div>
            ) : filteredProjects.map(project => {
              const alreadyApplied = project.applications?.find(a => a.studentEmail === user?.email)
              return (
                <div key={project._id} className="project-card">
                  <div className="card-company">{project.clientCompany}</div>
                  <div className="card-title">{project.title}</div>
                  <div className="card-budget">₹{project.budget}</div>
                  <div className="card-footer">
                    {alreadyApplied ? (
                      <span className={`applied-badge ${alreadyApplied.status === "approved" ? "approved" : "pending"}`}>
                        {alreadyApplied.status === "approved" ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Approved</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Applied</>
                        )}
                      </span>
                    ) : (
                      <button className="apply-btn" onClick={() => handleApply(project._id)}>
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

export default Home