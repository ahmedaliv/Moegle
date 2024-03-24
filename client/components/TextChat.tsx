import { ClientToServerEvents, ServerToClientEvents } from "@/lib/webrtc/types";
import { Socket } from "socket.io-client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { handleNext } from "@/lib/webrtc";
import { ScrollArea } from "./ui/scroll-area";
const TextChat = ({
  peerConnection,
  localStreamRef,
  remoteStreamRef,
  socketRef,
  chatChannel,
  className,
}: {
  peerConnection: MutableRefObject<RTCPeerConnection | undefined>;
  localStreamRef: MutableRefObject<HTMLVideoElement | null>;
  remoteStreamRef: MutableRefObject<HTMLVideoElement | null>;
  socketRef: MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
  chatChannel: RTCDataChannel | undefined;
  className?: string;
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  if (chatChannel) {
    chatChannel.onmessage = (event) => {
      setChatHistory([...chatHistory, JSON.parse(event.data)]);
    };
  }
  const sendChatMessage = (
    chatChannel: RTCDataChannel | undefined,
    message: string
  ) => {
    if (chatChannel) {
      const messageToSend = {
        message,
        id: socketRef.current?.id,
      };
      chatChannel.send(JSON.stringify(messageToSend));
      setChatHistory([...chatHistory, messageToSend]);
      setChatMessage("");
    }
  };
  const handleSendMessage = () => {
    if (chatMessage.trim() === "") {
      return;
    }
    sendChatMessage(chatChannel, chatMessage);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chatHistory]);
  return (
    <>
      <div
        className={cn(
          className,
          "w-full flex h-[38vh] sm:h-[55vh] scrollbar-black"
        )}
      >
        <ScrollArea
          className="
            w-full
            flex 
            flex-col
            items-center
            space-y-2
            "
        >
          {chatHistory.map(
            (
              data: {
                message: string;
                id: string;
              },
              index: number
            ) => (
              <div
                key={index}
                className={`
                w-[auto]
                  mr-auto
                  p-2
                  `}
              >
                {data.id === socketRef.current?.id ? (
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-black">You: </span>
                    {data.message}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-red-800">Stranger: </span>
                    {data.message}
                  </p>
                )}
              </div>
            )
          )}
          <div ref={chatEndRef}></div>
        </ScrollArea>
      </div>
      <div className="w-full sm:h-[80px] flex flex-row gap-3  justify-center items-center">
        <Button
          variant="default"
          className="h-full w-[25%] sm:w-[15%] rounded-sm"
          onClick={() => {
            handleNext(
              peerConnection,
              localStreamRef,
              remoteStreamRef,
              socketRef
            );
            // clear the chat history
            setChatHistory([]);
          }}
        >
          Next
        </Button>
        <Textarea
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          variant="outline"
          className=" w-[25%] sm:w-[15%] h-full rounded-sm"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </>
  );
};

export default TextChat;
