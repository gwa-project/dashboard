# GWA Project Dashboard

Dashboard admin untuk GO-GCP backend menggunakan Google OAuth SSO.

## 🚀 Features

- **Google OAuth SSO** - Login dengan akun Google
- **Responsive Design** - Mobile-friendly dengan Bulma CSS
- **Real-time Data** - Dashboard yang update otomatis
- **User Management** - Kelola user sistem
- **Clean UI** - Interface yang modern dan mudah digunakan

## 📋 Prerequisites

1. **Google OAuth Setup**:
   - Buat project di [Google Cloud Console](https://console.cloud.google.com)
   - Enable Google+ API
   - Buat OAuth 2.0 credentials
   - Tambah authorized JavaScript origins:
     - `http://localhost:8080` (development)
     - `https://your-domain.com` (production)

2. **GO-GCP Backend**:
   - Backend GO-GCP harus sudah deploy dan running
   - Database MongoDB harus terkoneksi

## ⚙️ Setup

### 1. Update Google OAuth Client ID

Edit file `jscroot/url/config.js`:

```javascript
export const googleConfig = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE', // Ganti dengan Client ID yang benar
    redirectUri: window.location.origin + '/dashboard/',
    scope: 'openid email profile'
};
```

### 2. Update Backend URL

Dalam file yang sama, update URL backend:

```javascript
export const backend = {
    baseURL: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function',
    // ... endpoints lainnya
};
```

### 3. Deployment

#### Development (Local)

**⚠️ IMPORTANT: ES6 Modules require HTTP server due to CORS policy!**

```bash
# Option 1: Python HTTP Server (Recommended)
cd dashboard
python -m http.server 8080
# Then open: http://localhost:8080

# Option 2: Node.js http-server
cd dashboard
npx http-server -p 8080

# Option 3: VS Code Live Server Extension
# Right-click index.html → "Open with Live Server"
```

**Cannot open index.html directly with file:// - it will show 404 errors!**

#### Production (GitHub Pages)
1. Push dashboard ke GitHub repository
2. Enable GitHub Pages di repository settings
3. Set source ke `main` branch `/dashboard` folder
4. Update Google OAuth authorized origins dengan domain GitHub Pages

#### Production (Custom Domain)
1. Upload folder `dashboard` ke web hosting
2. Update Google OAuth authorized origins
3. Update `baseURL` di config.js jika perlu

## 📚 Struktur Files

```
dashboard/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Custom CSS styles
│   ├── js/                 # Additional JavaScript files
│   └── img/                # Images and icons
├── jscroot/
│   ├── index.js            # Main application logic
│   └── url/
│       └── config.js       # Backend configuration & API client
└── README.md               # Documentation
```

## 🔧 Configuration

### Google OAuth Setup Detail

1. **Google Cloud Console**:
   ```
   Project: gwa-project-472118
   APIs & Services > Credentials
   Create OAuth 2.0 Client ID
   Application type: Web application
   ```

2. **Authorized JavaScript origins**:
   ```
   http://localhost:8080
   https://gwa-project.github.io
   https://your-custom-domain.com
   ```

3. **Authorized redirect URIs**:
   ```
   http://localhost:8080/dashboard/
   https://gwa-project.github.io/GO-GCP/dashboard/
   https://your-custom-domain.com/dashboard/
   ```

### Backend Integration

Dashboard menggunakan endpoints berikut dari GO-GCP backend:

- `POST /auth/login` - Google OAuth login
- `GET /data/user` - Get user profile
- `GET /users` - Get all users (admin)
- `GET /health` - Health check

## 🎯 Usage

### Login Flow
1. User klik tombol "Sign in with Google"
2. Google OAuth popup muncul
3. User authorize aplikasi
4. Dashboard decode JWT dari Google
5. Send user data ke backend GO-GCP
6. Backend create/update user di MongoDB
7. Backend return PASETO token
8. Dashboard store token dan redirect ke main dashboard

### Navigation
- **Home** - Dashboard overview dengan statistik
- **Profile** - User profile management
- **Users** - User management (jika admin)

## 🔐 Security

- **PASETO Tokens** - Secure token yang tidak bisa di-crack
- **HTTPS Only** - Enforced untuk production
- **CORS Protection** - Configured di backend
- **Input Validation** - Semua input di-validate
- **XSS Protection** - Content Security Policy

## 🚨 Troubleshooting

### 1. Google OAuth Error
```
Error: redirect_uri_mismatch
```
**Solution**: Check authorized redirect URIs di Google Cloud Console

### 2. CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution**: Update CORS origins di backend `config/cors.go`

### 3. Token Invalid
```
Error: Invalid or expired token
```
**Solution**: Check PASETO key di backend environment variables

### 4. Database Connection Failed
```
Database not connected
```
**Solution**: Check MongoDB connection string di backend

## 📱 Mobile Support

Dashboard fully responsive dan support:
- iOS Safari
- Android Chrome
- Mobile Firefox
- Progressive Web App ready

## 🎨 Customization

### Themes
Update CSS variables di `assets/css/style.css`:

```css
:root {
    --primary-color: #3273dc;    /* Main color */
    --secondary-color: #48c774;  /* Success color */
    --accent-color: #ffdd57;     /* Warning color */
}
```

### Menu Items
Edit navigation di `index.html` bagian sidebar:

```html
<ul class="menu-list">
    <li><a href="#home"><i class="fas fa-home"></i>&nbsp; Home</a></li>
    <li><a href="#custom"><i class="fas fa-cog"></i>&nbsp; Custom Page</a></li>
</ul>
```

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check troubleshooting section
2. Verify semua configuration benar
3. Check browser console untuk error details
4. Test dengan backend health endpoint

## 🔄 Updates

Untuk update dashboard:
1. Backup current configuration
2. Download/pull latest version
3. Update configuration files
4. Test di development environment
5. Deploy ke production

## 📊 Monitoring

Dashboard include built-in monitoring:
- Real-time user count
- Active sessions
- System health status
- API response times (via browser network tab)

Perfect! Dashboard sudah siap dengan Google OAuth integration! 🎉