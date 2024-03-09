import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { io } from "socket.io-client";
import { Socket } from "socket.io";

function ChatPanel() {
  const PORT = 3005;
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef<Socket>();
  const peerConnection = useRef<RTCPeerConnection>();
    const ICE_SERVERS = {
    iceServers: [
      {
        urls: 'stun:openrelay.metered.ca:80',
      }
    ],
  };
  const handleTrackEvent = (event) => {
   console.log("track event", event.streams);
    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = event.streams[0];
    console.log(remoteStreamRef.current.srcObject);
    
    }
  };
useEffect(() => {
  peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
  console.log("peer connection created");

  // Create a data channel
  let dataChannel = peerConnection.current.createDataChannel("chat");

  // Handle incoming messages
  dataChannel.onmessage = (event) => {
    console.log("Received message:", event.data);
  };
  // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  //   console.log(stream);
  //   setLocalStream(stream);
  //   stream.getTracks().forEach((track) => {
  //     peerConnection.current?.addTrack(track, stream);
  //     console.log(`track added to peer connection ${track.id}`);
  //   });
  // });

  peerConnection.current.onicecandidate = (event) => {
    console.log("ice candidate emitted");
    if (event.candidate) {
      // Send the candidate to the other peer
      socketRef.current.emit("ice-candidate", event.candidate);
    }
  };

  // After the connection is established, send a message
  peerConnection.current.onconnectionstatechange = (event) => {
    console.log(`connection state changed `);
    if (peerConnection?.current.connectionState === "connected") {
      dataChannel.send("Hello, peer!");
    }
  };
}, []);
  useEffect(() => {
    console.log(`state -> ${peerConnection.current?.connectionState}`);
    
  }, [peerConnection]);
  
  // useEffect(() => {
  //   if (localStream) {
  //     const localVideo = document.getElementById('localUser') as HTMLVideoElement;
  //     localVideo.srcObject = localStream;
  //   }
  // }, [localStream]);

  useEffect(() => {
    const socket = io(`:${PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
      retries: 3,
    });

    socketRef.current = socket;
    socket.on("connect", () => {
      // console.log("connected");
    });
    
    socket.on('matched', ({ type, initiator }: { type: string; initiator: boolean }) => {
          if (type === 'video' && initiator) {
            console.log(`init man`);
            createOffer();
          }
    });

    socket.on("offer", async (offer) => {
      // handling the incoming offer
      console.log(`incoming offer `);
      handleOffer(offer);
    });

    socket.on("answer", (answer) => { handleAnswer(answer) });

    // handling ice candidates
    socket.on("ice-candidate", (candidate) => handleIceCandidate(candidate));

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      await fetch("/api/socket");
    });
    return () => {
      socket.disconnect();
    };
  },[])


  const createOffer = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    socketRef.current?.emit("offer", offer);
    console.log("offer emitted");
  };
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    await peerConnection?.current?.setRemoteDescription(offer);
    const answer = await peerConnection?.current?.createAnswer();
    await peerConnection?.current?.setLocalDescription(answer);
    socketRef.current.emit("answer", answer);
  };

const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
  await peerConnection?.current?.setRemoteDescription(answer);
  console.log("Answer received");

  // if (peerConnection?.current) {
  //   peerConnection.current.ontrack = (event) => {
  //     console.log("Ontrack event", event);
  //     // setRemoteStream(event.streams[0]);
  //   };
  // }
};


  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    await peerConnection?.current?.addIceCandidate(candidate);
    // console.log("ice candidate added");
    
  };
  
  return (
    <main className="flex flex-row justify-between max-h-screen">
      <div className="w-[34%] chat-video-container flex items-stretch">
        <div className="flex flex-col w-full">
          <video
            id="localUser"
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
