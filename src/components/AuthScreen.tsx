import React, { useState, useEffect } from 'react';
import { SchoolProfile, UserAccount, UserRole } from '../types';
import {
  GraduationCap,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthScreenProps {
  profile: SchoolProfile;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser: (newUser: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  profile,
  users,
  onLoginSuccess,
  onRegisterUser,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form Fields - guaranteed empty on initial view and after reset
  const [role, setRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Generate random 5-character alphanumeric captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [isRegisterMode]);

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setFullName('');
    setCaptchaInput('');
    setShowPassword(false);
    generateCaptcha();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan masukkan username dan password.');
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Kode captcha tidak cocok! Silakan periksa kembali.');
      generateCaptcha();
      return;
    }

    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase().trim() === username.toLowerCase().trim() &&
        u.password === password &&
        u.role === role
    );

    if (!matchedUser) {
      setErrorMessage(
        `Username atau password salah untuk role ${role === 'admin' ? 'Admin' : 'Guru'}.`
      );
      generateCaptcha();
      return;
    }

    // Success! Clear input fields so whenever they log out and return, fields are empty!
    clearForm();
    onLoginSuccess(matchedUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim() || !fullName.trim()) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Kode captcha tidak cocok! Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    // Check if username already taken
    const exists = users.some(
      (u) => u.username.toLowerCase().trim() === username.toLowerCase().trim()
    );

    if (exists) {
      setErrorMessage('Username tersebut sudah digunakan. Silakan gunakan username lain.');
      return;
    }

    // Register user
    onRegisterUser({
      username: username.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      role: role,
    });

    setSuccessMessage(
      'Pendaftaran berhasil! Akun telah tersimpan di database. Silakan masuk menggunakan akun baru Anda.'
    );
    clearForm();
    setIsRegisterMode(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Decorative subtle backdrop elements */}
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-6 sm:p-8 space-y-6">
          
          {/* Top School Logo & Identity */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200/80 shadow-inner flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-200">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.namaSekolah}
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <GraduationCap className="w-11 h-11 text-blue-600" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                SiApgus v1.0
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {profile.namaSekolah || 'Sistem Aplikasi Guru Sekolah'}
              </h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isRegisterMode
                  ? 'Pendaftaran Akun Baru Pengguna SiApgus'
                  : 'Sistem Terintegrasi Database Spreadsheet & Manajemen Nilai Rapor'}
              </p>
            </div>
          </div>

          {/* Alert feedback */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit}
            className="space-y-4"
          >
            {/* Role Switcher Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Peran Pengguna (Role)
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="admin">Administrator (Admin Sekolah)</option>
                  <option value="guru">Guru Mata Pelajaran / Wali Kelas</option>
                </select>
              </div>
            </div>

            {/* Nama Lengkap (Only in Register mode) */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder:text-slate-400"
              />
            </div>

            {/* Password with Eye Icon toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden p-1"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Captcha Security */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Verifikasi Captcha
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Ketik kode di samping
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={generateCaptcha}
                  title="Klik untuk acak kode baru"
                  className="px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-xl font-mono text-base font-bold tracking-widest text-slate-800 select-none cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <span className="italic">{captchaCode}</span>
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Kode"
                  maxLength={5}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold tracking-wider text-slate-800 uppercase focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-center"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke SiApgus</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="pt-3 border-t border-slate-100 text-center">
            {isRegisterMode ? (
              <p className="text-xs text-slate-600">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    clearForm();
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  Kembali ke Tampilan Login
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    clearForm();
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  Daftar Baru Pengguna
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          SiApgus © 2026 · Sistem Aplikasi Guru Sekolah & Integrasi Spreadsheet
        </p>
      </div>
    </div>
  );
};
