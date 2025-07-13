import React from 'react';

const MyVotes = ({ votes, proposals, isLoading }) => {
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!votes || votes.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🗳️</div>
          <h3>Belum ada riwayat voting</h3>
          <p>Anda belum memberikan suara pada proposal apapun</p>
        </div>
      </div>
    );
  }

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

  const getProposalById = (proposalId) => {
    if (!proposals || !Array.isArray(proposals)) {
      return null;
    }
    return proposals.find(p => Number(p.id) === Number(proposalId));
  };

  return (
    <div className="container">
      <div className="mb-3">
        <h2>🗳️ Riwayat Voting Anda</h2>
        <p>Berikut adalah daftar proposal yang telah Anda vote ({votes.length} vote)</p>
      </div>

      <div className="grid grid-2">
        {votes.map((vote, index) => {
          const proposal = getProposalById(vote.proposalId);
          const selectedOption = proposal && proposal.options 
            ? proposal.options[vote.option] 
            : `Opsi ${vote.option}`;
          
          return (
            <div key={index} className="card fade-in">
              <div className="proposal-header">
                <div>
                  <h3>{proposal ? proposal.title : `Proposal ID: ${vote.proposalId}`}</h3>
                  <div className="proposal-meta">
                    <small>Voted: {formatDate(vote.timestamp)}</small>
                  </div>
                </div>
                <span className="proposal-status active">
                  Voted
                </span>
              </div>
              
              {proposal && (
                <p className="proposal-description">{proposal.description}</p>
              )}
              
              <div className="vote-choice">
                <div className="flex items-center gap-2 mb-2">
                  <span className="btn btn-success btn-small">✓ Pilihan Anda:</span>
                </div>
                <div className="option selected">
                  <div className="option-text">
                    <strong>{selectedOption}</strong>
                  </div>
                </div>
              </div>
              
              <div className="proposal-actions">
                <small style={{ color: '#718096' }}>
                  Proposal ID: {vote.proposalId} | Option Index: {vote.option}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyVotes;
