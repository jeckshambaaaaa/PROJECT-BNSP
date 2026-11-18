import API_URL from "./api";
import type { Siswa, SiswaResponse } from "../types/siswa";

export type DeleteType = "soft" | "hard";

interface GetSiswaParams {
  limit?: number;
  offset?: number;
  search?: string;
  jurusan?: string;
}

export const getSiswa = async ({
  limit = 10,
  offset = 0,
  search = "",
  jurusan = "",
}: GetSiswaParams = {}): Promise<SiswaResponse> => {
  const params = new URLSearchParams();

  params.append("limit", String(limit));
  params.append("offset", String(offset));

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (jurusan.trim()) {
    params.append("jurusan", jurusan.trim());
  }

  const response = await fetch(
    `${API_URL}/siswa?${params.toString()}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil data siswa"
    );
  }

  return result;
};

export const createSiswa = async (data: Partial<Siswa>) => {
  const response = await fetch(`${API_URL}/siswa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menambahkan data siswa"
    );
  }

  return result;
};

export const updateSiswa = async (
  id: number,
  data: Partial<Siswa>
) => {
  const response = await fetch(`${API_URL}/siswa/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memperbarui data siswa"
    );
  }

  return result;
};

export const deleteSiswa = async (
  id: number,
  type: DeleteType
) => {
  const response = await fetch(
    `${API_URL}/siswa/${id}?type=${type}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.error || "Gagal menghapus data siswa"
    );
  }

  return result;
};
