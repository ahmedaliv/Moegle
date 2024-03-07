"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { io, Socket } from "socket.io-client";
import {  useState } from "react";

interface FormProps {
  setVideoChat: Dispatch<SetStateAction<boolean>>;
}

type ServerToClientEvents = {
  paired: (peerId: string) => void;
};

type ClientToServerEvents = {
  join: () => void;
};

const Form = ({ setVideoChat }: FormProps) => {  
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const connectToServer = () => {
    const socket = io(`:${PORT + 1}`, { path: "/api/socket", addTrailingSlash: false });
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Connected")
    });
    socket.on("disconnect", () => {
      console.log("Disconnected")
    });
    socket.on("connect_error", async err => {
      console.log(`connect_error due to ${err.message}`)
      await fetch("/api/socket");
    });

  };

  const handleJoinChat = () => {
    console.log("joning chat");
    setVideoChat(true);
    if (!socket) {
      connectToServer();
    }
    socket?.emit("join");
  };
  return (
    <div className="flex flex-row justify-center gap-4 mt-5">
      <Button className="text-md" size="lg" onClick={handleJoinChat}>
        Start a Video Chat
      </Button>
    </div>
  );
};

export default Form;
