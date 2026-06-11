# Kozos adatok tobb eszkozon

GitHub Pages csak statikus fajlokat futtat, ezert a PC es a mobil csak akkor latja ugyanazokat az adatokat, ha a frontend egy kozos, publikus Node backendhez csatlakozik.

## 1. Backend deploy

Deployold ezt a projektet Node appkent egy szolgaltatora, peldaul Render, Railway, Fly.io vagy sajat VPS.

Indito parancs:

```bash
npm start
```

Szukseges kornyezeti valtozok:

```bash
PORT=3000
FRONTEND_URL=https://felhasznalonev.github.io/repo-nev
CORS_ORIGIN=https://felhasznalonev.github.io
```

A backend URL peldaul ilyen lesz:

```text
https://naptar-backend.onrender.com
```

## 2. Frontend beallitas

GitHub Pages hasznalathoz ird be a backend URL-t a `config.js` fajlba:

```js
window.HEARTH_BACKEND_URL = 'https://naptar-backend.onrender.com'
```

Ezutan commitold es pushold a `config.js` modositast. Minden eszkoz ugyanarra a backend adatbazisra fog menteni.

## 3. UI-bol is allithato

A Beallitasok oldalon a "Kozos backend URL" mezobe is be lehet irni a backend cimet. Ez az adott bongeszore mentodik, ezert csaladi hasznalatra a `config.js` jobb megoldas.

## Fontos

Ha a frontend csak GitHub Pages-en fut es nincs publikus backend URL, akkor az adatok a bongeszo localStorage tarhelyen maradnak. Ilyenkor a PC es a mobil nem tud automatikusan kozos adatokat latni.
