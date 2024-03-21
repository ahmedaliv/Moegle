import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { io,Socket } from "socket.io-client";
import { handleAnswer, handleIceCandidate, init, createOffer , handleOffer} from "@/lib/webrtc"
import {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@/lib/webrtc/types";


function ChatPanel() {
  const PORT = 3005;
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const peerConnection = useRef<RTCPeerConnection | undefined>();

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents>
      = io(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}`);
    socketRef.current = socket;
    if (!peerConnection.current) {
      init(
        peerConnection,
        localStreamRef,
        remoteStreamRef,
        socketRef
      );
    }

    // Event listeners for the socket
    
      socket.on("connect", () => {
        console.log("WS connected");
      });

      socket.on(
        "matched",
        ({ type, initiator }: { type: string; initiator: boolean }) => {
          playMatchSound();
          if (type === "video" && initiator) {
            console.log(`init man`);
            createOffer(peerConnection, socketRef);
          }
        }
      );
      // handling ice candidates
    socket.on("receiveCandidate", (data) => handleIceCandidate(peerConnection, data.candidate));
      // handling the incoming offer
      socket.on("receiveOffer", async (data):Promise<void> => {
        console.log(`incoming offer `);
        handleOffer(data.offer, peerConnection, socketRef,localStreamRef);
      });
      // handling the incoming answer
      socket.on("answerReceivedFromServer", async (data) => {
        handleAnswer(peerConnection, data.answer);
      });

      // handling the socket connection error (reconnect)
      socket.on("connect_error", async (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      
      return () => {
        socket.disconnect();
      };
  }, []);

  const handleNext = () => { 
    // close current connection with the peer
    if (peerConnection.current) {
      peerConnection.current.ontrack = null;
      peerConnection.current.onicecandidate = null;
      peerConnection.current.oniceconnectionstatechange = null;
      peerConnection.current?.close();
      peerConnection.current = undefined;
      console.log('resetting');
    }
    
    if(remoteStreamRef.current) remoteStreamRef.current.srcObject = null
    // init again
    init(peerConnection, localStreamRef, remoteStreamRef, socketRef);
    socketRef.current?.emit("next");
  }
  const playMatchSound = () => {
    const audio = new Audio("/sounds/match-notification.wav");
    audio.addEventListener(
      "canplaythrough",
      () => {
        audio.play();
      },
      { once: true }
    );
  };
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
          <Button size="lg" variant="outline" className="h-full" onClick={()=>handleNext()}>
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

export default ChatPanel;
