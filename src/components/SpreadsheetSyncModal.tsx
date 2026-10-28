import React, { useState } from 'react';
import { AppDatabase } from '../types';
import {
  Database,
  X,
  Copy,
  Download,
  Check,
  ExternalLink,
  Table,
  FileCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  db: AppDatabase;
  onUpdateSheetsUrl: (url: string) => void;
  onSyncNow: () => Promise<void>;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({
  isOpen,
  onClose,
  db,
  onUpdateSheetsUrl,
  onSyncNow,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'code' | 'sync'>('info');
  const [webAppUrl, setWebAppUrl] = useState(db.sheetsWebAppUrl || '');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/Code.gs');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert('Gagal menyalin kode. Anda dapat mengunduh file Code.gs secara langsung.');
    }
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/Code.gs');
    element.setAttribute('download', 'Code.gs');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExecuteSync = async () => {
    if (!webAppUrl.trim()) {
      alert('Silakan masukkan URL Web App Google Apps Script.');
      return;
    }
    onUpdateSheetsUrl(webAppUrl.trim());
    setIsSyncing(true);
    setSyncStatus('Sedang mengirim sinkronisasi seluruh basis data ke Google Spreadsheet...');

    try {
      await onSyncNow();
      setSyncStatus('Sinkronisasi selesai! Seluruh 9 tabel berhasil diperbarui di Google Spreadsheet.');
    } catch (err: any) {
      setSyncStatus('Gagal sinkronisasi: ' + (err.message || 'Periksa izin deployment Web App'));
    } finally {
      setIsSyncing(false);
    }
  };

  const sheetNames = [
    { name: 'DB_Pengguna', count: db.users.length, desc: 'Akun Login Admin & Guru' },
    { name: 'DB_ProfilSekolah', count: 1, desc: 'Identitas & Logo Sekolah' },
    { name: 'DB_Siswa', count: db.siswa.length, desc: 'Data Siswa Kelas 7-9 & Rombel' },
    { name: 'DB_Guru', count: db.guru.length, desc: 'Data Pendidik & Mapel' },
    { name: 'DB_MataPelajaran', count: db.guruMapel.length, desc: 'Alokasi Pengampu & Tugas Tambahan' },
    { name: 'DB_WaliKelas', count: db.waliKelas.length, desc: 'Penetapan Wali Kelas' },
    { name: 'DB_JurnalPembelajaran', count: db.jurnal.length, desc: 'Jurnal Harian KBM' },
    { name: 'DB_Penilaian', count: db.penilaian.length, desc: 'Nilai Sumatif, STS, SAS & KKTP' },
    { name: 'DB_Absensi', count: db.absensi.length, desc: 'Presensi Siswa H, S, I, A' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Integrasi Database Google Spreadsheet & Code.gs
              </h2>
              <p className="text-xs text-slate-500">
                Sistem database terintegrasi otomatis untuk SiApgus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tabel Spreadsheet ({sheetNames.length})
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            File Script Code.gs
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'sync'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Koneksi Web App
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 leading-relaxed">
                Database tersimpan secara lokal dan otomatis disinkronkan ke 9 lembar kerja (sheet) pada Google Spreadsheet melalui script <strong>Code.gs</strong>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sheetNames.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-800 block text-[11px]">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-bold tabular-nums">
                      {item.count} data
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">
                    File Backend Google Apps Script (Code.gs)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    File ini telah dibuat di root proyek dan siap digunakan pada Apps Script.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copySuccess ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Code.gs</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto space-y-1">
                <p className="text-emerald-400">// SISTEM APLIKASI GURU SEKOLAH (SiApgus) - Code.gs</p>
                <p className="text-slate-400">// Fungsi inisialisasi sheet otomatis:</p>
                <p>function setupDatabase() &#123; ... &#125;</p>
                <p>function doGet(e) &#123; ... &#125;</p>
                <p>function doPost(e) &#123; ... &#125;</p>
                <p className="text-slate-500">// Seluruh kode lengkap telah tersimpan di /Code.gs</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700">Langkah Pemasangan di Google Drive:</span>
                <ol className="list-decimal pl-4 text-slate-600 space-y-1 text-[11px]">
                  <li>Buat Google Spreadsheet baru di Google Drive Anda.</li>
                  <li>Buka <em>Ekstensi &gt; Apps Script</em>.</li>
                  <li>Tempel seluruh isi <strong>Code.gs</strong> dan jalankan <code>setupDatabase()</code> satu kali.</li>
                  <li>Klik <em>Terapkan &gt; Penerapan Baru &gt; Aplikasi Web</em>.</li>
                  <li>Salin URL Web App dan tempelkan pada tab Koneksi Web App di sini.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Aplikasi Web Google Apps Script
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webAppUrl}
                  onChange={(e) => setWebAppUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {syncStatus && (
                <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{syncStatus}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleExecuteSync}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sedang Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
