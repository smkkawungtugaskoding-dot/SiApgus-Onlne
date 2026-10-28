import React, { useState, useMemo } from 'react';
import {
  AbsensiRecord,
  AppDatabase,
  SchoolProfile,
  UserAccount,
  WaliKelasAssignment
} from '../../types';
import {
  Printer,
  Calendar,
  Filter,
  Users,
  Award,
  Eye,
  CheckCircle,
  FileText
} from 'lucide-react';

interface GuruMenuCetakAbsenProps {
  currentUser: UserAccount;
  db: AppDatabase;
}

export const GuruMenuCetakAbsen: React.FC<GuruMenuCetakAbsenProps> = ({
  currentUser,
  db,
}) => {
  const { profile, waliKelas, siswa, absensi } = db;

  // Determine Wali Kelas assignment
  const assignedWali = waliKelas.find(
    (wk) =>
      wk.namaGuru.toLowerCase().trim() ===
      currentUser.fullName.toLowerCase().trim()
  );

  const defaultKelas = assignedWali ? assignedWali.kodeKelas : '7';
  const defaultRombel = assignedWali ? assignedWali.rombel : 'A';

  const [filterKelas, setFilterKelas] = useState<'7' | '8' | '9'>(defaultKelas);
  const [filterRombel, setFilterRombel] = useState<'A' | 'B' | 'C' | 'D'>(defaultRombel);
  const [selectedBulan, setSelectedBulan] = useState('10'); // Oktober
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [selectedMinggu, setSelectedMinggu] = useState('ALL');

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Month labels
  const bulanList = [
    { val: '01', label: 'Januari' },
    { val: '02', label: 'Februari' },
    { val: '03', label: 'Maret' },
    { val: '04', label: 'April' },
    { val: '05', label: 'Mei' },
    { val: '06', label: 'Juni' },
    { val: '07', label: 'Juli' },
    { val: '08', label: 'Agustus' },
    { val: '09', label: 'September' },
    { val: '10', label: 'Oktober' },
    { val: '11', label: 'November' },
    { val: '12', label: 'Desember' },
  ];

  // Students of this class
  const classStudents = useMemo(() => {
    return siswa
      .filter((s) => s.kelas === filterKelas && s.rombel === filterRombel)
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  }, [siswa, filterKelas, filterRombel]);

  // Compute attendance recap for students
  const recapData = useMemo(() => {
    return classStudents.map((st) => {
      // Find records in selected month/year
      const studentRecords = absensi.filter((a) => {
        const matchesStudent = a.siswaId === st.id;
        const matchesClass = a.kelas === filterKelas && a.rombel === filterRombel;
        const [yr, mo] = a.tanggal.split('-');
        const matchesMonth = mo === selectedBulan && yr === selectedTahun;
        return matchesStudent && matchesClass && matchesMonth;
      });

      const hCount = studentRecords.filter((r) => r.status === 'H').length;
      const sCount = studentRecords.filter((r) => r.status === 'S').length;
      const iCount = studentRecords.filter((r) => r.status === 'I').length;
      const aCount = studentRecords.filter((r) => r.status === 'A').length;

      const totalHari = hCount + sCount + iCount + aCount;
      const persentase = totalHari > 0 ? Math.round((hCount / totalHari) * 100) : 100;

      return {
        siswa: st,
        hCount,
        sCount,
        iCount,
        aCount,
        totalHari,
        persentase,
      };
    });
  }, [classStudents, absensi, filterKelas, filterRombel, selectedBulan, selectedTahun]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Hak Akses Wali Kelas</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Menu Cetak Rekap Absensi Siswa
          </h1>
          <p className="text-xs text-slate-500">
            Rekap kehadiran siswa mingguan & bulanan dengan format cetak resmi mengetahui Kepala Sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>{isPreviewMode ? 'Tutup Pratinjau' : 'Pratinjau Cetak'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Absensi (PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Kelas */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tingkat Kelas
          </label>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>
        </div>

        {/* Rombel */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Rombel
          </label>
          <select
            value={filterRombel}
            onChange={(e) => setFilterRombel(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="A">Rombel A</option>
            <option value="B">Rombel B</option>
            <option value="C">Rombel C</option>
            <option value="D">Rombel D</option>
          </select>
        </div>

        {/* Bulan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bulan Rekap
          </label>
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
          >
            {bulanList.map((b) => (
              <option key={b.val} value={b.val}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tahun
          </label>
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6">
        
        {/* Kop Surat Resmi Sekolah */}
        <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-4">
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt={profile.namaSekolah}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900">
                PEMERINTAH DAERAH PROVINSI JAWA TIMUR
              </h2>
              <h1 className="text-lg sm:text-xl font-black uppercase text-slate-900">
                {profile.namaSekolah}
              </h1>
              <p className="text-xs text-slate-600">
                {profile.alamatSekolah} · Telp: {profile.telp || '-'} · NPSN: {profile.npsn || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 underline decoration-slate-400">
            REKAPITULASI PRESENSI KEHADIRAN SISWA
          </h3>
          <p className="text-xs text-slate-600">
            Kelas: {filterKelas}{filterRombel} · Periode: {bulanList.find(b => b.val === selectedBulan)?.label} {selectedTahun}
          </p>
        </div>

        {/* Table Rekap Kehadiran */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px]">
                <th className="border border-slate-300 py-2.5 px-3 w-10 text-center">No</th>
                <th className="border border-slate-300 py-2.5 px-3">Nama Siswa</th>
                <th className="border border-slate-300 py-2.5 px-3 w-16 text-center">JK</th>
                <th className="border border-slate-300 py-2.5 px-3 w-16 text-center">Hadir</th>
                <th className="border border-slate-300 py-2.5 px-3 w-16 text-center">Sakit</th>
                <th className="border border-slate-300 py-2.5 px-3 w-16 text-center">Ijin</th>
                <th className="border border-slate-300 py-2.5 px-3 w-16 text-center">Alpha</th>
                <th className="border border-slate-300 py-2.5 px-3 w-24 text-center">% Hadir</th>
              </tr>
            </thead>
            <tbody>
              {recapData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada siswa pada kelas {filterKelas}{filterRombel}.
                  </td>
                </tr>
              ) : (
                recapData.map((item, idx) => (
                  <tr key={item.siswa.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 font-semibold text-slate-800">
                      {item.siswa.nama}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center">
                      {item.siswa.jenisKelamin}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums font-semibold text-emerald-800">
                      {item.hCount}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums font-semibold text-amber-800">
                      {item.sCount}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums font-semibold text-blue-800">
                      {item.iCount}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums font-semibold text-rose-800">
                      {item.aCount}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 text-center tabular-nums font-bold">
                      {item.persentase}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Requirement: Mengetahui Nama Kepala Sekolah yang terhubung dan tersimpan dari Menu Setting */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-800">
          <div className="text-center space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala {profile.namaSekolah}</p>
            </div>
            <div>
              <p className="font-bold underline">{profile.kepalaSekolah || 'Dr. H. Ahmad Dahlan, M.Pd.'}</p>
              <p className="text-[11px] text-slate-500">NIP/NUPTK: {profile.nuptk || '-'}</p>
            </div>
          </div>

          <div className="text-center space-y-16">
            <div>
              <p>Surabaya, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold">Wali Kelas {filterKelas}{filterRombel}</p>
            </div>
            <div>
              <p className="font-bold underline">{assignedWali ? assignedWali.namaGuru : currentUser.fullName}</p>
              <p className="text-[11px] text-slate-500">NIP/NUPTK: -</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
