// ============================================
// AUTH.JS - Sistem Autentikasi dengan Path yang Benar
// ============================================
// Simpan file ini di: AdminLTE-4.0.0-rc4/dist/auth.js
// ============================================

/**
 * Fungsi untuk mendapatkan semua user yang terdaftar
 */
function getAllUsers() {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
}

/**
 * Fungsi REGISTER - Mendaftarkan user baru
 */
function register(firstName, lastName, email, password, confirmPassword) {
    // Validasi 1: Cek apakah semua field sudah diisi
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('❌ Semua field harus diisi!');
        return false;
    }

    // Validasi 2: Cek apakah password sama dengan konfirmasi
    if (password !== confirmPassword) {
        alert('❌ Password dan konfirmasi password tidak cocok!');
        return false;
    }

    // Validasi 3: Cek panjang password minimal 8 karakter
    if (password.length < 8) {
        alert('❌ Password minimal harus 8 karakter!');
        return false;
    }

    // Validasi 4: Cek format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Format email tidak valid!');
        return false;
    }

    // Ambil data users yang sudah ada
    const users = getAllUsers();

    // Validasi 5: Cek apakah email sudah terdaftar
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        alert('❌ Email sudah terdaftar! Silakan gunakan email lain atau login.');
        return false;
    }

    // Buat object user baru
    const newUser = {
        id: Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        registeredAt: new Date().toISOString(),
        lastLogin: null
    };

    // Simpan user baru
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Notifikasi sukses
    alert('✅ Akun berhasil dibuat! Silakan login.');
    
    // Redirect ke halaman login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
    
    return true;
}

/**
 * Fungsi LOGIN - Masuk ke sistem
 */
function login(email, password) {
    // Validasi input
    if (!email || !password) {
        alert('❌ Email dan password harus diisi!');
        return false;
    }

    // Ambil semua users
    const users = getAllUsers();

    // Cari user berdasarkan email dan password
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase().trim() && 
        u.password === password
    );

    // Validasi kredensial
    if (!user) {
        alert('❌ Email atau password salah!');
        return false;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));

    // Simpan session
    const sessionData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loginAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(sessionData));

    // Notifikasi sukses
    alert(`✅ Login berhasil! Selamat datang, ${user.firstName}!`);

    // Redirect ke AdminLTE Dashboard
    setTimeout(() => {
        window.location.href = 'AdminLTE-4.0.0-rc4/dist/index.html';
    }, 500);
    
    return true;
}

/**
 * Fungsi LOGOUT - Keluar dari sistem
 */
function logout() {
    // Hapus session
    localStorage.removeItem('currentUser');
    
    // Notifikasi
    alert('✅ Anda telah berhasil logout!');
    
    // Redirect ke landing page
    // Karena logout dipanggil dari AdminLTE (dalam subfolder dist),
    // kita perlu naik 2 level ke root folder
    setTimeout(() => {
        window.location.href = '../../landing_page.html';
    }, 300);
}

/**
 * Fungsi untuk cek apakah user sudah login
 */
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

/**
 * Fungsi untuk mendapatkan data user yang sedang login
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Fungsi untuk proteksi halaman admin
 * Dipanggil di index.html (AdminLTE Dashboard)
 */
function protectAdminPage() {
    if (!isLoggedIn()) {
        alert('⚠️ Anda harus login terlebih dahulu untuk mengakses halaman ini!');
        // Redirect ke login (naik 2 level ke root folder)
        window.location.href = '../../login.html';
        return;
    }
    
    // Update nama user di navbar AdminLTE
    const user = getCurrentUser();
    
    // Update nama di navbar
    const userNameElements = document.querySelectorAll('.d-none.d-md-inline');
    userNameElements.forEach(el => {
        if (el.textContent.includes('Alexander Pierce')) {
            el.textContent = `${user.firstName} ${user.lastName}`;
        }
    });
    
    // Update nama di dropdown user
    const userHeaders = document.querySelectorAll('.user-header p');
    userHeaders.forEach(el => {
        if (el.textContent.includes('Alexander Pierce')) {
            el.innerHTML = `
                ${user.firstName} ${user.lastName} - Web Developer
                <small>Member since ${new Date(user.loginAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</small>
            `;
        }
    });
}

/**
 * Fungsi untuk redirect jika user sudah login
 * Dipanggil di login.html dan register.html
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'AdminLTE-4.0.0-rc4/dist/index.html';
    }
}

/**
 * Fungsi helper untuk debugging
 */
function debugAuth() {
    console.log('=== DEBUG AUTH SYSTEM ===');
    console.log('Logged In:', isLoggedIn());
    console.log('Current User:', getCurrentUser());
    console.log('All Users:', getAllUsers());
    console.log('========================');
}