(function () {
  const form = document.getElementById('seo-form');
  const results = document.getElementById('seo-results');
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
    const r = rng(hash(domain + '|rs4'));
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
    results.innerHTML = `
      <div style="display:flex;gap:1.8rem;align-items:center;flex-wrap:wrap;margin-bottom:1.6rem;">
        <div style="font-size:3rem;font-weight:700;color:var(--accent);">${data.overall}</div>
        <div>
          <div style="font-size:1.25rem;font-weight:600;margin-bottom:0.25rem;">${grade}</div>
          <div style="color:var(--muted);font-size:0.92rem;">Analysis for ${data.domain}</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.6rem;">
        ${Object.entries(data.cats).map(([k,v]) => `<span style="font-size:0.72rem;padding:0.28rem 0.65rem;border-radius:999px;background:var(--bg);border:1px solid var(--border);"><strong style="color:var(--text);">${v}</strong> ${k}</span>`).join('')}
      </div>
      <div style="margin-bottom:1.4rem;">
        <div style="font-size:0.75rem;letter-spacing:0.06em;text-transform:uppercase;color:var(--dim);margin-bottom:0.7rem;">Priority Issues</div>
        ${data.issues.map(i => `
          <div style="display:flex;gap:0.85rem;padding:0.85rem 1rem;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-bottom:0.55rem;">
            <span style="font-size:0.65rem;font-weight:600;text-transform:uppercase;padding:0.18rem 0.4rem;border-radius:4px;height:fit-content;background:${i.s==='critical'?'rgba(239,68,68,0.15)':i.s==='high'?'rgba(245,158,11,0.15)':'rgba(59,130,246,0.12)'};color:${i.s==='critical'?'#f87171':i.s==='high'?'#fbbf24':'#60a5fa'};">${i.s}</span>
            <div>
              <div style="font-size:0.92rem;margin-bottom:0.15rem;">${i.t}</div>
              <div style="font-size:0.82rem;color:var(--muted);">${i.d}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding:1.2rem 1.4rem;background:linear-gradient(135deg,rgba(201,162,39,0.1),transparent);border:1px solid rgba(201,162,39,0.22);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
        <div>
          <div style="font-weight:600;margin-bottom:0.2rem;">Estimated Fix Investment</div>
          <div style="font-size:0.82rem;color:var(--muted);">Based on issue severity and engineering effort</div>
        </div>
        <div style="display:flex;align-items:center;gap:1.1rem;">
          <span style="font-size:1.5rem;font-weight:700;color:var(--accent);">$${data.fee.toLocaleString()}</span>
          <a href="#contact" class="btn btn-primary">Book Fix</a>
        </div>
      </div>
    `;
    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let url = document.getElementById('seo-url').value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    const btn = document.getElementById('analyze-btn');
    const txt = btn.querySelector('.btn-text');
    const spin = btn.querySelector('.btn-spin');
    txt.hidden = true; spin.hidden = false; btn.disabled = true;
    results.hidden = true;
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1700));
    render(analyze(url));
    txt.hidden = false; spin.hidden = true; btn.disabled = false;
  });
})();
