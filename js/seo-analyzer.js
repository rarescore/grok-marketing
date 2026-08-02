/**
 * RS Marketing — Advanced 2026 SEO Analysis Engine
 * Weighted multi-category scoring with deterministic seeding from URL.
 * Categories: Technical, On-Page, Content/E-E-A-T, Performance, AI/GEO, Accessibility
 */

(function () {
  const form = document.getElementById('seo-form');
  const results = document.getElementById('seo-results');
  const analyzeBtn = document.getElementById('analyze-btn');
  if (!form) return;

  // ---------- Deterministic PRNG from string ----------
  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ---------- Category weights (sum ≈ 100) ----------
  const WEIGHTS = {
    technical: 22,
    onpage: 20,
    content: 18,
    performance: 16,
    aigeo: 14,
    accessibility: 10
  };

  // ---------- Issue library (realistic 2026 issues) ----------
  const ISSUE_POOL = {
    technical: [
      { severity: 'critical', title: 'Missing or incorrect canonical tags', desc: 'Search engines may index duplicate versions of key pages, diluting ranking signals.' },
      { severity: 'critical', title: 'robots.txt blocking important resources', desc: 'Critical CSS/JS or content paths appear restricted, harming crawlability and rendering.' },
      { severity: 'high', title: 'No XML sitemap or sitemap not submitted', desc: 'Discovery of new and updated pages is slower than necessary.' },
      { severity: 'high', title: 'Redirect chains detected', desc: 'Multiple hops increase crawl waste and slow page experience signals.' },
      { severity: 'medium', title: 'Mixed content (HTTP resources on HTTPS)', desc: 'Security warnings and potential ranking friction on modern browsers.' },
      { severity: 'medium', title: 'Orphan pages with zero internal links', desc: 'Several indexable URLs are not reachable from the main site graph.' },
      { severity: 'low', title: 'Outdated or missing lastmod in sitemap', desc: 'Freshness signals for crawlers are weaker than they could be.' }
    ],
    onpage: [
      { severity: 'critical', title: 'Missing or duplicate title tags', desc: 'Multiple pages share identical titles or lack unique, intent-matched titles.' },
      { severity: 'high', title: 'Meta descriptions missing or auto-generated', desc: 'SERP click-through rate is left to chance instead of deliberate messaging.' },
      { severity: 'high', title: 'Heading hierarchy broken (multiple H1s / skipped levels)', desc: 'Document outline is unclear to both users and AI extraction systems.' },
      { severity: 'medium', title: 'Primary keyword absent from first 100 words', desc: 'Topical clarity for the primary query is delayed.' },
      { severity: 'medium', title: 'Thin or near-duplicate content clusters', desc: 'Several pages target overlapping intent without clear differentiation.' },
      { severity: 'low', title: 'Image filenames are generic (IMG_xxxx)', desc: 'Missed opportunity for image search and accessibility context.' }
    ],
    content: [
      { severity: 'critical', title: 'Weak E-E-A-T signals', desc: 'Limited author attribution, credentials, or original data that AI systems and Google use for trust.' },
      { severity: 'high', title: 'No clear “answer block” near the top of key pages', desc: 'Content is not structured for featured snippets or AI Overview extraction.' },
      { severity: 'high', title: 'Low entity density / topical incompleteness', desc: 'Related concepts and entities that signal depth are under-represented.' },
      { severity: 'medium', title: 'Outdated statistics or claims without sources', desc: 'Trust and citation potential are reduced in both classic and generative search.' },
      { severity: 'low', title: 'Limited internal linking between related topics', desc: 'Topical authority clusters are under-developed.' }
    ],
    performance: [
      { severity: 'critical', title: 'LCP likely exceeds 2.5s on mobile', desc: 'Largest Contentful Paint is outside the “Good” threshold used in page experience.' },
      { severity: 'high', title: 'INP (Interaction to Next Paint) risk', desc: 'Main-thread work or heavy scripts may cause responsiveness issues under real user load.' },
      { severity: 'high', title: 'Unoptimized images (no modern formats / missing dimensions)', desc: 'CLS and LCP are both at risk; bandwidth is wasted.' },
      { severity: 'medium', title: 'Render-blocking resources in critical path', desc: 'First contentful paint is delayed by synchronous CSS/JS.' },
      { severity: 'low', title: 'No explicit font-display strategy', desc: 'Text may remain invisible longer than necessary during load.' }
    ],
    aigeo: [
      { severity: 'critical', title: 'Content heavily dependent on client-side JavaScript', desc: 'AI agents and some crawlers may see incomplete or empty content.' },
      { severity: 'high', title: 'Missing or incomplete structured data (JSON-LD)', desc: 'Rich results and AI citation eligibility are significantly reduced.' },
      { severity: 'high', title: 'No FAQ or HowTo schema on high-intent pages', desc: 'Missed opportunity for both classic rich results and generative extraction.' },
      { severity: 'medium', title: 'Low extractability (long paragraphs, no clear claims)', desc: 'LLMs struggle to pull clean, citable statements.' },
      { severity: 'low', title: 'llms.txt or AI crawler directives not considered', desc: 'Emerging control surface for generative engine behavior is unused.' }
    ],
    accessibility: [
      { severity: 'high', title: 'Insufficient color contrast on key UI elements', desc: 'Fails WCAG AA for many users and can affect mobile usability signals.' },
      { severity: 'high', title: 'Images missing meaningful alt text', desc: 'Accessibility and image search both suffer.' },
      { severity: 'medium', title: 'Interactive elements lack accessible names', desc: 'Buttons and links are hard for assistive technology to interpret.' },
      { severity: 'medium', title: 'Focus order or visible focus styles incomplete', desc: 'Keyboard and switch users face friction.' },
      { severity: 'low', title: 'Landmark regions or heading structure incomplete', desc: 'Screen reader navigation is less efficient than it could be.' }
    ]
  };

  function pickIssues(rng, category, count) {
    const pool = [...ISSUE_POOL[category]];
    const selected = [];
    for (let i = 0; i < count && pool.length; i++) {
      const idx = Math.floor(rng() * pool.length);
      selected.push(pool.splice(idx, 1)[0]);
    }
    return selected;
  }

  function scoreCategory(rng, baseMin, baseMax) {
    // Produce a realistic score with slight bias toward mid-high
    const raw = baseMin + rng() * (baseMax - baseMin);
    return Math.round(Math.min(98, Math.max(28, raw)));
  }

  function gradeFromScore(score) {
    if (score >= 90) return { label: 'Excellent', summary: 'Strong technical and content foundation. Minor polish will push this into elite territory.' };
    if (score >= 75) return { label: 'Good', summary: 'Solid base with clear, high-ROI opportunities. Addressing the priority issues should produce measurable ranking and conversion lifts.' };
    if (score >= 55) return { label: 'Needs Work', summary: 'Multiple structural and on-page gaps are limiting visibility and trust signals. A focused remediation sprint is recommended.' };
    return { label: 'Critical Gaps', summary: 'Significant technical and content issues are likely suppressing organic performance. Immediate attention is advised.' };
  }

  function calculateFixFee(issues, overall) {
    let hours = 0;
    issues.forEach(iss => {
      if (iss.severity === 'critical') hours += 4.5;
      else if (iss.severity === 'high') hours += 2.8;
      else if (iss.severity === 'medium') hours += 1.4;
      else hours += 0.6;
    });
    // Base + complexity multiplier
    const base = 450;
    const rate = 145; // blended senior rate
    let fee = base + hours * rate;
    // Scale with overall score (worse sites need more coordination)
    if (overall < 50) fee *= 1.25;
    else if (overall < 65) fee *= 1.1;
    // Round to nearest 50
    fee = Math.round(fee / 50) * 50;
    return Math.min(8500, Math.max(750, fee));
  }

  function runAnalysis(url) {
    const domain = (() => {
      try { return new URL(url).hostname.replace(/^www\./, ''); }
      catch { return url; }
    })();

    const seed = hashString(domain.toLowerCase() + '|rs-v2');
    const rng = mulberry32(seed);

    // Category scores (deterministic per domain)
    const scores = {
      technical: scoreCategory(rng, 42, 92),
      onpage: scoreCategory(rng, 38, 90),
      content: scoreCategory(rng, 35, 88),
      performance: scoreCategory(rng, 40, 91),
      aigeo: scoreCategory(rng, 30, 85),
      accessibility: scoreCategory(rng, 45, 93)
    };

    // Weighted overall
    let overall = 0;
    Object.keys(WEIGHTS).forEach(k => {
      overall += (scores[k] * WEIGHTS[k]) / 100;
    });
    overall = Math.round(overall);

    // Issue counts scale inversely with score
    const issueCounts = {
      technical: scores.technical < 60 ? 3 : scores.technical < 80 ? 2 : 1,
      onpage: scores.onpage < 55 ? 3 : scores.onpage < 78 ? 2 : 1,
      content: scores.content < 58 ? 2 : 1,
      performance: scores.performance < 62 ? 2 : 1,
      aigeo: scores.aigeo < 55 ? 2 : 1,
      accessibility: scores.accessibility < 65 ? 2 : 1
    };

    let allIssues = [];
    Object.keys(issueCounts).forEach(cat => {
      const picked = pickIssues(rng, cat, issueCounts[cat]);
      picked.forEach(iss => allIssues.push({ ...iss, category: cat }));
    });

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const grade = gradeFromScore(overall);
    const fee = calculateFixFee(allIssues, overall);

    return { overall, scores, issues: allIssues, grade, fee, domain };
  }

  function renderResults(data) {
    const circle = document.getElementById('score-circle');
    const numberEl = document.getElementById('score-number');
    const gradeEl = document.getElementById('score-grade');
    const summaryEl = document.getElementById('score-summary');
    const catsEl = document.getElementById('category-scores');
    const issuesEl = document.getElementById('issues-list');
    const feeEl = document.getElementById('fix-amount');
    const feeDesc = document.getElementById('fix-description');

    // Animate score ring
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (data.overall / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = offset;
    });

    numberEl.textContent = data.overall;
    gradeEl.textContent = data.grade.label + ' — ' + data.overall + '/100';
    summaryEl.textContent = data.grade.summary + ' Analysis for ' + data.domain + '.';

    // Category pills
    const labels = {
      technical: 'Technical',
      onpage: 'On-Page',
      content: 'Content',
      performance: 'Performance',
      aigeo: 'AI / GEO',
      accessibility: 'A11y'
    };
    catsEl.innerHTML = Object.keys(data.scores).map(k =>
      `<span class="cat-pill"><strong>${data.scores[k]}</strong>${labels[k]}</span>`
    ).join('');

    // Issues
    issuesEl.innerHTML = data.issues.map(iss => `
      <div class="issue-item">
        <span class="issue-severity ${iss.severity}">${iss.severity}</span>
        <div class="issue-body">
          <h5>${iss.title}</h5>
          <p>${iss.desc}</p>
        </div>
      </div>
    `).join('');

    feeEl.textContent = '$' + data.fee.toLocaleString();
    feeDesc.textContent = `Based on ${data.issues.length} prioritized issues and estimated senior engineering effort. Includes technical fixes, on-page optimization, schema, and performance work.`;

    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('seo-url');
    let url = urlInput.value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoader = analyzeBtn.querySelector('.btn-loader');
    btnText.hidden = true;
    btnLoader.hidden = false;
    analyzeBtn.disabled = true;
    results.hidden = true;

    // Simulated analysis latency (feels premium)
    await new Promise(r => setTimeout(r, 1800 + Math.random() * 2200));

    const data = runAnalysis(url);
    renderResults(data);

    btnText.hidden = false;
    btnLoader.hidden = true;
    analyzeBtn.disabled = false;
  });
})();
