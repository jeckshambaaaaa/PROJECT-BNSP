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
exports.deleteSiswa = exports.updateSiswa = exports.createSiswa = exports.getSiswa = void 0;
const db_1 = __importDefault(require("../config/db"));
const validateSiswa = (data, isUpdate = false) => {
    const errors = [];
    const requiredFields = isUpdate
        ? ['nama', 'jurusan', 'alamat']
        : ['kode', 'nama', 'tanggal_lahir', 'jurusan', 'alamat'];
    for (const field of requiredFields) {
        if (typeof data[field] !== 'string' ||
            data[field].trim() === '') {
            errors.push(`${field} wajib diisi`);
        }
    }
    if (!isUpdate && typeof data.tanggal_lahir === 'string') {
        const date = data.tanggal_lahir.trim();
        const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if (!validFormat || isNaN(Date.parse(date))) {
            errors.push('Format tanggal_lahir harus YYYY-MM-DD dan valid');
        }
        else {
            const parsed = new Date(`${date}T00:00:00Z`);
            if (parsed.toISOString().slice(0, 10) !== date) {
                errors.push('Tanggal lahir tidak valid');
            }
        }
    }
    return errors;
};
// 1. READ: Ambil Semua Data Siswa (Dengan Pagination)
const getSiswa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const limitRaw = (_a = req.query.limit) !== null && _a !== void 0 ? _a : '10';
        const offsetRaw = (_b = req.query.offset) !== null && _b !== void 0 ? _b : '0';
        const limit = Number(limitRaw);
        const offset = Number(offsetRaw);
        // Validasi limit
        if (!Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit harus berupa angka 1 sampai 100'
            });
        }
        // Validasi offset
        if (!Number.isInteger(offset) ||
            offset < 0) {
            return res.status(400).json({
                success: false,
                message: 'Offset harus berupa angka 0 atau lebih'
            });
        }
        const query = `
            SELECT *
            FROM siswa
            WHERE deleted_at IS NULL
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `;
        const countQuery = `
            SELECT COUNT(*) 
            FROM siswa
            WHERE deleted_at IS NULL
        `;
        const { rows } = yield db_1.default.query(query, [limit, offset]);
        const totalResult = yield db_1.default.query(countQuery);
        const total = Number(totalResult.rows[0].count);
        return res.status(200).json({
            success: true,
            message: 'Data siswa berhasil ditemukan',
            data: rows,
            pagination: {
                total,
                limit,
                offset,
                currentPage: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data siswa'
        });
    }
});
exports.getSiswa = getSiswa;
// 2. CREATE: Tambah Siswa Baru
const createSiswa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { kode, nama, tanggal_lahir, jurusan, alamat, created_by } = req.body;
        // Validasi input
        const errors = validateSiswa(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors
            });
        }
        const query = `
            INSERT INTO siswa
            (kode, nama, tanggal_lahir, jurusan, alamat, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            kode.trim(),
            nama.trim(),
            tanggal_lahir.trim(),
            jurusan.trim(),
            alamat.trim(),
            (created_by === null || created_by === void 0 ? void 0 : created_by.trim()) || 'system'
        ];
        const { rows } = yield db_1.default.query(query, values);
        return res.status(201).json({
            success: true,
            message: 'Data siswa berhasil ditambahkan',
            data: rows[0]
        });
    }
    catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Kode siswa sudah digunakan'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data siswa'
        });
    }
});
exports.createSiswa = createSiswa;
// 3. UPDATE: Ubah Data Siswa
const updateSiswa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nama, jurusan, alamat, updated_by } = req.body;
        // Validasi input
        const errors = validateSiswa(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors
            });
        }
        const query = `
            UPDATE siswa
            SET
                nama = $1,
                jurusan = $2,
                alamat = $3,
                updated_by = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            AND deleted_at IS NULL
            RETURNING *
        `;
        const values = [
            nama.trim(),
            jurusan.trim(),
            alamat.trim(),
            typeof updated_by === 'string' && updated_by.trim()
                ? updated_by.trim()
                : 'system',
            id
        ];
        const { rows } = yield db_1.default.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan atau sudah dihapus'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Data siswa berhasil diperbarui',
            data: rows[0]
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data siswa'
        });
    }
});
exports.updateSiswa = updateSiswa;
// 4. DELETE: Hapus Data Siswa (Soft Delete & Hard Delete)
const deleteSiswa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const type = req.query.type;
        // Validasi jenis penghapusan
        if (type !== 'soft' && type !== 'hard') {
            return res.status(400).json({
                success: false,
                message: 'Tipe penghapusan harus soft atau hard'
            });
        }
        // Karena aplikasi tidak menggunakan login,
        // identitas admin dibuat tetap.
        const deletedBy = 'Admin';
        // HARD DELETE
        if (type === 'hard') {
            const query = `
                DELETE FROM siswa
                WHERE id = $1
                RETURNING *
            `;
            const { rows } = yield db_1.default.query(query, [id]);
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Data siswa tidak ditemukan'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Data siswa berhasil dihapus permanen',
                deleteType: 'hard',
                data: rows[0]
            });
        }
        // SOFT DELETE
        const query = `
            UPDATE siswa
            SET
                deleted_by = $1,
                deleted_at = CURRENT_TIMESTAMP
            WHERE id = $2
            AND deleted_at IS NULL
            RETURNING *
        `;
        const { rows } = yield db_1.default.query(query, [deletedBy, id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data siswa tidak ditemukan atau sudah dihapus'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Data siswa berhasil dihapus sementara',
            deleteType: 'soft',
            data: rows[0]
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data siswa'
        });
    }
});
exports.deleteSiswa = deleteSiswa;
