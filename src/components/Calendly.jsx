
import Script from "next/script";
import React from "react";


const Calendly = ({ open, closeModal }) => {

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md calendly-wrapper ${
        open ? "scale-100  opacity-100" : "scale-95 opacity-0 pointer-events-none"
      } transition-all duration-300`}
    >
      <button
        onClick={() => closeModal(false)}
        className="right-4 cursor-pointer top-4 absolute z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#fff"
          className="w-8 h-8"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
      <div
        className="calendly-inline-widget min-w-[320px] min-h-[700px]"
        data-url="https://calendly.com/ravinwebsurgeon/30min"
      ></div>
      <Script
        type="text/javascript"
        src="https://assets.calendly.com/assets/external/widget.js"
        async
      />
    </div>
  );
};

export default Calendly;
