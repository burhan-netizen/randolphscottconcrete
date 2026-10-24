import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (s, c = document) => c.querySelector(s)
const $$ = (s, c = document) => [...c.querySelectorAll(s)]

/* smooth scroll */
let lenis
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href')
  const el = id.length > 1 && $(id)
  if (!el) return
  e.preventDefault()
  document.body.classList.remove('menu-open')
  $('.burger').setAttribute('aria-expanded', 'false')
  lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
}))

/* nav + mobile menu + sticky cta */
const nav = $('#nav'), sticky = $('.sticky-cta')
ScrollTrigger.create({ start: 40, onUpdate: s => nav.classList.toggle('scrolled', s.scroll() > 40) })
ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70%', end: 99999, onToggle: s => sticky.classList.toggle('show', s.isActive) })
ScrollTrigger.create({ trigger: '#estimate', start: 'top 80%', end: 'bottom top', onToggle: s => s.isActive && sticky.classList.remove('show'), onLeaveBack: () => sticky.classList.add('show') })
$('.burger').addEventListener('click', e => {
  const open = document.body.classList.toggle('menu-open')
  e.currentTarget.setAttribute('aria-expanded', open)
  $('.mobile-menu').setAttribute('aria-hidden', !open)
})

/* hero intro */
if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero-title .line > *', { yPercent: 115, duration: 1.4, stagger: 0.12 })
    .from('.eyebrow', { y: 20, opacity: 0, duration: 1 }, 0.1)
    .from('.hero-sub, .hero-actions, .hero-proof', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.5)
    .from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 28px 28px)', duration: 1.6, ease: 'expo.inOut' }, 0.1)
    .from('.arch video', { scale: 1.5, duration: 2.2 }, 0.1)
    .from('.seal', { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.6)' }, 0.9)
  gsap.to('.hero-media', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.hero-copy', { yPercent: 10, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  // count up
  const c = $('[data-count]'); const o = { v: 0 }
  gsap.to(o, { v: 40, duration: 2, delay: 0.8, ease: 'power3.out', onUpdate: () => (c.textContent = Math.round(o.v)) })
}

/* magnetic */
if (matchMedia('(hover:hover)').matches && !reduce) {
  $$('.magnetic').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' })
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.25); yTo((e.clientY - r.top - r.height / 2) * 0.35) })
    b.addEventListener('mouseleave', () => { xTo(0); yTo(0) })
  })
}

/* pour reveal */
const steps = $$('.pour-steps li')
const setStep = p => steps.forEach((s, i) => s.classList.toggle('is-on', p >= [0, 0.3, 0.7][i]))
const pourTl = () => {
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  tl.fromTo('.pf-after-wrap', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1 }, 0)
    .fromTo('.screed', { left: '0%' }, { left: '100%', duration: 1 }, 0)
    .fromTo('.pf-meter-fill', { width: '0%' }, { width: '100%', duration: 1 }, 0)
    .to('.pf-l1', { opacity: 0, duration: 0.15 }, 0.25)
    .fromTo('.pf-l2', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.75)
  return tl
}
const mm = gsap.matchMedia()
mm.add('(min-width: 901px)', () => {
  ScrollTrigger.create({ trigger: '.pour', pin: '.pour-pin', start: 'top top', end: '+=160%', scrub: 0.6, animation: pourTl(), onUpdate: s => setStep(s.progress) })
})
mm.add('(max-width: 900px)', () => {
  ScrollTrigger.create({ trigger: '.pour-frame', start: 'top 75%', end: 'bottom 35%', scrub: 0.6, animation: pourTl(), onUpdate: s => setStep(s.progress) })
})

/* services hover image */
const flt = $('.svc-float'), fimg = $('.svc-float img')
if (matchMedia('(hover:hover) and (min-width:901px)').matches) {
  const xTo = gsap.quickTo(flt, 'x', { duration: 0.6, ease: 'power3' }), yTo = gsap.quickTo(flt, 'y', { duration: 0.6, ease: 'power3' })
  const rTo = gsap.quickTo(flt, 'rotation', { duration: 0.8, ease: 'power3' })
  let lastX = 0
  $('.svc-list').addEventListener('mousemove', e => { xTo(e.clientX + 30); yTo(e.clientY - 190); rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6)); lastX = e.clientX })
  $$('.svc').forEach(s => s.addEventListener('mouseenter', () => { fimg.src = s.dataset.img; flt.classList.add('on') }))
  $('.svc-list').addEventListener('mouseleave', () => flt.classList.remove('on'))
}

/* finishes */
const tabs = $$('.fin-tabs button'), fims = $$('.fin-stage img')
tabs.forEach((t, i) => t.addEventListener('click', () => {
  tabs.forEach(x => x.setAttribute('aria-selected', x === t))
  fims.forEach((im, j) => im.classList.toggle('is-on', i === j))
  $('.fin-cap-n').textContent = String(i + 1).padStart(2, '0')
  $('.fin-cap-t').textContent = t.querySelector('span').textContent
}))

/* gallery drag */
const tr = $('.gal-track')
let down = false, sx = 0, sl = 0, moved = false
tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; tr.classList.add('dragging') })
addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; tr.scrollLeft = sl - dx })
addEventListener('pointerup', () => { down = false; tr.classList.remove('dragging') })
tr.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation() }, { passive: true })
tr.setAttribute('data-lenis-prevent-wheel', '')
if (!reduce) gsap.from('.g', { x: 120, opacity: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.gal-track', start: 'top 85%' } })

/* lazy videos */
const io = new IntersectionObserver(es => es.forEach(en => {
  const v = en.target
  if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}) } else v.pause()
}), { threshold: 0.25 })
$$('.lazy-vid').forEach(v => io.observe(v))

/* process line */
mm.add('(min-width: 901px)', () => {
  gsap.to('.proc-line span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.proc', start: 'top 75%', end: 'bottom 55%', scrub: true,
    onUpdate: s => $$('.proc-step').forEach((p, i) => p.classList.toggle('lit', s.progress >= i / 3.2)) } })
})
mm.add('(max-width: 900px)', () => {
  gsap.to('.proc-line span', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.proc', start: 'top 70%', end: 'bottom 60%', scrub: true,
    onUpdate: s => $$('.proc-step').forEach((p, i) => p.classList.toggle('lit', s.progress >= i / 3.2)) } })
})

/* generic reveals */
if (!reduce) {
  const targets = $$('.sec-head, .svc, .why-card, .proc-step, .towns li, .faq-list details, .story-copy > *, .phone, .fin-left > *, .fin-stage, .est-copy > *, .est-form, .area-grid > div, .faq-grid > div:first-child, .gal-head')
  targets.forEach(t => t.classList.add('rv'))
  ScrollTrigger.batch(targets, { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }) })
  gsap.fromTo('.phone', { rotate: -10 }, { rotate: 4, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } })
}

/* form */
const form = $('.est-form')
form.addEventListener('submit', e => {
  e.preventDefault()
  const f = new FormData(form)
  let ok = true
  ;['name', 'phone'].forEach(n => { const el = form.elements[n]; const bad = !el.value.trim(); el.classList.toggle('err', bad); if (bad) ok = false })
  if (!ok) { form.querySelector('.err').focus(); return }
  const types = f.getAll('type').join(', ') || 'Not specified'
  const body = `Name: ${f.get('name')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email') || '-'}\nProject: ${types}\nCity/ZIP: ${f.get('city') || '-'}\n\n${f.get('msg') || ''}`
  location.href = `mailto:rsconcrete407@gmail.com?subject=${encodeURIComponent('Free estimate request: ' + types)}&body=${encodeURIComponent(body)}`
  form.querySelector('.f-ok').hidden = false
})

addEventListener('load', () => ScrollTrigger.refresh())
