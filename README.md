# ✂️ The Next Cut — Barbershop App

Booking un produktu rezervācijas aplikācija **The Next Cut** barbershopam Liepājā.

**Bārbers:** Deniss Ponomarjovs  
**Adrese:** Jūras iela 3, Liepāja  
**Instagram:** [@thenextcutt](https://instagram.com/thenextcutt)

---

## 🚀 Uzstādīšana

```bash
# 1. Klonē repozitoriju
git clone https://github.com/YOUR_USERNAME/thenextcut.git
cd thenextcut

# 2. Instalē atkarības
npm install

# 3. Palaid lokāli
npm run dev
```

Atver [http://localhost:5173](http://localhost:5173)

---

## 📦 Build (produkcija)

```bash
npm run build
```

Fails tiek ģenerēts mapē `dist/` — to var augšupielādēt jebkurā hostingā.

---

## 🌐 Deploy uz GitHub Pages

```bash
# 1. Instalē gh-pages
npm install --save-dev gh-pages

# 2. Pievieno package.json scripts:
#    "deploy": "gh-pages -d dist"

# 3. Build + deploy
npm run build
npm run deploy
```

Vai izmanto **Vercel** / **Netlify** — vienkārši savieno GitHub repo.

---

## 📱 Funkcijas

### Klientam
- **Pieraksts** — izvēlies pakalpojumu → datumu → brīvo laiku → aizpildi formu
- **Produkti** — apskatīt un rezervēt produktus saņemšanai salonā
- Animēti soļu indikatori, pulsējoši brīvie laiki
- Pilnīgi mobilā versija ar iOS safe area atbalstu

### Adminam (parole: `admin123`)
- Rezervāciju pārskatīšana un dzēšana
- Pakalpojumu pievienošana, rediģēšana, aktivēšana/deaktivēšana
- Produktu pārvaldīšana ar pieejamības kontroli
- Grafika iestatīšana: brīvdienas + konkrētu laiku bloķēšana

---

## 🛠️ Tehnoloģijas

- **React 18** + **Vite**
- **CSS Variables** + **Google Fonts** (Big Shoulders Display, Barlow Condensed, DM Sans)
- **localStorage** — dati saglabājas lokāli pārlūkā

---

## 📁 Struktūra

```
thenextcut/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← Visa aplikācija
│   ├── index.css      ← Globālie stili + iOS fix
│   └── main.jsx       ← Ieeja
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Admin paroles maiņa

`src/App.jsx` failā atrodi rindu:

```js
if (adminPw === 'admin123') {
```

Un nomainī `'admin123'` uz savu paroli.

---

*The Next Cut © 2025 · Liepāja*
