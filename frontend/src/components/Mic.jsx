import { useEffect, useRef, useState } from "react";

export default function Mic({ onTranscript, onSkillsUpdate }) {
  const [isListening, setIsListening] = useState(false);
  const [currentSessionText, setCurrentSessionText] = useState("");
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef(""); // Track only final recognized text

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = () => {
    if (isListening) {
      console.log("Already listening...");
      return;
    }

    // Check browser support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configuration
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
      resetSilenceTimer(); // Reset timer on any speech activity
      
      let interimTranscript = "";
      let newFinalTranscript = "";

      // Process all new results since last result
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

      // For real-time display, combine final + interim
      const displayText = finalTranscriptRef.current + interimTranscript;
      onTranscript?.(displayText);
    };

    recognition.onerror = (event) => {
      console.error("❌ Recognition error:", event.error);
      
      // Don't stop on no-speech error, it's common
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
      
      // Auto-add skills if we have content and recognition ended naturally
      if (finalTranscriptRef.current.trim() && recognitionRef.current) {
        console.log("Auto-adding skills after recognition ended");
        onSkillsUpdate?.(finalTranscriptRef.current);
      }
    };

    // Store and start recognition
    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      console.log("✅ Recognition started successfully");
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    console.log("🛑 Stopping listening manually");
    
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

    // Only add skills if we have content and it's a manual stop
    if (finalTranscriptRef.current.trim()) {
      console.log("Adding skills on manual stop:", finalTranscriptRef.current);
      onSkillsUpdate?.(finalTranscriptRef.current);
    }
  };

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      console.log("⏰ 15 seconds of silence - stopping automatically");
      stopListening();
    }, 15000); // Reduced to 5 seconds for better UX
  };

  const addToSkills = () => {
    if (finalTranscriptRef.current.trim()) {
      console.log("✅ Manually adding to skills:", finalTranscriptRef.current);
      onSkillsUpdate?.(finalTranscriptRef.current);
      clearSession();
    }
  };

  const clearSession = () => {
    console.log("🗑️ Clearing session");
    finalTranscriptRef.current = "";
    setCurrentSessionText("");
    onTranscript?.("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Clear previous session when starting fresh
      if (!finalTranscriptRef.current.trim()) {
        clearSession();
      }
      startListening();
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Single toggle button */}
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
            minWidth: "140px"
          }}
        >
          {isListening ? (
            <>🛑 Stop Recording</>
          ) : (
            <>🎤 Start Recording</>
          )}
        </button>

        <button
          onClick={addToSkills}
          disabled={!finalTranscriptRef.current.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: finalTranscriptRef.current.trim() ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: finalTranscriptRef.current.trim() ? "pointer" : "not-allowed",
          }}
        >
          ✅ Add to Skills
        </button>

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
      </div>

      {/* Status indicators */}
      <div style={{ marginBottom: "10px" }}>
        {isListening && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            color: "#dc3545", 
            fontWeight: "bold",
            marginBottom: "5px"
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#dc3545",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite"
            }}></div>
            🎧 Listening... (auto-stops after 15s silence)
          </div>
        )}
        
        {finalTranscriptRef.current.trim() && (
          <div style={{ 
            color: "#28a745", 
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}>
            ✅ <strong>Ready to add:</strong> {finalTranscriptRef.current.length} characters captured
          </div>
        )}
      </div>

      {/* Current session display */}
      {currentSessionText && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            border: "2px solid #dee2e6",
            borderRadius: "8px",
            fontSize: "16px",
            lineHeight: "1.5",
            minHeight: "60px"
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#495057" }}>
            📝 Your spoken text:
          </div>
          {currentSessionText}
        </div>
      )}

      {/* CSS for pulse animation */}
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