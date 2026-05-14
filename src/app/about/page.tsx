const FEATURES = [
  {
    icon: '📰',
    iconBg: '#2563eb22',
    iconBorder: '#2563eb44',
    title: '100+ Sources',
    description:
      'Read from a wide range of outlets across the political spectrum — from local papers to international wire services.',
  },
  {
    icon: '📊',
    iconBg: '#7c3aed22',
    iconBorder: '#7c3aed44',
    title: 'Reading Analytics',
    description:
      'Track your habits across categories and sources. See your bias distribution and get a diversity score each week.',
  },
  {
    icon: '🔭',
    iconBg: '#05966922',
    iconBorder: '#34d39944',
    title: 'Full Spectrum View',
    description:
      'See any headline covered from Left to Right. Understand how framing shapes the story before you form an opinion.',
  },
]

const TEAM = [
  {
    name: 'Kevin Huynh',
    href: 'https://www.linkedin.com/in/kevinhuynh23/',
    initials: 'K',
    gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  },
  {
    name: 'Andrew Hwang',
    href: 'https://www.linkedin.com/in/andrewhwang10/',
    initials: 'A',
    gradient: 'linear-gradient(135deg, #0891b2, #2563eb)',
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <div
        className="relative text-center py-20 px-6"
        style={{
          background: 'linear-gradient(160deg, var(--color-base) 0%, var(--color-card) 60%, var(--color-elevated) 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 65%)',
          }}
        />
        <p
          className="text-xs font-bold uppercase tracking-[0.15em] mb-4 relative"
          style={{ color: 'var(--color-accent)' }}
        >
          About Spectrum
        </p>
        <h1
          className="font-extrabold leading-tight mb-2 relative"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '40px',
            color: 'var(--color-text-primary)',
          }}
        >
          Widen your perspective.
        </h1>
        <h2
          className="font-extrabold leading-tight mb-6 relative"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '40px',
            color: 'var(--color-border)',
          }}
        >
          Challenge your views.
        </h2>
        <p
          className="text-[15px] leading-relaxed max-w-xl mx-auto relative"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Spectrum is a melting pot of news sources and perspectives, all in one place. We believe a
          well-informed public starts with reading beyond your bubble.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Features */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          What makes us different
        </p>
        <div className="grid grid-cols-3 gap-4 mb-14">
          {FEATURES.map(({ icon, iconBg, iconBorder, title, description }) => (
            <div
              key={title}
              className="rounded-[10px] p-6"
              style={{ background: 'var(--color-elevated)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3.5"
                style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
              >
                {icon}
              </div>
              <h3
                className="font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--color-text-primary)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Team */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Meet the team
        </p>
        <div className="grid grid-cols-2 gap-4">
          {TEAM.map(({ name, href, initials, gradient }) => (
            <div
              key={name}
              className="rounded-[10px] p-5 flex items-center gap-3.5"
              style={{ background: 'var(--color-elevated)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ background: gradient }}
              >
                {initials}
              </div>
              <div>
                <p
                  className="font-bold mb-0.5"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: 'var(--color-text-primary)' }}
                >
                  {name}
                </p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-accent)' }}
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
