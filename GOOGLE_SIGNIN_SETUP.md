# Google Sign-In – make it work

Your app uses **Client ID**: `973772894057-dqlr6ktlisv062nor30c1nqvekhjhrau.apps.googleusercontent.com`  
*(Client secret is for server-side only—never put it in frontend code.)*

## 1. Google Cloud Console (required)

If the button stays on "Loading…" or shows an error, add your site as an authorized origin:

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Click your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`  ← for `npm run dev`
   - Your live site, e.g. `https://www.lumenara.co.in`
4. Click **Save**.

Wait 1–2 minutes, then reload your app and try again.

## 2. Run and test locally

```bash
cd "c:\Users\tejes\Downloads\mern setup\Lumenaratechnologies-main"
npm run dev
```

Open http://localhost:5173 → click **Login** → the "Sign in with Google" button should change from "Loading…" to "Sign in with Google" within a few seconds.

## 3. If it still stays on "Loading…"

- Disable **ad blockers** or **privacy extensions** for `localhost:5173` (they often block `accounts.google.com`).
- In the browser console (F12 → Console), check for red errors and share them if you need more help.
