# 📚 Premium BookStore Management System

A high-performance, production-ready MERN stack application for digital library management. Features a stunning **Emerald Green Theme**, role-based access control, and a fully responsive interface.

## ✨ Features

- **🔐 Secure Authentication**: Integrated with JWT and Google OAuth, including Google reCAPTCHA v2 protection.
- **🛡️ Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for **Administrators**, **Managers**, and **Users**.
- **🎨 Premium UI/UX**:
  - Emerald Green Design System (Modern & Professional).
  - High-contrast **Dark Mode** optimized for OLED displays.
  - Fully responsive architecture (Mobile to Widescreen).
- **📖 Inventory Management**: Full CRUD operations for books, search by title/author, and advanced filtering (Genre, Price, Rating).
- **👥 User Management**: System administrators can manage user roles, status (Activate/Suspend), and monitor participation.
- **⚡ Performance Optimized**: Fast data retrieval with debounced searching, pagination, and efficient state management.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Context API, Lucide/Fi Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas/Local) with Mongoose.
- **Security**: JWT, Google reCAPTCHA, Bcrypt.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/anuragthakur03906-dot/BOOK-STORE.git
cd BOOK-STORE
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
```
Start Backend:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```
Start Frontend:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
BOOK-STORE/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # Auth & Security
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Theme state
│   │   ├── pages/            # View components
│   │   └── services/         # API integration
```

---

## 🎨 Theme Customization
The project uses a centralized design system in `index.css` via CSS variables. You can easily modify the colors by updating the `--primary-main` RGB values.

```css
:root {
  --primary-main: 34 197 94; /* Emerald Green */
}
```

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---
**Developed with ❤️ by Anurag Thakur**
