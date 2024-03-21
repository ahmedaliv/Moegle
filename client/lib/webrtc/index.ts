import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/lib/webrtc/types";

const ICE_SERVERS = {
 iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "2750906d299ed597fb228d3b",
        credential: "XEm1rO/AIW1Ke9pH",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "2750906d299ed597fb228d3b",
        credential: "XEm1rO/AIW1Ke9pH",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "2750906d299ed597fb228d3b",
        credential: "XEm1rO/AIW1Ke9pH",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "2750906d299ed597fb228d3b",
        credential: "XEm1rO/AIW1Ke9pH",
      },
  ],
};

/**
 * Handles the firing of the ontrack event on the peer connection.
 *
 * @param event - The event object containing information about the track event.
 *
 * @returns void
 */

const handleTrackEvent = function (
  remoteStreamRef: MutableRefObject<HTMLVideoElement | null>
) {
  return (event: RTCTrackEvent) => {
    console.log("track event", event.streams);
    let rS = new MediaStream();
    if (remoteStreamRef.current) {
      console.log(rS);
      remoteStreamRef.current.srcObject = rS;
      console.log("added to remoteRef");
    }
    console.log(`track event -> event`);

    event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
      rS.addTrack(track);
    });
  };
};

/**
 * Initializes the WebRTC connection.
 *
 * @param peerConnectionRef - A mutable reference to the RTCPeerConnection object.
 * @param localStreamRef - A mutable reference to the local media stream object.
 * @param socketRef - A mutable reference to the WebSocket object.
 *
 * @returns void
 */
export const init = async (
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>,
  localStreamRef: MutableRefObject<HTMLVideoElement | null>,
  remoteStreamRef: MutableRefObject<HTMLVideoElement | null>,
  socketRef: MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null> // Update the type here
) => {
  peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
  console.log(`created peer connection`);
  // Handle ice connection state change
  peerConnection.current.oniceconnectionstatechange = () => {
    if (
      peerConnection.current?.iceConnectionState === "disconnected" ||
      peerConnection.current?.iceConnectionState === "closed"
    ) {
      // Disable remote stream
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = null;
      }
      console.log("Peer disconnected");
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
    }
  };
  peerConnection.current.ontrack = handleTrackEvent(remoteStreamRef);
  const localStream = await navigator.mediaDevices.getUserMedia({
    video:true, 
    audio: true,
  });
  localStream.getTracks().forEach((track) => {
    peerConnection.current?.addTrack(track, localStream);
  });
  if (localStreamRef.current) {
    localStreamRef.current.srcObject = localStream;
  }
  console.log(`local stream added.`);

  peerConnection.current.onicecandidate = (
    event: RTCPeerConnectionIceEvent
  ) => {
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

/**
 * Creates and emits an offer to establish a connection with a remote peer.
 *
 * @param peerConnection - A mutable reference to the RTCPeerConnection object.
 * @param socketRef - A mutable reference to the WebSocket object used for communication.
 *
 * @returns void
 */
export const createOffer = async (
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>,
  socketRef: MutableRefObject<Socket | null>
) => {
  const offer = await peerConnection.current?.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.current?.setLocalDescription(offer);
  if (offer) {
    socketRef.current?.emit("offerToRemote", {
      offer,
    });
  }
  console.log("offer emitted" + offer?.sdp);
};

export const handleOffer = async (
  offer: RTCSessionDescriptionInit,
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>,
  socketRef: MutableRefObject<Socket | null>,
  localStreamRef: MutableRefObject<HTMLVideoElement | null>
) => {
  await peerConnection?.current?.setRemoteDescription(offer);

  if (peerConnection.current) {
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
  }
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localStream.getTracks().forEach((track) => {
    peerConnection.current?.addTrack(track, localStream);
  });
  if (localStreamRef.current) {
    localStreamRef.current.srcObject = localStream;
  }
  console.log(`local stream added.`);

  const answer = await peerConnection?.current?.createAnswer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  console.log("Answer created" + answer?.sdp);
  await peerConnection?.current?.setLocalDescription(answer);
  if (answer) {
    socketRef.current?.emit("answerSentToServer", {
      answer: answer,
    });
  }
};

export const handleAnswer = async (
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>,
  answer: RTCSessionDescriptionInit
) => {
  await peerConnection?.current?.setRemoteDescription(answer);
  console.log("Answer received");
};

export const handleIceCandidate = async (
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>,
  candidate: RTCIceCandidateInit
) => {
  await peerConnection?.current?.addIceCandidate(candidate);
  console.log("ice candidate added");
};
