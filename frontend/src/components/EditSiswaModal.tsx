
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Siswa } from "../types/siswa";

interface EditSiswaModalProps {
  isOpen: boolean;
  siswa: Siswa | null;
  onClose: () => void;
  onSubmit: (data: {
    kode: string;
    nama: string;
    tanggal_lahir: string;
    jurusan: string;
    alamat: string;
  }) => Promise<void>;
}

function EditSiswaModal({
  isOpen,
  siswa,
  onClose,
  onSubmit,
}: EditSiswaModalProps) {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    tanggal_lahir: "",
    jurusan: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (siswa) {
      setForm({
        kode: siswa.kode,
        nama: siswa.nama,
        tanggal_lahir: siswa.tanggal_lahir
          ? siswa.tanggal_lahir.slice(0, 10)
          : "",
        jurusan: siswa.jurusan,
        alamat: siswa.alamat,
      });

      setError("");
    }
  }, [siswa]);

  if (!isOpen || !siswa) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui data siswa"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Edit Data Siswa
            </h2>
            <p className="text-sm text-gray-500">
              Ubah informasi data siswa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Kode */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Kode Siswa
            </label>

            <input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Masukkan kode siswa"
            />
          </div>

          {/* Nama */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Siswa
            </label>

            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Masukkan nama siswa"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tanggal Lahir
            </label>

            <input
              type="date"
              name="tanggal_lahir"
              value={form.tanggal_lahir}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Jurusan */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Jurusan
            </label>

            <input
              type="text"
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Masukkan jurusan"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Alamat
            </label>

            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Masukkan alamat siswa"
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditSiswaModal;