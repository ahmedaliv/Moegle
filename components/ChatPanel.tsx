import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { io } from "socket.io-client";
import { Socket } from "socket.io";

// type ServerToClientEvents   = {
//   matched: (data: { type: string; initiator: boolean }) => void;
//   receiveOffer: (data:{offer:RTCSessionDescriptionInit}) => void;
//   answerReceivedFromServer: (data:{answer:RTCSessionDescriptionInit}) => void;
//   receiveCandidate: (data:{candidate:RTCIceCandidateInit}) => void;
// };

// type ClientToServerEvents = {
//   offerToRemote: (data:{offer:RTCSessionDescriptionInit}) => void;
//   answerSentToServer: (data:{answer:RTCSessionDescriptionInit}) => void;
//   candidateToServer: (data:{candidate:RTCIceCandidateInit}) => void;
// };

function ChatPanel() {
  const PORT = process.env.PORT ? Number(process.env.PORT) + 5 : 3005;
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const socketRef = useRef<Socket>(null);
  const peerConnection = useRef<RTCPeerConnection>();
  const ICE_SERVERS = {
    iceServers: [
      {
        urls: [
          "stun:stun1.1.google.com:19302",
          "stun:stun2.1.google.com:19302",
        ],
      },
    ],
  };

  const handleTrackEvent = async (event: any) => {
    console.log("track event", event.streams);
    let rS = new MediaStream();
    if (remoteStreamRef.current) {
      console.log(rS);
      remoteStreamRef.current.srcObject = rS;
      console.log('added to remoteRef');
 
    }
    console.log(`track event -> event`);

    event.streams[0].getTracks().forEach((track: any) => {
      rS.addTrack(track);
    });
  };

  useEffect(() => {
    if (!peerConnection.current) {
      init();
    }
      const socket = io(`:${PORT}`, {
        path: "/api/socket",
        addTrailingSlash: false,
      
      });

      socketRef.current = socket;
      // setSocket(socket);
      socket.on("connect", () => {
        console.log("WS connected");
      });

      socket.on(
        "matched",
        ({ type, initiator }: { type: string; initiator: boolean }) => {
          if (type === "video" && initiator) {
            console.log(`init man`);
            createOffer();
          }
        }
      );
      // handling ice candidates
      socket.on("receiveCandidate", (data) => handleIceCandidate(data.candidate));
        
      socket.on("receiveOffer", async (data) => {
        // handling the incoming offer
        console.log(`incoming offer `);
        handleOffer(data.offer);
      });

      socket.on("answerReceivedFromServer", (data) => {
        handleAnswer(data.answer);
      });


      socket.on("connect_error", async (err) => {
        console.log(`connect_error due to ${err.message}`);
        await fetch("/api/socket");
      });
      
      return () => {
        socket.disconnect();
      };
  }, []);
  const init = async () => {
    peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
    console.log(`created peer connection`);
    peerConnection.current.ontrack = handleTrackEvent;
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    }
    );
    if (localStreamRef.current) {
      localStreamRef.current.srcObject = localStream;
    }
    console.log(`local stream added.`);
    
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice candidate event");
        // Send the candidate to the other peer
        if (socketRef.current) {
          if (socketRef.current.connected) {
            console.log(`ice candidate sent to the server`);
            console.log(event.candidate);
            console.log(socketRef.current);
            socketRef.current.emit("candidateToServer", {
              candidate: event.candidate,
            });
          } else {
            console.error("Socket is not connected");
          }
        }
      }
    };
  };

  const createOffer = async () => {
    const offer = await peerConnection.current?.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
    await peerConnection.current?.setLocalDescription(offer);
    if (offer ) {
      socketRef.current?.emit("offerToRemote", {
      offer
      });
    }
    console.log("offer emitted"+ offer?.sdp);
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    await peerConnection?.current?.setRemoteDescription(offer);
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice candidate event");
        // Send the candidate to the other peer
        if (socketRef.current) {
          if (socketRef.current.connected) {
            console.log(`ice candidate sent to the server`);
            console.log(event.candidate);
            console.log(socketRef.current);
            socketRef.current.emit("candidateToServer", {
              candidate: event.candidate,
            });
          } else {
            console.error("Socket is not connected");
          }
        }
      }
    }
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    }
    );
    if (localStreamRef.current) {
      localStreamRef.current.srcObject = localStream;
    }
    console.log(`local stream added.`);

    const answer = await peerConnection?.current?.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    console.log("Answer created" + answer?.sdp);
    
    await peerConnection?.current?.setLocalDescription(answer);
    if (answer) {
      socketRef.current?.emit("answerSentToServer", {
        answer: answer,
      });
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerConnection?.current?.setRemoteDescription(answer);
    console.log("Answer received");
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    await peerConnection?.current?.addIceCandidate(candidate);
    console.log("ice candidate added");
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
          <Button size="lg" variant="outline" className="h-full">
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
