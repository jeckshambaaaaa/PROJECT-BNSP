import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import siswaRoutes from './routes/siswaRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan frontend React mengakses API kita
app.use(express.json()); // Agar bisa membaca body format JSON dari Postman/React

// Route sederhana untuk test server
app.get('/', async (req, res) => {
    try {
        const dbTime = await pool.query('SELECT NOW()');
        res.status(200).json({
            message: 'Server Backend Siap!',
            databaseTime: dbTime.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ error: 'Koneksi database bermasalah' });
    }
});

// ... app.use(cors()) dan app.use(express.json())

// Daftarkan rute API siswa
app.use('/api/siswa', siswaRoutes); // <-- Tambahkan baris ini

// ... route GET '/' untuk test server
// ... app.listen(port)

// Menyalakan server
app.listen(port, () => {
    console.log(`[Server]: Berjalan di http://localhost:${port}`);
});