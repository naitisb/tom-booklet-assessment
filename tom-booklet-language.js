// Language and Localization Support for ToM Assessment
// Handles American English vs British English translations

const LANGUAGE_VARIANTS = {
    'en-US': {
        name: 'American English',
        region: 'United States',
        translations: {
            // School terms
            'grade': 'grade',
            'kindergarten': 'kindergarten',
            'preschool': 'preschool',
            'teacher': 'teacher',
            'recess': 'recess',
            'snacktime': 'snack time',

            // Common words
            'mom': 'mom',
            'color': 'color',
            'favorite': 'favorite',
            'realize': 'realize',
            'recognize': 'recognize',

            // Story-specific
            'playground': 'playground',
            'slide': 'slide',
            'swings': 'swings',
            'sandbox': 'sandbox'
        },
        schoolLevels: [
            { value: 'preschool', label: 'Preschool' },
            { value: 'k', label: 'Kindergarten' },
            { value: '1', label: '1st Grade' },
            { value: '2', label: '2nd Grade' },
            { value: '3', label: '3rd Grade' },
            { value: '4', label: '4th Grade' },
            { value: '5', label: '5th Grade' },
            { value: '6', label: '6th Grade' },
            { value: '7', label: '7th Grade' },
            { value: '8', label: '8th Grade' }
        ]
    },

    'en-GB-ENG': {
        name: 'British English (England)',
        region: 'England',
        translations: {
            // School terms
            'grade': 'year',
            'kindergarten': 'reception',
            'preschool': 'nursery',
            'teacher': 'teacher',
            'recess': 'break time',
            'snacktime': 'snack time',

            // Common words
            'mom': 'mum',
            'color': 'colour',
            'favorite': 'favourite',
            'realize': 'realise',
            'recognize': 'recognise',

            // Story-specific
            'playground': 'playground',
            'slide': 'slide',
            'swings': 'swings',
            'sandbox': 'sandpit'
        },
        schoolLevels: [
            { value: 'nursery', label: 'Nursery' },
            { value: 'reception', label: 'Reception' },
            { value: 'year1', label: 'Year 1' },
            { value: 'year2', label: 'Year 2' },
            { value: 'year3', label: 'Year 3' },
            { value: 'year4', label: 'Year 4' },
            { value: 'year5', label: 'Year 5' },
            { value: 'year6', label: 'Year 6' },
            { value: 'year7', label: 'Year 7' },
            { value: 'year8', label: 'Year 8' },
            { value: 'year9', label: 'Year 9' },
            { value: 'year10', label: 'Year 10' },
            { value: 'year11', label: 'Year 11' }
        ]
    },

    'en-GB-SCT': {
        name: 'British English (Scotland)',
        region: 'Scotland',
        translations: {
            // School terms
            'grade': 'year',
            'kindergarten': 'primary 1',
            'preschool': 'nursery',
            'teacher': 'teacher',
            'recess': 'break time',
            'snacktime': 'snack time',

            // Common words
            'mom': 'mum',
            'color': 'colour',
            'favorite': 'favourite',
            'realize': 'realise',
            'recognize': 'recognise',

            // Story-specific
            'playground': 'playground',
            'slide': 'slide',
            'swings': 'swings',
            'sandbox': 'sandpit'
        },
        schoolLevels: [
            { value: 'nursery', label: 'Nursery' },
            { value: 'p1', label: 'Primary 1' },
            { value: 'p2', label: 'Primary 2' },
            { value: 'p3', label: 'Primary 3' },
            { value: 'p4', label: 'Primary 4' },
            { value: 'p5', label: 'Primary 5' },
            { value: 'p6', label: 'Primary 6' },
            { value: 'p7', label: 'Primary 7' },
            { value: 's1', label: 'Secondary 1' },
            { value: 's2', label: 'Secondary 2' },
            { value: 's3', label: 'Secondary 3' },
            { value: 's4', label: 'Secondary 4' }
        ]
    },

    // Alias for backward compatibility
    'en-GB': {
        name: 'British English (England)',
        region: 'England',
        translations: {
            // School terms
            'grade': 'year',
            'kindergarten': 'reception',
            'preschool': 'nursery',
            'teacher': 'teacher',
            'recess': 'break time',
            'snacktime': 'snack time',

            // Common words
            'mom': 'mum',
            'color': 'colour',
            'favorite': 'favourite',
            'realize': 'realise',
            'recognize': 'recognise',

            // Story-specific
            'playground': 'playground',
            'slide': 'slide',
            'swings': 'swings',
            'sandbox': 'sandpit'
        },
        schoolLevels: [
            { value: 'nursery', label: 'Nursery' },
            { value: 'reception', label: 'Reception' },
            { value: 'year1', label: 'Year 1' },
            { value: 'year2', label: 'Year 2' },
            { value: 'year3', label: 'Year 3' },
            { value: 'year4', label: 'Year 4' },
            { value: 'year5', label: 'Year 5' },
            { value: 'year6', label: 'Year 6' },
            { value: 'year7', label: 'Year 7' },
            { value: 'year8', label: 'Year 8' },
            { value: 'year9', label: 'Year 9' },
            { value: 'year10', label: 'Year 10' },
            { value: 'year11', label: 'Year 11' }
        ]
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en-US';
    }

    setLanguage(languageCode) {
        if (LANGUAGE_VARIANTS[languageCode]) {
            this.currentLanguage = languageCode;
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    // Get language code for speech synthesis (en-US or en-GB)
    getSpeechLanguageCode() {
        if (this.currentLanguage.startsWith('en-GB')) {
            return 'en-GB';
        }
        return 'en-US';
    }

    getLanguageName() {
        return LANGUAGE_VARIANTS[this.currentLanguage].name;
    }

    getSchoolLevels() {
        return LANGUAGE_VARIANTS[this.currentLanguage].schoolLevels;
    }

    translate(text) {
        const translations = LANGUAGE_VARIANTS[this.currentLanguage].translations;
        let translatedText = text;

        // Apply translations
        for (const [original, translated] of Object.entries(translations)) {
            // Case-insensitive replacement that preserves original case
            const regex = new RegExp(`\\b${original}\\b`, 'gi');
            translatedText = translatedText.replace(regex, (match) => {
                // Preserve capitalization
                if (match[0] === match[0].toUpperCase()) {
                    return translated.charAt(0).toUpperCase() + translated.slice(1);
                }
                return translated;
            });
        }

        return translatedText;
    }

    // Get appropriate terminology
    getTerm(key) {
        return LANGUAGE_VARIANTS[this.currentLanguage].translations[key] || key;
    }
}

// Audio and Text-to-Speech Support
class AudioManager {
    constructor() {
        this.audioEnabled = false;
        this.currentAudio = null;
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.highlightCallback = null;
        this.voices = [];
        this.preferredVoice = null;

        // Load voices
        this.loadVoices();

        // Voice loading can be async
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.speechSynthesis.getVoices();

        // Try to find appropriate voice based on language
        const languageCode = languageManager.getLanguage();

        if (languageCode.startsWith('en-GB')) {
            // Prefer British English voices for England and Scotland
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.startsWith('en-GB') ||
                voice.name.includes('British') ||
                voice.name.includes('UK')
            );
        } else {
            // Prefer American English voices
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.startsWith('en-US') ||
                voice.name.includes('US') ||
                voice.name.includes('American')
            );
        }

        // Fallback to any English voice
        if (!this.preferredVoice) {
            this.preferredVoice = this.voices.find(voice => voice.lang.startsWith('en'));
        }
    }

    setHighlightCallback(callback) {
        this.highlightCallback = callback;
    }

    enable() {
        this.audioEnabled = true;
    }

    disable() {
        this.audioEnabled = false;
        this.stop();
    }

    isEnabled() {
        return this.audioEnabled;
    }

    stop() {
        if (this.currentUtterance) {
            this.speechSynthesis.cancel();
            this.currentUtterance = null;
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    async speak(text, options = {}) {
        if (!this.audioEnabled) return;

        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        // Set voice
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }

        // Set language (use speech code for TTS)
        utterance.lang = languageManager.getSpeechLanguageCode();

        // Set speech parameters
        utterance.rate = options.rate || 0.9; // Slightly slower for children
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Word boundary event for highlighting
        utterance.onboundary = (event) => {
            if (event.name === 'word' && this.highlightCallback) {
                const wordIndex = this.getWordIndex(text, event.charIndex);
                this.highlightCallback(wordIndex);
            }
        };

        utterance.onend = () => {
            if (this.highlightCallback) {
                this.highlightCallback(-1); // Clear highlight
            }
            this.currentUtterance = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.currentUtterance = null;
        };

        return new Promise((resolve) => {
            utterance.onend = () => {
                if (this.highlightCallback) {
                    this.highlightCallback(-1);
                }
                this.currentUtterance = null;
                resolve();
            };
            this.speechSynthesis.speak(utterance);
        });
    }

    getWordIndex(text, charIndex) {
        const beforeText = text.substring(0, charIndex);
        return beforeText.split(/\s+/).length - 1;
    }

    pause() {
        if (this.currentUtterance) {
            this.speechSynthesis.pause();
        }
    }

    resume() {
        if (this.currentUtterance) {
            this.speechSynthesis.resume();
        }
    }

    isPaused() {
        return this.speechSynthesis.paused;
    }

    isSpeaking() {
        return this.speechSynthesis.speaking;
    }

    // Get available voices for user selection
    getAvailableVoices() {
        return this.voices.filter(voice => voice.lang.startsWith('en'));
    }

    setVoice(voiceName) {
        this.preferredVoice = this.voices.find(voice => voice.name === voiceName);
    }
}

// Text Highlighter for synchronized audio
class TextHighlighter {
    constructor(textElement) {
        this.textElement = textElement;
        this.words = [];
        this.currentWordIndex = -1;
    }

    prepareText(text) {
        // Split text into words and wrap each in a span
        this.words = text.split(/(\s+)/);

        const wrappedHTML = this.words.map((word, index) => {
            if (word.trim() === '') {
                return word; // Preserve whitespace
            }
            return `<span class="word" data-word-index="${Math.floor(index/2)}">${word}</span>`;
        }).join('');

        this.textElement.innerHTML = wrappedHTML;
    }

    highlightWord(wordIndex) {
        // Remove previous highlight
        const previousHighlight = this.textElement.querySelector('.word-highlighted');
        if (previousHighlight) {
            previousHighlight.classList.remove('word-highlighted');
        }

        // Clear all highlights if index is -1
        if (wordIndex === -1) {
            this.currentWordIndex = -1;
            return;
        }

        // Add highlight to current word
        const wordElements = this.textElement.querySelectorAll('.word');
        const targetWord = Array.from(wordElements).find(
            el => parseInt(el.dataset.wordIndex) === wordIndex
        );

        if (targetWord) {
            targetWord.classList.add('word-highlighted');
            this.currentWordIndex = wordIndex;

            // Scroll into view if needed
            targetWord.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    clearHighlight() {
        this.highlightWord(-1);
    }
}

// Global instances
const languageManager = new LanguageManager();
const audioManager = new AudioManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageManager, AudioManager, TextHighlighter, languageManager, audioManager };
}
