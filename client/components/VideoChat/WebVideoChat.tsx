const WebVideoChat = ({
  localStreamRef,
  remoteStreamRef,
}: {
  localStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  remoteStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
  return (
    <div className="w-[42%] sm:w-[25%] flex">
      <div className="flex flex-col justify-center w-full m-2">
        <video
          ref={localStreamRef}
          autoPlay
          muted
          className={`bg-neutral-500 max-h-[40vh] w-full `}
        />
        <video
          ref={remoteStreamRef}
          className={`
             bg-neutral-700
             ${remoteStreamRef.current ? `bg-white` : `bg-neutral-500`}
          max-h-[40vh] w-full border-t-2 border-white`}
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};

export default WebVideoChat;
