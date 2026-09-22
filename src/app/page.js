import Calendly from "@/components/Calendly";
import ChatBot from "@/components/ChatBot";
import SpeechToText from "@/components/VoiceChat";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      {/* <SpeechToText /> */}
      <ChatBot />
      
    </div>
  );
}
