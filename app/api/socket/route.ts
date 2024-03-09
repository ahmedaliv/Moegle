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

const PORT = 3005;
const waitingUsers:any[] = [];
export async function GET(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  try {
    if (res.socket?.server?.io) {
      res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT}` })
      return
    }


    console.log("Starting Socket.IO server on port:", PORT)

    const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT)

    io.on("connect", socket => {
      const _socket = socket
      console.log("socket connect", socket.id);
      // socket.on("offer", (data) => console.log(data.data));
    
      waitingUsers.push(socket);
      console.log(`New connection -> ${socket.id}, Total connections -> ${waitingUsers.length
        }`);

      if (waitingUsers.length >= 2) {
        // Match two random users
        const [indexA, indexB] = getRandomPairIndices(waitingUsers.length);
        const userA = waitingUsers.splice(indexA, 1)[0];
        const userB = waitingUsers.splice(indexB - 1, 1)[0];

        // Notify users that they are matched
        userA.emit("matched", { type: "video", initiator: true });
        userB.emit("matched", { type: "chat", initiator: false });

        userA.on("offer", (offer) => userB.emit("offer", offer));
        userB.on("offer", (offer) => userA.emit("answer", offer));

        
        userA.on("answer", (answer) => userB.emit("answer", answer));
        userB.on("answer", (answer) => userA.emit("answer", answer));
        
        // handling ice candidates
        // userA.on("ice-candidate", (candidate) => userB.emit("ice-candidate", candidate));
        // userB.on("ice-candidate", (candidate) => userA.emit("ice-candidate", candidate));

        // Handle disconnection
        userA.on("disconnect", () => handleDisconnect(userA));
        userB.on("disconnect", () => handleDisconnect(userB));
      }

      socket.on("disconnect", () => handleDisconnect(socket));
      _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)
      socket.on("disconnect", async () => {
        console.log("socket disconnect")
      });
      socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
      });
    })

    res.socket.server.io = io
    res.status(201).json({ success: true, message: "Socket is started", socket: `:${5000}` })
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

function handleDisconnect(socket: SocketWithIO) {
  const index = waitingUsers.indexOf(socket);
  if (index !== -1) {
    waitingUsers.splice(index, 1);
    console.log(`User ${socket.id} disconnected`);
  }
}