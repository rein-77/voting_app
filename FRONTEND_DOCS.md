# Frontend Documentation - Voting DApp

## 📋 Overview

Frontend untuk DApp Voting dibangun menggunakan React dengan Vite sebagai build tool. Interface yang modern dan responsif untuk berinteraksi dengan backend Motoko di Internet Computer.

## 🏗️ Architecture

### Components Structure
```
src/
├── components/
│   ├── Header.jsx              # Navigation header
│   ├── ProposalCard.jsx        # Individual proposal card
│   ├── ProposalsList.jsx       # List of all proposals
│   ├── CreateProposal.jsx      # Form to create new proposal
│   ├── MyVotes.jsx             # User's voting history
│   └── LoadingSpinner.jsx      # Loading indicator
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.scss                  # Styles
```

### Key Features

#### 1. **Header Component**
- Navigation menu dengan 3 tab utama
- Responsive design dengan collapse menu untuk mobile
- Active state indication

#### 2. **ProposalCard Component**
- Menampilkan detail proposal (judul, deskripsi, opsi)
- Voting interface dengan radio buttons
- Real-time hasil voting dengan progress bar
- Status indicators (aktif/tidak aktif, sudah vote)

#### 3. **CreateProposal Component**
- Form untuk membuat proposal baru
- Dynamic option management (2-6 opsi)
- Validation untuk input yang diperlukan
- Auto-reset form setelah submit

#### 4. **ProposalsList Component**
- Grid layout untuk menampilkan semua proposal
- Loading states dan empty states
- Pagination-ready structure

#### 5. **MyVotes Component**
- Menampilkan riwayat voting user
- Mapping vote dengan proposal details
- Timeline format dengan timestamp

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple gradient)
- **Success**: `#48bb78` (Green)
- **Danger**: `#f56565` (Red)
- **Background**: Linear gradient (`#667eea` to `#764ba2`)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Base Size**: 16px
- **Line Height**: 1.6

### Layout
- **Container**: Max-width 1200px with auto margins
- **Grid**: CSS Grid with responsive breakpoints
- **Cards**: Rounded corners (12px) with subtle shadows
- **Buttons**: Rounded (8px) with hover effects

## 🔧 State Management

### App State
```jsx
const [currentView, setCurrentView] = useState('proposals');
const [proposals, setProposals] = useState([]);
const [myVotes, setMyVotes] = useState([]);
const [votedProposals, setVotedProposals] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [loadingStates, setLoadingStates] = useState({});
```

### Data Flow
1. **Initial Load**: Fetch proposals, votes, dan voted status
2. **Create Proposal**: Submit → Update proposals list → Switch to proposals view
3. **Vote**: Submit → Update voted status → Refresh vote history
4. **View Results**: Fetch results → Display in modal/card

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px
- **Mobile**: ≤ 768px

### Mobile Optimizations
- Collapsed navigation
- Single column grid layout
- Stacked action buttons
- Optimized touch targets

## 🚀 Performance

### Optimizations
- **Code Splitting**: Components loaded on-demand
- **Lazy Loading**: Images dan heavy components
- **Memoization**: Expensive calculations cached
- **Debouncing**: Form inputs dengan delay

### Bundle Size
- **Vendors**: React, React-DOM, DFX Agent
- **Assets**: SCSS, Images, Icons
- **Estimated**: ~200KB gzipped

## 🔌 Backend Integration

### API Calls
```jsx
// Create proposal
const result = await voting_app_backend.createProposal(title, description, options);

// Vote on proposal
const result = await voting_app_backend.vote(proposalId, optionIndex);

// Get proposals
const proposals = await voting_app_backend.getActiveProposals();

// Get vote results
const result = await voting_app_backend.getVoteResults(proposalId);
```

### Error Handling
- Network errors dengan retry mechanism
- Backend errors dengan user-friendly messages
- Loading states untuk semua async operations
- Validation errors dengan inline messages

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- State management
- Event handlers
- Utility functions

### Integration Tests
- Component interactions
- API calls
- Form submissions
- Navigation flow

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance metrics

## 📦 Dependencies

### Core
- **React**: ^18.2.0
- **React-DOM**: ^18.2.0
- **@dfinity/agent**: ^2.1.3
- **@dfinity/candid**: ^2.1.3
- **@dfinity/principal**: ^2.1.3

### Development
- **Vite**: ^4.3.9
- **SASS**: ^1.63.6
- **TypeScript**: ^5.1.3
- **@vitejs/plugin-react**: ^4.0.1

## 🚀 Build & Deploy

### Development
```bash
npm install
npm start
```

### Production Build
```bash
npm run build
dfx deploy voting_app_frontend
```

### Environment Variables
```bash
# Development
VITE_DFX_NETWORK=local

# Production
VITE_DFX_NETWORK=ic
```

## 🔐 Security

### Best Practices
- **Input Validation**: Semua form input divalidasi
- **XSS Prevention**: Sanitasi user input
- **CSRF Protection**: Token-based authentication
- **Content Security Policy**: Headers configured

### ICP-Specific Security
- **Principal Validation**: Identity verification
- **Canister Calls**: Secure inter-canister communication
- **Asset Security**: Proper asset canister configuration

## 🎯 Future Enhancements

### Planned Features
1. **Dark Mode**: Theme switching
2. **Notifications**: Real-time updates
3. **Advanced Charts**: Better data visualization
4. **Internationalization**: Multi-language support
5. **PWA**: Progressive Web App capabilities
6. **Accessibility**: WCAG compliance

### Performance Improvements
1. **Virtual Scrolling**: Large proposal lists
2. **Image Optimization**: Lazy loading dan compression
3. **Service Worker**: Offline functionality
4. **Bundle Analysis**: Size optimization

## 📊 Analytics

### Metrics to Track
- **User Engagement**: Time on page, bounce rate
- **Feature Usage**: Most used features
- **Performance**: Load times, bundle size
- **Errors**: Error rates dan types

### Tools
- **Core Web Vitals**: Performance monitoring
- **User Analytics**: Behavior tracking
- **Error Tracking**: Bug reporting

---

**Last Updated**: July 13, 2025
**Version**: 1.0.0
