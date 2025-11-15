import { useEffect, useRef, useState } from "react";

export default function Mic({ onTranscript, onFinalTranscript, showControls = true }) {
  const [isListening, setIsListening] = useState(false);
  const [currentSessionText, setCurrentSessionText] = useState("");
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = () => {
    if (isListening) return;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setIsListening(true);
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      resetSilenceTimer();
      
      let interimTranscript = "";
      let newFinalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update final transcript
      if (newFinalTranscript) {
        finalTranscriptRef.current += newFinalTranscript;
        setCurrentSessionText(finalTranscriptRef.current);
        onTranscript?.(finalTranscriptRef.current);
      }

      // For real-time display
      const displayText = finalTranscriptRef.current + interimTranscript;
      onTranscript?.(displayText);
    };

    recognition.onerror = (event) => {
      console.error("❌ Recognition error:", event.error);
      
      if (event.error === 'no-speech') {
        console.log("No speech detected, continuing to listen...");
        return;
      }
      
      stopListening();
      
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone permissions.");
      }
    };

    recognition.onend = () => {
      console.log("🔴 Speech recognition ended");
      setIsListening(false);
      clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Recognition already stopped");
      }
      recognitionRef.current = null;
    }
    
    setIsListening(false);
    clearTimeout(silenceTimerRef.current);

    // Call onFinalTranscript if we have content
    if (finalTranscriptRef.current.trim() && onFinalTranscript) {
      onFinalTranscript?.(finalTranscriptRef.current);
    }
  };

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      console.log("⏰ 15 seconds of silence - stopping automatically");
      stopListening();
    }, 15000);
  };

  const clearSession = () => {
    finalTranscriptRef.current = "";
    setCurrentSessionText("");
    onTranscript?.("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-3 items-center mb-4">
        <button
          onClick={toggleListening}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
            isListening 
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" 
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          }`}
        >
          {isListening ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Listening
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Listening
            </>
          )}
        </button>

        {showControls && (
          <button
            onClick={clearSession}
            disabled={!finalTranscriptRef.current.trim()}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              finalTranscriptRef.current.trim()
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {isListening && (
        <div className="flex items-center gap-3 text-red-600 font-semibold mb-4">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span>Listening... (auto-stops after 15s silence)</span>
        </div>
      )}

      {showControls && currentSessionText && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Current Transcript:</div>
          <div className="text-gray-900 bg-white p-3 rounded-lg border border-gray-300">
            {currentSessionText}
          </div>
        </div>
      )}
    </div>
  );
}