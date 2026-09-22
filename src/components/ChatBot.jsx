"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import Image from "next/image";
import {
  checkIsCancelled,
  addToCart,
  checkAddToCart,
  checkAdditionalInfo,
  checkOrderIds,
  checkCheckout,
  checkButton,
  checkArray,
  checkProducts,
} from "@/utils/checker";
import ChatbotInput from "./ChatbotInput";
import ChatBotIntial from "./ChatBotIntial";
import FrontScreen from "./FrontScreen";
import ProductCards from "./ProductCards";
import { useChat } from "@/context/ChatProvider";
import { q } from "@/utils/faq";
import Calendly from "./Calendly";

const ChatBot = () => {
  const { storeData } = useChat();
  const MAX_CHARS = 150;
  const [sessionId, setSessionId] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [showIntialChat, setShowIntialChat] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [productsData, setProductsData] = useState({});
  const [open, setOpen] = useState(false);

  const closePopup = () => {
    const userId = localStorage.getItem("fc_userId");
    socketRef.current.emit("send_message", {
      message: "closePopup",
      sessionId: sessionId,
      userId: userId,
    });
    setOpen(false);
    window.parent.postMessage({ action: "opendPopup", open: false }, "*");
  };
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + "px";
    }
  };

  useEffect(() => {
    const getSessionId = sessionStorage.getItem("fcc_session_id");
    const userId = localStorage.getItem("fc_userId");
    const id = uuidv4();
    if (!getSessionId) {
      sessionStorage.setItem("fcc_session_id", id);
      setSessionId(id);
    } else {
      window.parent.postMessage(
        { action: "addToCart", showChat: !showChat },
        "*"
      );
      setSessionId(getSessionId);
    }
    if (!userId) {
      const newUserId = uuidv4();
      localStorage.setItem("fc_userId", newUserId);
    }
  }, []);
  useEffect(() => {
    console.log(
      "%cYour Session ID: %c" + sessionId,
      "font-size: 18px; font-weight: bold; color: green;",
      "font-size: 18px; font-weight: bold;"
    );
    socketRef.current = io(process.env.NEXT_PUBLIC_ORIGIN, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      setIsConnected(true);
      setError("");
      const userId =
        localStorage.getItem("fc_userId") ||
        sessionStorage.getItem("fc_userId") ||
        null;
      socket.emit("join_session", { sessionId: sessionId, userId });
    });

    socket.on("schedule_meeting", (data) => {      
      if (sessionId == data.sessionId) {
        window.parent.postMessage({ action: "opendPopup", open: true }, "*");
        setOpen(true);
      }
    });
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Failed to connect to chat server");
      setIsConnected(false);
    });

    socket.on("session_history", (data) => {
      console.log(
        "📜 Received session history:",
        data.messages.length,
        "messages"
      );
      console.log(data);
      setMessages(
        data.messages.map((msg) => ({
          type: msg.type,
          content: msg.content,
          name: msg.name,
          timestamp: new Date(msg.timestamp),
        }))
      );
    });

    socket.on("message_received", (message) => {
      console.log("📨 Message received:", message);
    });

    socket.on("suggestedProducts", (message) => {
      console.log("Suggested products:", message);
      setSuggestedProducts(message);
    });
    socket.on("ai_response", (message) => {
      console.log("AI response:", message);
      setMessages((prev) => [
        ...prev,
        {
          type: message.type,
          content: message.content,
          name: message.name,
          id: message.id,
          timestamp: new Date(message.timestamp),
        },
      ]);
      setIsLoading(false);
      setIsTyping(false);
    });

    socket.on("typing", (data) => {
      setIsTyping(data.isTyping);
    });

    socket.on("error", (error) => {
      console.error("Server error:", error);
      setError(error.message);
      setIsLoading(false);
      setIsTyping(false);
    });

    socket.on("session_cleared", (data) => {
      setMessages([]);
      setError("");
    });

    socket.on("session_deleted", (data) => {
      console.log("🗑️ Session deleted:", data);
      const id = uuidv4();
      setSessionId(id);
      setMessages([]);
      setError("");
    });

    socket.on("session_info", (info) => {
      console.log("📊 Session info:", info);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("user_typing", { sessionId, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("user_typing", { sessionId, isTyping: false });
      }, 1000);
    }
  };

  const onSubmit = async (messageInput) => {
    if (!messageInput.trim() || !sessionId || isLoading || !isConnected) return;

    setIsLoading(true);
    setError("");

    const userMessage = {
      type: "user",
      content: messageInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userId =
      localStorage.getItem("fc_userId") ||
      sessionStorage.getItem("fc_userId") ||
      null;

    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        message: messageInput,
        sessionId: sessionId,
        userId: userId,
      });
    } else {
      setError("Not connected to chat server");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(input);
    } else {
      handleTyping();
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setInput(newValue);
    }
  };
  function getRandomQuestions(min = 4, max = 4) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...q].sort(() => 0.5 - Math.random());
    const shuffledQ = shuffled.slice(0, count);
    const filterQ = [];
    for (const question of shuffledQ) {
      if (question) {
        filterQ.push(question.q);
      }
    }
    filterQ.push("Is it possible to arrange a meeting?");
    return filterQ;
  }
  const questions = getRandomQuestions();
  useEffect(() => {
    if (messages.length > 0 && !showChat) {
      setShowChat(true);
      setShowIntialChat(true);
    }
  }, [messages]);
  return (
      <div className="fixed bottom-0 right-0 pb-8 pr-8 max-max-mb:pr-4 max-max-mb:pb-4">
      <div
          className={`absolute bottom-[112px] right-8 max-max-mb:bottom-[90px] max-max-mb:right-4 max-max-mb:min-w-[calc(100vw-32px)]  h-[600px] max-w-2xl  rounded-2xl shadow-cs-xl bg-white min-w-[410px] ${
          showChat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
        } duration-300 transition-all`}
      >
        <div className="main-wrapper h-full">
          <FrontScreen
            onSubmit={onSubmit}
            questions={questions}
            setShowIntialChat={setShowIntialChat}
            showIntialChat={showIntialChat}
          />
          {/* Messages Container */}
          <div
            className={`flex-1 absolute top-0 w-full h-full justify-between rounded-t-2xl bg-white z-10 ${
              showIntialChat
                ? "flex flex-col  left-0"
                : "flex flex-col  left-full"
            } p-0 pb-0 pr-0 space-y-0 ${
              messages.length === 0
                ? " "
                : "overflow-y-auto max-h-[calc(100%-108px)]"
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-1 p-4 bg-white justify-between">
              <div className="flex items-center gap-1">
                <button
                  className=""
                  onClick={() => {
                    setShowIntialChat(false);
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z"
                      fill="#8D8D8D"
                    />
                  </svg>
                </button>
                <Image src="/bot-2.png" width={26} height={26} alt="Bot" />
              </div>
            </div>

            <div className="w-full overflow-y-auto m-0 pb-4 px-4 grid gap-2.5">
              {error && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm">
                  ⚠️ {error}
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={"messages-" + index}
                  className={`flex ${
                    message.type === "user" || message.type === "human"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[90%]">
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === "user" || message.type === "human"
                          ? "custom-gradient text-white "
                          : message.type === "error"
                          ? "bg-red-100 text-red-800 rounded-md "
                          : message.type === "system"
                          ? "bg-yellow-100 text-yellow-800 rounded-md"
                          : "bg-[#F5F7F9] text-[#06132B] rounded-md "
                      }`}
                    >
                      <div
                        className="text-sm rte"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replaceAll("```", "")
                            .replaceAll("html", ""),
                        }}
                      ></div>
                    </div>
                    {index === messages.length - 1 &&
                      checkProducts(message.content) &&
                      suggestedProducts && (
                        <ProductCards
                          message={message.content}
                          products={suggestedProducts.suggestedProducts}
                        />
                      )}
                    <div
                      className={`text-xs mt-1 opacity-70 flex justify-start items-center ${
                        message.type === "user" || !message.name
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.name && (
                        <span>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    {checkArray(message.content) &&
                      index === messages.length - 1 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {checkArray(message.content).map((item, i) => (
                            <button
                              key={`questions-${i}`}
                              onClick={() => {
                                onSubmit(item);
                                setProductsData((prev) => ({
                                  ...prev,
                                  [message.id]: true,
                                }));
                              }}
                              className=" border border-blue-2000 text-left mt-1 text-blue-2000 text-xs rounded-lg px-3 py-3 duration-300 transition-colors  custom-gradient-hover hover:text-white"
                              dangerouslySetInnerHTML={{ __html: item }}
                            ></button>
                          ))}
                          {messages.length > 3 && (
                            <button
                              key={`questions-meeting`}
                              onClick={() => {
                                onSubmit("I want to schedule a meeting.");
                                setProductsData((prev) => ({
                                  ...prev,
                                  [message.id]: true,
                                }));
                                window.parent.postMessage(
                                  { action: "opendPopup", open: true },
                                  "*"
                                );
                              }}
                              className=" border border-blue-2000 text-left mt-1 text-blue-2000 text-xs rounded-lg px-3 py-3 duration-300 transition-colors  custom-gradient-hover hover:text-white"
                              dangerouslySetInnerHTML={{
                                __html: "I want to schedule a meeting.",
                              }}
                            ></button>
                          )}
                        </div>
                      )}
                    {checkIsCancelled(message.content) && (
                      <button
                        onClick={() =>
                          onSubmit(
                            "Yes, Cancel My order <!---Cancel My order -->"
                          )
                        }
                        className="text-white bg-blue-500 mt-2 rounded-lg flex px-3 py-2 items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Yes, Cancel My order
                      </button>
                    )}
                    {checkAdditionalInfo(message.content, "show support") && (
                      <button
                        onClick={() => {
                          alert("Support contact info");
                        }}
                        className="text-white bg-blue-500 mt-2 rounded-lg flex px-3 py-2 items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#ffff"
                        >
                          <path d="M480-172v-28h248q13 0 22.5-8t9.5-21v-273q0-111-83-184.5T480-760q-114 0-197 73.5T200-502v222h-14q-22 0-38-14.5T132-331v-74q0-17 12-29.5t28-20.5v-48q0-61 25-113t67-90.5q42-38.5 98-60T480-788q62 0 118 21.5t98 60q42 38.5 67 90.5t25 113v47q15 7 27.5 18t12.5 28v85q0 17-12.5 28T788-279v50q0 24-17.5 40.5T728-172H480ZM380-424q-11 0-19.5-7.5T352-450q0-11 8.5-19t19.5-8q11 0 19.5 8t8.5 19q0 11-8.5 18.5T380-424Zm200 0q-11 0-19.5-7.5T552-450q0-11 8.5-19t19.5-8q11 0 19.5 8t8.5 19q0 11-8.5 18.5T580-424Zm-303-64q-5-85 56-144.5T482-692q74 0 131.5 43.5T684-533q-76-1-141.5-38T442-675q-14 66-58 115t-107 72Z" />
                        </svg>{" "}
                        Contact Support
                      </button>
                    )}
                    {checkAddToCart(message.content) && (
                      <button
                        onClick={() => {
                          addToCart(message.content);
                          onSubmit("Yes, Add to cart");
                        }}
                        className="text-white bg-blue-500 mt-2 rounded-lg flex px-3 py-2 items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M286.15-97.69q-29.15 0-49.57-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.57-20.42 29.16 0 49.58 20.42 20.42 20.42 20.42 49.58 0 29.15-20.42 49.57-20.42 20.43-49.58 20.43Zm387.7 0q-29.16 0-49.58-20.43-20.42-20.42-20.42-49.57 0-29.16 20.42-49.58 20.42-20.42 49.58-20.42 29.15 0 49.57 20.42t20.42 49.58q0 29.15-20.42 49.57Q703-97.69 673.85-97.69ZM211.85-790h555.38q24.54 0 37.11 20.89 12.58 20.88 1.2 42.65L677.38-494.31q-9.84 17.31-26.03 26.96-16.2 9.66-35.5 9.66H324l-46.31 84.61q-3.08 4.62-.19 10 2.88 5.39 8.65 5.39h457.69v60H286.15q-40 0-60.11-34.5-20.12-34.5-1.42-68.89l57.07-102.61L136.16-810H60v-60h113.85l38 80Z" />
                        </svg>
                        Add to cart
                      </button>
                    )}
                    {checkCheckout(message.content) && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(socketRef.current);
                            socketRef.current.emit("ask_any_other_info", {
                              sessionId,
                              ask: true,
                            });
                            window.parent.postMessage(
                              { action: "cartRedirect", cartpage: true },
                              "*"
                            );
                          }}
                          className={`px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        >
                          Got to cart
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            socketRef.current.emit("ask_any_other_info", {
                              sessionId,
                              ask: true,
                            });
                            window.parent.postMessage(
                              { action: "cartRedirect", checkoutPage: true },
                              "*"
                            );
                          }}
                          className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        >
                          Contiue to Checkout
                        </button>
                      </div>
                    )}
                    {checkButton(message.content, "confirmEmail") && (
                      <div className="mt-1 flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => {
                            onSubmit("Yes, use this email");
                          }}
                          className="text-white bg-blue-500 mt-2 rounded-lg flex px-3 py-2 items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            onSubmit("No, email is not correct.");
                          }}
                          className="text-white bg-blue-500 mt-2 rounded-lg flex px-3 py-2 items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    )}
                    {checkOrderIds(message.content) && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                        {checkOrderIds(message.content).map((item, idx) => (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderId(item.order_id);
                              onSubmit(
                                "I wanted to know about my order: " +
                                  item.order_id.replace(
                                    "gid://shopify/Order/",
                                    ""
                                  ) +
                                  "."
                              );
                            }}
                            className={`px-3 py-2 ${
                              selectedOrderId === item.order_id ||
                              !selectedOrderId
                                ? "bg-blue-600"
                                : "bg-blue-600"
                            }  text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            key={"order-id-" + idx}
                          >
                            <ul className="list-disc pl-4">
                              {item.lineItems.map((lineItem, lineIdx) => (
                                <li key={`line-item-${lineIdx}`}>
                                  {lineItem.title} - Qty: {lineItem.quantity}
                                </li>
                              ))}
                            </ul>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatbotInput
            MAX_CHARS={MAX_CHARS}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            handleSubmit={handleSubmit}
            input={input}
            isConnected={isConnected}
            isLoading={isLoading}
            sessionId={sessionId}
            messages={messages}
            textareaRef={textareaRef}
            isTyping={isTyping}
            showIntialChat={showIntialChat}
          />
        </div>
      </div>

      <ChatBotIntial
        setShowChat={setShowChat}
        setShowIntialChat={setShowIntialChat}
        showChat={showChat}
      />
      <Calendly open={open} closeModal={closePopup} />
    </div>
  );
};

export default ChatBot;
