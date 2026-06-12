# DNB Medicine PYQ — Deployment Guide

## Files in this folder
- `index.html` — The full app (743 questions embedded)
- `manifest.json` — PWA manifest (app name, icons, theme)
- `sw.js` — Service worker (offline support)
- `icon-192.png` — App icon (home screen)
- `icon-512.png` — App icon (splash screen)
- `vercel.json` — Vercel routing config

## Deploy to Vercel (Free, 5 minutes)

1. Go to https://vercel.com and sign up (free)
2. Click "Add New Project"
3. Choose "Upload" (drag and drop this folder)
4. Click Deploy
5. Your app is live at: https://your-project-name.vercel.app

## Share with students
- Send them the Vercel URL
- They open it in Chrome/Safari
- Tap "Add to Home Screen" when prompted
- App icon appears on their phone — works like a native app
- Works offline after first load

## Update the app
1. Make changes to index.html
2. Go to Vercel dashboard
3. Re-upload the updated folder
4. All users get the update instantly — no action needed from them

## Custom domain (optional)
- Buy a domain (e.g. dnbpyq.in) from GoDaddy/Namecheap (~₹800/year)
- Add it in Vercel settings
- Students access via dnbpyq.in instead of vercel.app URL
