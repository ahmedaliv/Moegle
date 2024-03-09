import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";

interface FormProps {
  setVideoChat: Dispatch<SetStateAction<boolean>>;
}

// type ServerToClientEvents = {
//   matched: (data: { type: string; initiator: boolean }) => void;
//   offer: (offer: RTCSessionDescriptionInit) => void;
//   answer: (answer: RTCSessionDescriptionInit) => void;
//   icecandidate: (candidate: RTCIceCandidateInit) => void;
// };

// type ClientToServerEvents = {
//   join: () => void;
//   offer: (offer: RTCSessionDescriptionInit) => void;
//   answer: (answer: RTCSessionDescriptionInit) => void;
//   icecandidate: (candidate: RTCIceCandidateInit) => void;
// };
let socket;
const Form = ({ setVideoChat }: FormProps) => {
  const handleVideoChat = () => setVideoChat(true);
  return (
    <div className="flex flex-row justify-center gap-4 mt-5">
      <Button className="text-md" size="lg" onClick={handleVideoChat}>
        Start a Video Chat
      </Button>
    </div>
  );
};

export default Form;
