import { Request, Response } from 'express';
import pool from '../config/db';

const validateSiswa = (data: any, isUpdate = false) => {
    const errors: string[] = [];

    const requiredFields = isUpdate
        ? ['nama', 'jurusan', 'alamat']
        : ['kode', 'nama', 'tanggal_lahir', 'jurusan', 'alamat'];

    for (const field of requiredFields) {
        if (
            typeof data[field] !== 'string' ||
            data[field].trim() === ''
        ) {
            errors.push(`${field} wajib diisi`);
        }
    }

    if (!isUpdate && typeof data.tanggal_lahir === 'string') {
        const date = data.tanggal_lahir.trim();
        const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if (!validFormat || isNaN(Date.parse(date))) {
            errors.push('Format tanggal_lahir harus YYYY-MM-DD dan valid');
        } else {
            const parsed = new Date(`${date}T00:00:00Z`);
            if (parsed.toISOString().slice(0, 10) !== date) {
                errors.push('Tanggal lahir tidak valid');
            }
        }
    }

    return errors;
};

// 1. READ: Ambil Semua Data Siswa (Dengan Pagination)


export const getSiswa = async (req: Request, res: Response) => {
    try {
        // Parameter pagination
        const limitRaw = req.query.limit ?? "10";
        const offsetRaw = req.query.offset ?? "0";

        const limit = Number(limitRaw);
        const offset = Number(offsetRaw);

        // Parameter pencarian dan filter
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const jurusan =
            typeof req.query.jurusan === "string"
                ? req.query.jurusan.trim()
                : "";

        // Validasi limit
        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Limit harus berupa angka 1 sampai 100"
            });
        }

        // Validasi offset
        if (
            !Number.isInteger(offset) ||
            offset < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Offset harus berupa angka 0 atau lebih"
            });
        }

        // Parameter pencarian
        const searchValue = search
            ? `%${search}%`
            : null;

        const jurusanValue = jurusan || null;

        // Query data siswa
        const query = `
            SELECT *
            FROM siswa
            WHERE deleted_at IS NULL
            AND (
                $1::text IS NULL
                OR kode ILIKE $1
                OR nama ILIKE $1
            )
            AND (
                $2::text IS NULL
                OR jurusan = $2
            )
            ORDER BY id DESC
            LIMIT $3 OFFSET $4
        `;

        // Query total data sesuai pencarian dan filter
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM siswa
            WHERE deleted_at IS NULL
            AND (
                $1::text IS NULL
                OR kode ILIKE $1
                OR nama ILIKE $1
            )
            AND (
                $2::text IS NULL
                OR jurusan = $2
            )
        `;

        // Query daftar jurusan untuk filter
        const jurusanQuery = `
            SELECT DISTINCT jurusan
            FROM siswa
            WHERE deleted_at IS NULL
            ORDER BY jurusan ASC
        `;

        const values = [
            searchValue,
            jurusanValue
        ];

        const { rows } = await pool.query(
            query,
            [...values, limit, offset]
        );

        const totalResult = await pool.query(
            countQuery,
            values
        );

        const jurusanResult = await pool.query(
            jurusanQuery
        );

        const total = Number(
            totalResult.rows[0].total
        );

        return res.status(200).json({
            success: true,
            message: "Data siswa berhasil ditemukan",

            data: rows,

            pagination: {
                total,
                limit,
                offset,
                currentPage: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit)
            },

            filters: {
                jurusan: jurusanResult.rows.map(
                    (item) => item.jurusan
                )
            }
        });

    } catch (error) {
        console.error("Get siswa error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data siswa"
        });
    }
};

// 2. CREATE: Tambah Siswa Baru
export const createSiswa = async (req: Request, res: Response) => {
    try {
        const {
            kode,
            nama,
            tanggal_lahir,
            jurusan,
            alamat,
            created_by
        } = req.body;

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
            created_by?.trim() || 'system'
        ];

        const { rows } = await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: 'Data siswa berhasil ditambahkan',
            data: rows[0]
        });

    } catch (error: any) {
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
};


// 3. UPDATE: Ubah Data Siswa


export const updateSiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      kode,
      nama,
      tanggal_lahir,
      jurusan,
      alamat,
    } = req.body;

    // Validasi data
    if (
      !kode ||
      !nama ||
      !tanggal_lahir ||
      !jurusan ||
      !alamat
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua data siswa wajib diisi",
      });
    }

    // Validasi tanggal
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal_lahir)) {
      return res.status(400).json({
        success: false,
        message: "Format tanggal lahir harus YYYY-MM-DD",
      });
    }

    // Pastikan tanggal benar-benar valid
    const date = new Date(`${tanggal_lahir}T00:00:00Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== tanggal_lahir
    ) {
      return res.status(400).json({
        success: false,
        message: "Tanggal lahir tidak valid",
      });
    }

    const updatedBy = "Admin";

    const result = await pool.query(
      `
      UPDATE siswa
      SET
        kode = $1,
        nama = $2,
        tanggal_lahir = $3,
        jurusan = $4,
        alamat = $5,
        updated_by = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
        AND deleted_at IS NULL
      RETURNING *
      `,
      [
        kode,
        nama,
        tanggal_lahir,
        jurusan,
        alamat,
        updatedBy,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data siswa tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data siswa berhasil diperbarui",
      data: result.rows[0],
    });

  } catch (error: any) {
    console.error("Update siswa error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Kode siswa sudah digunakan",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui data siswa",
    });
  }
};

// 4. DELETE: Hapus Data Siswa (Soft Delete & Hard Delete)

export const deleteSiswa = async (req: Request, res: Response) => {
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

            const { rows } = await pool.query(query, [id]);

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

        const { rows } = await pool.query(query, [deletedBy, id]);

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

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data siswa'
        });
    }
};