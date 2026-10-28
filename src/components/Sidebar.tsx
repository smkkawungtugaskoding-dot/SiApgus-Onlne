import React from 'react';
import {
  SchoolProfile,
  UserAccount,
  WaliKelasAssignment
} from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Settings,
  BookMarked,
  FileSpreadsheet,
  CheckSquare,
  Printer,
  FileText,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentUser: UserAccount;
  profile: SchoolProfile;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onLogout: () => void;
  waliKelasList: WaliKelasAssignment[];
  onOpenSpreadsheetSync: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentUser,
  profile,
  activeMenu,
  setActiveMenu,
  onLogout,
  waliKelasList,
  onOpenSpreadsheetSync
}) => {
  // Check if current logged in teacher is a designated Wali Kelas
  const isWaliKelas =
    currentUser.role === 'admin' ||
    waliKelasList.some(
      (wk) =>
        wk.namaGuru.toLowerCase().trim() ===
        currentUser.fullName.toLowerCase().trim()
    );

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const adminMenuItems: MenuItem[] = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-siswa', label: 'Menu Siswa', icon: Users },
    { id: 'admin-guru', label: 'Menu Guru', icon: GraduationCap },
    { id: 'admin-mapel', label: 'Guru Mata Pelajaran', icon: BookOpen },
    { id: 'admin-wali-kelas', label: 'Menu Wali Kelas', icon: Award },
    { id: 'admin-setting', label: 'Setting Profil Sekolah', icon: Settings },
  ];

  const guruMenuItems: MenuItem[] = [
    { id: 'guru-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guru-jurnal', label: 'Jurnal Pembelajaran', icon: BookMarked },
    { id: 'guru-penilaian', label: 'Data Penilaian Rapor', icon: FileSpreadsheet },
    // Only designated Wali Kelas can access Absensi, Cetak Absen, and Cetak Rapor
    ...(isWaliKelas
      ? [
          { id: 'guru-absensi', label: 'Menu Absensi Siswa', icon: CheckSquare, badge: 'Wali Kelas' },
          { id: 'guru-cetak-absen', label: 'Cetak Absen Siswa', icon: Printer, badge: 'Wali Kelas' },
          { id: 'guru-cetak-rapor', label: 'Cetak Rapor Siswa', icon: FileText, badge: 'Wali Kelas' },
        ]
      : []),
  ];

  const currentMenuItems =
    currentUser.role === 'admin' ? adminMenuItems : guruMenuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => {}}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div className="h-20 px-5 flex items-center gap-3 border-b border-slate-100 bg-slate-50/70">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt={profile.namaSekolah}
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            ) : (
              <GraduationCap className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900 truncate tracking-tight">
              SiApgus
            </h2>
            <p className="text-xs text-slate-500 truncate" title={profile.namaSekolah}>
              {profile.namaSekolah || 'Sistem Aplikasi Guru'}
            </p>
          </div>
        </div>

        {/* User Card Profile in Sidebar */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate" title={currentUser.fullName}>
                {currentUser.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-medium text-blue-600 capitalize">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Guru Pengajar'}
                </span>
                {isWaliKelas && currentUser.role === 'guru' && (
                  <span className="text-[10px] text-emerald-700 font-medium">
                    · Wali Kelas
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {currentUser.role === 'admin' ? 'Menu Administrasi' : 'Menu Guru & Rapor'}
          </div>

          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Quick Database & Code.gs Action */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onOpenSpreadsheetSync}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Database & Code.gs</span>
            </button>
          </div>
        </div>

        {/* Footer Logout Action */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
