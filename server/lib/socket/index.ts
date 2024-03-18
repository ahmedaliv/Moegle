import { Server, Socket } from "socket.io";

export function setupSocketIO(io: Server) {
  const waitingUsers: Socket[] = [];

  io.on("connection", (socket: Socket) => {
    handleConnection(socket, waitingUsers);
  });
}

function handleConnection(socket: Socket, waitingUsers: Socket[]) {
  waitingUsers.push(socket);
  console.log(
    `New connection -> ${socket.id}, Total connections -> ${waitingUsers.length}`
  );

  if (waitingUsers.length >= 2) {
    matchUsers(waitingUsers);
  }

  socket.on("disconnect", () => {
    console.log(
      `Connection ${socket.id} has left, Total connections -> ${waitingUsers.length}`
    );
    const index = waitingUsers.indexOf(socket);
    if (index > -1) {
      waitingUsers.splice(index, 1);
    }
  });

  socket.on("error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}

function matchUsers(waitingUsers: Socket[]) {
  const [indexA, indexB] = getRandomPairIndices(waitingUsers.length);
  const userA = waitingUsers.splice(indexA, 1)[0];
  const userB = waitingUsers.splice(indexB - 1, 1)[0];

  userA.emit("matched", { type: "video", initiator: true });
  userB.emit("matched", { type: "video", initiator: false });
    // webrtc event listeners 
    userA.on(
        "offerToRemote",
        (data: { offer: RTCSessionDescriptionInit }) => {
          userB.emit("receiveOffer", {
            offer: data.offer,
          });
        }
      );
      userB.on(
        "answerSentToServer",
        (data: { answer: RTCSessionDescriptionInit }) => {
          userA.emit("answerReceivedFromServer", {
            answer: data.answer,
          });
        }
      );
      userA.on(
        "candidateToServer",
        (data: { candidate: RTCIceCandidateInit }) => {
          userB.emit("receiveCandidate", {
            candidate: data.candidate,
          });
        }
      );
      userB.on("candidateToServer", (data: { candidate: RTCIceCandidate }) => {
        userA.emit("receiveCandidate", {
          candidate: data.candidate,
        });
      });
    

  // Remove matched users from waiting users array
  waitingUsers.splice(waitingUsers.indexOf(userA), 1);
  waitingUsers.splice(waitingUsers.indexOf(userB), 1);
}

function getRandomPairIndices(maxIndex: number): [number, number] {
  const indexA = Math.floor(Math.random() * maxIndex);
  let indexB = Math.floor(Math.random() * maxIndex);
  while (indexB === indexA) {
    indexB = Math.floor(Math.random() * maxIndex);
  }
  return [indexA, indexB];
}