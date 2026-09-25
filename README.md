# &lt;bca/&gt; Students Portfolio & Admin Panel 🚀

A modern, highly interactive, and fully responsive Developer Portfolio designed specifically for **code with repswal**. It features a sleek dark mode UI with neon accents, interactive canvas backgrounds, and a powerful **Firebase-powered Admin Panel** to manage your content dynamically.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

---

## ✨ Key Features

### 🌐 Main Website (`index.html`)
- **Particle Canvas Background:** Interactive particle nodes that react to mouse movements.
- **Dynamic Typing Effect:** An animated hero section displaying rotating roles (Web Developer, App Developer, code with repswal, etc.).
- **Smooth Animations:** Scroll reveal effects, staggered loading, and interactive hover states.
- **Integrated Contact Form:** Sends emails via **EmailJS** and simultaneously saves the message directly into the Firestore database for the admin panel.
- **SEO Optimized:** Fully configured with Open Graph tags, Twitter Cards, Canonical URLs, and JSON-LD schema markup for better search engine ranking.

### 🛡️ Secure Admin Panel (`login.html` & `admin.html`)
- **Firebase Authentication:** Secure login system so only authorized admins can access the dashboard.
- **Live Messages Inbox:** Read new inquiries arriving from the main website's contact form in real-time.
- **Projects Management (CRUD):** Add, edit, and delete portfolio projects dynamically via Firestore. Includes support for custom project cover images and live demo links!
- **Skills Management (CRUD):** Update your technical skills and proficiency percentages seamlessly.
- **Profile Settings:** Update your Bio, Email, and Social Media links (Instagram, Telegram, WhatsApp, GitHub).
- **Toast Notifications:** Modern, sleek animated popups for success and error messages.
- **Privacy:** Admin and Login pages are protected with `noindex` tags so they won't appear on Google search results.

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (No heavy frameworks!)
- **Backend/Database:** Firebase v8 (Authentication & Firestore)
- **Email Service:** EmailJS
- **Typography:** Google Fonts (Outfit, Inter)

---

## 🚀 Setup & Installation

### 1. Clone the Project
Simply clone or download this repository to your local machine.

### 2. Configure Firebase
To make the Admin Panel work, you need your own Firebase project:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a web app and copy your Firebase configuration object.
3. Open `js/firebase-init.js` and paste your credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Enable Authentication & Database
1. In Firebase Console, go to **Authentication** > **Sign-in method** and enable **Email/Password**.
2. Go to the **Users** tab and create your Admin credentials (e.g., `admin@bcastudents.com` & `Password123`).
3. Go to **Firestore Database** and create a new database. Start it in **Test Mode** (or configure secure rules).
4. Create empty collections named: `projects`, `skills`, `settings`, and `site_notifications` (optional, as they will be created automatically when data is added).

### 4. Run the Project
Because this project uses standard HTML/CSS/JS, you can run it directly:
- Open `index.html` in your browser.
- Open `login.html`, enter the credentials you created in Firebase, and enjoy the Admin Dashboard!

*(Note: For the best experience, run it through a local server like Python's http.server or VS Code's "Live Server" extension).*

---

## 📞 Community & Contact
Join the growing community of code with repswal!
- **Instagram:** [@codewithrepswal](https://www.instagram.com/codewithrepswal)
- **WhatsApp:** [Join Group](https://chat.whatsapp.com/Ckrwtak2RmW0kSS14rAnaI?mode=gi_t)
- **Telegram:** [Join Channel](https://t.me/computer_science_students_A)

---
*Built with ❤️ for the code with repswal Community in India 🇮🇳*
