import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Cek koneksi saat server mulai
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error saat koneksi ke database', err.stack);
    } else {
        console.log('Berhasil terhubung ke database project_ujikom');
    }
    if (release) release();
});

export default pool;