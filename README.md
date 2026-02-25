# 🎬 Shakzz Play - The Ultimate Entertainment System

Welcome to **Shakzz Play**! A hybrid, all-in-one streaming application built to seamlessly integrate Hollywood movies, global TV series, precise Anime tracking, and Live TV into a single, beautiful, native-feeling mobile and web experience.

**"DIVE INTO THE SYSTEM."**

---

## ✨ Key Features

* **🍿 Massive VOD Library:** Stream trending Movies, top K-Dramas, C-Dramas, and Filipino Series, powered by TMDB.
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
`bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Shakzz-Play.git
cd Shakzz-Play
`

**2. Install the necessary dependencies:**
`bash
npm install
`

**3. Set up your environment variables:**
Duplicate the `.env.example` file, rename it to `.env`, and add your Firebase and TMDB keys.

**4. Start the development server:**
`bash
npm run dev
`

---

## 🏗️ Architecture Highlight: The Reverse Proxy
To ensure maximum uptime and security, Shakzz Play does not hardcode raw IPTV stream URLs or sensitive API keys directly into the client-side code. 

Instead, all stream requests are routed through a custom **Cloudflare Worker Reverse Proxy**. 
* **Zero-Update Fixes:** If a public stream goes down, the routing is updated on the proxy server. The app instantly pulls the new working stream without requiring users to download a new `.apk`.
* **Security:** The frontend only communicates with the proxy endpoints, keeping the underlying server infrastructure completely hidden.

---

## 🤝 Contributing
Shakzz Play is completely open-source, and community contributions are highly encouraged! If you have an idea to make this app even better, here is how you can help:

1. **Fork** the Project
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please make sure your code follows the existing style and that you don't commit any `.env` files or hardcoded credentials.

---

## ☕ Support the Project
Building and maintaining a hybrid streaming app takes a massive amount of time, and running the proxy servers isn't free. If you enjoy using Shakzz Play and want to support the continued development, any contributions are incredibly appreciated! 

## 📄 License
Distributed under the **GPL-3.0 License**. Because this is a copyleft license, any modifications or derivative works based on Shakzz Play must also be made open-source under the exact same license. See the `LICENSE` file for more information.

---
*Built with 💻 and ☕ by Shakzz*