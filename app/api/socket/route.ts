import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
import { Server } from "socket.io"

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

// type ServerToClientEvents = {
//   matched: (data: { type: string; initiator: boolean }) => void;
//   offer: (offer: RTCSessionDescriptionInit) => void;
//   answer: (answer: RTCSessionDescriptionInit) => void;
//   receiveCandidate: (candidate: RTCIceCandidateInit) => void;
// };

// type ClientToServerEvents = {
//   join: () => void;
//   offer: (offer: RTCSessionDescriptionInit) => void;
//   answer: (answer: RTCSessionDescriptionInit) => void;
//   candidateToServer: (candidate: RTCIceCandidateInit) => void;
// };


const PORT = Number(process.env.PORT) + 5 || 3005;
const waitingUsers:any[] = [];
export async function GET(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  try {
    if (res.socket?.server?.io) {
      res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT}` })
      return
    }


    console.log("Starting Socket.IO server on port:", PORT)

    const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" }, allowEIO3:true }).listen(PORT)

    io.on("connect", socket => {
      const _socket = socket
      console.log("socket connect", socket.id);
      waitingUsers.push(socket);
      console.log(`New connection -> ${socket.id}, Total connections -> ${waitingUsers.length
        }`);

      if (waitingUsers.length >= 2) {
        // Match two random users
        const [indexA, indexB] = getRandomPairIndices(waitingUsers.length);
        const userA = waitingUsers.splice(indexA, 1)[0];
        const userB = waitingUsers.splice(indexB - 1, 1)[0];

        // handling ice candidates
        userA.on("candidateToServer", (data: any) => {
          console.log("candidateToServer", data.candidate);
          userB.emit("receiveCandidate", {
            candidate: data.candidate
          });
        });
        userB.on("candidateToServer", (data) => {
          console.log('candidateToServer', data.candidate);
          userA.emit("receiveCandidate", {
            candidate: data.candidate
          });
        });
        // Notify users that they are matched
        userA.emit("matched", { type: "video", initiator: true });
        userB.emit("matched", { type: "video", initiator: false });

        userA.on("offerToRemote", (data) => {
          // console.log("offerToRemote", data)
          userB.emit("receiveOffer", {
            offer: data.offer
          })
        })
        userB.on("answerSentToServer", (data: any) => {
          // console.log("answerSentToServer", data)
          userA.emit("answerReceivedFromServer", {
            answer: data.answer
          })
        });


        // Handle disconnection
        // userA.on("disconnect", () => handleDisconnect(userA));
        // userB.on("disconnect", () => handleDisconnect(userB));
      }

      // socket.on("disconnect", () => handleDisconnect(socket));
      // _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)
      socket.on("disconnect", async () => {
        console.log("socket disconnect")
      });
      socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
      });
    })
    res.socket.server.io = io
    res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT}` })
  } catch (error) {
    console.log(`Catched Error -> ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}


function getRandomPairIndices(maxIndex: number): [number, number] {
  const indexA = Math.floor(Math.random() * maxIndex);
  let indexB = Math.floor(Math.random() * maxIndex);
  while (indexB === indexA) {
    indexB = Math.floor(Math.random() * maxIndex);
  }
  return [indexA, indexB];
}

function handleDisconnect(socket) {
  const index = waitingUsers.indexOf(socket);
  if (index !== -1) {
    waitingUsers.splice(index, 1);
    console.log(`User ${socket.id} disconnected`);
  }
}

