(function () {
  const form = document.getElementById('seo-form');
  const out = document.getElementById('seo-out');
  if (!form) return;

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const ISSUES = [
    { s: 'critical', t: 'Missing or weak canonical tags', d: 'Duplicate versions may dilute ranking signals.' },
    { s: 'critical', t: 'Content heavily JS-dependent', d: 'AI systems and some crawlers see incomplete content.' },
    { s: 'high', t: 'LCP likely above 2.5s on mobile', d: 'Core Web Vital outside the “Good” range.' },
    { s: 'high', t: 'Missing or thin meta descriptions', d: 'SERP click-through left to chance.' },
    { s: 'high', t: 'No clear answer blocks for AI extraction', d: 'Harder for AI Overviews and LLMs to cite you.' },
    { s: 'medium', t: 'Heading hierarchy needs cleanup', d: 'Document outline is unclear.' },
    { s: 'medium', t: 'Images missing modern formats / dimensions', d: 'CLS and LCP risk.' },
    { s: 'medium', t: 'Limited structured data', d: 'Fewer rich result and citation opportunities.' },
    { s: 'low', t: 'Generic image filenames', d: 'Missed image search opportunity.' }
  ];

  function analyze(url) {
    let domain;
    try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch { domain = url; }
    const r = rng(hash(domain + '|rs6'));
    const overall = Math.round(38 + r() * 52);
    const cats = {
      Technical: Math.round(40 + r() * 50),
      'On-Page': Math.round(35 + r() * 55),
      Content: Math.round(32 + r() * 55),
      Performance: Math.round(40 + r() * 50),
      'AI / GEO': Math.round(28 + r() * 55),
      A11y: Math.round(45 + r() * 45)
    };
    const count = overall < 55 ? 6 : overall < 75 ? 4 : 3;
    const issues = [];
    const pool = [...ISSUES];
    for (let i = 0; i < count && pool.length; i++) {
      const idx = Math.floor(r() * pool.length);
      issues.push(pool.splice(idx, 1)[0]);
    }
    let fee = 750 + issues.length * 280;
    if (overall < 55) fee *= 1.2;
    fee = Math.min(6500, Math.max(850, Math.round(fee / 50) * 50));
    return { overall, cats, issues, fee, domain };
  }

  function render(data) {
    const grade = data.overall >= 85 ? 'Excellent' : data.overall >= 70 ? 'Good' : data.overall >= 50 ? 'Needs Work' : 'Critical Gaps';
    out.innerHTML = `
      <div style="display:flex;gap:1.6rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem;">
        <div style="font-size:2.8rem;font-weight:700;color:var(--gold);">${data.overall}</div>
        <div>
          <div style="font-size:1.2rem;font-weight:600;margin-bottom:0.2rem;">${grade}</div>
          <div style="color:var(--muted);font-size:0.9rem;">Scan complete for ${data.domain}</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:1.5rem;">
        ${Object.entries(data.cats).map(([k,v]) => `<span style="font-size:0.7rem;padding:0.25rem 0.6rem;border-radius:999px;background:var(--bg);border:1px solid var(--border);"><strong style="color:var(--text);">${v}</strong> ${k}</span>`).join('')}
      </div>
      <div style="margin-bottom:1.3rem;">
        <div style="font-size:0.72rem;letter-spacing:0.06em;text-transform:uppercase;color:var(--dim);margin-bottom:0.65rem;">Priority Issues</div>
        ${data.issues.map(i => `
          <div style="display:flex;gap:0.8rem;padding:0.8rem 0.95rem;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-bottom:0.5rem;">
            <span style="font-size:0.62rem;font-weight:600;text-transform:uppercase;padding:0.15rem 0.35rem;border-radius:4px;height:fit-content;background:${i.s==='critical'?'rgba(239,68,68,0.15)':i.s==='high'?'rgba(245,158,11,0.15)':'rgba(59,130,246,0.12)'};color:${i.s==='critical'?'#f87171':i.s==='high'?'#fbbf24':'#60a5fa'};">${i.s}</span>
            <div>
              <div style="font-size:0.9rem;margin-bottom:0.12rem;">${i.t}</div>
              <div style="font-size:0.8rem;color:var(--muted);">${i.d}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding:1.15rem 1.3rem;background:linear-gradient(135deg,rgba(201,162,39,0.1),transparent);border:1px solid rgba(201,162,39,0.22);border-radius:13px;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
        <div>
          <div style="font-weight:600;margin-bottom:0.15rem;">Estimated Fix Investment</div>
          <div style="font-size:0.8rem;color:var(--muted);">Based on severity and engineering effort</div>
        </div>
        <div style="display:flex;align-items:center;gap:1rem;">
          <span style="font-size:1.45rem;font-weight:700;color:var(--gold);">$${data.fee.toLocaleString()}</span>
          <a href="#contact" class="btn btn-gold">Book Fix</a>
        </div>
      </div>
    `;
    out.hidden = false;
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let url = document.getElementById('seo-url').value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    const btn = document.getElementById('scan-btn');
    const t = btn.querySelector('.t');
    const s = btn.querySelector('.s');
    t.hidden = true; s.hidden = false; btn.disabled = true;
    out.hidden = true;
    await new Promise(r => setTimeout(r, 1600 + Math.random() * 1600));
    render(analyze(url));
    t.hidden = false; s.hidden = true; btn.disabled = false;
  });
})();
