# AI Chatbot Widget — Frontend

An embeddable, real-time AI shopping assistant built with **Next.js**. This widget delivers conversational commerce for e-commerce and service-based websites — combining text chat, voice interaction, product recommendations, and appointment booking in a single, lightweight interface.

## Overview

This project is the frontend client for an AI-powered chatbot that helps website visitors get instant answers, discover products, and book calls — without leaving the page. It connects to a backend AI engine over WebSockets for real-time, low-latency conversations and is designed to be dropped into any storefront or marketing site.

## Key Features

- **Real-Time Conversational AI** — Live, streaming chat powered by Socket.IO for instant, natural-feeling responses.
- **Voice Chat Support** — Hands-free interaction with speech-to-text input and text-to-speech playback.
- **Smart Product Recommendations** — Displays interactive product cards with pricing, discounts, and imagery pulled dynamically from the store catalog.
- **Appointment Scheduling** — Built-in Calendly integration lets users book consultations directly from the chat.
- **FAQ & Guided Responses** — Pre-configured knowledge base for handling common customer questions instantly.
- **Modern, Responsive UI** — Built with Tailwind CSS for a clean, mobile-friendly experience across devices.
- **Modular Architecture** — Cleanly separated components, services, and context providers, making it easy to extend or white-label for different clients.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (React 19) |
| Styling | Tailwind CSS 4 |
| Real-Time Communication | Socket.IO Client |
| Voice | React Text-to-Speech |
| Data Validation | Zod |
| HTTP Client | Axios |
| Icons | Lucide React |

## How It Works

1. The widget establishes a live connection to the AI backend over WebSockets.
2. User messages (typed or spoken) are sent to the AI engine and streamed back in real time.
3. Based on the conversation, the assistant can surface relevant product cards, answer FAQs, or offer to schedule a meeting via Calendly.
4. All chat state is managed centrally, keeping the UI fast and consistent across the session.

## Use Cases

- E-commerce stores wanting an AI shopping assistant that recommends products and answers questions
- Service businesses that want visitors to book consultations directly through chat
- Any website looking to add a modern, voice-enabled AI support widget

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the widget locally.

### Environment Variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_ORIGIN=<your backend socket server URL>
```

## Project Structure

```
src/
├── app/          # Next.js app router entry points
├── components/   # UI components (ChatBot, VoiceChat, ProductCards, Calendly, etc.)
├── context/      # Global chat state management
├── services/     # API/store service calls
└── utils/        # Helper functions (currency formatting, discounts, FAQ logic)
```

## About

This project is developed and maintained by [thefabcode.com](https://thefabcode.com) — a team specializing in building custom AI-driven web applications, chatbots, and e-commerce solutions.
