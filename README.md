# 📨 MailMind AI — Intelligent Inbox Classifier

This project is a **Next.js App Router**–based web app that connects with **Google OAuth** and **Gmail API** to fetch user emails and classify them using **Google Gemini API model: gemini-2.0-flash**.  

---

## 🚀 Tech Stack
- **Next.js (App Router + API Routes)**
- **Tailwind CSS** for styling
- **NextAuth.js** for Google OAuth authentication
- **Gmail API** for fetching emails
- **Gemini API (Google AI)** for email classification
- **JavaScript (ESNext)**

---

## ✨ Features

### 🔐 Authentication
- Secure Google login with **NextAuth.js**.
- **Dedicated login page** with different UI for logged-in and logged-out states.
- **User profile image** dynamically displayed from session data.

### 📩 Fetch Emails
- Fetches Gmail emails of the authenticated user.
- User can choose how many emails to fetch (10, 15, 20, 25, 30).

### 🧠 Classification
- Classifies emails into **Promotions**, **Social**, **Important**, and **General** categories using **Gemini API**.
- Displays dynamic color-coded tags on each email.

### 💬 Email Detail View
- Clicking an email opens a **detail panel** showing subject, sender, and content.
- Clean, responsive two-pane Gmail-style layout.

### 🔍 Email Search
- Search emails by **sender name** or **subject** for quick filtering.

### 🎛️ Controls
- Manual **Fetch Emails** and **Classify Emails** buttons.
- Prevents unnecessary re-fetching when switching tabs.

### 💎 UX Enhancements
- Shimmer placeholders while loading.
- Error handling & real-time feedback messages.
- Persistent Gemini API key storage.

---

## ⚙️ Folder Structure

```
📁 app/
 ┣ 📂 api/
 ┃ ┣ 📂 auth/
 ┃ ┃ ┗ 📂 [...nextauth]/
 ┃ ┃    ┗ 📜 route.js
 ┃ ┣ 📂 classifyEmails/
 ┃ ┃ ┗ 📜 route.js
 ┃ ┣ 📂 fetchEmails/
 ┃ ┃ ┗ 📜 route.js
 ┣ 📂 emails/
 ┃ ┗ 📜 page.js
 ┣ 📜 layout.js
 ┣ 📜 Providers.js
 ┣ 📜 globals.css
 ┣ 📜 favicon.ico
 ┗ 📜 page.js

📁 components/
 ┣ 📜 AIKeyInput.js
 ┗ 📜 ShimmerCard.js

📜 .env.local
📜 README.md
📜 package.json
📜 next.config.mjs
📜 tailwind.config.js
📜 postcss.config.js
📜 jsconfig.json
📜 node_modules/

```

---

## 🔑 Environment Variables

Create a `.env.local` file in your project root with:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🧩 API Endpoints

### `/api/fetchEmails`
Fetches user emails from Gmail API.

### `/api/classifyEmails`
Classifies fetched emails using Gemini API.

---

## 🧠 How It Works
1. **User logs in** with Google OAuth.
2. **Fetch Emails** → Gmail API retrieves email list.
3. **Emails display** with subject, sender, and snippet.
4. **Classify Emails** → Gemini API predicts categories.
5. **Tags update** on UI (Promotions, Social, etc.).
6. **Click an email** → Opens detailed content panel.

---

## 🖥️ Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---



---

## 🏁 Conclusion
This project showcases:
- **Google OAuth & Gmail API integration**
- **AI-based classification with Gemini model: gemini-2.0-flash**
- **Clean UI built with Tailwind CSS**
- **Full-stack Next.js development**

Built with ❤️ by **Mohammad Faisal** and developed with assistance from **GitHub Copilot**  
