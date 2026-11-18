
import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Filter,
  RotateCcw,
} from "lucide-react";

import {
  getSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../services/siswaServices";

import type { DeleteType } from "../services/siswaServices";
import type { Siswa, Pagination } from "../types/siswa";

import SiswaModal from "../components/SiswaModal";
import EditSiswaModal from "../components/EditSiswaModal";
import DeleteSiswaModal from "../components/DeleteSiswaModal";

const SiswaPage = () => {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 0,
  });

  // Search dan filter
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [daftarJurusan, setDaftarJurusan] = useState<string[]>([]);

  // Modal tambah
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Modal edit
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Modal hapus
  const [selectedDeleteSiswa, setSelectedDeleteSiswa] =
    useState<Siswa | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notifikasi
  const [successMessage, setSuccessMessage] = useState("");

  // Debounce pencarian agar API tidak dipanggil setiap ketikan
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Mengambil data siswa
  const loadSiswa = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSiswa({
        limit,
        offset,
        search: debouncedSearch,
        jurusan,
      });

      setSiswa(result.data);
      setPagination(result.pagination);

      setDaftarJurusan(result.filters?.jurusan || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data";

      setError(message);
      setSiswa([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSiswa();
  }, [limit, offset, debouncedSearch, jurusan]);

  // Notifikasi otomatis hilang
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // Tambah siswa
  const handleCreateSiswa = async (data: Partial<Siswa>) => {
    try {
      await createSiswa(data);

      setIsCreateOpen(false);
      setOffset(0);
      setSuccessMessage("Data siswa berhasil ditambahkan!");

      if (offset === 0) {
        await loadSiswa();
      }
    } catch (err) {
      throw err;
    }
  };

  // Edit siswa
  const handleUpdateSiswa = async (data: Partial<Siswa>) => {
    if (!selectedSiswa) return;

    try {
      await updateSiswa(selectedSiswa.id, data);

      setIsEditOpen(false);
      setSelectedSiswa(null);
      setSuccessMessage("Data siswa berhasil diperbarui!");

      await loadSiswa();
    } catch (err) {
      throw err;
    }
  };

  // Hapus siswa
  const handleDeleteSiswa = async (type: DeleteType) => {
    if (!selectedDeleteSiswa) return;

    try {
      await deleteSiswa(selectedDeleteSiswa.id, type);

      setIsDeleteOpen(false);
      setSelectedDeleteSiswa(null);

      setSuccessMessage(
        type === "soft"
          ? "Data siswa berhasil dihapus!"
          : "Data siswa berhasil dihapus permanen!"
      );

      if (siswa.length === 1 && offset > 0) {
        setOffset((previous) => Math.max(0, previous - limit));
      } else {
        await loadSiswa();
      }
    } catch (err) {
      throw err;
    }
  };

  // Reset pencarian dan filter
  const handleResetFilter = () => {
    setSearch("");
    setDebouncedSearch("");
    setJurusan("");
    setOffset(0);
  };

  // Format tanggal
  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const hasActiveFilter = search !== "" || jurusan !== "";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Data Siswa
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola seluruh data siswa melalui halaman ini.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Tambah Siswa
        </button>
      </div>

      {/* Notifikasi sukses */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">
              {successMessage}
            </span>
          </div>

          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Tutup notifikasi"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Total siswa */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:w-64">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Users size={22} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Siswa Aktif
            </p>

            <h2 className="text-2xl font-bold text-gray-800">
              {pagination.total}
            </h2>
          </div>
        </div>
      </div>

      {/* Search dan filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />

          <h2 className="font-semibold text-gray-800">
            Pencarian dan Filter
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Search */}
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan kode atau nama siswa..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Hapus pencarian"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* Filter jurusan */}
          <select
            value={jurusan}
            onChange={(e) => {
              setJurusan(e.target.value);
              setOffset(0);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Semua Jurusan</option>

            {daftarJurusan.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Reset filter */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {hasActiveFilter
              ? "Menampilkan hasil berdasarkan pencarian dan filter."
              : "Menampilkan seluruh data siswa aktif."}
          </p>

          {hasActiveFilter && (
            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <RotateCcw size={15} />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Tabel siswa */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            Daftar Siswa
          </h2>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value={5}>5 data</option>
            <option value={10}>10 data</option>
            <option value={20}>20 data</option>
            <option value={50}>50 data</option>
          </select>
        </div>

        {error && (
          <div className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">No</th>
                <th className="px-5 py-4">Kode</th>
                <th className="px-5 py-4">Nama Siswa</th>
                <th className="px-5 py-4">Tanggal Lahir</th>
                <th className="px-5 py-4">Jurusan</th>
                <th className="px-5 py-4">Alamat</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="animate-spin" size={20} />
                      Memuat data siswa...
                    </div>
                  </td>
                </tr>
              ) : siswa.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                siswa.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {offset + index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {item.kode}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.nama}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatTanggal(item.tanggal_lahir)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {item.jurusan}
                      </span>
                    </td>

                    <td className="max-w-xs truncate px-5 py-4 text-gray-600">
                      {item.alamat}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => {
                            setSelectedSiswa(item);
                            setIsEditOpen(true);
                          }}
                          title="Edit siswa"
                          className="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDeleteSiswa(item);
                            setIsDeleteOpen(true);
                          }}
                          title="Hapus siswa"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            Menampilkan{" "}
            {pagination.total === 0 ? 0 : offset + 1}
            {" - "}
            {Math.min(offset + siswa.length, pagination.total)}
            {" dari "}
            {pagination.total} data
          </p>

          <div className="flex items-center justify-end gap-2">

            <button
              disabled={offset === 0 || loading}
              onClick={() =>
                setOffset((previous) =>
                  Math.max(0, previous - limit)
                )
              }
              className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="px-3 text-sm text-gray-600">
              Halaman {pagination.currentPage} dari{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>

            <button
              disabled={
                offset + limit >= pagination.total || loading
              }
              onClick={() => setOffset((previous) => previous + limit)}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman selanjutnya"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        </div>
      </div>

      {/* Modal tambah */}
      <SiswaModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSiswa}
      />

      {/* Modal edit */}
      <EditSiswaModal
        isOpen={isEditOpen}
        siswa={selectedSiswa}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedSiswa(null);
        }}
        onSubmit={handleUpdateSiswa}
      />

      {/* Modal hapus */}
      <DeleteSiswaModal
        isOpen={isDeleteOpen}
        siswa={selectedDeleteSiswa}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedDeleteSiswa(null);
        }}
        onConfirm={handleDeleteSiswa}
      />

    </div>
  );
};

export default SiswaPage;
