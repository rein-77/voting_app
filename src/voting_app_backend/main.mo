import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

actor VotingApp {
  
  // Tipe data untuk proposal polling
  public type Proposal = {
    id: Nat;
    title: Text;
    description: Text;
    options: [Text];
    creator: Principal;
    createdAt: Int;
    isActive: Bool;
  };

  // Tipe data untuk suara
  public type Vote = {
    proposalId: Nat;
    voter: Principal;
    option: Nat; // Index dari option yang dipilih
    timestamp: Int;
  };

  // Tipe data untuk hasil voting
  public type VoteResult = {
    proposalId: Nat;
    results: [(Text, Nat)]; // (option, vote count)
    totalVotes: Nat;
  };

  // Tipe data untuk error
  public type Error = {
    #NotFound;
    #AlreadyVoted;
    #InvalidOption;
    #ProposalNotActive;
    #Unauthorized;
  };

  // State variables
  private stable var nextProposalId: Nat = 0;
  private stable var proposalEntries: [(Nat, Proposal)] = [];
  private stable var voteEntries: [(Text, Vote)] = []; // Key: proposalId#voter

  // Helper function untuk hash Nat
  private func natHash(n: Nat): Hash.Hash {
    Text.hash(Nat.toText(n))
  };

  // HashMaps untuk storage
  private var proposals = HashMap.HashMap<Nat, Proposal>(0, Nat.equal, natHash);
  private var votes = HashMap.HashMap<Text, Vote>(0, Text.equal, Text.hash);

  // Restore state after upgrade
  system func preupgrade() {
    proposalEntries := Iter.toArray(proposals.entries());
    voteEntries := Iter.toArray(votes.entries());
  };

  system func postupgrade() {
    proposals := HashMap.fromIter<Nat, Proposal>(proposalEntries.vals(), proposalEntries.size(), Nat.equal, natHash);
    votes := HashMap.fromIter<Text, Vote>(voteEntries.vals(), voteEntries.size(), Text.equal, Text.hash);
    proposalEntries := [];
    voteEntries := [];
  };

  // Helper function untuk generate vote key
  private func generateVoteKey(proposalId: Nat, voter: Principal): Text {
    Nat.toText(proposalId) # "#" # Principal.toText(voter)
  };

  // Fungsi untuk membuat proposal baru
  public shared(msg) func createProposal(title: Text, description: Text, options: [Text]): async Result.Result<Proposal, Error> {
    let caller = msg.caller;
    let proposal: Proposal = {
      id = nextProposalId;
      title = title;
      description = description;
      options = options;
      creator = caller;
      createdAt = Time.now();
      isActive = true;
    };
    
    proposals.put(nextProposalId, proposal);
    nextProposalId += 1;
    
    #ok(proposal)
  };

  // Fungsi untuk mendapatkan semua proposal aktif
  public query func getActiveProposals(): async [Proposal] {
    let activeProposals = Array.filter<Proposal>(
      Iter.toArray(proposals.vals()),
      func(proposal: Proposal): Bool { proposal.isActive }
    );
    activeProposals
  };

  // Fungsi untuk mendapatkan proposal berdasarkan ID
  public query func getProposal(proposalId: Nat): async Result.Result<Proposal, Error> {
    switch(proposals.get(proposalId)) {
      case null { #err(#NotFound) };
      case (?proposal) { #ok(proposal) };
    }
  };

  // Fungsi untuk memberikan suara
  public shared(msg) func vote(proposalId: Nat, optionIndex: Nat): async Result.Result<Text, Error> {
    let caller = msg.caller;
    let voteKey = generateVoteKey(proposalId, caller);
    
    // Cek apakah proposal ada
    switch(proposals.get(proposalId)) {
      case null { return #err(#NotFound) };
      case (?proposal) {
        // Cek apakah proposal masih aktif
        if (not proposal.isActive) {
          return #err(#ProposalNotActive);
        };
        
        // Cek apakah option valid
        if (optionIndex >= proposal.options.size()) {
          return #err(#InvalidOption);
        };
        
        // Cek apakah user sudah voting
        switch(votes.get(voteKey)) {
          case (?_) { return #err(#AlreadyVoted) };
          case null {
            // Buat vote baru
            let vote: Vote = {
              proposalId = proposalId;
              voter = caller;
              option = optionIndex;
              timestamp = Time.now();
            };
            
            votes.put(voteKey, vote);
            #ok("Vote berhasil dicatat!")
          };
        };
      };
    }
  };

  // Fungsi untuk mendapatkan hasil voting
  public query func getVoteResults(proposalId: Nat): async Result.Result<VoteResult, Error> {
    switch(proposals.get(proposalId)) {
      case null { #err(#NotFound) };
      case (?proposal) {
        var results: [(Text, Nat)] = [];
        var totalVotes: Nat = 0;
        
        // Hitung votes untuk setiap option
        for (i in Iter.range(0, proposal.options.size() - 1)) {
          let optionText = proposal.options[i];
          var count: Nat = 0;
          
          // Count votes untuk option ini
          for (vote in votes.vals()) {
            if (vote.proposalId == proposalId and vote.option == i) {
              count += 1;
            };
          };
          
          results := Array.append(results, [(optionText, count)]);
          totalVotes += count;
        };
        
        let result: VoteResult = {
          proposalId = proposalId;
          results = results;
          totalVotes = totalVotes;
        };
        
        #ok(result)
      };
    }
  };

  // Fungsi untuk cek apakah user sudah voting
  public shared query(msg) func hasVoted(proposalId: Nat): async Bool {
    let caller = msg.caller;
    let voteKey = generateVoteKey(proposalId, caller);
    
    switch(votes.get(voteKey)) {
      case null { false };
      case (?_) { true };
    }
  };

  // Fungsi untuk menonaktifkan proposal (hanya creator yang bisa)
  public shared(msg) func deactivateProposal(proposalId: Nat): async Result.Result<Text, Error> {
    let caller = msg.caller;
    
    switch(proposals.get(proposalId)) {
      case null { #err(#NotFound) };
      case (?proposal) {
        if (proposal.creator != caller) {
          return #err(#Unauthorized);
        };
        
        let updatedProposal: Proposal = {
          id = proposal.id;
          title = proposal.title;
          description = proposal.description;
          options = proposal.options;
          creator = proposal.creator;
          createdAt = proposal.createdAt;
          isActive = false;
        };
        
        proposals.put(proposalId, updatedProposal);
        #ok("Proposal berhasil dinonaktifkan")
      };
    }
  };

  // Fungsi untuk mendapatkan total jumlah proposal
  public query func getTotalProposals(): async Nat {
    proposals.size()
  };

  // Fungsi untuk mendapatkan vote history user
  public shared query(msg) func getUserVotes(): async [Vote] {
    let caller = msg.caller;
    let userVotes = Array.filter<Vote>(
      Iter.toArray(votes.vals()),
      func(vote: Vote): Bool { vote.voter == caller }
    );
    userVotes
  };

  // Fungsi test untuk greet (bisa dihapus nanti)
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "! Selamat datang di Voting DApp!";
  };
};
