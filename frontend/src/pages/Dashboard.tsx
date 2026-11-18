
import { useEffect, useState } from "react";

import {
  Users,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { getSiswa } from "../services/siswaServices";

const Dashboard = () => {
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalJurusan, setTotalJurusan] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil statistik dari backend
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSiswa({
        limit: 1,
        offset: 0,
      });

      // Total siswa aktif
      setTotalSiswa(result.pagination.total);

      // Jumlah jurusan unik
      setTotalJurusan(result.filters?.jurusan?.length ?? 0);

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengambil statistik dashboard";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statistics = [
    {
      title: "Total Siswa",
      value: totalSiswa,
      description: "Seluruh siswa aktif",
      icon: Users,
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "Jurusan",
      value: totalJurusan,
      description: "Program keahlian",
      icon: BookOpen,
      iconColor: "bg-purple-100 text-purple-600",
    },
    {
      title: "Administrator",
      value: 1,
      description: "Pengelola aplikasi",
      icon: GraduationCap,
      iconColor: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat Datang, Administrator!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Berikut ringkasan sistem manajemen data siswa.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {statistics.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div
                  className={`rounded-xl p-3 ${item.iconColor}`}
                >
                  <Icon size={23} />
                </div>

                <ArrowUpRight
                  size={20}
                  className="text-gray-300"
                />

              </div>

              <div className="mt-5">
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {loading && index !== 2 ? (
                    <Loader2
                      size={23}
                      className="animate-spin text-gray-400"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-gray-900">
                      {item.value.toLocaleString("id-ID")}
                    </h2>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* Informasi Aplikasi */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-800">
          Informasi Aplikasi
        </h2>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          EduManage merupakan aplikasi manajemen data siswa
          yang digunakan untuk mengelola informasi siswa secara
          terstruktur melalui sistem CRUD.
        </p>

        <div className="mt-5 rounded-xl bg-blue-50 p-4">

          <h3 className="text-sm font-semibold text-blue-700">
            Sistem Terintegrasi
          </h3>

          <p className="mt-1 text-sm text-blue-600">
            Data statistik siswa dan jurusan diambil langsung
            dari database PostgreSQL melalui REST API.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;