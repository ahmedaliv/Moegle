"use client";
import Form from "@/components/ui/Form";
import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
export default function Home() {
  const [videoChat, setVideoChat] = useState<boolean>(false);
  return (
    <main className="w-[100%] h-full">
      {!videoChat && (
        <>
          <div className="container mx-auto text-center mt-2">
            <h1 className="text-2xl sm:text-xl font-bold mb-2">
              Welcome to Moegle - Where Chance Meets Connection!
            </h1>
            <p className="text-base md:text-md text-gray-700">
              Looking for a random chat buddy? You're in the right place! Moegle
              brings people together from all walks of life for spontaneous
              conversations, meaningful connections, and endless possibilities.
            </p>
            <p className="text-base md:text-md text-gray-700 mt-2">
              Whether you're here to make new friends, have deep discussions, or
              simply enjoy some casual banter, Moegle is your go-to destination.
              Say goodbye to boredom and hello to serendipity!
            </p>

            <Form setVideoChat={setVideoChat} />
          </div>
        </>
      )}
      {videoChat && <ChatPanel />}
    </main>
  );
}
