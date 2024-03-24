"use client";
import Form from "@/components/ui/Form";
import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
export default function Home() {
  const [videoChat, setVideoChat] = useState<boolean>(false);
  return (
    <main className="w-[100%]">
      {!videoChat && (
        <>
          <p className="text-center text-md  mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, quis
            magnam sequi, delectus harum ex porro nulla aspernatur ipsum
            sapiente reiciendis eligendi possimus libero assumenda id iure
            perferendis incidunt ipsa? Architecto quam in hic aliquam quae?
            Officia, eum corporis dolorum distinctio adipisci numquam quis
            soluta nihil omnis consectetur repellendus quaerat inventore
            asperiores neque est fugit in! Molestias quam necessitatibus quas?
            Temporibus deleniti illo est? Consequuntur itaque architecto
            nostrum, tenetur illum officia fugiat accusantium atque in,
            accusamus provident eum quos sunt quasi. Veniam nulla in magni
            pariatur deleniti. Provident, omnis nemo. Delectus quaerat, vitae
            ad, quod blanditiis dolorem magni, id eum inventore aut voluptate
            omnis officiis libero dicta veritatis? Laudantium qui fuga
          </p>
          <Form setVideoChat={setVideoChat} />
        </>
      )}
      {videoChat && <ChatPanel />}
    </main>
  );
}
