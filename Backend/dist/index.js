"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const siswaRoutes_1 = __importDefault(require("./routes/siswaRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)()); // Mengizinkan frontend React mengakses API kita
app.use(express_1.default.json()); // Agar bisa membaca body format JSON dari Postman/React
// Route sederhana untuk test server
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbTime = yield db_1.default.query('SELECT NOW()');
        res.status(200).json({
            message: 'Server Backend Siap!',
            databaseTime: dbTime.rows[0].now
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Koneksi database bermasalah' });
    }
}));
// ... app.use(cors()) dan app.use(express.json())
// Daftarkan rute API siswa
app.use('/api/siswa', siswaRoutes_1.default); // <-- Tambahkan baris ini
// ... route GET '/' untuk test server
// ... app.listen(port)
// Menyalakan server
app.listen(port, () => {
    console.log(`[Server]: Berjalan di http://localhost:${port}`);
});
