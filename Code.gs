/**
 * ============================================================================
 * SISTEM APLIKASI GURU SEKOLAH (SiApgus) - Google Apps Script Backend (Code.gs)
 * ============================================================================
 * Script ini digunakan pada Google Apps Script yang terhubung dengan Google Spreadsheet
 * untuk mengelola database SiApgus secara otomatis dan terintegrasi.
 *
 * CARA PEMASANGAN:
 * 1. Buat Google Spreadsheet baru di Google Drive (beri nama: "Database SiApgus").
 * 2. Klik menu "Ekstensi" > "Apps Script".
 * 3. Hapus kode default, lalu salin dan tempelkan seluruh kode ini ke dalam file Code.gs.
 * 4. Jalankan fungsi "setupDatabase()" satu kali untuk membuat semua sheet & tabel otomatis.
 * 5. Klik "Terapkan" (Deploy) > "Penerapan baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Jalankan sebagai: "Saya" (Me)
 *    - Yang memiliki akses: "Siapa saja" (Anyone)
 * 8. Salin URL Aplikasi Web yang dihasilkan dan tempelkan ke pengaturan SiApgus.
 * ============================================================================
 */

// Konstanta Nama-Nama Sheet Database
const SHEET_NAMES = {
  USERS: 'DB_Pengguna',
  PROFIL: 'DB_ProfilSekolah',
  SISWA: 'DB_Siswa',
  GURU: 'DB_Guru',
  MAPEL: 'DB_MataPelajaran',
  WALI_KELAS: 'DB_WaliKelas',
  JURNAL: 'DB_JurnalPembelajaran',
  PENILAIAN: 'DB_Penilaian',
  ABSENSI: 'DB_Absensi'
};

/**
 * Inisialisasi struktur sheet dan header kolom secara otomatis di Google Spreadsheet.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Pengguna (Users / Login)
  createSheetIfNotExists(ss, SHEET_NAMES.USERS, [
    'ID', 'Username', 'Password', 'Role', 'Nama Lengkap', 'Waktu Dibuat'
  ], [
    ['USR-001', 'admin', 'admin123', 'admin', 'Administrator SiApgus', new Date().toISOString()],
    ['USR-002', 'guru1', 'guru123', 'guru', 'Budi Santoso, S.Pd.', new Date().toISOString()]
  ]);

  // 2. Sheet Profil Sekolah
  createSheetIfNotExists(ss, SHEET_NAMES.PROFIL, [
    'Nama Sekolah', 'Kepala Sekolah', 'NUPTK', 'NPSN', 'Akreditasi', 'Kurikulum', 'Kode Pos', 'Alamat', 'Telepon', 'Logo URL/Base64'
  ], [
    [
      'SMP NEGERI 1 CONTOH',
      'Dr. H. Ahmad Dahlan, M.Pd.',
      '197508172000031001',
      '20104567',
      'A',
      'Kurikulum Merdeka',
      '60123',
      'Jl. Pendidikan No. 45, Kebangsaan',
      '(031) 555-1234',
      ''
    ]
  ]);

  // 3. Sheet Siswa
  createSheetIfNotExists(ss, SHEET_NAMES.SISWA, [
    'ID Siswa', 'Nama Siswa', 'Jenis Kelamin', 'Kelas', 'Rombel'
  ], [
    ['SIS-001', 'Ahmad Rizky Pratama', 'L', '7', 'A'],
    ['SIS-002', 'Anisa Rahmawati', 'P', '7', 'A'],
    ['SIS-003', 'Bagas Aditya Putra', 'L', '7', 'B'],
    ['SIS-004', 'Cantika Dewi Putri', 'P', '8', 'A'],
    ['SIS-005', 'Dimas Arya Yudha', 'L', '9', 'C']
  ]);

  // 4. Sheet Guru
  createSheetIfNotExists(ss, SHEET_NAMES.GURU, [
    'ID Guru', 'Nama Guru', 'Jenis Kelamin', 'Guru Mata Pelajaran'
  ], [
    ['GUR-001', 'Budi Santoso, S.Pd.', 'L', 'Matematika'],
    ['GUR-002', 'Siti Aminah, M.Pd.', 'P', 'Bahasa Indonesia'],
    ['GUR-003', 'Hendra Wijaya, S.Kom.', 'L', 'Informatika'],
    ['GUR-004', 'Dewi Lestari, S.Pd.', 'P', 'Ilmu Pengetahuan Alam (IPA)']
  ]);

  // 5. Sheet Mata Pelajaran & Penugasan Guru
  createSheetIfNotExists(ss, SHEET_NAMES.MAPEL, [
    'ID', 'Kode Mapel', 'Mata Pelajaran', 'Kelas', 'Rombel', 'Nama Guru', 'Jenis Kelamin', 'Tugas Tambahan'
  ], [
    ['MP-001', 'MTK-7', 'Matematika', '7', 'A', 'Budi Santoso, S.Pd.', 'L', 'Guru Mapel'],
    ['MP-002', 'BIN-7', 'Bahasa Indonesia', '7', 'A', 'Siti Aminah, M.Pd.', 'P', 'Wali Kelas 7A'],
    ['MP-003', 'INF-7', 'Informatika', '7', 'A', 'Hendra Wijaya, S.Kom.', 'L', 'Guru Mapel'],
    ['MP-004', 'IPA-7', 'Ilmu Pengetahuan Alam (IPA)', '7', 'A', 'Dewi Lestari, S.Pd.', 'P', 'Guru Mapel']
  ]);

  // 6. Sheet Wali Kelas
  createSheetIfNotExists(ss, SHEET_NAMES.WALI_KELAS, [
    'ID', 'Kode Kelas', 'Rombel', 'Nama Guru', 'Jenis Kelamin', 'Guru Mata Pelajaran', 'Tugas Tambahan'
  ], [
    ['WK-001', '7', 'A', 'Siti Aminah, M.Pd.', 'P', 'Bahasa Indonesia', 'Wali Kelas 7A'],
    ['WK-002', '7', 'B', 'Budi Santoso, S.Pd.', 'L', 'Matematika', 'Wali Kelas 7B'],
    ['WK-003', '8', 'A', 'Dewi Lestari, S.Pd.', 'P', 'IPA', 'Wali Kelas 8A'],
    ['WK-004', '9', 'A', 'Hendra Wijaya, S.Kom.', 'L', 'Informatika', 'Wali Kelas 9A']
  ]);

  // 7. Sheet Jurnal Pembelajaran
  createSheetIfNotExists(ss, SHEET_NAMES.JURNAL, [
    'ID Jurnal', 'Hari/Tanggal', 'Kelas', 'Jam Ke', 'Capaian Pembelajaran (CP)', 'Tujuan Pembelajaran (TP)', 'KBM', 'Refleksi Guru & Asesmen', 'Siswa Tidak Hadir', 'Nama Guru'
  ]);

  // 8. Sheet Penilaian Rapor
  createSheetIfNotExists(ss, SHEET_NAMES.PENILAIAN, [
    'ID Penilaian', 'ID Siswa', 'Nama Siswa', 'Kelas', 'Rombel', 'Mata Pelajaran', 'Tahun Pelajaran', 'Semester', 'KKTP', 
    'Sumatif 1', 'Sumatif 2', 'Sumatif 3', 'STS', 'SAS', 'Nilai Sisipan', 'Capaian Sisipan', 'Nilai Akhir', 'Capaian Akhir', 'Nama Guru'
  ]);

  // 9. Sheet Absensi Harian Siswa
  createSheetIfNotExists(ss, SHEET_NAMES.ABSENSI, [
    'ID Absen', 'Tanggal', 'Kelas', 'Rombel', 'ID Siswa', 'Nama Siswa', 'Status (H/S/I/A)', 'Keterangan', 'Wali Kelas'
  ]);

  Logger.log('Semua database sheet SiApgus berhasil disiapkan!');
  return { status: 'success', message: 'Database SiApgus siap digunakan!' };
}

/**
 * Helper untuk membuat sheet jika belum ada beserta styling header
 */
function createSheetIfNotExists(ss, name, headers, defaultRows) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2563EB')
               .setFontColor('#FFFFFF')
               .setFontWeight('bold')
               .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    
    if (defaultRows && defaultRows.length > 0) {
      defaultRows.forEach(row => sheet.appendRow(row));
    }
  }
  return sheet;
}

/**
 * Handle HTTP GET Request (API Endpoint & Web App Entry)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'ping';

  // Jika diminta HTML standalone langsung dari Apps Script
  if (action === 'html' || !e.parameter.action) {
    try {
      return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle('SiApgus - Sistem Aplikasi Guru Sekolah')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    } catch (err) {
      // Jika Index.html belum dibuat di project Apps Script
      return ContentService.createTextOutput(JSON.stringify({
        status: 'online',
        app: 'SiApgus - Sistem Aplikasi Guru Sekolah',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        instructions: 'Database Apps Script siap menerima request API SiApgus.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'getAllData') {
    return respondJSON({
      status: 'success',
      data: {
        users: getSheetData(ss, SHEET_NAMES.USERS),
        profil: getSheetData(ss, SHEET_NAMES.PROFIL)[0] || null,
        siswa: getSheetData(ss, SHEET_NAMES.SISWA),
        guru: getSheetData(ss, SHEET_NAMES.GURU),
        mapel: getSheetData(ss, SHEET_NAMES.MAPEL),
        waliKelas: getSheetData(ss, SHEET_NAMES.WALI_KELAS),
        jurnal: getSheetData(ss, SHEET_NAMES.JURNAL),
        penilaian: getSheetData(ss, SHEET_NAMES.PENILAIAN),
        absensi: getSheetData(ss, SHEET_NAMES.ABSENSI)
      }
    });
  }

  if (action === 'getSheet') {
    const sheetKey = e.parameter.sheet;
    const sheetName = SHEET_NAMES[sheetKey] || sheetKey;
    const data = getSheetData(ss, sheetName);
    return respondJSON({ status: 'success', data: data });
  }

  return respondJSON({ status: 'online', message: 'SiApgus API aktif' });
}

/**
 * Handle HTTP POST Request (Menyimpan data dari frontend SiApgus)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'syncAll') {
      // Sinkronisasi penuh semua tabel dari aplikasi SiApgus
      const payload = postData.payload;
      if (payload.profil) replaceSheetData(ss, SHEET_NAMES.PROFIL, [payload.profil]);
      if (payload.siswa) replaceSheetData(ss, SHEET_NAMES.SISWA, payload.siswa);
      if (payload.guru) replaceSheetData(ss, SHEET_NAMES.GURU, payload.guru);
      if (payload.mapel) replaceSheetData(ss, SHEET_NAMES.MAPEL, payload.mapel);
      if (payload.waliKelas) replaceSheetData(ss, SHEET_NAMES.WALI_KELAS, payload.waliKelas);
      if (payload.jurnal) replaceSheetData(ss, SHEET_NAMES.JURNAL, payload.jurnal);
      if (payload.penilaian) replaceSheetData(ss, SHEET_NAMES.PENILAIAN, payload.penilaian);
      if (payload.absensi) replaceSheetData(ss, SHEET_NAMES.ABSENSI, payload.absensi);
      if (payload.users) replaceSheetData(ss, SHEET_NAMES.USERS, payload.users);

      return respondJSON({ status: 'success', message: 'Sinkronisasi berhasil disimpan ke Google Spreadsheet!' });
    }

    if (action === 'saveNilaiBatch') {
      const records = postData.records || [];
      const sheet = ss.getSheetByName(SHEET_NAMES.PENILAIAN);
      records.forEach(item => {
        sheet.appendRow([
          item.id || Utilities.getUuid(),
          item.siswaId,
          item.namaSiswa,
          item.kelas,
          item.rombel,
          item.mapel,
          item.tahunPelajaran,
          item.semester,
          item.kktp,
          item.sumatif1,
          item.sumatif2,
          item.sumatif3,
          item.sts,
          item.sas,
          item.nilaiSisipan,
          item.capaianSisipan,
          item.nilaiAkhir,
          item.capaianAkhir,
          item.namaGuru
        ]);
      });
      return respondJSON({ status: 'success', message: 'Nilai berhasil disimpan' });
    }

    if (action === 'saveAbsensiBatch') {
      const records = postData.records || [];
      const sheet = ss.getSheetByName(SHEET_NAMES.ABSENSI);
      records.forEach(item => {
        sheet.appendRow([
          item.id || Utilities.getUuid(),
          item.tanggal,
          item.kelas,
          item.rombel,
          item.siswaId,
          item.namaSiswa,
          item.status,
          item.keterangan || '',
          item.waliKelas || ''
        ]);
      });
      return respondJSON({ status: 'success', message: 'Absensi berhasil disimpan' });
    }

    return respondJSON({ status: 'error', message: 'Action tidak dikenali' });
  } catch (err) {
    return respondJSON({ status: 'error', message: err.toString() });
  }
}

/**
 * Mengambil data sheet sebagai array of objects
 */
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  const headers = rows[0];
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j].toString().trim();
      obj[key] = row[j];
    }
    result.push(obj);
  }
  return result;
}

/**
 * Mengganti seluruh isi sheet dengan dataset baru
 */
function replaceSheetData(ss, sheetName, dataArray) {
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) return;
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  
  // Ambil header yang ada di baris pertama
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
  
  const rowsToInsert = dataArray.map(item => {
    return headers.map(header => {
      const key = header.toString().trim();
      return item[key] !== undefined ? item[key] : (item[header] !== undefined ? item[header] : '');
    });
  });

  if (rowsToInsert.length > 0) {
    sheet.getRange(2, 1, rowsToInsert.length, headers.length).setValues(rowsToInsert);
  }
}

function respondJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
