import { useEffect } from 'react'

// Replicates the original vanilla-JS behaviors from the static site:
// - staggered reveal-on-scroll animations
// - scroll progress bar
// - magnetic button hover effect
// - tilt effect on cards
// - parallax chips inside the hero visual
export default function useSiteEffects() {
  useEffect(() => {
    const parentIndex = new WeakMap()
    document.querySelectorAll('.reveal').forEach((el) => {
      const p = el.parentElement
      const n = parentIndex.get(p) || 0
      el.style.transitionDelay = Math.min(n * 60, 360) + 'ms'
      parentIndex.set(p, n + 1)
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    const bar = document.getElementById('progress-bar')
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
      if (bar) bar.style.width = scrolled + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const btnMove = (e) => {
      const btn = e.currentTarget
      const r = btn.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`
    }
    const btnLeave = (e) => {
      e.currentTarget.style.transform = 'translate(0,0)'
    }
    const btns = document.querySelectorAll('.btn')
    btns.forEach((btn) => {
      btn.addEventListener('mousemove', btnMove)
      btn.addEventListener('mouseleave', btnLeave)
    })

    const cardMove = (e) => {
      const card = e.currentTarget
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      card.style.transform = `perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`
    }
    const cardLeave = (e) => {
      e.currentTarget.style.transform = ''
    }
    const cards = document.querySelectorAll('.svc-tile, .price-card, .testi-card2')
    cards.forEach((card) => {
      card.addEventListener('mousemove', cardMove)
      card.addEventListener('mouseleave', cardLeave)
    })

    const heroVisual = document.querySelector('.hero-visual')
    const heroMove = (e) => {
      const r = heroVisual.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      heroVisual.querySelectorAll('.chip').forEach((chip, i) => {
        const depth = (i + 1) * 9
        chip.style.transform = `translate(${x * depth}px, ${y * depth}px)`
      })
    }
    const heroLeave = () => {
      heroVisual.querySelectorAll('.chip').forEach((chip) => {
        chip.style.transform = 'translate(0,0)'
      })
    }
    if (heroVisual) {
      heroVisual.addEventListener('mousemove', heroMove)
      heroVisual.addEventListener('mouseleave', heroLeave)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      btns.forEach((btn) => {
        btn.removeEventListener('mousemove', btnMove)
        btn.removeEventListener('mouseleave', btnLeave)
      })
      cards.forEach((card) => {
        card.removeEventListener('mousemove', cardMove)
        card.removeEventListener('mouseleave', cardLeave)
      })
      if (heroVisual) {
        heroVisual.removeEventListener('mousemove', heroMove)
        heroVisual.removeEventListener('mouseleave', heroLeave)
      }
      io.disconnect()
    }
  }, [])
}
