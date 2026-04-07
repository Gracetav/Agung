# BENGKEL AGUNG SPAREPART SEJAHTERA

Aplikasi E-Commerce Penjualan Sparepart Motor berbasis Web dengan Arsitektur MVC (Model-View-Controller).

## TEKNOLOGI
- **Backend:** Node.js (Express.js)
- **View Engine:** EJS with express-ejs-layouts
- **Database:** MySQL
- **Frontend:** Tailwind CSS (via CDN)
- **Fonts:** Montserrat (Google Fonts)
- **Uploads:** Multer

## PRASYARAT
- Node.js installed
- MySQL (XAMPP/Laragon/Direct)
- NPM installed

## CARA INSTALL & MENJALANKAN

1.  **Clone / Download Project**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Persiapkan Database**
    - Buka PHPMyAdmin atau MySQL Client Anda.
    - Buat database baru dengan nama `bengkel_agung`.
    - Import file `database.sql` ke dalam database tersebut.
4.  **Konfigurasi Environment**
    - Buka file `.env`.
    - Sesuaikan `DB_USER` dan `DB_PASS` dengan settingan MySQL Anda (biasanya user: root, pass: kosong).
5.  **Seeding Admin (PENTING)**
    - Jalankan script berikut untuk membuat akun admin default:
    ```bash
    node seed-admin.js
    ```
    - Akun Admin Default:
        - **Email:** admin@agung.com
        - **Password:** admin123
6.  **Jalankan Aplikasi**
    ```bash
    npm start
    ```
    Atau jika ingin auto-reload (pastikan nodemon terinstall):
    ```bash
    npx nodemon app.js
    ```
7.  **Akses Aplikasi**
    - Buka browser dan pergi ke: `http://localhost:3000`

## FITUR UTAMA
- **Role Admin:** Kelola produk (CRUD + Gambar), kelola user (Lihat/Hapus), kelola pesanan (Update status & cek bukti transfer).
- **Role User:** Registrasi/Login, belanja sparepart, keranjang belanja, checkout, upload bukti transfer, tracking status pesanan.
- **Order Flow Status:**
  `Pending` -> (User Upload Bayar) -> (Admin Konfirmasi) -> `Paid` -> (Admin Kirim) -> `Shipped` -> (Selesai/Diterima) -> `Completed`.

## STRUKTUR FOLDER
```text
/Agung
├── config/             # DB Connection
├── controllers/        # Business Logic
├── middleware/         # Auth & Admin Access
├── models/             # Schema-less data handler
├── public/             # Static images
├── routes/             # URL Routing
├── uploads/            # Multi-part file storage (products & payments)
├── views/              # EJS Templates
│   ├── admin/          # Admin UI
│   ├── user/           # User UI
│   ├── auth/           # Login/Register UI
│   └── layouts/        # Root layouts
├── app.js              # Entry Point
└── database.sql        # MySQL Schema
```

© 2026 Bengkel Agung Sejahtera. Semua Hak Dilindungi.
