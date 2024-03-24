import { Dispatch, SetStateAction } from "react";
import { Button } from "./button";

interface FormProps {
  setVideoChat: Dispatch<SetStateAction<boolean>>;
}

const Form = ({ setVideoChat }: FormProps) => {
  const handleVideoChat = () => setVideoChat(true);
  return (
    <div className="flex flex-row justify-center gap-4 mt-5">
      <Button className="text-[16px]" size="lg" onClick={handleVideoChat}>
        Start a Video Chat
      </Button>
    </div>
  );
};

export default Form;
