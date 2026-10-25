import { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantVisualState, WakeWordSettings } from '../types/jarvis';

export const defaultWakeWordSettings: WakeWordSettings = {
  enabled: true,
  wakePhrase: 'Hey Jarvis',
  handsFreeEnabled: true,
  sensitivity: 'medium',
  voiceResponseEnabled: true,
  listeningTimeoutSeconds: 5,
  animationIntensity: 'high',
  realtimeTranscriptionEnabled: true,
  isMicPaused: false,
};

interface UseJarvisVoiceProps {
  settings: WakeWordSettings;
  onCommandReceived: (command: string) => Promise<string>;
  onTriggerConfirmation?: () => void;
  onExpandOverlay?: () => void;
}

export function useJarvisVoice({
  settings,
  onCommandReceived,
  onTriggerConfirmation,
  onExpandOverlay,
}: UseJarvisVoiceProps) {
  const [visualState, setVisualState] = useState<AssistantVisualState>('STANDBY');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechOutputLevel, setSpeechOutputLevel] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [lastSpeechResponse, setLastSpeechResponse] = useState<string>(
    'Good day, sir. Systems operational. Standing by for "Hey Jarvis" or push-to-talk.'
  );

  // References for cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const latestTranscriptRef = useRef<string>('');

  // Stop Audio Analyser
  const stopAudioAnalyser = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Start Audio Analyser for realistic audio-reactive animations
  const startAudioAnalyser = useCallback(async () => {
    try {
      stopAudioAnalyser();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize 0-100
        const scaled = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(scaled);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Microphone audio analyser unavailable, using simulated level', err);
    }
  }, [stopAudioAnalyser]);

  // Text-To-Speech Synthesis with boundary modulation & deep baritone JARVIS timbre
  const speakText = useCallback(
    (text: string): Promise<void> => {
      return new Promise(resolve => {
        if (!settings.voiceResponseEnabled || !window.speechSynthesis) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Deep, rich baritone timbre (Paul Bettany / classic British JARVIS tone)
        utterance.rate = 0.96; // Measured, elegant, articulate pace
        utterance.pitch = 0.76; // Deep, calm baritone resonance

        // Select the deepest and most natural British / English voice available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          v =>
            v.name.includes('Google UK English Male') ||
            v.name.includes('Daniel') ||
            v.name.includes('Arthur') ||
            v.name.includes('George') ||
            v.name.includes('Oliver') ||
            (v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('male')) ||
            (v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
            v.lang.startsWith('en-GB') ||
            v.lang.startsWith('en')
        );
        if (preferred) utterance.voice = preferred;

        let modulationInterval: NodeJS.Timeout | null = setInterval(() => {
          setSpeechOutputLevel(Math.floor(Math.random() * 55) + 30);
        }, 75);

        utterance.onend = () => {
          if (modulationInterval) clearInterval(modulationInterval);
          setSpeechOutputLevel(0);
          resolve();
        };

        utterance.onerror = () => {
          if (modulationInterval) clearInterval(modulationInterval);
          setSpeechOutputLevel(0);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [settings.voiceResponseEnabled]
  );

  // Interrupt Speech
  const interruptSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechOutputLevel(0);
    setVisualState('STANDBY');
  }, []);

  // Process User Command
  const processCommand = useCallback(
    async (commandText: string) => {
      const trimmed = commandText.trim();
      if (!trimmed || isProcessingRef.current) return;
      isProcessingRef.current = true;

      // 1. Transition to PROCESSING state
      setVisualState('PROCESSING');
      stopAudioAnalyser();

      // Guard timeout to prevent endless thinking
      const thinkingTimeout = setTimeout(() => {
        if (isProcessingRef.current) {
          setVisualState('ERROR');
          setLastSpeechResponse('The AI processing request timed out. Please try again, sir.');
          isProcessingRef.current = false;
        }
      }, 25000);

      try {
        const response = await onCommandReceived(trimmed);
        clearTimeout(thinkingTimeout);
        setLastSpeechResponse(response);

        // 2. Transition to SPEAKING state
        setVisualState('SPEAKING');
        await speakText(response);

        // 3. Complete and return to STANDBY
        setVisualState('STANDBY');
      } catch (err) {
        clearTimeout(thinkingTimeout);
        setVisualState('ERROR');
        setLastSpeechResponse('An anomaly occurred while processing your command, sir.');
      } finally {
        isProcessingRef.current = false;
      }
    },
    [onCommandReceived, speakText, stopAudioAnalyser]
  );

  // Trigger Live Listening for Command with no stale closure
  const startListeningForCommand = useCallback(() => {
    if (settings.isMicPaused) {
      setVisualState('PAUSED');
      return;
    }

    setVisualState('LISTENING');
    setTranscript('');
    latestTranscriptRef.current = '';
    startAudioAnalyser();

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('SpeechRecognition API not supported on this browser platform');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      // Reset any silence timeout
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognizer.stop();
        const captured = latestTranscriptRef.current.trim();
        if (captured) {
          latestTranscriptRef.current = '';
          processCommand(captured);
        } else {
          stopAudioAnalyser();
          setVisualState('STANDBY');
        }
      }, settings.listeningTimeoutSeconds * 1000);

      recognizer.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const currentText = final || interim;
        setTranscript(currentText);
        latestTranscriptRef.current = currentText;

        // Reset silence timer when user speaks
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          recognizer.stop();
        }, 1800);
      };

      recognizer.onend = () => {
        stopAudioAnalyser();
        const captured = latestTranscriptRef.current.trim();
        latestTranscriptRef.current = '';
        if (captured) {
          processCommand(captured);
        } else {
          setVisualState('STANDBY');
        }
      };

      recognizer.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        stopAudioAnalyser();
        setVisualState('STANDBY');
      };

      recognizer.start();
    } catch (e) {
      console.error('Failed to initiate speech recognizer:', e);
      stopAudioAnalyser();
      setVisualState('STANDBY');
    }
  }, [
    settings.isMicPaused,
    settings.listeningTimeoutSeconds,
    startAudioAnalyser,
    stopAudioAnalyser,
    processCommand,
  ]);

  // Trigger Wake Word Sequence (Section B: Animated Wake-up Effect)
  const triggerWakeWordActivation = useCallback(
    async (manualPhrase?: string) => {
      if (settings.isMicPaused || isProcessingRef.current) return;

      // Expand floating overlay if minimized
      if (onExpandOverlay) onExpandOverlay();

      // Step 1 & 2: WAKE DETECTED with glowing outer ring
      setVisualState('WAKE_DETECTED');
      const greeting = "Yes, I'm listening.";
      setLastSpeechResponse(greeting);

      // Brief pause for the wake-up expansion animation
      if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current);
      wakeTimeoutRef.current = setTimeout(async () => {
        // Speak short greeting
        if (settings.voiceResponseEnabled) {
          await speakText(greeting);
        }
        // Step 9: Transition into listening animation
        startListeningForCommand();
      }, 700);
    },
    [settings.isMicPaused, settings.voiceResponseEnabled, onExpandOverlay, speakText, startListeningForCommand]
  );

  // Continuous Ambient Wake-Word Spotter (On-Device Keyword Spotting)
  useEffect(() => {
    if (!settings.enabled || settings.isMicPaused || !settings.handsFreeEnabled) {
      if (settings.isMicPaused) setVisualState('PAUSED');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    let isRunning = true;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const wakeRecognizer = new SpeechRecognition();
    wakeRecognizer.continuous = true;
    wakeRecognizer.interimResults = true;
    wakeRecognizer.lang = 'en-US';

    const targetPhrases = ['jarvis', 'hey jarvis', 'hi jarvis', 'ok jarvis'];

    wakeRecognizer.onresult = (event: any) => {
      if (visualState !== 'STANDBY') return;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const spoken = event.results[i][0].transcript.toLowerCase().trim();
        const matched = targetPhrases.some(phrase => spoken.includes(phrase));

        if (matched) {
          wakeRecognizer.stop();
          triggerWakeWordActivation();
          break;
        }
      }
    };

    wakeRecognizer.onend = () => {
      // Loop continuous listening if still in STANDBY and hands-free is enabled
      if (isRunning && visualState === 'STANDBY' && settings.enabled && !settings.isMicPaused) {
        try {
          wakeRecognizer.start();
        } catch (_) {}
      }
    };

    try {
      wakeRecognizer.start();
      recognitionRef.current = wakeRecognizer;
    } catch (_) {}

    return () => {
      isRunning = false;
      try {
        wakeRecognizer.stop();
      } catch (_) {}
    };
  }, [settings.enabled, settings.isMicPaused, settings.handsFreeEnabled, visualState, triggerWakeWordActivation]);

  // Push-to-Talk Toggle
  const togglePushToTalk = () => {
    if (visualState === 'LISTENING') {
      stopAudioAnalyser();
      setVisualState('STANDBY');
    } else {
      startListeningForCommand();
    }
  };

  return {
    visualState,
    setVisualState,
    audioLevel,
    speechOutputLevel,
    transcript,
    lastSpeechResponse,
    setLastSpeechResponse,
    triggerWakeWordActivation,
    togglePushToTalk,
    interruptSpeech,
    processCommand,
    speakText,
  };
}
