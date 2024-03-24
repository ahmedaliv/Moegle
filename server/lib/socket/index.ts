import {  includes } from "lodash-es";
import { Server, Socket } from "socket.io";


export function setupSocketIO(io: Server) {
  const waitingUsers: Socket[] = [];

  io.on("connection", (socket: Socket) => {
    handleConnection(socket, waitingUsers);
    socket.on("next", () => {
      console.log("Next event received");
      // check if the user already in the waiting list
      const isInWaiting = includes(waitingUsers, socket);
      if (!isInWaiting) {
        handleConnection(socket, waitingUsers);
        console.log("User added to waiting list, total current waiting users", waitingUsers.length);
      } else {
        console.log("User already in waiting list");
      }
      
    })
  });
}

function handleConnection(socket: Socket, waitingUsers: Socket[]) {
  waitingUsers.push(socket);
  console.log(
    `New connection -> ${socket.id}, Total connections -> ${waitingUsers.length}`
  );

  // allow a random delay before matching users to simulate randomization
  setTimeout(() => {
    if (waitingUsers.length >= 2) {
      matchUsers(waitingUsers);
    }
  }, Math.floor(Math.random() * 2000) + 2000); 

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
  console.log(`matched ${userA.id} with ${userB.id}`);

  userA.emit("matched", { type: "video", initiator: true });
  userB.emit("matched", { type: "video", initiator: false });
    // webrtc event listeners 
    userA.once(
        "offerToRemote",
      (data: { offer: RTCSessionDescriptionInit }) => {
          console.log(`offer sent to user b with socket id ${userB.id} from ${userA.id}`);
          userB.emit("receiveOffer", {
            offer: data.offer,
          });
        }
      );
      userB.once(
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
       
      console.log(`current waiting after matching ${waitingUsers.length}`);
      

}

function getRandomPairIndices(maxIndex: number): [number, number] {
  const indexA = Math.floor(Math.random() * maxIndex);
  let indexB = Math.floor(Math.random() * maxIndex);
  while (indexB === indexA) {
    indexB = Math.floor(Math.random() * maxIndex);
  }
  return [indexA, indexB];
}