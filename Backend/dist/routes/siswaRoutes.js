"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siswaController_1 = require("../controllers/siswaController");
const router = (0, express_1.Router)();
// Rute CRUD Siswa
router.get('/', siswaController_1.getSiswa);
router.post('/', siswaController_1.createSiswa);
router.put('/:id', siswaController_1.updateSiswa);
router.delete('/:id', siswaController_1.deleteSiswa);
exports.default = router;
