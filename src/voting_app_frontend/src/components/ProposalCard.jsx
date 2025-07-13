import React, { useState } from 'react';

const ProposalCard = ({ proposal, onVote, onViewResults, hasVoted, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [voteResults, setVoteResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleVote = async () => {
    if (selectedOption !== null) {
      await onVote(proposal.id, selectedOption);
      setSelectedOption(null);
    }
  };

  const handleViewResults = async () => {
    if (!showResults) {
      try {
        setLoadingResults(true);
        console.log('Fetching results for proposal:', proposal.id);
        const results = await onViewResults(proposal.id);
        console.log('Results received:', results);
        
        if (results) {
          setVoteResults(results);
          setShowResults(true);
        } else {
          console.error('No results received');
          alert('Gagal memuat hasil voting');
        }
      } catch (error) {
        console.error('Error in handleViewResults:', error);
        alert('Terjadi kesalahan saat memuat hasil');
      } finally {
        setLoadingResults(false);
      }
    } else {
      setShowResults(false);
      setVoteResults(null);
    }
  };

  const formatDate = (timestamp) => {
    try {
      // Convert nanoseconds to milliseconds
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (!proposal) {
    return (
      <div className="card proposal-card">
        <div className="empty-state">
          <p>Proposal tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card proposal-card fade-in">
      <div className="proposal-header">
        <div>
          <h3>{proposal.title || 'Untitled Proposal'}</h3>
          <div className="proposal-meta">
            <small>Dibuat: {formatDate(proposal.createdAt)}</small>
          </div>
        </div>
        <span className={`proposal-status ${proposal.isActive ? 'active' : 'inactive'}`}>
          {proposal.isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </div>
      
      <p className="proposal-description">{proposal.description || 'Tidak ada deskripsi'}</p>
      
      {proposal.isActive && !hasVoted && proposal.options && (
        <div className="proposal-options">
          <h4 className="mb-2">Pilih opsi:</h4>
          {proposal.options.map((option, index) => (
            <div
              key={index}
              className={`option ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => setSelectedOption(index)}
            >
              <div className="option-text">
                <input
                  type="radio"
                  name={`proposal-${proposal.id}`}
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  style={{ marginRight: '0.5rem' }}
                />
                {option}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasVoted && (
        <div className="mb-2">
          <span className="btn btn-success btn-small">✓ Anda sudah memberikan suara</span>
        </div>
      )}

      <div className="proposal-actions">
        {proposal.isActive && !hasVoted && proposal.options && (
          <button
            className="btn btn-primary"
            onClick={handleVote}
            disabled={selectedOption === null || isLoading}
          >
            {isLoading ? 'Memproses...' : '🗳️ Vote'}
          </button>
        )}
        
        <button
          className="btn btn-secondary"
          onClick={handleViewResults}
          disabled={isLoading || loadingResults}
        >
          {loadingResults ? '⏳ Memuat...' : showResults ? '🔼 Sembunyikan Hasil' : '📊 Lihat Hasil'}
        </button>
      </div>

      {showResults && (
        <div className="vote-results">
          {voteResults ? (
            <>
              <div className="total-votes">
                <h4>📊 Hasil Voting</h4>
                <p>Total Suara: {Number(voteResults.totalVotes) || 0}</p>
              </div>
              {voteResults.results && voteResults.results.length > 0 ? (
                voteResults.results.map(([option, count], index) => {
                  const totalVotes = Number(voteResults.totalVotes) || 0;
                  const voteCount = Number(count) || 0;
                  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <span className="result-option">{option}</span>
                        <span className="result-count">
                          {voteCount} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="result-bar">
                        <div 
                          className="result-fill" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <p>Belum ada suara untuk proposal ini</p>
                </div>
              )}
            </>
          ) : (
            <div className="loading-results">
              <p>Memuat hasil voting...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalCard;
