# Voting DApp Backend API Documentation

## Overview
Backend untuk DApp voting sederhana yang dibangun menggunakan Motoko di Internet Computer Protocol (ICP).

## Data Types

### Proposal
```motoko
type Proposal = {
  id: Nat;
  title: Text;
  description: Text;
  options: [Text];
  creator: Principal;
  createdAt: Int;
  isActive: Bool;
};
```

### Vote
```motoko
type Vote = {
  proposalId: Nat;
  voter: Principal;
  option: Nat; // Index dari option yang dipilih
  timestamp: Int;
};
```

### VoteResult
```motoko
type VoteResult = {
  proposalId: Nat;
  results: [(Text, Nat)]; // (option, vote count)
  totalVotes: Nat;
};
```

### Error
```motoko
type Error = {
  #NotFound;
  #AlreadyVoted;
  #InvalidOption;
  #ProposalNotActive;
  #Unauthorized;
};
```

## API Functions

### 1. createProposal
**Deskripsi**: Membuat proposal polling baru
**Signature**: `createProposal(title: Text, description: Text, options: [Text]): async Result<Proposal, Error>`
**Parameter**:
- `title`: Judul proposal
- `description`: Deskripsi proposal
- `options`: Array opsi voting

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend createProposal '("Nanas di atas pizza?", "Polling tentang nanas di atas pizza", vec {"Ya, saya suka"; "Tidak, saya tidak suka"})'
```

### 2. getActiveProposals
**Deskripsi**: Mendapatkan semua proposal yang masih aktif
**Signature**: `getActiveProposals(): async [Proposal]`
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend getActiveProposals '()'
```

### 3. getProposal
**Deskripsi**: Mendapatkan proposal berdasarkan ID
**Signature**: `getProposal(proposalId: Nat): async Result<Proposal, Error>`
**Parameter**:
- `proposalId`: ID proposal
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend getProposal '(0)'
```

### 4. vote
**Deskripsi**: Memberikan suara pada proposal
**Signature**: `vote(proposalId: Nat, optionIndex: Nat): async Result<Text, Error>`
**Parameter**:
- `proposalId`: ID proposal
- `optionIndex`: Index opsi yang dipilih (mulai dari 0)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend vote '(0, 0)'
```

### 5. getVoteResults
**Deskripsi**: Mendapatkan hasil voting untuk proposal
**Signature**: `getVoteResults(proposalId: Nat): async Result<VoteResult, Error>`
**Parameter**:
- `proposalId`: ID proposal
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend getVoteResults '(0)'
```

### 6. hasVoted
**Deskripsi**: Mengecek apakah user sudah memberikan suara pada proposal
**Signature**: `hasVoted(proposalId: Nat): async Bool`
**Parameter**:
- `proposalId`: ID proposal
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend hasVoted '(0)'
```

### 7. deactivateProposal
**Deskripsi**: Menonaktifkan proposal (hanya creator yang bisa)
**Signature**: `deactivateProposal(proposalId: Nat): async Result<Text, Error>`
**Parameter**:
- `proposalId`: ID proposal

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend deactivateProposal '(0)'
```

### 8. getTotalProposals
**Deskripsi**: Mendapatkan total jumlah proposal
**Signature**: `getTotalProposals(): async Nat`
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend getTotalProposals '()'
```

### 9. getUserVotes
**Deskripsi**: Mendapatkan riwayat voting user
**Signature**: `getUserVotes(): async [Vote]`
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend getUserVotes '()'
```

### 10. greet
**Deskripsi**: Fungsi test untuk greeting
**Signature**: `greet(name: Text): async Text`
**Parameter**:
- `name`: Nama untuk greeting
**Query**: Ya (read-only)

**Contoh penggunaan**:
```bash
dfx canister call voting_app_backend greet '("Testing")'
```

## Fitur Utama

### 1. Pembuatan Proposal
- Setiap user dapat membuat proposal baru
- Proposal berisi judul, deskripsi, dan opsi voting
- Creator proposal disimpan untuk kontrol akses

### 2. Voting System
- Satu user hanya bisa vote sekali per proposal
- Voting dilakukan dengan memilih index opsi
- Validasi proposal aktif dan opsi valid

### 3. Transparansi Hasil
- Hasil voting dapat dilihat real-time
- Menampilkan jumlah vote per opsi
- Total vote keseluruhan

### 4. Access Control
- Hanya creator yang bisa menonaktifkan proposal
- Identity management menggunakan Principal ID

### 5. State Management
- Menggunakan stable variables untuk upgrade compatibility
- HashMap untuk performa query yang optimal
- Persistent storage untuk proposal dan vote

## Security Features

1. **Identity Verification**: Menggunakan Principal ID untuk identifikasi user
2. **Vote Uniqueness**: Sistem mencegah double voting
3. **Access Control**: Hanya creator yang bisa menonaktifkan proposal
4. **Data Integrity**: Menggunakan Result type untuk error handling

## Error Handling

- `#NotFound`: Proposal tidak ditemukan
- `#AlreadyVoted`: User sudah memberikan suara
- `#InvalidOption`: Index opsi tidak valid
- `#ProposalNotActive`: Proposal sudah dinonaktifkan
- `#Unauthorized`: User tidak memiliki akses

## Deployment

1. Create canister: `dfx canister create voting_app_backend`
2. Build: `dfx build voting_app_backend`
3. Deploy: `dfx deploy voting_app_backend`

## Testing

Backend telah ditest dengan berbagai skenario:
- ✅ Membuat proposal baru
- ✅ Mendapatkan daftar proposal aktif
- ✅ Voting pada proposal
- ✅ Cek hasil voting
- ✅ Validasi double voting
- ✅ Query functions
