# 🎬 Shakzz Play - The Ultimate Entertainment System

Welcome to **Shakzz Play**! A hybrid, all-in-one streaming application built to seamlessly integrate Hollywood movies, global TV series, precise Anime tracking, and Live TV into a single, beautiful, native-feeling mobile and web experience.

**"DIVE INTO THE SYSTEM."**

---

## ✨ Key Features

* **🍿 Massive VOD Library:** Stream trending Movies, top K-Dramas, C-Dramas, and Filipino Series, powered by TMDB.
* **🎌 Native Anime Integration:** Bypasses standard western API limits. Fetches accurate episode counts, synopses, and recommendations directly from **MyAnimeList (Jikan API)**.
* **📡 Live TV Hub:** Watch local and international Live TV seamlessly. Channel lists are dynamically fetched securely via a Cloudflare Worker proxy.
* **⚡ Multi-Source Playback:** Never get stuck buffering. Built-in server selection lets you swap between backup streaming APIs instantly.
* **🛡️ Offline Protection Mode:** If your internet drops, a custom "Blast Door" UI safely locks the content view while keeping the navigation bars accessible, functioning just like a premium native app.
* **💾 Cloud Sync:** Powered by Firebase to securely save your "Continue Watching" history, progress bars, and "Watchlist" across devices.
* **📱 Mobile-Ready:** Built with React and structured for native mobile deployment using Ionic Capacitor.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, HTML5, CSS3 (Custom UI/UX)
* **Backend / Cloud:** Firebase (Authentication, Firestore Database)
* **APIs:** * TMDB API (Movies & TV Shows)
  * Autoembed / Vidsrc (Streaming Sources)
* **Proxy / Security:** Cloudflare Workers (For Live TV M3U8/Manifest fetching)
* **Mobile Wrap:** Capacitor (Screen Orientation, Status Bar, App locking)

---

## 🚀 How to Run Locally

If you want to clone this repository and run it on your own machine, follow these steps:

**1. Clone the repository:**
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/Shakzz-Play.git](https://github.com/YOUR_GITHUB_USERNAME/Shakzz-Play.git)
cd Shakzz-Play
