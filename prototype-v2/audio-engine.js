/**
 * Sentence-by-Sentence Audio Narration Engine
 * Gradually reveals text as it's narrated with synchronized highlighting
 */

class AudioNarrationEngine {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.isNarrating = false;
        this.voices = [];
        this.preferredVoice = null;
        this.language = 'en-US'; // Can be changed to 'en-GB'

        // Load voices
        this.loadVoices();
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.speechSynthesis.getVoices();

        // Try to find appropriate voice based on language
        if (this.language === 'en-GB') {
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.startsWith('en-GB') ||
                voice.name.includes('British') ||
                voice.name.includes('UK')
            );
        } else {
            // For US English, prefer child-friendly female voices
            // Try to find Samantha, Victoria, or other friendly female voices
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.startsWith('en-US') &&
                voice.name.toLowerCase().includes('female')
            ) || this.voices.find(voice =>
                voice.lang.startsWith('en-US') &&
                (voice.name.includes('Samantha') ||
                 voice.name.includes('Victoria') ||
                 voice.name.includes('Karen') ||
                 voice.name.includes('Zira'))
            ) || this.voices.find(voice =>
                voice.lang.startsWith('en-US')
            );
        }

        // Fallback to any English voice
        if (!this.preferredVoice) {
            this.preferredVoice = this.voices.find(voice => voice.lang.startsWith('en'));
        }

        console.log('Selected voice:', this.preferredVoice?.name);
    }

    setLanguage(lang) {
        this.language = lang;
        this.loadVoices();
    }

    /**
     * Split text into sentences
     */
    parseSentences(text) {
        // Split on periods, exclamation marks, and question marks
        // But preserve the punctuation
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const matches = text.match(sentenceRegex);

        if (matches) {
            return matches.map(s => s.trim());
        } else {
            // If no matches, return the whole text
            return [text.trim()];
        }
    }

    /**
     * Narrate text sentence by sentence with progressive reveal
     */
    async narrateText(text, containerElement, onComplete) {
        this.sentences = this.parseSentences(text);
        this.currentSentenceIndex = 0;
        this.isNarrating = true;

        // Clear container
        containerElement.innerHTML = '';

        // Update status
        this.updateStatus('Narrating...');

        // Narrate each sentence
        for (let i = 0; i < this.sentences.length; i++) {
            this.currentSentenceIndex = i;
            await this.narrateSentence(this.sentences[i], containerElement);
        }

        this.isNarrating = false;
        this.updateStatus('Narration complete');

        if (onComplete) {
            onComplete();
        }
    }

    /**
     * Narrate a single sentence
     */
    async narrateSentence(sentence, containerElement) {
        return new Promise((resolve, reject) => {
            // Add sentence to container
            const sentenceElement = document.createElement('div');
            sentenceElement.className = 'script-sentence active';
            sentenceElement.textContent = sentence;
            containerElement.appendChild(sentenceElement);

            // Scroll into view
            sentenceElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Create utterance
            const utterance = new SpeechSynthesisUtterance(sentence);
            this.currentUtterance = utterance;

            // Set voice and language
            if (this.preferredVoice) {
                utterance.voice = this.preferredVoice;
            }
            utterance.lang = this.language;

            // Make voice more child-friendly and upbeat
            if (this.language === 'en-US') {
                utterance.rate = 0.9; // Natural pace
                utterance.pitch = 1.15; // Slightly higher pitch for friendliness
            } else {
                utterance.rate = 0.85; // Slightly slower for British English
                utterance.pitch = 1.0; // Normal pitch
            }
            utterance.volume = 1.0;

            // When utterance ends
            utterance.onend = () => {
                // Remove highlight from this sentence
                sentenceElement.classList.remove('active');
                resolve();
            };

            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                sentenceElement.classList.remove('active');
                reject(error);
            };

            // Speak
            this.speechSynthesis.speak(utterance);
        });
    }

    /**
     * Stop narration
     */
    stop() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        this.isNarrating = false;
        this.updateStatus('Stopped');
    }

    /**
     * Pause narration
     */
    pause() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.pause();
        }
        this.updateStatus('Paused');
    }

    /**
     * Resume narration
     */
    resume() {
        if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
            this.updateStatus('Narrating...');
        }
    }

    /**
     * Update status indicator
     */
    updateStatus(text) {
        const statusElement = document.getElementById('audioStatusText');
        if (statusElement) {
            statusElement.textContent = text;
        }
    }

    /**
     * Check if narration is in progress
     */
    isSpeaking() {
        return this.speechSynthesis.speaking;
    }
}

// Global instance
const audioEngine = new AudioNarrationEngine();
