(() => {
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const captureMode = new URLSearchParams(location.search).has('capture')
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
  const lerp = (a, b, t) => a + (b - a) * t

  const intro = $('#intro')
  const header = $('#header')
  const introCar = $('#intro-car-wrap')
  const portal = $('#portal')
  const flash = $('#white-flash')
  const counter = $('#loader-count')
  const skipIntro = $('#intro-skip')
  const raceCar = $('#race-car-rail')
  const heroReveal = () => {
    document.body.classList.remove('intro-active')
    intro.hidden = true
    header.classList.add('ready')
    const groups = $$('.hero .reveal-group > *')
    groups.forEach((el, index) => {
      el.animate(
        [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 780, delay: 90 + index * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      )
    })
    raceCar.style.opacity = '1'
  }

  let introFinished = false
  const finishIntro = () => {
    if (introFinished) return
    introFinished = true
    heroReveal()
  }

  async function playIntro() {
    document.body.classList.add('intro-active')
    try { await $('.intro-car').decode() } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 160))
    const carMotion = introCar.animate([
      { transform: 'translate3d(-108%, -48%, 0) scale(.78)', filter: 'blur(3px)' },
      { offset: .43, transform: 'translate3d(7%, -48%, 0) scale(1)', filter: 'blur(0)' },
      { offset: .58, transform: 'translate3d(-2%, -48%, 0) scale(1.04)', filter: 'blur(0)' },
      { transform: 'translate3d(-29%, -48%, 0) scale(8.8)', filter: 'blur(.4px)' }
    ], { duration: 3300, easing: 'cubic-bezier(.42,0,.08,1)', fill: 'forwards' })

    setTimeout(() => {
      portal.animate([
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.12)' },
        { opacity: 1, transform: 'translate(-50%,-50%) scale(.42)', offset: .35 },
        { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }
      ], { duration: 1500, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' })
      const start = performance.now()
      const count = now => {
        const progress = clamp((now - start) / 1250, 0, 1)
        counter.textContent = `${Math.round(progress * 100)}%`
        if (progress < 1) requestAnimationFrame(count)
      }
      requestAnimationFrame(count)
    }, 2250)

    await carMotion.finished
    await new Promise(resolve => setTimeout(resolve, 320))
    await flash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 620, easing: 'ease-in', fill: 'forwards' }).finished
    finishIntro()
  }

  skipIntro.addEventListener('click', finishIntro)
  $('.skip-link').addEventListener('click', finishIntro)
  if (reduceMotion || captureMode) finishIntro(); else playIntro()

  // Header and mobile navigation
  const menuButton = $('#menu-button')
  const mobileNav = $('#mobile-nav')
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true'
    menuButton.setAttribute('aria-expanded', String(!open))
    mobileNav.classList.toggle('open', !open)
  })
  $$('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false')
  }))

  // Reveal choreography
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('in-view')
      if (!reduceMotion) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(42px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
        )
      }
      observer.unobserve(entry.target)
    })
  }, { threshold: .13, rootMargin: '0px 0px -8% 0px' })
  $$('.reveal-group,.reveal-card').forEach(el => observer.observe(el))

  // Scroll-controlled race car and page progress
  const chapters = $$('.chapter')
  const progressBar = $('#page-progress')
  let current = { x: 57, y: 66, scale: .64, opacity: 0, blur: 0 }
  let target = { ...current }
  let lastScroll = scrollY
  let scrollVelocity = 0

  function updateTarget() {
    const viewportFocus = innerHeight * .52
    let active = chapters[0]
    let best = Infinity
    chapters.forEach(section => {
      const rect = section.getBoundingClientRect()
      const distance = Math.abs((rect.top + rect.height * .5) - viewportFocus)
      if (distance < best) { best = distance; active = section }
    })
    target.x = Number(active.dataset.carX || 50)
    target.y = Number(active.dataset.carY || 75)
    target.scale = Number(active.dataset.carScale || .45)
    target.opacity = Number(active.dataset.carOpacity ?? 1)
    scrollVelocity = scrollY - lastScroll
    lastScroll = scrollY
    target.blur = clamp(Math.abs(scrollVelocity) * .06, 0, 3.5)
  }

  function animationLoop() {
    const doc = document.documentElement
    const max = Math.max(1, doc.scrollHeight - innerHeight)
    const pageProgress = clamp(scrollY / max, 0, 1)
    progressBar.style.transform = `scaleX(${pageProgress})`
    header.classList.toggle('scrolled', scrollY > 40)
    updateTarget()
    const ease = reduceMotion ? 1 : .075
    current.x = lerp(current.x, target.x, ease)
    current.y = lerp(current.y, target.y, ease)
    current.scale = lerp(current.scale, target.scale, ease)
    current.opacity = lerp(current.opacity, introFinished ? target.opacity : 0, .1)
    current.blur = lerp(current.blur, target.blur, .15)
    raceCar.style.transform = `translate3d(${current.x}vw, ${current.y}vh, 0) scale(${current.scale})`
    raceCar.style.opacity = current.opacity
    raceCar.style.filter = `blur(${current.blur}px)`
    if (!captureMode) requestAnimationFrame(animationLoop)
  }
  requestAnimationFrame(animationLoop)

  // Lightweight high-DPI telemetry canvas
  const canvas = $('#telemetry-canvas')
  const ctx = canvas.getContext('2d', { alpha: true })
  let dots = []
  function resizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = Math.floor(innerWidth * dpr)
    canvas.height = Math.floor(innerHeight * dpr)
    canvas.style.width = `${innerWidth}px`
    canvas.style.height = `${innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    dots = Array.from({ length: innerWidth < 720 ? 18 : 38 }, (_, index) => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: .04 + Math.random() * .12, vy: (Math.random() - .5) * .04,
      r: index % 7 === 0 ? 2 : 1
    }))
  }
  resizeCanvas(); addEventListener('resize', resizeCanvas, { passive: true })
  function drawTelemetry() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    if (!reduceMotion && innerWidth > 720) {
      const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
      ctx.strokeStyle = 'rgba(215,25,28,.16)'; ctx.lineWidth = 1
      dots.forEach((dot, index) => {
        dot.x += dot.vx * (1 + Math.abs(scrollVelocity) * .04); dot.y += dot.vy
        if (dot.x > innerWidth + 30) dot.x = -30
        ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(17,17,19,.18)'; ctx.fill()
        if (index % 4 === 0) {
          const other = dots[(index + 7) % dots.length]
          const dx = other.x - dot.x, dy = other.y - dot.y
          if (dx * dx + dy * dy < 120000) { ctx.beginPath(); ctx.moveTo(dot.x, dot.y); ctx.lineTo(other.x, other.y); ctx.stroke() }
        }
      })
      ctx.beginPath();
      for (let x = -50; x <= innerWidth + 50; x += 12) {
        const y = innerHeight * (.22 + p * .62) + Math.sin(x * .011 + p * 12) * 34
        x === -50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(215,25,28,.1)'; ctx.stroke()
    }
    scrollVelocity *= .88
    if (!captureMode) requestAnimationFrame(drawTelemetry)
  }
  requestAnimationFrame(drawTelemetry)

  // Visibility calculator
  const inputs = {
    searches: $('#searches'), value: $('#customer-value'), leads: $('#current-leads'), conversion: $('#conversion')
  }
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  function calculateAudit() {
    const searches = +inputs.searches.value, customerValue = +inputs.value.value, leads = +inputs.leads.value, conversion = +inputs.conversion.value / 100
    const potentialLeads = Math.round(searches * conversion)
    const missedLeads = Math.max(0, potentialLeads - leads)
    const opportunity = missedLeads * customerValue
    const score = clamp(Math.round(100 - (missedLeads / Math.max(1, potentialLeads)) * 82), 8, 96)
    $('#searches-output').textContent = searches.toLocaleString()
    $('#value-output').textContent = currency.format(customerValue)
    $('#leads-output').textContent = leads.toLocaleString()
    $('#conversion-output').textContent = `${(conversion * 100).toFixed(1)}%`
    $('#score-result').textContent = score
    $('#leads-result').textContent = potentialLeads.toLocaleString()
    $('#revenue-result').textContent = currency.format(opportunity)
  }
  Object.values(inputs).forEach(input => input.addEventListener('input', calculateAudit)); calculateAudit()

  // Engine interaction
  const engineContent = {
    website: ['Website', 'A fast, premium digital headquarters that clearly explains the offer and turns attention into action.'],
    seo: ['SEO', 'Technical structure, relevance, service and location signals that help search systems understand where the business belongs.'],
    ads: ['Advertising', 'Focused campaigns that produce measurable demand while organic visibility compounds over time.'],
    content: ['Content', 'Useful, distinctive messaging that reduces friction, earns attention, and creates topical relevance.'],
    data: ['Analytics', 'Calls, forms, bookings, rankings, and campaign attribution provide the telemetry required to improve.']
  }
  $$('.engine-node').forEach(button => button.addEventListener('click', () => {
    const [title, copy] = engineContent[button.dataset.node]
    const detail = $('#engine-detail')
    detail.animate([{ opacity: .2, transform: 'translateX(-50%) translateY(8px)' }, { opacity: 1, transform: 'translateX(-50%) translateY(0)' }], { duration: 360, fill: 'both' })
    detail.innerHTML = `<span>${title}</span><p>${copy}</p>`
  }))

  // Service tabs
  const serviceData = {
    website: { n:'01', label:'Website systems', title:'Make the first impression feel impossible to ignore.', copy:'High-converting, mobile-first websites built for speed, SEO, credibility, and lead generation.', items:['Research and positioning','Conversion-focused design','Core Web Vitals','Schema and internal linking'], score:'100/100' },
    seo: { n:'02', label:'Search visibility', title:'Make the business easy for Google—and customers—to understand.', copy:'Keyword research, technical SEO, local SEO, content optimization, internal linking, and ongoing ranking improvements.', items:['Technical auditing','Local search architecture','Service and location pages','Rank tracking'], score:'94% MATCH' },
    advertising: { n:'03', label:'Paid acquisition', title:'Buy attention with a system built to learn from every click.', copy:'Google, Meta, Instagram, Facebook, and TikTok campaigns designed around measurable leads and revenue.', items:['Campaign strategy','Creative testing','Landing pages','Conversion tracking'], score:'4.7X ROAS' },
    content: { n:'04', label:'Content engine', title:'Give the market a reason to stop, understand, and remember.', copy:'SEO articles, landing pages, short-form videos, social content, and conversion-focused messaging.', items:['Topical strategy','Short-form creative','Landing page copy','Editorial systems'], score:'30+ / MO' },
    authority: { n:'05', label:'Authority signals', title:'Build the proof that separates the answer from another claim.', copy:'Relevant backlinks, citations, digital PR, local authority, and trust signals around the business.', items:['Link strategy','Local citations','Digital PR','Reputation signals'], score:'TRUST ↑' },
    analytics: { n:'06', label:'Growth telemetry', title:'Know which part of the system is actually producing business.', copy:'Call tracking, form tracking, campaign attribution, rankings, dashboards, and monthly reporting.', items:['Call attribution','Conversion events','Funnel reporting','Monthly optimization'], score:'LIVE DATA' }
  }
  $$('.service-tabs button').forEach(button => button.addEventListener('click', () => {
    $$('.service-tabs button').forEach(item => item.setAttribute('aria-selected', String(item === button)))
    const data = serviceData[button.dataset.service]
    const copy = $('#service-copy')
    copy.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 430, fill: 'both', easing: 'cubic-bezier(.16,1,.3,1)' })
    copy.innerHTML = `<p>${data.n} / ${data.label}</p><h3>${data.title}</h3><span>${data.copy}</span><ul>${data.items.map(item => `<li>${item}</li>`).join('')}</ul>`
    $('#service-readout').textContent = button.dataset.service.toUpperCase()
    $('.service-readout b').textContent = data.score
  }))

  // Deterministic demo plan counts, stable per month/session
  function seededCount(key) {
    const monthKey = new Date().toISOString().slice(0, 7)
    let seed = [...`${monthKey}-${key}`].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    seed = Math.abs(Math.sin(seed) * 10000)
    return 70 + Math.floor((seed % 1) * 181)
  }
  $$('[data-count-key]').forEach(plan => { $('[data-plan-count]', plan).textContent = seededCount(plan.dataset.countKey) })

  // Contact form opens a populated email draft; no backend is assumed.
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`RS Marketing inquiry — ${data.get('company')}`)
    const body = encodeURIComponent(`Name: ${data.get('name')}\nCompany: ${data.get('company')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nGoal: ${data.get('goal')}\nBudget: ${data.get('budget')}\n\nMessage:\n${data.get('message')}`)
    $('#form-status').textContent = 'Opening your email application with the inquiry prepared.'
    location.href = `mailto:hello.rarescore@gmail.com?subject=${subject}&body=${body}`
  })
})()
