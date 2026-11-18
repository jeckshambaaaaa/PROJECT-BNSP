
export interface Siswa {
  id: number;
  kode: string;
  nama: string;
  tanggal_lahir: string;
  jurusan: string;
  alamat: string;
  created_by: string | null;
  created_at: string;
  deleted_by: string | null;
  deleted_at: string | null;
  updated_by: string | null;
  updated_at: string | null;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
}

export interface SiswaResponse {
  success: boolean;
  message: string;
  data: Siswa[];
  pagination: Pagination;
  filters: {
    jurusan: string[];
  };
}
