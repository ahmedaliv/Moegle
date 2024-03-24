import { playMatchNotification } from "@/lib/sound-utils";
import { createOffer, handleAnswer, handleIceCandidate, handleOffer } from "@/lib/webrtc";
import { ClientToServerEvents, ServerToClientEvents } from "@/lib/webrtc/types";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = ({
  peerConnection,
  localStreamRef,
  setChatChannel,
}: {
  peerConnection: React.MutableRefObject<RTCPeerConnection | undefined>;
  localStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  setChatChannel: React.Dispatch<
    React.SetStateAction<RTCDataChannel | undefined>
  >;
}) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `${process.env.NEXT_PUBLIC_SOCKETIO_URL}`
    );
    socketRef.current = socket;
    // Event listeners for the socket

    socket.on("connect", () => {
      console.log("WS connected");
    });

    socket.on(
      "matched",
      ({ type, initiator }: { type: string; initiator: boolean }) => {
        playMatchNotification();
        if (type === "video" && initiator) {
          console.log(`init man`);
          createOffer(peerConnection, socketRef, setChatChannel);
        }
      }
    );
    // handling ice candidates
    socket.on("receiveCandidate", (data) =>
      handleIceCandidate(peerConnection, data.candidate)
    );
    // handling the incoming offer
    socket.on("receiveOffer", async (data): Promise<void> => {
      console.log(`incoming offer `);
      handleOffer(data.offer, peerConnection, socketRef, localStreamRef,setChatChannel);
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
  return socketRef;
};

export default useSocket
