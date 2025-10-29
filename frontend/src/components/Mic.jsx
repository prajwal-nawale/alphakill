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
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
        <button
          onClick={toggleListening}
          style={{
            padding: "10px 20px",
            backgroundColor: isListening ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isListening ? "🛑 Stop" : "🎤 Start"}
        </button>

        {showControls && (
          <>
            <button
              onClick={clearSession}
              disabled={!finalTranscriptRef.current.trim()}
              style={{
                padding: "10px 20px",
                backgroundColor: finalTranscriptRef.current.trim() ? "#6c757d" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: finalTranscriptRef.current.trim() ? "pointer" : "not-allowed",
              }}
            >
              🗑️ Clear
            </button>
          </>
        )}
      </div>

      {isListening && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          color: "#dc3545", 
          fontWeight: "bold",
          marginBottom: "10px"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#dc3545",
            borderRadius: "50%",
            animation: "pulse 1.5s infinite"
          }}></div>
          Listening... (auto-stops after 15s silence)
        </div>
      )}

      {showControls && currentSessionText && (
        <div style={{
          marginTop: "10px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          fontSize: "14px",
        }}>
          <strong>Current transcript:</strong> {currentSessionText}
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}