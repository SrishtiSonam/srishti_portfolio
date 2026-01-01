class VoiceService {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSupported = 'speechSynthesis' in window;
    }

    /**
     * Check if text-to-speech is supported
     */
    isTextToSpeechSupported() {
        return this.isSupported;
    }

    /**
     * Speak text using Web Speech API
     */
    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('Text-to-speech is not supported in this browser');
            return;
        }

        // Cancel any ongoing speech
        this.stop();

        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Configure voice settings
        this.currentUtterance.rate = options.rate || 1.0;
        this.currentUtterance.pitch = options.pitch || 1.0;
        this.currentUtterance.volume = options.volume || 1.0;
        this.currentUtterance.lang = options.lang || 'en-US';

        // Select voice if specified
        if (options.voiceName) {
            const voices = this.synthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.name === options.voiceName);
            if (selectedVoice) {
                this.currentUtterance.voice = selectedVoice;
            }
        }

        // Event handlers
        if (options.onStart) {
            this.currentUtterance.onstart = options.onStart;
        }
        if (options.onEnd) {
            this.currentUtterance.onend = options.onEnd;
        }
        if (options.onError) {
            this.currentUtterance.onerror = options.onError;
        }

        // Speak
        this.synthesis.speak(this.currentUtterance);
    }

    /**
     * Stop current speech
     */
    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
    }

    /**
     * Pause current speech
     */
    pause() {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
        }
    }

    /**
     * Resume paused speech
     */
    resume() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }

    /**
     * Get available voices
     */
    getVoices() {
        return this.synthesis.getVoices();
    }

    /**
     * Check if currently speaking
     */
    isSpeaking() {
        return this.synthesis.speaking;
    }

    /**
     * Check if currently paused
     */
    isPaused() {
        return this.synthesis.paused;
    }
}

export const voiceService = new VoiceService();
