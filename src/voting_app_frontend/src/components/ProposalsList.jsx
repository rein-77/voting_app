import React from 'react';
import ProposalCard from './ProposalCard';

const ProposalsList = ({ 
  proposals, 
  onVote, 
  onViewResults, 
  votedProposals, 
  isLoading,
  loadingStates 
}) => {
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Belum ada proposal</h3>
          <p>Jadilah yang pertama membuat proposal voting!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-3">
        <h2>📋 Daftar Proposal ({proposals.length})</h2>
        <p>Pilih proposal untuk memberikan suara atau lihat hasil voting</p>
      </div>
      
      <div className="grid grid-2">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onVote={onVote}
            onViewResults={onViewResults}
            hasVoted={votedProposals.includes(proposal.id)}
            isLoading={loadingStates[proposal.id] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default ProposalsList;
