
export interface Candidate {
  id: string;
  name: string;
  votes: number;
  image: string;
  bio: string;
}

export interface Activity {
  id: string;
  userName: string;
  candidateName: string;
  timestamp: number;
}

export interface VoteData {
  whatsapp: string;
  fullName: string;
  candidateId: string;
}

export type VotingStatus = 'ongoing' | 'ended' | 'upcoming';
