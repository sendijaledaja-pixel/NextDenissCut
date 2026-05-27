import { useState, useEffect } from 'react'
import './index.css'

/* ─── STORAGE (localStorage) ──────────────────────── */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function persist(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

/* ─── DEFAULTS ────────────────────────────────────── */
const DEF_SVCS = [
  { id: 1, name: 'Matu griezums',         duration: 30, price: 20, active: true },
  { id: 2, name: 'Bārda',                 duration: 20, price: 12, active: true },
  { id: 3, name: 'Matu griezums + Bārda', duration: 50, price: 30, active: true },
  { id: 4, name: 'Skin fade',             duration: 40, price: 25, active: true },
  { id: 5, name: 'Bērnu griezums',        duration: 25, price: 15, active: true },
]
const DEF_PRODS = [
  { id: 1, name: 'Reuzel Pomāde',   price: 16, desc: 'Klasiska pomāde — spēcīga fiksācija', available: true, icon: '🐷' },
  { id: 2, name: 'STMNT Wax',       price: 18, desc: 'Matēts vasks, vidēja fiksācija',      available: true, icon: '⚡' },
  { id: 3, name: 'Uppercut Deluxe', price: 17, desc: 'Dabīgs izskatījums, vidējs spīdums',  available: true, icon: '✂️' },
  { id: 4, name: 'Slick Gorilla',   price: 14, desc: 'Ūdens bāzes — viegli noskalojams',    available: true, icon: '🦍' },
  { id: 5, name: 'Bārdas eļļa',    price: 18, desc: 'Mitrinoša eļļa bārdas kopšanai',     available: true, icon: '💧' },
  { id: 6, name: 'Dāvanu karte',    price: 50, desc: 'Dāvanu karte 50 € vērtībā',          available: true, icon: '🎁' },
]

/* ─── TIME UTILS ──────────────────────────────────── */
const ALL_SLOTS = (() => {
  const s = []
  for (let h = 9; h < 18; h++) {
    s.push(`${String(h).padStart(2, '0')}:00`)
    s.push(`${String(h).padStart(2, '0')}:30`)
  }
  return s
})()

const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const todayStr = () => new Date().toISOString().split('T')[0]

function getSlots(date, dur, books, blocked, offDays) {
  if (!date || offDays.includes(date)) return []
  const dayB  = books.filter(b => b.date === date)
  const dayBl = blocked[date] || []
  return ALL_SLOTS.filter(slot => {
    const s = toMin(slot), e = s + dur
    if (e > 18 * 60) return false
    if (dayBl.includes(slot)) return false
    return !dayB.some(b => s < toMin(b.time) + b.duration && e > toMin(b.time))
  })
}

/* ─── COUNTER HOOK ────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let cur = 0
      const step = Math.ceil(target / 40)
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target)
        setVal(cur)
        if (cur >= target) clearInterval(iv)
      }, 30)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return val
}

/* ─── CSS ─────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg:          #080808;
  --s1:          #0D0D0D;
  --s2:          #131313;
  --s3:          #181818;
  --border:      #1E1E1E;
  --gold:        #C8922A;
  --gold2:       #E4AE3A;
  --gold-dim:    rgba(200,146,42,0.12);
  --gold-border: rgba(200,146,42,0.25);
  --text:        #F2EDE4;
  --dim:         #606060;
  --muted:       #2E2E2E;
  --red:         #B83220;
}

@keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes shimmer  { 0% { background-position:-200% center } 100% { background-position:200% center } }
@keyframes pulse    { 0%,100% { opacity:1;transform:scale(1) } 50% { opacity:.5;transform:scale(.8) } }
@keyframes slideRight { from { transform:translateX(-100%);opacity:0 } to { transform:translateX(0);opacity:1 } }
@keyframes glow     { 0%,100% { box-shadow:0 0 0 0 rgba(200,146,42,0) } 50% { box-shadow:0 0 20px 4px rgba(200,146,42,.15) } }

.fade-up   { animation: fadeUp .5s ease forwards }
.fade-up-1 { animation: fadeUp .5s ease .1s both }
.fade-up-2 { animation: fadeUp .5s ease .2s both }
.fade-up-3 { animation: fadeUp .5s ease .3s both }
.fade-up-4 { animation: fadeUp .5s ease .4s both }

.app {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  overflow-x: hidden;
}

/* ─ HEADER ─ */
.hdr {
  position: sticky; top: 0; z-index: 100;
  background: rgba(8,8,8,.97);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
  display: flex; align-items: center; justify-content: space-between;
}
.hdr-logo {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 22px; font-weight: 900;
  text-transform: uppercase; letter-spacing: 3px;
  color: var(--text); line-height: 1;
}
.hdr-logo em { color: var(--gold); font-style: normal; }
.hdr-tag  { font-size: 9px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }
.hdr-barber {
  font-size: 10px; color: var(--gold); letter-spacing: 1px; text-transform: uppercase;
  padding: 4px 10px; border: 1px solid var(--gold-border); border-radius: 3px;
}

/* ─ HERO ─ */
.hero { position: relative; padding: 40px 20px 32px; overflow: hidden; }
.hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 120% 60% at 80% 0%, rgba(200,146,42,.06) 0%, transparent 60%),
    repeating-linear-gradient(-55deg, transparent, transparent 35px, rgba(200,146,42,.018) 35px, rgba(200,146,42,.018) 36px);
}
.hero-eyebrow { position: relative; display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.hero-eyebrow-line { flex: 1; height: 1px; background: var(--gold); opacity: .2; max-width: 36px; }
.hero-eyebrow-text { font-size: 9px; color: var(--gold); letter-spacing: 4px; text-transform: uppercase; }
.hero-title {
  position: relative;
  font-family: 'Big Shoulders Display', sans-serif;
  font-weight: 900;
  font-size: clamp(68px, 18vw, 88px);
  line-height: .85; text-transform: uppercase;
  color: var(--text); margin-bottom: 22px; letter-spacing: -1px;
}
.hero-title .hl { color: var(--gold); display: block; }
.hero-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.hero-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); opacity: .25; }
.hero-sub { font-size: 12px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px; }
.hero-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--gold); color: #080808;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 16px; letter-spacing: 3px; text-transform: uppercase;
  padding: 14px 28px; border: none; border-radius: 3px; cursor: pointer;
  animation: glow 3s ease-in-out infinite;
  transition: background .2s, transform .15s;
  position: relative; overflow: hidden;
}
.hero-cta::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
  background-size: 200% 100%;
  animation: shimmer 2.5s ease-in-out infinite;
}
.hero-cta:hover { background: var(--gold2); transform: translateY(-1px); }
.hero-cta:active { transform: translateY(0); }

/* ─ STATS ─ */
.stats { display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stat-item { padding: 18px 0; text-align: center; position: relative; }
.stat-item:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 1px; background: var(--border); }
.stat-num { font-family: 'Big Shoulders Display', sans-serif; font-size: 36px; font-weight: 900; color: var(--gold); line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 9px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; }

/* ─ SECTION ─ */
.section { padding: 28px 16px 8px; }
.section-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--text); }
.section-line { flex: 1; height: 1px; background: var(--border); }

/* ─ SERVICE CARDS ─ */
.svc-card {
  position: relative; overflow: hidden;
  background: var(--s1); border: 1px solid var(--border); border-left: 3px solid transparent;
  border-radius: 4px; padding: 18px 18px 18px 20px; margin-bottom: 8px;
  cursor: pointer; display: flex; align-items: center; justify-content: space-between;
  width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  transition: border-color .25s, background .25s, transform .2s;
}
.svc-card:hover { border-color: var(--gold-border); border-left-color: var(--gold); background: var(--s2); transform: translateY(-2px); }
.svc-card:active { transform: translateY(0); }
.svc-num {
  position: absolute; right: 80px; top: 50%; transform: translateY(-50%);
  font-family: 'Big Shoulders Display', sans-serif; font-size: 56px; font-weight: 900;
  color: rgba(200,146,42,.04); line-height: 1; user-select: none; pointer-events: none;
}
.svc-info { flex: 1; position: relative; }
.svc-name { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 5px; }
.svc-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; color: var(--dim);
  background: var(--s3); border: 1px solid var(--border);
  padding: 3px 9px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;
}
.svc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; position: relative; }
.svc-price { font-family: 'Big Shoulders Display', sans-serif; font-size: 26px; font-weight: 800; color: var(--gold); letter-spacing: 1px; line-height: 1; }
.svc-arrow { font-size: 14px; color: var(--muted); transition: color .2s, transform .2s; }
.svc-card:hover .svc-arrow { color: var(--gold); transform: translateX(3px); }

/* ─ STEP PROGRESS ─ */
.step-progress { display: flex; align-items: center; padding: 16px 16px 0; margin-bottom: 20px; }
.step-item { display: flex; align-items: center; gap: 7px; flex: 1; }
.step-item:last-child { flex: 0; }
.step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  border: 1px solid var(--border); color: var(--dim); background: var(--s1);
  transition: all .3s; flex-shrink: 0;
  font-family: 'Barlow Condensed', sans-serif;
}
.step-dot.done   { background: var(--gold); border-color: var(--gold); color: #080808; }
.step-dot.active { background: var(--s2); border-color: var(--gold); color: var(--gold); box-shadow: 0 0 12px rgba(200,146,42,.2); }
.step-line { flex: 1; height: 1px; background: var(--border); margin: 0 6px; transition: background .3s; }
.step-line.done { background: var(--gold); opacity: .3; }

/* ─ BOOKING SELECTED ─ */
.book-selected {
  background: var(--s1); border: 1px solid var(--gold-border); border-radius: 4px;
  padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; position: relative; overflow: hidden;
}
.book-selected::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--gold); }

/* ─ DATE ─ */
.date-wrap { margin-bottom: 22px; }
.date-label { font-size: 9px; color: var(--gold); letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 8px; }
.date-input {
  background: var(--s1); border: 1px solid var(--border); border-radius: 4px;
  padding: 13px 16px; color: var(--text); font-family: 'DM Sans', sans-serif;
  font-size: 15px; width: 100%; transition: border-color .2s;
}
.date-input:focus { outline: none; border-color: var(--gold); }
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(.35); }

/* ─ SLOTS ─ */
.slots-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.slots-label { font-size: 9px; color: var(--gold); letter-spacing: 3px; text-transform: uppercase; }
.slots-count { font-size: 10px; color: var(--dim); }
.slots-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 22px; }
.slot {
  background: var(--s1); border: 1px solid var(--border); border-radius: 4px;
  padding: 11px 4px; text-align: center; font-size: 13px; cursor: pointer; color: var(--dim);
  transition: all .15s; font-family: 'DM Sans', sans-serif; position: relative;
}
.slot::before {
  content: ''; position: absolute; top: 5px; right: 5px;
  width: 4px; height: 4px; border-radius: 50%;
  background: #3A6A3A; animation: pulse 2s ease infinite;
}
.slot:hover { border-color: rgba(200,146,42,.4); color: var(--gold); background: var(--gold-dim); }
.slot.sel    { border-color: var(--gold); background: var(--gold-dim); color: var(--gold); font-weight: 600; }
.slot.sel::before { background: var(--gold); }

/* ─ FORM ─ */
.form-field { margin-bottom: 14px; }
.form-label { font-size: 9px; color: var(--gold); letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 7px; }
.form-input {
  background: var(--s1); border: 1px solid var(--border); border-radius: 4px;
  padding: 12px 14px; color: var(--text); font-family: 'DM Sans', sans-serif;
  font-size: 14px; width: 100%; transition: border-color .2s;
}
.form-input:focus { outline: none; border-color: var(--gold); }
.form-input::placeholder { color: var(--muted); }

/* ─ SUMMARY ─ */
.sumbox {
  background: var(--s1); border: 1px solid var(--gold-border); border-radius: 4px;
  padding: 16px 18px; margin-bottom: 20px; position: relative; overflow: hidden;
}
.sumbox::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, var(--gold), transparent); }
.sum-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
.sum-label { color: var(--dim); }
.sum-val   { color: var(--text); }
.sum-divider { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
.sum-total { display: flex; justify-content: space-between; align-items: center; }
.sum-price { font-family: 'Big Shoulders Display', sans-serif; font-size: 28px; font-weight: 800; color: var(--gold); letter-spacing: 1px; line-height: 1; }

/* ─ BUTTONS ─ */
.gbtn {
  background: var(--gold); color: #080808; border: none;
  padding: 14px 28px; border-radius: 3px;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 16px;
  letter-spacing: 2px; text-transform: uppercase; cursor: pointer; width: 100%;
  transition: background .2s, transform .15s; position: relative; overflow: hidden;
}
.gbtn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
  background-size: 200% 100%; opacity: 0; transition: opacity .3s;
}
.gbtn:hover { background: var(--gold2); transform: translateY(-1px); }
.gbtn:hover::after { opacity: 1; animation: shimmer 1s ease; }
.gbtn:active { transform: translateY(0); }
.gbtn:disabled { background: var(--s3); color: var(--muted); cursor: default; transform: none; }
.back-btn {
  display: inline-flex; align-items: center; gap: 8px;
  color: var(--dim); font-size: 12px; cursor: pointer;
  background: none; border: none; padding: 0; margin-bottom: 20px;
  font-family: 'DM Sans', sans-serif; letter-spacing: 1px;
  text-transform: uppercase; transition: color .2s;
}
.back-btn:hover { color: var(--gold); }

/* ─ SUCCESS ─ */
.success-wrap { padding: 24px 16px; animation: fadeIn .4s ease; }
.success-card { background: var(--s1); border: 1px solid var(--gold-border); border-radius: 4px; padding: 48px 24px; text-align: center; position: relative; overflow: hidden; }
.success-card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.success-icon  { font-size: 52px; margin-bottom: 16px; display: block; }
.success-title { font-family: 'Big Shoulders Display', sans-serif; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: var(--gold); margin-bottom: 10px; line-height: 1; }
.success-sub   { font-size: 14px; color: var(--dim); line-height: 1.8; }
.success-detail { color: var(--text); font-weight: 500; }

/* ─ INFO / WARN ─ */
.info-box { background: var(--s2); border-left: 2px solid var(--gold); padding: 10px 14px; margin-bottom: 18px; font-size: 13px; color: var(--dim); line-height: 1.6; }
.warn-box { background: rgba(184,50,32,.06); border-left: 2px solid var(--red); padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #9A4030; }
.err-msg  { color: var(--red); font-size: 12px; margin-bottom: 12px; letter-spacing: .5px; }

/* ─ LOCATION ─ */
.location-strip { margin-top: 24px; background: var(--s1); border: 1px solid var(--border); border-radius: 4px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.location-strip-icon { font-size: 20px; flex-shrink: 0; }
.location-name { font-size: 13px; font-weight: 500; }
.location-sub  { font-size: 11px; color: var(--dim); margin-top: 2px; }

/* ─ PRODUCTS ─ */
.prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.prod-card {
  background: var(--s1); border: 1px solid var(--border); border-radius: 4px; padding: 18px 14px;
  transition: border-color .2s, transform .2s; position: relative; overflow: hidden;
}
.prod-card:hover { border-color: var(--gold-border); transform: translateY(-2px); }
.prod-card.na    { opacity: .3; }
.prod-card::after { content: attr(data-icon); position: absolute; right: -5px; bottom: -10px; font-size: 56px; opacity: .04; user-select: none; pointer-events: none; }
.prod-icon  { font-size: 32px; margin-bottom: 12px; display: block; }
.prod-name  { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 5px; line-height: 1.3; }
.prod-desc  { font-size: 11px; color: var(--dim); line-height: 1.4; margin-bottom: 12px; min-height: 28px; }
.prod-price { font-family: 'Big Shoulders Display', sans-serif; font-size: 22px; font-weight: 800; color: var(--gold); margin-bottom: 10px; letter-spacing: 1px; }
.prod-btn {
  background: var(--gold-dim); color: var(--gold); border: 1px solid var(--gold-border);
  border-radius: 3px; padding: 7px 10px; font-size: 11px; cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; width: 100%; transition: background .15s;
}
.prod-btn:hover { background: rgba(200,146,42,.2); }

/* ─ BOTTOM NAV ─ */
.bnav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; z-index: 100;
  background: rgba(8,8,8,.97); backdrop-filter: blur(10px);
  border-top: 1px solid var(--border); display: flex;
  padding-bottom: env(safe-area-inset-bottom);
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 10px 8px 14px; cursor: pointer; font-size: 9px; gap: 5px;
  background: none; border: none;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  transition: color .2s; position: relative;
}
.nav-item.on  { color: var(--gold); }
.nav-item.off { color: var(--muted); }
.nav-item.on::before { content: ''; position: absolute; top: 0; left: 25%; right: 25%; height: 2px; background: var(--gold); animation: slideRight .3s ease; }
.nav-icon { font-size: 20px; }

/* ─ ADMIN ─ */
.admin-tabs { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; border-bottom: 1px solid var(--border); }
.admin-tab {
  padding: 14px 16px; font-size: 10px; cursor: pointer; white-space: nowrap;
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; transition: color .15s;
}
.admin-tab.on  { color: var(--gold); border-bottom-color: var(--gold); }
.admin-tab.off { color: var(--muted); }

.acard { background: var(--s1); border: 1px solid var(--border); border-radius: 4px; padding: 14px; margin-bottom: 8px; }
.badge     { display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.badge-on  { background: rgba(80,200,80,.1);  color: #50C850; }
.badge-off { background: rgba(200,80,80,.1);  color: #C85050; }

.sbtn     { padding: 5px 12px; border-radius: 3px; font-size: 10px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; border: 1px solid; background: none; transition: all .15s; letter-spacing: 1px; text-transform: uppercase; }
.sbtn-g   { color: var(--gold);  border-color: var(--gold-border); }  .sbtn-g:hover { background: var(--gold-dim); }
.sbtn-r   { color: #C85050; border-color: rgba(200,80,80,.2);  }  .sbtn-r:hover { background: rgba(200,80,80,.08); }
.sbtn-s   { color: #50C850; border-color: rgba(80,200,80,.2);  }  .sbtn-s:hover { background: rgba(80,200,80,.08); }
.sbtn-d   { color: var(--muted); border-color: var(--border);  }  .sbtn-d:hover { color: var(--dim); }

.nform  { background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 16px; margin-bottom: 14px; }
.ainput { background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 8px 11px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; width: 100%; transition: border-color .2s; }
.ainput:focus { outline: none; border-color: var(--gold); }
.albl   { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; display: block; }

.slot-adm     { padding: 9px 4px; text-align: center; font-size: 11px; border-radius: 3px; cursor: pointer; border: 1px solid var(--border); background: var(--s1); color: var(--muted); font-family: 'DM Sans', sans-serif; transition: all .15s; }
.slot-adm.blk { background: rgba(184,50,32,.08); border-color: rgba(184,50,32,.25); color: var(--red); }
.slot-adm:not(.blk):hover { border-color: var(--gold-border); color: var(--gold); }

.hdiv  { border: none; border-top: 1px solid var(--border); margin: 18px 0; }
.empty { text-align: center; padding: 28px 16px; color: var(--muted); font-size: 13px; }

/* ─ LOGIN ─ */
.login-wrap    { padding: 70px 24px; text-align: center; animation: fadeUp .4s ease; }
.login-icon    { font-size: 48px; margin-bottom: 20px; display: block; }
.login-title   { font-family: 'Big Shoulders Display', sans-serif; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: var(--text); margin-bottom: 4px; line-height: 1; }
.login-sub     { font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
`

/* ════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('booking')
  const [svcs,    setSvcs]    = useState(() => load('tnc_svcs',  DEF_SVCS))
  const [prods,   setProds]   = useState(() => load('tnc_prods', DEF_PRODS))
  const [books,   setBooks]   = useState(() => load('tnc_books', []))
  const [pRes,    setPRes]    = useState(() => load('tnc_pres',  []))
  const [blocked, setBlocked] = useState(() => load('tnc_blk',  {}))
  const [offDays, setOffDays] = useState(() => load('tnc_off',  []))

  // booking flow
  const [bStep,   setBStep]   = useState('svcs')
  const [selSvc,  setSelSvc]  = useState(null)
  const [selDate, setSelDate] = useState('')
  const [selTime, setSelTime] = useState(null)
  const [bForm,   setBForm]   = useState({ name: '', phone: '', email: '', comment: '' })
  const [bErr,    setBErr]    = useState('')

  // product flow
  const [pStep,   setPStep]   = useState('list')
  const [selProd, setSelProd] = useState(null)
  const [pForm,   setPForm]   = useState({ name: '', phone: '', comment: '' })
  const [pErr,    setPErr]    = useState('')

  // admin
  const [adminOk,     setAdminOk]     = useState(false)
  const [adminPw,     setAdminPw]     = useState('')
  const [adminPwErr,  setAdminPwErr]  = useState('')
  const [aTab,        setATab]        = useState('books')
  const [showAddSvc,  setShowAddSvc]  = useState(false)
  const [newSvc,      setNewSvc]      = useState({ name: '', duration: 30, price: 0 })
  const [editSvcId,   setEditSvcId]   = useState(null)
  const [editSvcD,    setEditSvcD]    = useState({})
  const [showAddProd, setShowAddProd] = useState(false)
  const [newProd,     setNewProd]     = useState({ name: '', price: 0, desc: '', icon: '✂️' })
  const [editProdId,  setEditProdId]  = useState(null)
  const [editProdD,   setEditProdD]   = useState({})
  const [offInput,    setOffInput]    = useState(todayStr())
  const [blkDate,     setBlkDate]     = useState(todayStr())

  // animated counters
  const c1 = useCounter(5,   400)
  const c2 = useCounter(2000,600)
  const c3 = useCounter(49,  800)

  const saveSvcs    = v => { setSvcs(v);    persist('tnc_svcs',  v) }
  const saveProds   = v => { setProds(v);   persist('tnc_prods', v) }
  const saveBooks   = v => { setBooks(v);   persist('tnc_books', v) }
  const savePRes    = v => { setPRes(v);    persist('tnc_pres',  v) }
  const saveBlocked = v => { setBlocked(v); persist('tnc_blk',   v) }
  const saveOff     = v => { setOffDays(v); persist('tnc_off',   v) }

  const slots = selSvc && selDate ? getSlots(selDate, selSvc.duration, books, blocked, offDays) : []

  const submitBook = () => {
    if (!bForm.name.trim() || !bForm.phone.trim() || !bForm.email.trim()) { setBErr('Aizpildi visus obligātos laukus (*)'); return }
    saveBooks([...books, { id: Date.now(), service: selSvc.name, duration: selSvc.duration, price: selSvc.price, date: selDate, time: selTime, ...bForm, createdAt: new Date().toISOString() }])
    setBStep('done')
  }

  const submitProd = () => {
    if (!pForm.name.trim() || !pForm.phone.trim()) { setPErr('Ievadi vārdu un telefonu'); return }
    savePRes([...pRes, { id: Date.now(), product: selProd.name, price: selProd.price, ...pForm, createdAt: new Date().toISOString() }])
    setPStep('done')
  }

  const toggleBlock = (date, slot) => {
    const cur  = blocked[date] || []
    const next = cur.includes(slot) ? cur.filter(s => s !== slot) : [...cur, slot]
    saveBlocked({ ...blocked, [date]: next })
  }
  const toggleOff = d => saveOff(offDays.includes(d) ? offDays.filter(x => x !== d) : [...offDays, d])

  const navTo = p => {
    setPage(p)
    if (p === 'booking')  { setBStep('svcs'); setSelSvc(null); setSelDate(''); setSelTime(null); setBErr('') }
    if (p === 'products') { setPStep('list'); setSelProd(null); setPErr('') }
  }

  const stepIndex = bStep === 'svcs' ? 0 : bStep === 'dt' ? 1 : 2

  const StepProgress = () => (
    <div className="step-progress">
      {['01','02','03'].map((n, i) => (
        <div className="step-item" key={i}>
          <div className={`step-dot ${i < stepIndex ? 'done' : i === stepIndex ? 'active' : ''}`}>
            {i < stepIndex ? '✓' : n}
          </div>
          {i < 2 && <div className={`step-line ${i < stepIndex ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  )

  /* ════ BOOKING ════ */
  const renderBooking = () => {
    if (bStep === 'done') return (
      <div className="success-wrap">
        <div className="success-card">
          <span className="success-icon">✅</span>
          <div className="success-title">Rezervācija<br />Apstiprināta</div>
          <div className="success-sub" style={{ marginTop: 14 }}>
            Paldies, <span className="success-detail">{bForm.name}</span>!<br />
            <span className="success-detail" style={{ color: '#C8922A' }}>{selSvc?.name}</span><br />
            {selDate} · {selTime}<br />
            <span style={{ fontSize: 12 }}>Jūras iela 3, Liepāja</span>
          </div>
          <button className="gbtn" style={{ marginTop: 28 }} onClick={() => { setBStep('svcs'); setBForm({ name:'',phone:'',email:'',comment:'' }); setSelSvc(null) }}>
            Jauna rezervācija
          </button>
        </div>
      </div>
    )

    if (bStep === 'form') return (
      <div style={{ padding: '0 16px 20px', animation: 'fadeUp .35s ease' }}>
        <StepProgress />
        <button className="back-btn" onClick={() => setBStep('dt')}>← Atpakaļ</button>
        <div className="section-hdr"><div className="section-title">Informācija</div><div className="section-line" /></div>
        <div className="sumbox">
          <div className="sum-row"><span className="sum-label">Pakalpojums</span><span className="sum-val">{selSvc?.name}</span></div>
          <div className="sum-row"><span className="sum-label">Bārbers</span><span style={{ color:'#C8922A', fontSize:13 }}>Deniss Ponomarjovs</span></div>
          <div className="sum-row"><span className="sum-label">Datums & Laiks</span><span className="sum-val">{selDate} · {selTime}</span></div>
          <hr className="sum-divider" />
          <div className="sum-total"><span className="sum-label" style={{ fontSize:12 }}>Kopā</span><span className="sum-price">{selSvc?.price} €</span></div>
        </div>
        {[
          { f:'name',  label:'Vārds *',   type:'text',  ph:'Tavs vārds' },
          { f:'phone', label:'Telefons *', type:'tel',   ph:'+371 20 000 000' },
          { f:'email', label:'E-pasts *',  type:'email', ph:'tavs@epasts.lv' },
        ].map(({ f, label, type, ph }) => (
          <div className="form-field" key={f}>
            <label className="form-label">{label}</label>
            <input className="form-input" type={type} placeholder={ph} value={bForm[f]}
              onChange={e => { setBForm({ ...bForm, [f]: e.target.value }); setBErr('') }} />
          </div>
        ))}
        <div className="form-field">
          <label className="form-label">Komentārs</label>
          <textarea className="form-input" rows={3} placeholder="Papildus vēlmes..."
            value={bForm.comment} onChange={e => setBForm({ ...bForm, comment: e.target.value })}
            style={{ resize: 'none' }} />
        </div>
        {bErr && <div className="err-msg">{bErr}</div>}
        <button className="gbtn" onClick={submitBook}>Apstiprināt rezervāciju →</button>
      </div>
    )

    if (bStep === 'dt') return (
      <div style={{ padding: '0 16px 20px', animation: 'fadeUp .35s ease' }}>
        <StepProgress />
        <button className="back-btn" onClick={() => { setBStep('svcs'); setSelDate(''); setSelTime(null) }}>← Atpakaļ</button>
        <div className="book-selected">
          <div>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:5 }}>{selSvc?.name}</div>
            <div style={{ fontSize:11, color:'#606060', letterSpacing:1, textTransform:'uppercase' }}>⏱ {selSvc?.duration} min · Deniss</div>
          </div>
          <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:28, fontWeight:800, color:'#C8922A' }}>{selSvc?.price} €</div>
        </div>
        <div className="date-wrap">
          <label className="date-label">Datums</label>
          <input type="date" className="date-input" min={todayStr()} value={selDate}
            onChange={e => { setSelDate(e.target.value); setSelTime(null) }} />
        </div>
        {selDate && offDays.includes(selDate) && <div className="warn-box">⚠️ Šajā datumā bārbers nav pieejams</div>}
        {selDate && !offDays.includes(selDate) && <>
          <div className="slots-hdr">
            <span className="slots-label">Brīvie laiki</span>
            {slots.length > 0 && <span className="slots-count">{slots.length} pieejami</span>}
          </div>
          {slots.length === 0
            ? <div className="empty">Šajā datumā nav brīvu laiku</div>
            : <div className="slots-grid">
                {slots.map(s => <button key={s} className={`slot${selTime===s?' sel':''}`} onClick={() => setSelTime(s)}>{s}</button>)}
              </div>
          }
        </>}
        <button className="gbtn" disabled={!selTime} onClick={() => setBStep('form')} style={{ marginTop:8 }}>Turpināt →</button>
      </div>
    )

    return (
      <>
        <div className="hero fade-up">
          <div className="hero-bg" />
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Jūras iela 3, Liepāja</span>
            <div className="hero-eyebrow-line" />
          </div>
          <div className="hero-title">The <em className="hl">Next</em> Cut</div>
          <div className="hero-divider">
            <div className="hero-divider-line" />
            <span>💈</span>
            <div className="hero-divider-line" />
          </div>
          <div className="hero-sub">Deniss Ponomarjovs · Certified Barber</div>
          <button className="hero-cta" onClick={() => document.getElementById('svcs-section')?.scrollIntoView({ behavior:'smooth' })}>
            Pierakstīties ↓
          </button>
        </div>

        <div className="stats">
          {[
            { num: `${c1}+`,                   label: 'Gadi pieredzē' },
            { num: `${c2}+`,                   label: 'Klienti' },
            { num: `${(c3/10).toFixed(1)}★`,   label: 'Reitings' },
          ].map((s, i) => (
            <div className="stat-item" key={i} style={{ animation: `fadeUp .5s ease ${0.3+i*.1}s both` }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div id="svcs-section" className="section">
          <div className="section-hdr"><div className="section-title">Pakalpojumi</div><div className="section-line" /></div>
          {svcs.filter(s => s.active).map((svc, i) => (
            <button key={svc.id} className="svc-card"
              style={{ animation: `fadeUp .4s ease ${i*.07}s both` }}
              onClick={() => { setSelSvc(svc); setBStep('dt') }}>
              <div className="svc-num">{String(i+1).padStart(2,'0')}</div>
              <div className="svc-info">
                <div className="svc-name">{svc.name}</div>
                <div className="svc-pill">⏱ {svc.duration} min</div>
              </div>
              <div className="svc-right">
                <div className="svc-price">{svc.price} €</div>
                <div className="svc-arrow">→</div>
              </div>
            </button>
          ))}
          {svcs.filter(s => s.active).length === 0 && <div className="empty">Nav aktīvu pakalpojumu</div>}
          <div className="location-strip" style={{ animation:'fadeUp .5s ease .4s both' }}>
            <div className="location-strip-icon">📍</div>
            <div>
              <div className="location-name">Jūras iela 3, Liepāja</div>
              <div className="location-sub">P–Sv · 10:00–19:00 · @thenextcutt</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ════ PRODUCTS ════ */
  const renderProducts = () => {
    if (pStep === 'done') return (
      <div className="success-wrap">
        <div className="success-card">
          <span className="success-icon">🎉</span>
          <div className="success-title">Rezervēts!</div>
          <div className="success-sub" style={{ marginTop:14 }}>
            <span className="success-detail">{selProd?.name}</span><br />
            Sagatavosim tev salonā.<br />
            <span style={{ fontSize:12 }}>Jūras iela 3, Liepāja</span>
          </div>
          <button className="gbtn" style={{ marginTop:28 }} onClick={() => { setPStep('list'); setPForm({ name:'',phone:'',comment:'' }); setSelProd(null) }}>Atpakaļ</button>
        </div>
      </div>
    )

    if (pStep === 'form') return (
      <div style={{ padding:'20px 16px', animation:'fadeUp .35s ease' }}>
        <button className="back-btn" onClick={() => setPStep('list')}>← Atpakaļ</button>
        <div className="section-hdr"><div className="section-title">Rezervēt produktu</div><div className="section-line" /></div>
        <div className="book-selected" style={{ marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:36 }}>{selProd?.icon}</span>
            <div>
              <div style={{ fontSize:15, fontWeight:500, marginBottom:4 }}>{selProd?.name}</div>
              <div style={{ fontSize:12, color:'#606060' }}>{selProd?.desc}</div>
            </div>
          </div>
          <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:24, fontWeight:800, color:'#C8922A' }}>{selProd?.price} €</div>
        </div>
        <div className="info-box">💡 Produkts tiks sagatavots un rezervēts tev salonā. Samaksa klātienē.</div>
        {[{ f:'name', label:'Vārds *', type:'text', ph:'Tavs vārds' }, { f:'phone', label:'Telefons *', type:'tel', ph:'+371 20 000 000' }].map(({ f, label, type, ph }) => (
          <div className="form-field" key={f}>
            <label className="form-label">{label}</label>
            <input className="form-input" type={type} placeholder={ph} value={pForm[f]}
              onChange={e => { setPForm({ ...pForm, [f]: e.target.value }); setPErr('') }} />
          </div>
        ))}
        <div className="form-field">
          <label className="form-label">Komentārs</label>
          <textarea className="form-input" rows={3} placeholder="Jautājumi vai piezīmes..." value={pForm.comment} onChange={e => setPForm({ ...pForm, comment: e.target.value })} style={{ resize:'none' }} />
        </div>
        {pErr && <div className="err-msg">{pErr}</div>}
        <button className="gbtn" onClick={submitProd}>Rezervēt salonā →</button>
      </div>
    )

    return (
      <>
        <div className="hero" style={{ paddingBottom:20 }}>
          <div className="hero-bg" />
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Barbershop produkti</span>
            <div className="hero-eyebrow-line" />
          </div>
          <div className="hero-title" style={{ fontSize:60 }}>Shop</div>
          <div className="hero-sub">Premium grooming · Rezervē salonā</div>
        </div>
        <div className="section">
          <div className="section-hdr"><div className="section-title">Produkti</div><div className="section-line" /></div>
          <div className="prod-grid">
            {prods.map((p, i) => (
              <div key={p.id} className={`prod-card${p.available?'':' na'}`} data-icon={p.icon}
                style={{ animation:`fadeUp .4s ease ${i*.06}s both` }}>
                <span className="prod-icon">{p.icon}</span>
                <div className="prod-name">{p.name}</div>
                <div className="prod-desc">{p.desc}</div>
                <div className="prod-price">{p.price} €</div>
                {p.available
                  ? <button className="prod-btn" onClick={() => { setSelProd(p); setPStep('form') }}>Izvēlēties</button>
                  : <div style={{ fontSize:10, color:'#1E1E1E', textAlign:'center', letterSpacing:1, textTransform:'uppercase' }}>Nav pieejams</div>
                }
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  /* ════ ADMIN ════ */
  const checkPw = () => {
    if (adminPw === 'admin123') { setAdminOk(true); setAdminPw('') }
    else setAdminPwErr('Nepareiza parole')
  }

  const AdminInput = ({ label, ...props }) => (
    <div style={{ marginBottom:8 }}>
      {label && <div style={{ fontSize:9, color:'#3A3A3A', marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>}
      <input className="ainput" {...props} />
    </div>
  )

  const renderAdmin = () => {
    if (!adminOk) return (
      <div className="login-wrap">
        <span className="login-icon">✂️</span>
        <div className="login-title">Admin<br />Panelis</div>
        <div className="login-sub">The Next Cut</div>
        <input className="form-input" type="password" placeholder="Parole" value={adminPw}
          onChange={e => { setAdminPw(e.target.value); setAdminPwErr('') }}
          onKeyDown={e => e.key === 'Enter' && checkPw()}
          style={{ marginBottom:10, textAlign:'center' }} />
        {adminPwErr && <div className="err-msg">{adminPwErr}</div>}
        <button className="gbtn" onClick={checkPw}>Pieteikties</button>
        <div style={{ marginTop:14, fontSize:10, color:'#1A1A1A', letterSpacing:2 }}>PAROLE: admin123</div>
      </div>
    )

    return (
      <div>
        <div className="admin-tabs">
          {[{ id:'books', l:'Rezervācijas' }, { id:'svcs', l:'Pakalpojumi' }, { id:'prods', l:'Produkti' }, { id:'sched', l:'Grafiks' }].map(t => (
            <button key={t.id} className={`admin-tab ${aTab===t.id?'on':'off'}`} onClick={() => setATab(t.id)}>{t.l}</button>
          ))}
        </div>
        <div style={{ padding:16 }}>

          {aTab === 'books' && (
            <div>
              <span className="albl">Pakalpojumu rezervācijas ({books.length})</span>
              {books.length === 0 ? <div className="empty">Nav rezervāciju</div>
                : [...books].reverse().map(b => (
                  <div className="acard" key={b.id}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ fontSize:14, fontWeight:500 }}>{b.service}</div>
                      <span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:18, color:'#C8922A', fontWeight:800 }}>{b.price} €</span>
                    </div>
                    <div style={{ fontSize:12, color:'#606060', lineHeight:2 }}>
                      <div>📅 {b.date} · {b.time} ({b.duration} min)</div>
                      <div>👤 {b.name} · 📞 {b.phone} · ✉️ {b.email}</div>
                      {b.comment && <div>💬 {b.comment}</div>}
                    </div>
                    <button className="sbtn sbtn-d" style={{ marginTop:8, fontSize:9 }} onClick={() => saveBooks(books.filter(x => x.id !== b.id))}>Dzēst</button>
                  </div>
                ))
              }
              <hr className="hdiv" />
              <span className="albl">Produktu rezervācijas ({pRes.length})</span>
              {pRes.length === 0 ? <div className="empty">Nav produktu rezervāciju</div>
                : [...pRes].reverse().map(r => (
                  <div className="acard" key={r.id}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ fontSize:14, fontWeight:500 }}>{r.product}</div>
                      <span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:18, color:'#C8922A', fontWeight:800 }}>{r.price} €</span>
                    </div>
                    <div style={{ fontSize:12, color:'#606060', lineHeight:2 }}>
                      <div>👤 {r.name} · 📞 {r.phone}</div>
                      {r.comment && <div>💬 {r.comment}</div>}
                    </div>
                    <button className="sbtn sbtn-d" style={{ marginTop:6, fontSize:9 }} onClick={() => savePRes(pRes.filter(x => x.id !== r.id))}>Dzēst</button>
                  </div>
                ))
              }
            </div>
          )}

          {aTab === 'svcs' && (
            <div>
              {!showAddSvc
                ? <button onClick={() => setShowAddSvc(true)} style={{ width:'100%', background:'rgba(200,146,42,.05)', border:'1px dashed rgba(200,146,42,.25)', borderRadius:4, padding:12, color:'#C8922A', fontSize:12, cursor:'pointer', marginBottom:14, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>+ Pievienot pakalpojumu</button>
                : <div className="nform">
                  <div style={{ fontSize:9, color:'#3A3A3A', marginBottom:10, textTransform:'uppercase', letterSpacing:2 }}>Jauns pakalpojums</div>
                  <AdminInput placeholder="Nosaukums" value={newSvc.name} onChange={e => setNewSvc({ ...newSvc, name:e.target.value })} />
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <AdminInput label="Ilgums (min)" type="number" value={newSvc.duration} onChange={e => setNewSvc({ ...newSvc, duration:+e.target.value })} style={{ flex:1 }} />
                    <AdminInput label="Cena (€)" type="number" value={newSvc.price} onChange={e => setNewSvc({ ...newSvc, price:+e.target.value })} style={{ flex:1 }} />
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="gbtn" style={{ flex:1 }} onClick={() => { if (!newSvc.name.trim()) return; saveSvcs([...svcs, { ...newSvc, id:Date.now(), active:true }]); setNewSvc({ name:'', duration:30, price:0 }); setShowAddSvc(false) }}>Pievienot</button>
                    <button onClick={() => setShowAddSvc(false)} style={{ flex:1, background:'none', border:'1px solid var(--border)', borderRadius:3, color:'#3A3A3A', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Atcelt</button>
                  </div>
                </div>
              }
              {svcs.map(svc => (
                <div className="acard" key={svc.id}>
                  {editSvcId === svc.id
                    ? <div>
                      <AdminInput placeholder="Nosaukums" value={editSvcD.name} onChange={e => setEditSvcD({ ...editSvcD, name:e.target.value })} />
                      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                        <AdminInput label="Min" type="number" value={editSvcD.duration} onChange={e => setEditSvcD({ ...editSvcD, duration:+e.target.value })} style={{ flex:1 }} />
                        <AdminInput label="Cena €" type="number" value={editSvcD.price} onChange={e => setEditSvcD({ ...editSvcD, price:+e.target.value })} style={{ flex:1 }} />
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="gbtn" style={{ flex:1, padding:'10px' }} onClick={() => { saveSvcs(svcs.map(s => s.id===svc.id ? { ...s,...editSvcD } : s)); setEditSvcId(null) }}>Saglabāt</button>
                        <button onClick={() => setEditSvcId(null)} style={{ flex:1, background:'none', border:'1px solid var(--border)', borderRadius:3, color:'#3A3A3A', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Atcelt</button>
                      </div>
                    </div>
                    : <div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                        <div><div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{svc.name}</div><div style={{ fontSize:11, color:'#484848' }}>{svc.duration} min · {svc.price} €</div></div>
                        <span className={`badge ${svc.active?'badge-on':'badge-off'}`}>{svc.active?'Aktīvs':'Neaktīvs'}</span>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="sbtn sbtn-g" onClick={() => { setEditSvcId(svc.id); setEditSvcD({ name:svc.name, duration:svc.duration, price:svc.price }) }}>Rediģēt</button>
                        <button className={`sbtn ${svc.active?'sbtn-r':'sbtn-s'}`} onClick={() => saveSvcs(svcs.map(s => s.id===svc.id ? { ...s, active:!s.active } : s))}>{svc.active?'Deaktivēt':'Aktivēt'}</button>
                        <button className="sbtn sbtn-d" onClick={() => saveSvcs(svcs.filter(s => s.id!==svc.id))}>Dzēst</button>
                      </div>
                    </div>
                  }
                </div>
              ))}
            </div>
          )}

          {aTab === 'prods' && (
            <div>
              {!showAddProd
                ? <button onClick={() => setShowAddProd(true)} style={{ width:'100%', background:'rgba(200,146,42,.05)', border:'1px dashed rgba(200,146,42,.25)', borderRadius:4, padding:12, color:'#C8922A', fontSize:12, cursor:'pointer', marginBottom:14, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>+ Pievienot produktu</button>
                : <div className="nform">
                  <div style={{ fontSize:9, color:'#3A3A3A', marginBottom:10, textTransform:'uppercase', letterSpacing:2 }}>Jauns produkts</div>
                  <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <input className="ainput" placeholder="Emoji" value={newProd.icon} onChange={e => setNewProd({ ...newProd, icon:e.target.value })} style={{ width:60 }} />
                    <input className="ainput" placeholder="Nosaukums" value={newProd.name} onChange={e => setNewProd({ ...newProd, name:e.target.value })} />
                  </div>
                  <AdminInput placeholder="Apraksts" value={newProd.desc} onChange={e => setNewProd({ ...newProd, desc:e.target.value })} />
                  <AdminInput label="Cena (€)" type="number" value={newProd.price} onChange={e => setNewProd({ ...newProd, price:+e.target.value })} />
                  <div style={{ display:'flex', gap:8, marginTop:10 }}>
                    <button className="gbtn" style={{ flex:1 }} onClick={() => { if (!newProd.name.trim()) return; saveProds([...prods, { ...newProd, id:Date.now(), available:true }]); setNewProd({ name:'', price:0, desc:'', icon:'✂️' }); setShowAddProd(false) }}>Pievienot</button>
                    <button onClick={() => setShowAddProd(false)} style={{ flex:1, background:'none', border:'1px solid var(--border)', borderRadius:3, color:'#3A3A3A', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Atcelt</button>
                  </div>
                </div>
              }
              {prods.map(p => (
                <div className="acard" key={p.id}>
                  {editProdId === p.id
                    ? <div>
                      <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                        <input className="ainput" value={editProdD.icon} onChange={e => setEditProdD({ ...editProdD, icon:e.target.value })} style={{ width:60 }} />
                        <input className="ainput" placeholder="Nosaukums" value={editProdD.name} onChange={e => setEditProdD({ ...editProdD, name:e.target.value })} />
                      </div>
                      <AdminInput placeholder="Apraksts" value={editProdD.desc} onChange={e => setEditProdD({ ...editProdD, desc:e.target.value })} />
                      <AdminInput label="Cena (€)" type="number" value={editProdD.price} onChange={e => setEditProdD({ ...editProdD, price:+e.target.value })} />
                      <div style={{ display:'flex', gap:8, marginTop:10 }}>
                        <button className="gbtn" style={{ flex:1, padding:'10px' }} onClick={() => { saveProds(prods.map(x => x.id===p.id ? { ...x,...editProdD } : x)); setEditProdId(null) }}>Saglabāt</button>
                        <button onClick={() => setEditProdId(null)} style={{ flex:1, background:'none', border:'1px solid var(--border)', borderRadius:3, color:'#3A3A3A', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Atcelt</button>
                      </div>
                    </div>
                    : <div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                          <span style={{ fontSize:28 }}>{p.icon}</span>
                          <div>
                            <div style={{ fontSize:14, fontWeight:500 }}>{p.name}</div>
                            <div style={{ fontSize:11, color:'#484848', marginTop:2 }}>{p.desc}</div>
                            <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:15, color:'#C8922A', marginTop:3, fontWeight:800 }}>{p.price} €</div>
                          </div>
                        </div>
                        <span className={`badge ${p.available?'badge-on':'badge-off'}`} style={{ alignSelf:'flex-start', whiteSpace:'nowrap' }}>{p.available?'Pieejams':'Nav'}</span>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="sbtn sbtn-g" onClick={() => { setEditProdId(p.id); setEditProdD({ name:p.name, price:p.price, desc:p.desc, icon:p.icon }) }}>Rediģēt</button>
                        <button className={`sbtn ${p.available?'sbtn-r':'sbtn-s'}`} onClick={() => saveProds(prods.map(x => x.id===p.id ? { ...x, available:!x.available } : x))}>{p.available?'Paslēpt':'Rādīt'}</button>
                        <button className="sbtn sbtn-d" onClick={() => saveProds(prods.filter(x => x.id!==p.id))}>Dzēst</button>
                      </div>
                    </div>
                  }
                </div>
              ))}
            </div>
          )}

          {aTab === 'sched' && (
            <div>
              <span className="albl">Brīvdienas / Atvaļinājums</span>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                <input type="date" className="ainput" value={offInput} min={todayStr()} onChange={e => setOffInput(e.target.value)} style={{ flex:1 }} />
                <button className="gbtn" style={{ width:'auto', padding:'8px 14px', fontSize:11 }} onClick={() => { if (offInput) toggleOff(offInput) }}>
                  {offDays.includes(offInput) ? '✓ Bloķēts' : 'Bloķēt'}
                </button>
              </div>
              {offDays.length > 0 && [...offDays].sort().map(d => (
                <div key={d} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--s1)', border:'1px solid rgba(184,50,32,.2)', borderRadius:4, padding:'8px 12px', marginBottom:5 }}>
                  <span style={{ fontSize:13, color:'#9A4030' }}>📅 {d}</span>
                  <button onClick={() => toggleOff(d)} style={{ fontSize:10, color:'#3A3A3A', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", textTransform:'uppercase', letterSpacing:1 }}>Atcelt</button>
                </div>
              ))}
              <hr className="hdiv" />
              <span className="albl">Bloķēt konkrētus laikus</span>
              <input type="date" className="ainput" value={blkDate} min={todayStr()} onChange={e => setBlkDate(e.target.value)} style={{ marginBottom:12 }} />
              {blkDate && (
                offDays.includes(blkDate)
                  ? <div className="warn-box">⚠️ Šī diena ir pilnībā bloķēta</div>
                  : <div>
                    <div style={{ fontSize:9, color:'#2A2A2A', marginBottom:10, textTransform:'uppercase', letterSpacing:2 }}>Klikšķini lai bloķētu / atbloķētu:</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
                      {ALL_SLOTS.map(slot => {
                        const isBlk = (blocked[blkDate] || []).includes(slot)
                        return <button key={slot} className={`slot-adm${isBlk?' blk':''}`} onClick={() => toggleBlock(blkDate, slot)}>{slot}</button>
                      })}
                    </div>
                    <div style={{ marginTop:10, fontSize:9, color:'#222', textTransform:'uppercase', letterSpacing:1 }}>Bloķēti: {(blocked[blkDate]||[]).length} / {ALL_SLOTS.length}</div>
                  </div>
              )}
            </div>
          )}

        </div>
      </div>
    )
  }

  /* ════ RENDER ════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="app">
        <div className="hdr">
          <div>
            <div className="hdr-logo">The <em>Next</em> Cut</div>
            <div className="hdr-tag">Liepāja · Barbershop</div>
          </div>
          {page === 'booking' && bStep === 'svcs' && <div className="hdr-barber">✂ Deniss</div>}
        </div>

        {page === 'booking'  && renderBooking()}
        {page === 'products' && renderProducts()}
        {page === 'admin'    && renderAdmin()}

        <nav className="bnav">
          {[
            { id:'booking',  icon:'✂️', label:'Pieraksts' },
            { id:'products', icon:'🧴', label:'Produkti' },
            { id:'admin',    icon:'🔐', label:'Admin' },
          ].map(n => (
            <button key={n.id} className={`nav-item ${page===n.id?'on':'off'}`} onClick={() => navTo(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
