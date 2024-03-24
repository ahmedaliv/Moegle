import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { init, handleNext } from "@/lib/webrtc";
import useSocket from "@/app/hooks/useSocket";
import MobileVideoChat from "./VideoChat/MobileVideoChat";
import WebVideoChat from "./VideoChat/WebVideoChat";

export default function ChatPanel() {
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const peerConnection = useRef<RTCPeerConnection | undefined>();
  const socketRef = useSocket({ peerConnection, localStreamRef });

  useEffect(() => {
    if (!peerConnection.current) {
      init(peerConnection, localStreamRef, remoteStreamRef, socketRef);
    }
  }, []);
  // check if mobile device
  const isMobile = window.innerWidth < 768; // Example threshold for mobile devices
  if (isMobile) {
    console.log("Mobile device detected");
  } else {
    console.log("Desktop device detected");
  }
  return (
    <main className="flex flex-col sm:flex-row justify-between">
      {isMobile ? (
        <MobileVideoChat
          localStreamRef={localStreamRef}
          remoteStreamRef={remoteStreamRef}
        />
      ) : (
        <WebVideoChat
          localStreamRef={localStreamRef}
          remoteStreamRef={remoteStreamRef}
        />
      )}
      <hr className="mt-2" />
      <div className="w-[100%] sm:w-[70%] flex flex-col items-center h-[47vh] sm:h-[80vh] mt-4 sm:mt-0">
        {!isMobile && (
          <div className="text-[10px] sm:text-[15px] w-full text-center">
            <p>You are now chatting with a random stranger</p>
            <p>You both speak the same language - English </p>
            <hr className="mt-2" />
          </div>
        )}
        <div className="flex flex-col items-center h-screen sm:mt-3">
          {/* Add your messages here */}
          <div className="message-container">
            <div className="message">
              <p className="text-[10px] sm:text-sm">Stranger: Hello</p>
            </div>
            <div className="message">
              <p className="text-[10px] sm:text-sm">You: Hi</p>
            </div>
          </div>
        </div>
        <div className="w-full sm:h-[80px] flex flex-row gap-3  justify-center items-center">
          <Button
            variant="default"
            className="h-full w-[25%] sm:w-[15%] rounded-sm"
            onClick={() =>
              handleNext(
                peerConnection,
                localStreamRef,
                remoteStreamRef,
                socketRef
              )
            }
          >
            Next
          </Button>
          <Textarea />
          <Button
            variant="outline"
            className=" w-[25%] sm:w-[15%] h-full rounded-sm"
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}
