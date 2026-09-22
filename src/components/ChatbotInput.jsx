"use client";
import { useChat } from "@/context/ChatProvider";
import Image from "next/image";
import React from "react";

const ChatbotInput = ({
  messages,
  showIntialChat,
  handleSubmit,
  MAX_CHARS,
  textareaRef,
  input,
  handleInputChange,
  handleKeyPress,
  isLoading,
  sessionId,
  isConnected,
  isTyping,
}) => {
  const { storeData } = useChat();
  return (
    messages.length > 0 &&
    showIntialChat && (
      <div className=" absolute bottom-0 z-20 w-full">
        <div
          className={`flex justify-start absolute left-0 w-full transition-all duration-200 ${
            isTyping ? "-top-7" : "top-0"
          }`}
        >
          <div className="bg-white/20 backdrop-blur-sm text-gray-800 w-full rounded-none px-4 py-1">
            <div className="flex items-center space-x-2">
              <Image src="/bot-1.png" width={16} height={16} alt="bot" />
              <span className="text-sm text-gray-500">
                {storeData?.botName || 'Joe'} is typing
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 pb-4 bg-white rounded-b-lg relative z-[1]"
        >
          <div className="flex space-x-2 items-start">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                placeholder={
                  isConnected ? "Enter your message..." : "Connecting..."
                }
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !sessionId || !isConnected}
                className="w-full pr-10 px-3 py-2  border-t border-gray-300 pl-0 rounded-none focus:outline-none  disabled:bg-gray-100 resize-none overflow-hidden min-h-[40px] max-h-[120px]"
                rows={1}
                style={{ lineHeight: "1.5" }}
              />
              <button
                type="submit"
                disabled={
                  isLoading || !input.trim() || !sessionId || !isConnected
                }
                className="h-10 bg-transparent absolute right-0 top-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill={isLoading ? "#556077" : "#155dfc"}
                >
                  <path d="M149-211v-542l639.92 271L149-211Zm35.77-55.62L696.08-482 184.77-698.85v169L386.85-482l-202.08 46.62v168.76Zm0 0v-432.23 432.23Z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex justify-between">
            <span>Press Enter to send, Shift+Enter for new line</span>

            <span className="text-xs text-gray-400">
              ( {input.length}/{MAX_CHARS} )
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2  hidden">
            sessionId: {sessionId}
          </div>
        </form>
      </div>
    )
  );
};

export default ChatbotInput;
