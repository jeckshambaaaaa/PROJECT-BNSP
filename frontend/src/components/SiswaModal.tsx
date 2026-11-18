
import { useState } from "react";
import { X } from "lucide-react";

interface SiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    kode: string;
    nama: string;
    tanggal_lahir: string;
    jurusan: string;
    alamat: string;
  }) => Promise<void>;
}

function SiswaModal({ isOpen, onClose, onSubmit }: SiswaModalProps) {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    tanggal_lahir: "",
    jurusan: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

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
      setForm({
        kode: "",
        nama: "",
        tanggal_lahir: "",
        jurusan: "",
        alamat: "",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan siswa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Tambah Siswa</h2>
            <p className="text-sm text-gray-500">
              Masukkan informasi siswa baru.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Kode Siswa</label>
            <input
              name="kode"
              value={form.kode}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Contoh: SIS001"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Siswa</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Masukkan nama siswa"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={form.tanggal_lahir}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Jurusan</label>
            <input
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Contoh: Teknik Informatika"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Alamat</label>
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

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Siswa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SiswaModal;