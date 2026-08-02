import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ExperienceProvider, useExperience } from './components/ExperienceContext'
import { usePerformanceProfile } from './hooks/usePerformanceProfile'
import { chapters } from './data/content'
import Preloader from './components/Preloader'
import Header from './components/Header'
import CustomCursor from './components/CustomCursor'
import SceneLayer from './components/SceneLayer'
import ProgressRail from './components/ProgressRail'
import LiveActivity from './components/LiveActivity'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Work from './sections/Work'
import Process from './sections/Process'
import Packages from './sections/Packages'
import Results from './sections/Results'
import Testimonials from './sections/Testimonials'
import Articles from './sections/Articles'
import Contact from './sections/Contact'

gsap.registerPlugin(ScrollTrigger)

function Site() {
  const profile = usePerformanceProfile()
  const { progress, velocity, pointer, active } = useExperience()
  const [loaded, setLoaded] = useState(profile.reducedMotion)
  const finishLoading = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', profile.reducedMotion)
    if (profile.reducedMotion) return
    const lenis = new Lenis({ duration: 1.18, smoothWheel: true, wheelMultiplier: .88, touchMultiplier: 1.25, anchors: { offset: -76 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [profile.reducedMotion])

  useEffect(() => {
    const move = (event) => {
      pointer.current.x = (event.clientX / innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / innerHeight) * 2 - 1)
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [pointer])

  useEffect(() => {
    if (!loaded) return
    const sections = gsap.utils.toArray('[data-chapter]')
    const master = ScrollTrigger.create({
      trigger: '#main-content', start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress
        velocity.current = self.getVelocity()
        document.documentElement.style.setProperty('--story-progress', self.progress)
        const fill = document.getElementById('progress-fill')
        if (fill) fill.style.transform = `scaleY(${self.progress})`
      }
    })
    const sectionTriggers = sections.map((section, index) => ScrollTrigger.create({
      trigger: section, start: 'top 52%', end: 'bottom 48%',
      onToggle: (self) => {
        if (!self.isActive) return
        active.current = index
        document.body.dataset.chapter = String(index)
        document.getElementById('progress-index')?.replaceChildren(document.createTextNode(chapters[index].index))
        document.getElementById('progress-label')?.replaceChildren(document.createTextNode(chapters[index].label))
      }
    }))
    const contexts = sections.map((section) => gsap.context(() => {
      gsap.from(section.querySelectorAll('.heading-word > span'), {
        yPercent: 112, rotate: 1.5, opacity: 0, stagger: .025, duration: 1.05, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 69%', toggleActions: 'play none none reverse' }
      })
      gsap.from(section.querySelectorAll('.reveal-copy'), {
        y: 34, opacity: 0, stagger: .09, duration: .95, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 68%', toggleActions: 'play none none reverse' }
      })
      gsap.from(section.querySelectorAll('.reveal-panel'), {
        y: 72, opacity: 0, clipPath: 'inset(16% 0 0 0)', stagger: .07, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 66%', toggleActions: 'play none none reverse' }
      })
    }, section))
    ScrollTrigger.refresh()
    return () => { master.kill(); sectionTriggers.forEach((item) => item.kill()); contexts.forEach((ctx) => ctx.revert()) }
  }, [loaded, progress, velocity, active])

  return (
    <>
      {!loaded && <Preloader onComplete={finishLoading} reducedMotion={profile.reducedMotion} />}
      <Header />
      <CustomCursor disabled={profile.compact || profile.reducedMotion} />
      <div className="grain" aria-hidden="true" />
      <SceneLayer enableWebGL={profile.enableWebGL} reducedMotion={profile.reducedMotion} />
      <ProgressRail />
      <LiveActivity reducedMotion={profile.reducedMotion} />
      <main id="main-content">
        <Hero chapter={chapters[0]} />
        <Services chapter={chapters[1]} />
        <Work chapter={chapters[2]} />
        <Process chapter={chapters[3]} />
        <Packages chapter={chapters[4]} />
        <Results chapter={chapters[5]} />
        <Testimonials chapter={chapters[6]} />
        <Articles chapter={chapters[7]} />
        <Contact chapter={chapters[8]} />
      </main>
      <footer className="site-footer"><span>© 2026 Rare Score Marketing</span><span>Design / Search / Creative / Growth</span><a href="mailto:hello.rarescore@gmail.com">hello.rarescore@gmail.com</a></footer>
    </>
  )
}

export default function App() {
  return <ExperienceProvider><Site /></ExperienceProvider>
}
