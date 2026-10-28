import React from 'react';
import { AppDatabase, UserAccount, Siswa } from '../../types';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CheckCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserAccount;
  loginTime: string;
  db: AppDatabase;
  onNavigate: (menu: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  loginTime,
  db,
  onNavigate,
}) => {
  const { siswa, guru, kelasList, guruMapel, waliKelas, profile } = db;

  // Compute breakdown statistics
  const totalSiswa = siswa.length;
  const totalGuru = guru.length;
  const totalKelas = kelasList.length;

  const siswaKelas7 = siswa.filter((s) => s.kelas === '7').length;
  const siswaKelas8 = siswa.filter((s) => s.kelas === '8').length;
  const siswaKelas9 = siswa.filter((s) => s.kelas === '9').length;

  const countLaki = siswa.filter((s) => s.jenisKelamin === 'L').length;
  const countPerempuan = siswa.filter((s) => s.jenisKelamin === 'P').length;

  // Rombel detailed counts
  const rombels = ['A', 'B', 'C', 'D'] as const;
  const kelasStats = [
    {
      kelas: '7',
      total: siswaKelas7,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-900',
      tagColor: 'bg-blue-600 text-white',
      rombels: rombels.map((r) => ({
        rombel: r,
        count: siswa.filter((s) => s.kelas === '7' && s.rombel === r).length,
      })),
    },
    {
      kelas: '8',
      total: siswaKelas8,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-900',
      tagColor: 'bg-emerald-600 text-white',
      rombels: rombels.map((r) => ({
        rombel: r,
        count: siswa.filter((s) => s.kelas === '8' && s.rombel === r).length,
      })),
    },
    {
      kelas: '9',
      total: siswaKelas9,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900',
      tagColor: 'bg-amber-600 text-white',
      rombels: rombels.map((r) => ({
        rombel: r,
        count: siswa.filter((s) => s.kelas === '9' && s.rombel === r).length,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-medium text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sistem Aplikasi Guru Sekolah (SiApgus)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hi, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Selamat datang di portal administrasi {profile.namaSekolah}. Aplikasi ini mengintegrasikan seluruh basis data guru, siswa, alokasi mata pelajaran, absensi harian, hingga cetak rapor otomatis dengan penyimpanan Google Spreadsheet.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shrink-0 text-left md:text-right">
            <span className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider block">
              Waktu Masuk Sistem
            </span>
            <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-white">
              <Calendar className="w-4 h-4 text-blue-200" />
              <span>{loginTime || new Date().toLocaleString('id-ID')}</span>
            </div>
            <span className="text-[11px] text-blue-200/80 block mt-0.5">
              Role: Administrator Sekolah
            </span>
          </div>
        </div>
      </div>

      {/* Main Stat Metric Cards with Soft Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div
          onClick={() => onNavigate('admin-siswa')}
          className="bg-linear-to-br from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-200/70 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">Total Siswa Aktif</span>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalSiswa}
            </div>
            <p className="text-xs text-blue-700/80 mt-1">
              {countLaki} Laki-laki · {countPerempuan} Perempuan
            </p>
          </div>
        </div>

        {/* Card 2: Total Guru */}
        <div
          onClick={() => onNavigate('admin-guru')}
          className="bg-linear-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-200/70 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Total Dewan Guru</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalGuru}
            </div>
            <p className="text-xs text-emerald-700/80 mt-1">
              {guruMapel.length} Penugasan Mengajar Aktif
            </p>
          </div>
        </div>

        {/* Card 3: Total Kelas & Rombel */}
        <div
          onClick={() => onNavigate('admin-siswa')}
          className="bg-linear-to-br from-amber-50 to-yellow-50/50 p-5 rounded-2xl border border-amber-200/70 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Kelas & Rombel</span>
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalKelas}
            </div>
            <p className="text-xs text-amber-700/80 mt-1">
              Tingkat 7, 8, dan 9 (A - D)
            </p>
          </div>
        </div>

        {/* Card 4: Wali Kelas */}
        <div
          onClick={() => onNavigate('admin-wali-kelas')}
          className="bg-linear-to-br from-purple-50 to-pink-50/50 p-5 rounded-2xl border border-purple-200/70 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800">Wali Kelas Terdaftar</span>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {waliKelas.length}
            </div>
            <p className="text-xs text-purple-700/80 mt-1">
              Dari {totalKelas} target rombel
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Kotak Data Siswa per Tingkat & Rombel (Random Soft Colors) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Rincian Sebaran Siswa Per Kelas & Rombel
            </h2>
            <p className="text-xs text-slate-500">
              Terhubung langsung secara real-time dengan menu isian data siswa
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-siswa')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Buka Menu Siswa →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {kelasStats.map((item) => (
            <div
              key={item.kelas}
              className={`rounded-xl border p-5 bg-linear-to-b ${item.color} space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.tagColor}`}>
                  Kelas {item.kelas}
                </span>
                <span className="text-xs font-semibold tabular-nums text-slate-700">
                  Total: {item.total} Siswa
                </span>
              </div>

              {/* Rombel detail boxes */}
              <div className="grid grid-cols-2 gap-2.5">
                {item.rombels.map((rb) => (
                  <div
                    key={rb.rombel}
                    className="bg-white/90 p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-600">
                      Rombel {item.kelas}{rb.rombel}
                    </span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {rb.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistik Visual (Gender & Mapel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Perbandingan Jenis Kelamin Siswa
            </h3>
            <span className="text-xs text-slate-500">Total {totalSiswa} siswa</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-blue-700">Laki-Laki ({countLaki} siswa)</span>
                <span className="tabular-nums font-semibold">
                  {totalSiswa > 0 ? Math.round((countLaki / totalSiswa) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalSiswa > 0 ? (countLaki / totalSiswa) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-rose-700">Perempuan ({countPerempuan} siswa)</span>
                <span className="tabular-nums font-semibold">
                  {totalSiswa > 0 ? Math.round((countPerempuan / totalSiswa) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalSiswa > 0 ? (countPerempuan / totalSiswa) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profil Sekolah Singkat */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Informasi Satuan Pendidikan
            </h3>
            <button
              onClick={() => onNavigate('admin-setting')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Ubah Profil
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-slate-400 block text-[11px]">NPSN</span>
              <span className="font-semibold text-slate-800">{profile.npsn || '-'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-slate-400 block text-[11px]">Akreditasi</span>
              <span className="font-semibold text-emerald-700">Peringkat {profile.akreditasi}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-slate-400 block text-[11px]">Kurikulum</span>
              <span className="font-semibold text-slate-800">{profile.kurikulum}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-slate-400 block text-[11px]">Kepala Sekolah</span>
              <span className="font-semibold text-slate-800 truncate block">
                {profile.kepalaSekolah || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
