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
          <p className="text-center text-md  mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, quis
            magnam sequi, delectus harum ex porro nulla aspernatur ipsum
            sapiente reiciendis eligendi possimus libero assumenda id iure
            perferendis incidunt ipsa? Architecto quam in hic aliquam quae?
            Officia, eum corporis dolorum distinctio adipisci numquam quis
          </p>
          <Form setVideoChat={setVideoChat} />
        </>
      )}
      {videoChat && <ChatPanel />}
    </main>
  );
}
