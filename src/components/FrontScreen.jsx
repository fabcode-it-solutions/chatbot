import Image from "next/image";
import React from "react";

const FrontScreen = ({
  showIntialChat,
  questions,
  onSubmit,
  setShowIntialChat,
}) => {
  return (
    <div
      className={`relative transition-all w-full duration-300 ${
        showIntialChat ? " -translate-x-full" : ""
      }`}
    >
      <div className="from-[3.1%] to-[91.09%] relative bg-gradient-to-bl rounded-t-2xl from-[#155DFC] to-[#2A27DA] pt-6 px-4 pb-16">
        <div className="flex justify-between items-center gap-4">
          <Image
            src="/bot.png"
            width={32}
            height={32}
            className="w-8 h-8"
            alt="bot"
          />
          <button className="relative group/button hover:bg-gray-100 transition-all duration-300 rounded-md hidden">
            <span
              className="absolute translate-x-1 opacity-0 pointer-events-none bg-white py-1 px-2 shadow-cs-xl text-xs whitespace-nowrap font-inter rounded-md text-gray-600 font-semibold duration-300 right-[112%]
              group-hover/button:opacity-100 group-hover/button:translate-x-0
              "
            >
              Open options
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover/button:fill-blue-400"
                d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className=" flex gap-1 items-center text-2xl text-white font-medium font-inter mt-4 leading-1">
          Hi there <Image src="/hand.png" width={24} height={24} alt="hand" />
        </div>
        <div className=" text-base text-white font-normal font-inter mt-4 leading-[1.5]">
          Welcome! How can I help you today? Ask us anything about The Fabcode.
        </div>
        <Image
          src="/wave.png"
          alt="wave"
          width={410}
          height={90}
          className="absolute bottom-0 left-0 w-full h-auto"
        />
      </div>
      <div className="bottom-main-wrapper p-4">
        <div className="flex flex-col items-end">
          {questions.map((item,i) => (
            <button
              onClick={() => {
                onSubmit(item);
                setShowIntialChat(true);
                if(item =="Is it possible to arrange a meeting?"){
                    window.parent.postMessage(
                                  { action: "opendPopup", open: true },
                                  "*"
                                );
                }
              }}
              key={'front-button-' + i}
              className=" border border-blue-2000 text-left mt-1 text-blue-2000 text-xs rounded-lg px-3 py-3 duration-300 transition-colors  custom-gradient-hover hover:text-white"
              dangerouslySetInnerHTML={{ __html: item }}
            ></button>
          ))}
        </div>

        <div className="flex items-center justify-between w-full relative mt-4 p-4 border border-light-100 rounded-lg">
          <div className="">
            <p className="font-inter font-semibold text-sm leading-none text-gray-800">
              {" "}
              Chat with us
            </p>
            <span className="font-inter font-normal text-xs leading-none text-gray-400">
              We reply immediately
            </span>
          </div>
          <Image src="/chatplane.png" width={24} height={24} alt="chatplane" />
          <button
            className="absolute top-0 right-0 w-full h-full flex items-center justify-center"
            onClick={() => {
              onSubmit("Hi");
              setShowIntialChat(true);
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default FrontScreen;
