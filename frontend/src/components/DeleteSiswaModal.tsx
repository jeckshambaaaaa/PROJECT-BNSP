
import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import type { Siswa } from "../types/siswa";
import type { DeleteType } from "../services/siswaServices";

interface DeleteSiswaModalProps {
  isOpen: boolean;
  siswa: Siswa | null;
  onClose: () => void;
  onConfirm: (type: DeleteType) => Promise<void>;
}

function DeleteSiswaModal({
  isOpen,
  siswa,
  onClose,
  onConfirm,
}: DeleteSiswaModalProps) {
  const [deleteType, setDeleteType] = useState<DeleteType>("soft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !siswa) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await onConfirm(deleteType);
      setDeleteType("soft");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data siswa"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Hapus Data Siswa
              </h2>
              <p className="text-sm text-gray-500">
                Pilih metode penghapusan.
              </p>
            </div>
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

        <div className="space-y-4 p-5">

          {/* Identitas siswa */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Siswa yang dipilih</p>
            <p className="mt-1 font-semibold text-gray-800">
              {siswa.nama}
            </p>
            <p className="text-sm text-gray-500">
              {siswa.kode}
            </p>
          </div>

          {/* Pilihan Soft Delete */}
          <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-blue-50">
            <input
              type="radio"
              name="deleteType"
              value="soft"
              checked={deleteType === "soft"}
              onChange={() => setDeleteType("soft")}
              disabled={loading}
              className="mt-1"
            />

            <div>
              <p className="font-semibold text-gray-800">
                Soft Delete
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Data disembunyikan dari daftar aktif, tetapi tetap
                tersimpan di database.
              </p>
            </div>
          </label>

          {/* Pilihan Hard Delete */}
          <label className="flex cursor-pointer gap-3 rounded-lg border border-red-200 p-4 hover:bg-red-50">
            <input
              type="radio"
              name="deleteType"
              value="hard"
              checked={deleteType === "hard"}
              onChange={() => setDeleteType("hard")}
              disabled={loading}
              className="mt-1"
            />

            <div>
              <p className="font-semibold text-red-600">
                Hard Delete
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Data dihapus permanen dari database dan tidak dapat
                dipulihkan melalui aplikasi.
              </p>
            </div>
          </label>

          {deleteType === "hard" && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Peringatan: penghapusan permanen tidak dapat dibatalkan.
              Pastikan kamu benar-benar ingin melanjutkan.
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={17} />
              {loading ? "Menghapus..." : "Hapus Data"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DeleteSiswaModal;