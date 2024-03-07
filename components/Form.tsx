"use client"
import { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';

interface FormProps {
  setVideoChat: Dispatch<SetStateAction<boolean>>;
}

const Form = ({ setVideoChat }: FormProps) => {

      const handleStartChat = async () => {
        // TODO: logic for starting the chat
        setVideoChat(true);
        const response = await fetch('/api/chat', {
          cache: 'no-cache',
        })
        console.log(await response.json());
        // const data = await response.json(); 
      };
  return (
    <div className="flex flex-row justify-center gap-4 mt-5">
      <Button className="text-md" size="lg" onClick={handleStartChat}>
        Start a Video Chat
      </Button>

    </div>
  );
}

export default Form