import React from "react";

const MobileVideoChat = ({
  localStreamRef,
  remoteStreamRef,
}: {
  localStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  remoteStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
  console.log(`mobile view`);

  return (
    <div className="w-[95%] sm:w-[28%] flex flex-col justify-center items-center ">
      <div className="text-[10px] sm:text-[15px] w-full text-center">
        <p>You are now chatting with a random stranger</p>
        <p>You both speak the same language - English </p>
      </div>
      <div
        className="flex
       flex-col
        w-full
         relative mt-4 "
      >
        <video
          ref={remoteStreamRef}
          className={` 
            bg-neutral-700
            w-full
            border-t-2
            h-[31vh]
             border-white`}
          autoPlay
          playsInline
        />
        <video
          ref={localStreamRef}
          autoPlay
          muted
          className={`
            bg-blue
            absolute 
            top-0 
            right-0
            mt-1
            w-[22vw]
            h-[8vh]
            `}
        />
      </div>
    </div>
  );
};

export default MobileVideoChat;
