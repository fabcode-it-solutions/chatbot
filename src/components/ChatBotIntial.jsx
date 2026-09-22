'use client';
import Image from "next/image";
import React, { useEffect } from "react";

const ChatBotIntial = ({ setShowChat, setShowIntialChat, showChat }) => {

  useEffect(()=>{

  },[])
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`font-inter shadow-2xl right-[80px] text-black flex items-center gap-1 bg-white py-3 px-[18px] top-[18px] rounded-md  transition-all duration-200 ${
          showChat ? "translate-x-1 opacity-0 invisible" : ""
        }`}
      >
        Chat with us <Image src="/hand.png" width={24} height={24} alt="hand" />
      </div>

      <button
        onClick={() => {
          setShowChat(!showChat);
          setShowIntialChat(false);
          window.parent.postMessage(
            { action: "addToCart", showChat: !showChat },
            "*"
          );
        }}
        className="w-[70px] h-[70px] max-max-mb:w-14 max-max-mb:h-14 shadow-2xl rounded-full bg-blue-2000 flex justify-center items-center hover:scale-100 scale-95 transition-all duration-300 cursor-pointer"
      >
        {showChat ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#fff"
              className="max-max-mb:!w-6"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        ) : (
          <Image
            width={40}
            height={40}
            src="/robot.png"
            className="invert max-max-mb:!w-6"
            alt="Robot"
          />
        )}
      </button>
    </div>
  );
};

export default ChatBotIntial;
