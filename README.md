# Voting DApp - Aplikasi Voting Sederhana di Internet Computer

Sebuah aplikasi voting desentralized (DApp) yang dibangun menggunakan Motoko di Internet Computer Protocol (ICP). Aplikasi ini memungkinkan pengguna untuk membuat polling dan memberikan suara secara transparan.

## 🚀 Fitur Utama

### ✅ Backend (Motoko) - SELESAI
- **Membuat Proposal**: Pengguna dapat membuat proposal polling baru dengan judul, deskripsi, dan opsi voting
- **Sistem Voting**: Setiap pengguna hanya dapat memberikan satu suara per proposal
- **Transparansi**: Hasil voting dapat dilihat secara real-time
- **Access Control**: Hanya creator yang dapat menonaktifkan proposal
- **State Management**: Menggunakan stable variables untuk upgrade compatibility

### ✅ Frontend (React) - SELESAI
- **Modern UI/UX**: Desain yang menarik dan responsif
- **Buat Proposal**: Interface yang mudah untuk membuat proposal baru
- **Daftar Proposal**: Tampilan card-based untuk semua proposal aktif
- **Voting Interface**: UI yang intuitif untuk memberikan suara
- **Hasil Real-time**: Dashboard dengan visualisasi hasil voting
- **Riwayat Voting**: Halaman untuk melihat riwayat vote pengguna
- **Responsive Design**: Bekerja dengan baik di desktop dan mobile

## 📁 Struktur Project

```
voting_app/
├── src/
│   ├── voting_app_backend/
│   │   └── main.mo           # Backend Motoko
│   └── voting_app_frontend/
│       └── src/
│           ├── App.jsx       # Frontend React
│           └── main.jsx
├── dfx.json                  # Konfigurasi DFX
└── README.md                 # File ini
```

## 🔧 Setup dan Installation

### Prerequisites
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install) (Internet Computer SDK)
- Node.js dan npm (untuk frontend)

### 1. Clone & Setup
```bash
cd voting_app/
dfx start --background
```

### 2. Deploy Backend & Frontend
```bash
# Deploy semua canister
dfx deploy

# Atau deploy satu per satu
dfx deploy voting_app_backend
dfx deploy voting_app_frontend
```

### 3. Akses Aplikasi
```bash
# Frontend Web App
http://ucwa4-rx777-77774-qaada-cai.localhost:4943/

# Backend Candid Interface
http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=umunu-kh777-77774-qaaca-cai
```

### 4. Development Mode
```bash
# Untuk development frontend
cd src/voting_app_frontend
npm start
```

## 📚 API Documentation

Lihat [BACKEND_API.md](./BACKEND_API.md) untuk dokumentasi lengkap API backend.

### Quick API Reference

| Function | Deskripsi | Type |
|----------|-----------|------|
| `createProposal` | Membuat proposal baru | Update |
| `getActiveProposals` | Mendapatkan semua proposal aktif | Query |
| `vote` | Memberikan suara | Update |
| `getVoteResults` | Mendapatkan hasil voting | Query |
| `hasVoted` | Cek apakah user sudah vote | Query |
| `deactivateProposal` | Nonaktifkan proposal | Update |

## 🧪 Testing

### Frontend Testing
- ✅ UI Components bekerja dengan baik
- ✅ Navigation antar halaman
- ✅ Responsive design
- ✅ Integrasi dengan backend

### Backend Testing
Backend telah ditest dengan berbagai skenario:
- ✅ Membuat proposal baru
- ✅ Mendapatkan daftar proposal aktif
- ✅ Voting pada proposal
- ✅ Cek hasil voting
- ✅ Validasi double voting
- ✅ Query functions

### Manual Testing Commands
```bash
# Test via CLI
dfx canister call voting_app_backend createProposal '("Nanas di atas pizza?", "Polling tentang nanas di atas pizza", vec {"Ya, saya suka"; "Tidak, saya tidak suka"})'
dfx canister call voting_app_backend getActiveProposals '()'
dfx canister call voting_app_backend vote '(0, 0)'
dfx canister call voting_app_backend getVoteResults '(0)'
```

## 🔒 Security Features

1. **Identity Verification**: Menggunakan Principal ID
2. **Vote Uniqueness**: Sistem mencegah double voting
3. **Access Control**: Hanya creator yang bisa menonaktifkan proposal
4. **Data Integrity**: Menggunakan Result type untuk error handling

## 📖 Dokumentasi Internet Computer

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

## 🚀 Deployment Guide

### 🔧 Local Development Deployment

Untuk deployment lokal yang sudah berjalan:

```bash
# 1. Pastikan DFX berjalan
dfx start --background

# 2. Deploy ke lokal
dfx deploy

# 3. Akses aplikasi
Frontend: http://ucwa4-rx777-77774-qaada-cai.localhost:4943/
Backend: http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=umunu-kh777-77774-qaaca-cai
```

### 🌐 Production Deployment ke IC Mainnet

Untuk mendeploy ke Internet Computer mainnet agar bisa digunakan banyak orang:

#### 1. Persiapan Mainnet
```bash
# Install dfx jika belum ada
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Buat identity baru untuk mainnet
dfx identity new mainnet-identity
dfx identity use mainnet-identity

# Tambahkan cycles (diperlukan untuk deploy ke mainnet)
# Bisa dibeli di https://cycles.faucet.dfinity.org/
```

#### 2. Deploy ke IC Mainnet
```bash
# Deploy ke mainnet
dfx deploy --network ic

# Atau deploy satu per satu
dfx deploy --network ic voting_app_backend
dfx deploy --network ic voting_app_frontend
```

#### 3. Akses Aplikasi di Internet
Setelah deploy berhasil, aplikasi akan tersedia di:
- Frontend: `https://<canister-id>.ic0.app`
- Backend: `https://<canister-id>.ic0.app`

### 💰 Biaya Deployment

**Mainnet Deployment:**
- **Initial Cost**: ~0.5 T cycles untuk setup
- **Monthly Cost**: ~0.1 T cycles per bulan
- **Storage**: ~0.01 T cycles per MB
- **Compute**: ~0.001 T cycles per request

**Cara Mendapatkan Cycles:**
1. **Cycles Faucet**: https://cycles.faucet.dfinity.org/ (gratis untuk developer)
2. **DFINITY Foundation**: Program grants untuk developer
3. **Beli ICP**: Convert ICP token ke cycles

### 🔧 Konfigurasi Production

#### 1. Environment Variables
```bash
# Set network ke production
export DFX_NETWORK=ic

# Set canister IDs yang sudah dideploy
export CANISTER_ID_VOTING_APP_BACKEND=<backend-canister-id>
export CANISTER_ID_VOTING_APP_FRONTEND=<frontend-canister-id>
```

#### 2. Optimasi Performance
```bash
# Build dengan optimasi
dfx build --network ic --with-cycles

# Compress assets
dfx deploy --network ic --with-cycles --mode optimize
```

### 🚀 Next Steps

1. **Enhanced Features**: Tambah fitur seperti deadline voting, kategori proposal, dan notifikasi
2. **UI/UX Improvements**: Animasi, dark mode, dan aksesibilitas yang lebih baik
3. **Advanced Testing**: Unit test, integration test, dan end-to-end testing
4. **Performance**: Optimasi loading dan caching
5. **Security**: Audit keamanan dan best practices
6. **Deployment**: Deploy ke mainnet ICP

---

**Status**: ✅ Backend Complete | ✅ Frontend Complete | 🎉 **PRODUCTION READY**

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd voting_app/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
