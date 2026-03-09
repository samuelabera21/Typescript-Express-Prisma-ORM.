export default function Home() {
  return (
    <main className="landing">
      <div className="landing__orb landing__orb--one" aria-hidden="true" />
      <div className="landing__orb landing__orb--two" aria-hidden="true" />

      <section className="shell hero">
        <p className="kicker">Orion Stack</p>
        <h1 className="hero__title">Ship secure products with the speed of a demo and the confidence of production.</h1>
        <p className="hero__subtitle">
          A modern starter built with Next.js and Express, now upgraded to HttpOnly cookie auth, structured APIs, and a dashboard-ready data layer.
        </p>
        <div className="hero__actions">
          <a href="/register" className="button button--solid">Start Free Demo</a>
          <a href="/login" className="button button--ghost">Sign In</a>
        </div>
        <div className="stats" role="list" aria-label="Platform stats">
          <div className="stat" role="listitem">
            <p className="stat__value">120ms</p>
            <p className="stat__label">median API response</p>
          </div>
          <div className="stat" role="listitem">
            <p className="stat__value">99.9%</p>
            <p className="stat__label">availability target</p>
          </div>
          <div className="stat" role="listitem">
            <p className="stat__value">3 steps</p>
            <p className="stat__label">from signup to dashboard</p>
          </div>
        </div>
      </section>

      <section className="shell features" aria-label="Key features">
        <article className="card">
          <h2>Secure by default</h2>
          <p>HttpOnly cookie auth with silent refresh keeps sessions durable and safer than browser token storage.</p>
        </article>
        <article className="card">
          <h2>Fullstack ready</h2>
          <p>Typed frontend service layer, role-aware backend middleware, and clean route boundaries for fast iteration.</p>
        </article>
        <article className="card">
          <h2>Demo content built in</h2>
          <p>Use this landing page as your launchpad while product modules grow in dashboard, profile, and admin areas.</p>
        </article>
      </section>

      <section className="shell roadmap" aria-label="Roadmap preview">
        <h2 className="section-title">Demo Roadmap</h2>
        <div className="roadmap__items">
          <div className="roadmap__item">
            <span className="badge">Week 1</span>
            <p>Onboarding, identity checks, and protected API calls.</p>
          </div>
          <div className="roadmap__item">
            <span className="badge">Week 2</span>
            <p>Usage analytics, activity timeline, and team roles.</p>
          </div>
          <div className="roadmap__item">
            <span className="badge">Week 3</span>
            <p>Billing hooks, webhook events, and production telemetry.</p>
          </div>
        </div>
      </section>

      <section className="shell cta">
        <h2>Ready to customize this into your product brand?</h2>
        <p>Replace copy, connect real modules, and launch with a modern UI foundation that already respects secure auth flows.</p>
        <a href="/dashboard" className="button button--solid">Open Dashboard</a>
      </section>
    </main>
  );
}
