export type ServerToClientEvents   = {
  matched: (data: { type: string; initiator: boolean }) => void;
  receiveOffer: (data:{offer:RTCSessionDescriptionInit}) => void;
  answerReceivedFromServer: (data:{answer:RTCSessionDescriptionInit}) => void;
  receiveCandidate: (data:{candidate:RTCIceCandidateInit}) => void;
};

export type ClientToServerEvents = {
  offerToRemote: (data:{offer:RTCSessionDescriptionInit}) => void;
  answerSentToServer: (data:{answer:RTCSessionDescriptionInit}) => void;
  candidateToServer: (data: { candidate: RTCIceCandidateInit }) => void;
  next: () => void;
};
