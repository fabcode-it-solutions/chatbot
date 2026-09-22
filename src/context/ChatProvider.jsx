"use client";
import { storeServices } from "@/services/storeServices";
import React, { useContext, useEffect, useState } from "react";
const ChatContext = React.createContext();

export function useChat() {
  return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
  const [storeData, setStoreData] = useState({});



  const getStoreData = async () => {
    const da = await storeServices.getStore("ai-agent-chatbot.myshopify.com");
    console.log(da)
    if (da) {
      setStoreData(da.store);
    }
  };
  const value = {
    storeData,
    getStoreData,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
