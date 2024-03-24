import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { init, handleNext } from "@/lib/webrtc";
import useSocket from "@/app/hooks/useSocket";
import MobileVideoChat from "./VideoChat/MobileVideoChat";
import WebVideoChat from "./VideoChat/WebVideoChat";
import TextChat from "./TextChat";

export default function ChatPanel() {
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | undefined>();
  const [chatChannel, setChatChannel] = useState<RTCDataChannel | undefined>();

  const socketRef = useSocket({
    peerConnection,
    localStreamRef,
    setChatChannel,
  });
  useEffect(() => {
    if (!peerConnection.current) {
      init(peerConnection, localStreamRef, remoteStreamRef, socketRef);
    }
  }, []);

  // check if mobile device
  const isMobile = window.innerWidth < 768;
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
      <div className="w-[100%] sm:w-[73%] flex flex-col items-center h-[47vh] sm:h-[80vh] mt-4 sm:mt-0">
        {!isMobile && (
          <div className="text-[10px] sm:text-[15px] w-full text-center">
            <p>You are now chatting with a random stranger</p>
            <p>You both speak the same language - English </p>
            <hr className="mt-2" />
          </div>
        )}
        <TextChat
          className="sm:mt-3"
          peerConnection={peerConnection}
          localStreamRef={localStreamRef}
          remoteStreamRef={remoteStreamRef}
          socketRef={socketRef}
          chatChannel={chatChannel} />
        </div> 
    </main>
  );
}
