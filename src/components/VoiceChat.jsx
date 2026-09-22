'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Play } from 'lucide-react';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition settings
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      // Handle speech recognition results
      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        // Process all results
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        setInterimTranscript(interim);
        if (final) {
          setFinalTranscript(prev => prev + final);
          setTranscript(prev => prev + final);
        }
      };

      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      // Handle end of recognition
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      // Handle start of recognition
      recognitionRef.current.onstart = () => {
        setError('');
        setIsListening(true);
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError('');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Failed to start listening');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const clearTranscript = () => {
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    setError('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <MicOff className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Supported</h2>
          <p className="text-gray-600">
            Speech recognition is not supported in this browser. 
            Please try Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Speech to Text</h1>
          <p className="text-gray-600">Convert your speech to text in real-time</p>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Microphone Visual */}
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-100 border-4 border-red-300 shadow-lg' 
                : 'bg-gray-100 border-4 border-gray-300'
            }`}>
              {isListening ? (
                <Mic className="w-16 h-16 text-red-500" />
              ) : (
                <MicOff className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {/* Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isListening 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isListening ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    Listening...
                  </>
                ) : (
                  'Ready to listen'
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Listening
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Listening
                </button>
              )}
              
              <button
                onClick={clearTranscript}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Live Transcript */}
          {(interimTranscript || isListening) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Live Speech:</h3>
              <p className="text-blue-600 italic">{interimTranscript || 'Listening for speech...'}</p>
            </div>
          )}

          {/* Final Transcript */}
          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-800">Transcript</h3>
              {transcript && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="p-4 min-h-[200px]">
              {transcript ? (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-blue-500 italic">{interimTranscript}</span>
                  )}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Your speech will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          {transcript && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {transcript.split(' ').filter(word => word.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {transcript.length}
                  </div>
                  <div className="text-sm text-gray-600">Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Sentences</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-3">How to use:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              Click "Start Listening" to begin speech recognition
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              Speak clearly into your microphone
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              Watch your speech appear as text in real-time
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
              Click "Stop Listening" when finished, then copy your text
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;