import { Dispatch, SetStateAction } from "react";

interface FormProps {
  setVideoChat: Dispatch<SetStateAction<boolean>>;
}

const Form = ({ setVideoChat }: FormProps) => {
  const handleVideoChat = () => setVideoChat(true);
  return (
    <div className="flex flex-row justify-center gap-4 mt-5">
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-8" onClick={handleVideoChat}>
      Join the Conversation
      </button>
    </div>
  );
};

export default Form;
