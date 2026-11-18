import { Router } from 'express';
import { getSiswa, createSiswa, updateSiswa, deleteSiswa } from '../controllers/siswaController';

const router = Router();

// Rute CRUD Siswa
router.get('/', getSiswa);
router.post('/', createSiswa);
router.put('/:id', updateSiswa);
router.delete('/:id', deleteSiswa);

export default router;