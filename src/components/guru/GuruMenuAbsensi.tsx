import React, { useState } from 'react';
import {
  AbsensiRecord,
  AbsensiStatus,
  AppDatabase,
  UserAccount,
  WaliKelasAssignment
} from '../../types';
import {
  CheckSquare,
  Save,
  Check,
  Calendar,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';

interface GuruMenuAbsensiProps {
  currentUser: UserAccount;
  db: AppDatabase;
  onSaveAbsensiBatch: (records: AbsensiRecord[]) => void;
}

export const GuruMenuAbsensi: React.FC<GuruMenuAbsensiProps> = ({
  currentUser,
  db,
  onSaveAbsensiBatch,
}) => {
  const { waliKelas, siswa, absensi } = db;

  // Find wali kelas assignment for current user
  const assignedWali = waliKelas.find(
    (wk) =>
      wk.namaGuru.toLowerCase().trim() ===
      currentUser.fullName.toLowerCase().trim()
  );

  // If user is admin, allow them to pick any class; if guru, lock to their assigned class
  const defaultKelas = assignedWali ? assignedWali.kodeKelas : '7';
  const defaultRombel = assignedWali ? assignedWali.rombel : 'A';

  const [selectedKelas, setSelectedKelas] = useState<'7' | '8' | '9'>(defaultKelas);
  const [selectedRombel, setSelectedRombel] = useState<'A' | 'B' | 'C' | 'D'>(defaultRombel);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

  const [statusMessage, setStatusMessage] = useState('');

  // Class students
  const classStudents = siswa
    .filter((s) => s.kelas === selectedKelas && s.rombel === selectedRombel)
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  // Local attendance state mapped by student ID
  const [localAttendance, setLocalAttendance] = useState<{
    [siswaId: string]: { status: AbsensiStatus; keterangan: string; saved: boolean };
  }>({});

  // Initialize or load existing records for that date & class
  React.useEffect(() => {
    const map: { [id: string]: { status: AbsensiStatus; keterangan: string; saved: boolean } } = {};
    classStudents.forEach((st) => {
      const existing = absensi.find(
        (a) =>
          a.siswaId === st.id &&
          a.tanggal === tanggal &&
          a.kelas === selectedKelas &&
          a.rombel === selectedRombel
      );
      if (existing) {
        map[st.id] = {
          status: existing.status,
          keterangan: existing.keterangan || '',
          saved: true,
        };
      } else {
        map[st.id] = {
          status: 'H', // Default to Hadir
          keterangan: '',
          saved: false,
        };
      }
    });
    setLocalAttendance(map);
  }, [classStudents, selectedKelas, selectedRombel, tanggal, absensi]);

  const handleStatusChange = (siswaId: string, status: AbsensiStatus) => {
    setLocalAttendance((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        status,
        saved: false,
      },
    }));
  };

  const handleKeteranganChange = (siswaId: string, ket: string) => {
    setLocalAttendance((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        keterangan: ket,
        saved: false,
      },
    }));
  };

  // Save single student attendance
  const handleSaveStudent = (siswaId: string, namaSiswa: string) => {
    const record = localAttendance[siswaId];
    if (!record) return;

    const newRecord: AbsensiRecord = {
      id: `ABS-${siswaId}-${tanggal}`,
      tanggal,
      kelas: selectedKelas,
      rombel: selectedRombel,
      siswaId,
      namaSiswa,
      status: record.status,
      keterangan: record.keterangan,
      waliKelas: currentUser.fullName,
    };

    onSaveAbsensiBatch([newRecord]);
    setLocalAttendance((prev) => ({
      ...prev,
      [siswaId]: { ...prev[siswaId], saved: true },
    }));

    setStatusMessage(`Absensi siswa ${namaSiswa} berhasil disimpan!`);
    setTimeout(() => setStatusMessage(''), 2500);
  };

  // Save all students attendance for the day
  const handleSaveAll = () => {
    const recordsToSave: AbsensiRecord[] = classStudents.map((st) => {
      const record = localAttendance[st.id] || { status: 'H', keterangan: '' };
      return {
        id: `ABS-${st.id}-${tanggal}`,
        tanggal,
        kelas: selectedKelas,
        rombel: selectedRombel,
        siswaId: st.id,
        namaSiswa: st.nama,
        status: record.status,
        keterangan: record.keterangan,
        waliKelas: currentUser.fullName,
      };
    });

    onSaveAbsensiBatch(recordsToSave);

    setLocalAttendance((prev) => {
      const updated: any = {};
      Object.keys(prev).forEach((k) => {
        updated[k] = { ...prev[k], saved: true };
      });
      return updated;
    });

    setStatusMessage('Seluruh absensi kelas berhasil disimpan ke database!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Hak Akses Khusus Wali Kelas</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Menu Absensi Siswa Harian
          </h1>
          <p className="text-xs text-slate-500">
            Catat dan simpan status kehadiran harian siswa: Hadir (H), Sakit (S), Ijin (I), dan Alpha (A) sesuai kelas yang Anda ampu.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Absensi Seluruh Siswa</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Date & Class Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Tanggal */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kelas & Rombel Indicator */}
          <div className="px-3.5 py-2 bg-blue-50 text-blue-800 rounded-xl font-bold text-xs border border-blue-200">
            Wali Kelas: {selectedKelas}{selectedRombel}
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> H: Hadir
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> S: Sakit
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> I: Ijin
          </span>
          <span className="flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> A: Alpha
          </span>
        </div>
      </div>

      {/* Table Absensi */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 w-60 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan Khusus</th>
                <th className="py-3 px-4 w-28 text-center">Simpan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">Tidak ada data siswa untuk kelas {selectedKelas}{selectedRombel}.</p>
                  </td>
                </tr>
              ) : (
                classStudents.map((st, idx) => {
                  const item = localAttendance[st.id] || { status: 'H', keterangan: '', saved: false };
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center tabular-nums text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {st.nama}
                      </td>

                      {/* Status Buttons: Hadir, Sakit, Ijin, Alpha */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                          {(['H', 'S', 'I', 'A'] as AbsensiStatus[]).map((status) => {
                            const isSelected = item.status === status;
                            let activeClass = 'bg-white text-slate-900 shadow-xs font-bold';
                            if (status === 'H' && isSelected) activeClass = 'bg-emerald-600 text-white font-bold shadow-xs';
                            if (status === 'S' && isSelected) activeClass = 'bg-amber-500 text-white font-bold shadow-xs';
                            if (status === 'I' && isSelected) activeClass = 'bg-blue-600 text-white font-bold shadow-xs';
                            if (status === 'A' && isSelected) activeClass = 'bg-rose-600 text-white font-bold shadow-xs';

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(st.id, status)}
                                className={`flex-1 py-1 px-2 rounded-md text-xs transition-colors ${
                                  isSelected
                                    ? activeClass
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Keterangan */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Catatan surat dokter / alasan ijin..."
                          value={item.keterangan}
                          onChange={(e) => handleKeteranganChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Save per student button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSaveStudent(st.id, st.nama)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                            item.saved
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          {item.saved ? 'Tersimpan' : 'Simpan'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
