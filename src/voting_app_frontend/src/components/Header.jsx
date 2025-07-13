import React from 'react';

const Header = ({ currentView, onViewChange }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src="/logo2.svg" alt="Voting DApp" />
          <h1>Voting DApp</h1>
        </div>
        
        <nav className="nav">
          <button 
            className={currentView === 'proposals' ? 'active' : ''}
            onClick={() => onViewChange('proposals')}
          >
            📋 Daftar Proposal
          </button>
          <button 
            className={currentView === 'create' ? 'active' : ''}
            onClick={() => onViewChange('create')}
          >
            ➕ Buat Proposal
          </button>
          <button 
            className={currentView === 'my-votes' ? 'active' : ''}
            onClick={() => onViewChange('my-votes')}
          >
            🗳️ Riwayat Vote
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
