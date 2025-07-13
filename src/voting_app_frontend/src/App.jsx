import React, { useState, useEffect } from 'react';
import { voting_app_backend } from 'declarations/voting_app_backend';
import Header from './components/Header';
import ProposalsList from './components/ProposalsList';
import CreateProposal from './components/CreateProposal';
import MyVotes from './components/MyVotes';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [currentView, setCurrentView] = useState('proposals');
  const [proposals, setProposals] = useState([]);
  const [myVotes, setMyVotes] = useState([]);
  const [votedProposals, setVotedProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load proposals first
      const proposalsResult = await voting_app_backend.getActiveProposals();
      console.log('Proposals loaded:', proposalsResult);
      setProposals(proposalsResult || []);
      
      // Then load votes and check voted proposals
      await Promise.all([
        loadMyVotes(),
        checkVotedProposals()
      ]);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProposals = async () => {
    try {
      const result = await voting_app_backend.getActiveProposals();
      console.log('Proposals loaded:', result);
      setProposals(result || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      setError('Failed to load proposals');
    }
  };

  const loadMyVotes = async () => {
    try {
      const result = await voting_app_backend.getUserVotes();
      console.log('My votes loaded:', result);
      setMyVotes(result || []);
    } catch (error) {
      console.error('Error loading my votes:', error);
      // Don't set error here as this might fail for new users
    }
  };

  const checkVotedProposals = async () => {
    try {
      const result = await voting_app_backend.getActiveProposals();
      const votedIds = [];
      
      for (const proposal of result || []) {
        try {
          const hasVoted = await voting_app_backend.hasVoted(proposal.id);
          if (hasVoted) {
            votedIds.push(proposal.id);
          }
        } catch (error) {
          console.error(`Error checking vote status for proposal ${proposal.id}:`, error);
        }
      }
      
      setVotedProposals(votedIds);
    } catch (error) {
      console.error('Error checking voted proposals:', error);
    }
  };

  const handleCreateProposal = async (title, description, options) => {
    try {
      setLoadingStates(prev => ({ ...prev, create: true }));
      
      const result = await voting_app_backend.createProposal(title, description, options);
      
      if (result.ok) {
        console.log('Proposal created successfully:', result.ok);
        await loadProposals(); // Reload proposals
        setCurrentView('proposals'); // Switch to proposals view
        return true;
      } else {
        console.error('Error creating proposal:', result.err);
        throw new Error('Failed to create proposal');
      }
    } catch (error) {
      console.error('Error in handleCreateProposal:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, create: false }));
    }
  };

  const handleVote = async (proposalId, optionIndex) => {
    try {
      setLoadingStates(prev => ({ ...prev, [proposalId]: true }));
      
      const result = await voting_app_backend.vote(proposalId, optionIndex);
      
      if (result.ok) {
        console.log('Vote successful:', result.ok);
        // Update voted proposals
        setVotedProposals(prev => [...prev, proposalId]);
        // Reload my votes
        await loadMyVotes();
        alert('Vote berhasil dicatat!');
      } else {
        console.error('Error voting:', result.err);
        let errorMessage = 'Gagal memberikan suara';
        
        if (result.err.AlreadyVoted) {
          errorMessage = 'Anda sudah memberikan suara pada proposal ini';
        } else if (result.err.NotFound) {
          errorMessage = 'Proposal tidak ditemukan';
        } else if (result.err.InvalidOption) {
          errorMessage = 'Opsi yang dipilih tidak valid';
        } else if (result.err.ProposalNotActive) {
          errorMessage = 'Proposal sudah tidak aktif';
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error in handleVote:', error);
      alert('Terjadi kesalahan saat memberikan suara');
    } finally {
      setLoadingStates(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const handleViewResults = async (proposalId) => {
    try {
      const result = await voting_app_backend.getVoteResults(proposalId);
      
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Error getting vote results:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Error in handleViewResults:', error);
      return null;
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setError(null);
    
    // Reload data when switching views
    if (view === 'proposals') {
      loadProposals();
      checkVotedProposals();
    } else if (view === 'my-votes') {
      loadMyVotes();
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <Header currentView={currentView} onViewChange={handleViewChange} />
        <LoadingSpinner message="Memuat data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header currentView={currentView} onViewChange={handleViewChange} />
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Terjadi Kesalahan</h3>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={loadInitialData}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="main-content">
        {currentView === 'proposals' && (
          <ProposalsList
            proposals={proposals}
            onVote={handleVote}
            onViewResults={handleViewResults}
            votedProposals={votedProposals}
            isLoading={false}
            loadingStates={loadingStates}
          />
        )}
        
        {currentView === 'create' && (
          <CreateProposal
            onCreateProposal={handleCreateProposal}
            isLoading={loadingStates.create || false}
          />
        )}
        
        {currentView === 'my-votes' && (
          <MyVotes
            votes={myVotes}
            proposals={proposals}
            isLoading={false}
          />
        )}
      </main>
    </div>
  );
}

export default App;
