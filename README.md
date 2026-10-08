# Sarath & Harmya — A Little Memory

A minimal, mobile-first anniversary WebAR-style memory app. It uses a static React/Vite frontend, local QR detection, and external video URLs. There is no backend or database.

## 1. Run locally

```bash
npm install
npm run dev
```

Open the Vite URL in a browser. Camera access works reliably on `localhost`; on a phone in production use HTTPS.

## 2. Add your videos

Open `src/data/memories.js` and replace `videoUrl` and optionally `posterUrl` with HTTPS URLs.

Example:

```js
videoUrl: "https://your-video-domain.example/first-meet.mp4"
```

For only one video, leave the other memory unused or remove it from the object.

## 3. QR URLs

After deployment, create QR codes for:

- `https://YOUR-DOMAIN.com/watch?id=first-meet`
- `https://YOUR-DOMAIN.com/watch?id=wedding`

The QR contains only the web URL/id. The MP4 is never stored in the QR.

## 4. Video storage

Recommended: Cloudflare R2 with a public/custom HTTPS domain. For private personal videos, use a storage setup that can serve the selected file to the browser without exposing credentials. Do not put R2 secret keys in this frontend.

## 5. Deploy

```bash
npm run build
```

Deploy the generated `dist` directory to Cloudflare Pages (or another static HTTPS host).

## Important browser behaviour

The normal phone camera scans the QR and opens the website. The webpage then asks for camera permission. After the user taps Start Memory, the page uses the rear camera to look for the same QR code. The native camera app cannot continue scanning after it hands control to the browser.

The current implementation uses QR detection to control playback. It is intentionally not a heavy 3D AR engine. The video is presented as a cinematic camera overlay, giving the desired AR-like memory-card effect while keeping the app small and dependable.
