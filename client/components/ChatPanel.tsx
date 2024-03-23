import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  init,
  handleNext,
} from "@/lib/webrtc";
import useSocket from "@/app/hooks/useSocket";

export default function ChatPanel() {
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const peerConnection = useRef<RTCPeerConnection | undefined>();
  const socketRef = useSocket({peerConnection,localStreamRef}) 

  useEffect(() => {
    if (!peerConnection.current) {
      init(peerConnection, localStreamRef, remoteStreamRef, socketRef);
    }
  }, []);

  return (
    <main className="flex flex-row justify-between max-h-screen">
      <div className="w-[34%] chat-video-container flex items-stretch">
        <div className="flex flex-col w-full">
          <video
            ref={localStreamRef}
            className="bg-neutral-700"
            autoPlay
            muted
          ></video>
          <video
            id="remoteUser"
            className="bg-neutral-700 border-t-2 border-white"
            autoPlay
            playsInline
            ref={remoteStreamRef}
          ></video>
        </div>
      </div>
      <hr />
      <div className="w-[64%] chat-text-container flex flex-col">
        <div className="chat-box w-full">
          <p>You are now chatting with a random stranger</p>
          <p>You both speak the same language - English </p>
          <hr className="mt-2" />
        </div>
        <div className="messages-area flex-1 overflow-auto">
          {/* Add your messages here */}
        </div>
        <div className="text-chat-area flex flex-row gap-3 mt-3 items-center">
          <Button
            size="lg"
            variant="outline"
            className="h-full"
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
          <Button size="lg" variant="outline" className="h-full">
            {" "}
            Send{" "}
          </Button>
        </div>
      </div>
    </main>
  );
}
