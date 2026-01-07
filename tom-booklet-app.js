// Enhanced ToM Booklet Assessment Application with Audio & Language Support
// Extends original functionality with text-to-speech, word highlighting, and British English

// Voice Recognition Support
class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.transcript = '';

        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 1;
        }
    }

    isSupported() {
        return this.recognition !== null;
    }

    setLanguage(languageCode) {
        if (this.recognition) {
            this.recognition.lang = languageCode;
        }
    }

    async startListening() {
        if (!this.recognition) {
            throw new Error('Speech recognition not supported');
        }

        return new Promise((resolve, reject) => {
            this.transcript = '';
            this.isListening = true;

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                this.transcript = finalTranscript || interimTranscript;
            };

            this.recognition.onend = () => {
                this.isListening = false;
                resolve(this.transcript);
            };

            this.recognition.onerror = (event) => {
                this.isListening = false;
                reject(event.error);
            };

            this.recognition.start();
        });
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    getTranscript() {
        return this.transcript;
    }
}

// Global voice recognition instance
const voiceRecognition = new VoiceRecognition();

// Enhanced Assessment Class
class EnhancedToMAssessment {
    constructor() {
        this.participantData = {};
        this.currentBooklet = null;
        this.currentItemIndex = 0;
        this.responses = [];
        this.freeResponseStorage = {}; // Store free responses for substitution
        this.startTime = null;
        this.itemStartTime = null;
        this.sessionData = {};
        this.currentHighlighter = null;
        this.audioRecordings = {}; // Store audio recordings by question ID
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }

    initialize(participantData, bookletType) {
        this.participantData = participantData;
        this.currentBooklet = bookletType;
        this.startTime = new Date().toISOString();
        this.currentItemIndex = 0;
        this.responses = [];
        this.freeResponseStorage = {};

        // Load appropriate booklet data
        this.items = this.loadBookletItems(bookletType);

        // Filter items based on age if needed
        if (bookletType === 'booklet2_young') {
            this.items = this.items.filter(item => !item.excludeForYoung);
        } else if (bookletType === 'booklet2') {
            this.items = this.items.filter(item => {
                if (!item.ageRestriction) return true;
                const age = parseInt(participantData.age);
                return age >= item.ageRestriction.min && age <= item.ageRestriction.max;
            });
        }

        this.sessionData = {
            participantId: participantData.id,
            age: participantData.age,
            booklet: bookletType,
            language: languageManager.getLanguage(),
            audioEnabled: audioManager.isEnabled(),
            examiner: participantData.examiner,
            startTime: this.startTime,
            responses: []
        };

        // Set voice recognition language (use speech code)
        voiceRecognition.setLanguage(languageManager.getSpeechLanguageCode());
    }

    loadBookletItems(bookletType) {
        if (bookletType === 'booklet1') {
            return [...BOOKLET_1_DATA.story1.items];
        } else if (bookletType === 'booklet2' || bookletType === 'booklet2_young') {
            return BOOKLET_2_DATA.items;
        }
        return [];
    }

    getCurrentItem() {
        if (this.currentItemIndex >= this.items.length) {
            return null;
        }
        return this.items[this.currentItemIndex];
    }

    async renderCurrentItem() {
        const item = this.getCurrentItem();

        if (!item) {
            this.completeAssessment();
            return;
        }

        this.itemStartTime = new Date();

        // Stop any playing audio
        audioManager.stop();

        // Update progress
        this.updateProgress();

        // Render illustration
        this.renderIllustration(item.illustration);

        // Render metadata
        this.renderMetadata(item);

        // Render script with translation
        await this.renderScript(item.script);

        // Render questions
        this.renderQuestions(item);

        // Update navigation buttons
        this.updateNavigation();
    }

    renderIllustration(illustrationPath) {
        const container = document.getElementById('illustrationContainer');

        const img = new Image();
        img.onload = function() {
            container.innerHTML = `<img src="${illustrationPath}" alt="Story illustration">`;
        };
        img.onerror = function() {
            container.innerHTML = `
                <div class="illustration-placeholder">
                    Illustration: ${illustrationPath.split('/').pop()}<br>
                    <small style="font-size: 0.8em;">(Place image files in the appropriate folder)</small>
                </div>
            `;
        };
        img.src = illustrationPath;
    }

    renderMetadata(item) {
        const metadata = document.getElementById('itemMetadata');
        const scored = item.scored !== false ? "Yes" : "No (Filler)";
        metadata.innerHTML = `
            <strong>Item ${item.number}:</strong> ${item.type} |
            <strong>ID:</strong> ${item.id} |
            <strong>Scored:</strong> ${scored}
        `;
    }

    async renderScript(scriptText) {
        const scriptElement = document.getElementById('scriptText');

        // Translate script
        let processedScript = languageManager.translate(scriptText);

        // Replace placeholders with stored free responses
        processedScript = this.replaceResponsePlaceholders(processedScript);

        // Grade placeholder removed (no longer collected)

        // If audio is enabled, prepare for highlighting
        if (audioManager.isEnabled()) {
            scriptElement.classList.add('audio-enabled');

            // Create highlighter
            this.currentHighlighter = new TextHighlighter(scriptElement);
            this.currentHighlighter.prepareText(processedScript);

            // Set up audio callback
            audioManager.setHighlightCallback((wordIndex) => {
                this.currentHighlighter.highlightWord(wordIndex);
            });

            // Auto-play script
            document.getElementById('audioStatus').textContent = 'Playing...';
            document.getElementById('playPauseBtn').classList.add('playing');
            document.getElementById('playPauseText').textContent = 'Pause';

            try {
                await audioManager.speak(processedScript);
                document.getElementById('audioStatus').textContent = 'Complete';
                document.getElementById('playPauseBtn').classList.remove('playing');
                document.getElementById('playPauseText').textContent = 'Replay';
            } catch (error) {
                console.error('Audio playback error:', error);
                document.getElementById('audioStatus').textContent = 'Error';
            }
        } else {
            scriptElement.classList.remove('audio-enabled');
            scriptElement.innerHTML = processedScript;
        }
    }

    replaceResponsePlaceholders(text) {
        let result = text;

        // Replace {childChoice} patterns
        for (const [key, value] of Object.entries(this.freeResponseStorage)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, value);
        }

        return result;
    }

    renderQuestions(item) {
        const questionContainer = document.getElementById('questionContainer');
        const questionText = document.getElementById('questionText');
        const responseArea = document.getElementById('responseArea');

        const currentQuestionIndex = this.getCurrentQuestionIndex(item);

        if (currentQuestionIndex >= item.questions.length) {
            if (item.followUp) {
                const translatedFollowUp = languageManager.translate(item.followUp);
                questionText.innerHTML = translatedFollowUp;
                responseArea.innerHTML = `
                    <p style="color: #6c757d; font-style: italic;">Read the follow-up text above, then proceed to the next item.</p>
                `;
            }
            return;
        }

        const question = item.questions[currentQuestionIndex];

        // Translate and process question text
        let processedQuestionText = languageManager.translate(question.text);
        processedQuestionText = this.replaceResponsePlaceholders(processedQuestionText);
        processedQuestionText = this.processQuestionText(processedQuestionText, item);
        questionText.innerHTML = processedQuestionText;

        // Render response options
        responseArea.innerHTML = '';

        switch (question.type) {
            case '2AFC':
            case 'preference':
            case 'implicit_action':
                if (question.type === 'preference') {
                    this.renderFreeResponse(question, responseArea, item);
                } else {
                    this.renderMultipleChoice(question, responseArea);
                }
                break;

            case 'explanation':
            case '2AFC_explanation':
                this.renderTextResponse(question, responseArea);
                if (question.type === '2AFC_explanation') {
                    this.renderMultipleChoice(question, responseArea);
                }
                break;

            case 'control':
                responseArea.innerHTML = `
                    <p style="color: #6c757d; font-style: italic;">This is a control item. Record the participant's action.</p>
                    <button class="btn" onclick="assessment.recordControlResponse('${question.id}')">Continue</button>
                `;
                break;
        }
    }

    renderFreeResponse(question, container, item) {
        const div = document.createElement('div');
        div.innerHTML = `
            <p style="margin-bottom: 15px; color: #666;">
                <strong>This is a free response question.</strong> The participant can answer in their own words.
            </p>
        `;

        // Multiple choice buttons (required for all free response questions)
        if (question.options && question.options.length > 0) {
            const choiceDiv = document.createElement('div');
            choiceDiv.innerHTML = '<p style="margin: 15px 0 10px 0; color: #333;"><strong>Select an answer:</strong></p>';
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '10px';
            btnContainer.style.flexWrap = 'wrap';
            btnContainer.style.marginBottom = '15px';

            // Add all options as buttons
            question.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'response-btn';
                btn.textContent = option;
                btn.style.padding = '12px 24px';
                btn.dataset.value = option;
                btn.onclick = () => {
                    // Deselect all other buttons
                    btnContainer.querySelectorAll('.response-btn').forEach(b => {
                        b.classList.remove('selected');
                        b.style.background = '';
                    });
                    // Select this button
                    btn.classList.add('selected');
                    btn.style.background = '#4CAF50';
                    btn.style.color = 'white';

                    // Auto-fill textarea
                    const textarea = document.getElementById('freeResponseInput');
                    textarea.value = option;
                    textarea.style.display = 'block';
                };
                btnContainer.appendChild(btn);
            });

            // Add "Other" option
            const otherBtn = document.createElement('button');
            otherBtn.className = 'response-btn';
            otherBtn.textContent = 'Other';
            otherBtn.style.padding = '12px 24px';
            otherBtn.dataset.value = 'other';
            otherBtn.onclick = () => {
                // Deselect all other buttons
                btnContainer.querySelectorAll('.response-btn').forEach(b => {
                    b.classList.remove('selected');
                    b.style.background = '';
                });
                // Select "Other"
                otherBtn.classList.add('selected');
                otherBtn.style.background = '#4CAF50';
                otherBtn.style.color = 'white';

                // Show and focus textarea for custom input
                const textarea = document.getElementById('freeResponseInput');
                textarea.value = '';
                textarea.style.display = 'block';
                textarea.focus();
            };
            btnContainer.appendChild(otherBtn);

            choiceDiv.appendChild(btnContainer);
            div.appendChild(choiceDiv);
        }

        // Create input area (initially hidden if options exist)
        const inputDiv = document.createElement('div');
        inputDiv.style.marginBottom = '15px';

        const textarea = document.createElement('textarea');
        textarea.className = 'text-response';
        textarea.id = 'freeResponseInput';
        textarea.placeholder = "Type or dictate the participant's response...";
        if (question.options && question.options.length > 0) {
            textarea.style.display = 'none'; // Hidden until option selected
        }
        inputDiv.appendChild(textarea);

        // Voice input button if supported
        if (voiceRecognition.isSupported()) {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'audio-btn';
            voiceBtn.style.marginTop = '10px';
            voiceBtn.innerHTML = '<span class="icon">🎤</span> <span id="voiceButtonText">Start Voice Input (Speech-to-Text)</span>';
            voiceBtn.id = 'voiceInputBtn';
            voiceBtn.onclick = () => this.toggleVoiceInput(textarea, voiceBtn);
            inputDiv.appendChild(voiceBtn);
        }

        // Audio recording button (records actual audio file)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const recordBtn = document.createElement('button');
            recordBtn.className = 'audio-btn';
            recordBtn.style.marginTop = '10px';
            recordBtn.style.marginLeft = '10px';
            recordBtn.innerHTML = '<span class="icon">⏺️</span> <span id="recordButtonText">Record Audio Response</span>';
            recordBtn.id = 'audioRecordBtn';
            recordBtn.onclick = () => this.toggleAudioRecording(recordBtn, question.id);
            inputDiv.appendChild(recordBtn);
        }

        div.appendChild(inputDiv);

        // Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn';
        confirmBtn.style.marginTop = '20px';
        confirmBtn.textContent = 'Save Response & Continue';
        confirmBtn.onclick = () => {
            const response = textarea.value.trim();
            if (response) {
                // Store for placeholder replacement
                if (question.storeAs) {
                    this.freeResponseStorage[question.storeAs] = response;

                    // Also store opposite if it's a two-option question
                    if (question.options && question.options.length === 2) {
                        const opposite = question.options.find(opt =>
                            opt.toLowerCase() !== response.toLowerCase()
                        );
                        if (opposite) {
                            this.freeResponseStorage[question.storeAs + '_opposite'] = opposite;
                        }
                    }
                }

                this.recordResponse(question.id, response, 'free_response');
                this.moveToNextQuestion();
            } else {
                alert('Please enter a response before continuing.');
            }
        };
        div.appendChild(confirmBtn);

        container.appendChild(div);
    }

    async toggleVoiceInput(textarea, button) {
        if (voiceRecognition.isListening) {
            voiceRecognition.stopListening();
            button.innerHTML = '<span class="icon">🎤</span> Start Voice Input (Speech-to-Text)';
            return;
        }

        button.innerHTML = '<span class="icon">🔴</span> Listening...';
        button.disabled = true;

        try {
            const transcript = await voiceRecognition.startListening();
            if (transcript) {
                textarea.value = transcript;
                textarea.style.display = 'block';
            }
        } catch (error) {
            console.error('Voice recognition error:', error);
            alert('Voice recognition error: ' + error);
        } finally {
            button.innerHTML = '<span class="icon">🎤</span> Start Voice Input (Speech-to-Text)';
            button.disabled = false;
        }
    }

    async toggleAudioRecording(button, questionId) {
        if (this.isRecording) {
            // Stop recording
            this.stopAudioRecording(button);
        } else {
            // Start recording
            await this.startAudioRecording(button, questionId);
        }
    }

    async startAudioRecording(button, questionId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.audioChunks = [];
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                // Store audio recording
                this.audioRecordings[questionId] = {
                    blob: audioBlob,
                    timestamp: new Date().toISOString(),
                    duration: (Date.now() - this.recordingStartTime) / 1000
                };

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                // Show success message
                const statusMsg = document.createElement('div');
                statusMsg.style.cssText = 'margin-top: 10px; padding: 10px; background: #4CAF50; color: white; border-radius: 5px;';
                statusMsg.textContent = `✓ Audio recorded (${Math.round(this.audioRecordings[questionId].duration)}s)`;
                button.parentElement.appendChild(statusMsg);

                setTimeout(() => statusMsg.remove(), 3000);
            };

            this.recordingStartTime = Date.now();
            this.mediaRecorder.start();
            this.isRecording = true;

            button.innerHTML = '<span class="icon">⏹️</span> <span id="recordButtonText">Stop Recording</span>';
            button.style.background = '#f44336';

        } catch (error) {
            console.error('Audio recording error:', error);
            alert('Could not access microphone: ' + error.message);
        }
    }

    stopAudioRecording(button) {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;

            button.innerHTML = '<span class="icon">⏺️</span> <span id="recordButtonText">Record Audio Response</span>';
            button.style.background = '';
        }
    }

    renderMultipleChoice(question, container) {
        const div = document.createElement('div');
        div.className = 'response-options';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'response-btn';
            button.textContent = languageManager.translate(option);
            button.onclick = () => this.selectResponse(question.id, option, button);
            div.appendChild(button);
        });

        container.appendChild(div);

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn';
        confirmBtn.style.marginTop = '20px';
        confirmBtn.textContent = 'Confirm Response';
        confirmBtn.disabled = true;
        confirmBtn.id = 'confirmBtn';
        confirmBtn.onclick = () => this.confirmResponse(question);
        container.appendChild(confirmBtn);
    }

    renderTextResponse(question, container) {
        const div = document.createElement('div');

        const textarea = document.createElement('textarea');
        textarea.className = 'text-response';
        textarea.placeholder = "Type the participant's verbal response here...";
        textarea.id = `response_${question.id}`;
        div.appendChild(textarea);

        // Voice input button if supported
        if (voiceRecognition.isSupported()) {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'audio-btn';
            voiceBtn.style.marginTop = '10px';
            voiceBtn.innerHTML = '<span class="icon">🎤</span> <span>Start Voice Input</span>';
            voiceBtn.onclick = () => this.toggleVoiceInput(textarea, voiceBtn);
            div.appendChild(voiceBtn);
        }

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn';
        confirmBtn.style.marginTop = '20px';
        confirmBtn.textContent = 'Save Response & Continue';
        confirmBtn.onclick = () => {
            const response = textarea.value.trim();
            if (response) {
                this.recordResponse(question.id, response, 'text');
                this.moveToNextQuestion();
            } else {
                alert('Please enter a response before continuing.');
            }
        };
        div.appendChild(confirmBtn);

        container.appendChild(div);
    }

    selectResponse(questionId, response, button) {
        document.querySelectorAll('.response-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        button.classList.add('selected');
        this.tempSelection = { questionId, response };

        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.disabled = false;
    }

    confirmResponse(question) {
        if (!this.tempSelection) {
            alert('Please select a response.');
            return;
        }

        this.recordResponse(question.id, this.tempSelection.response, '2AFC');
        this.applyBranchingLogic(question, this.tempSelection.response);
        this.moveToNextQuestion();
    }

    applyBranchingLogic(question, response) {
        const item = this.getCurrentItem();

        if (question.storeAs) {
            this.freeResponseStorage[question.storeAs] = response;
        }

        if (question.type === 'preference' && question.options) {
            const opposite = this.getOppositeChoice(question.options, response);
            this.freeResponseStorage[question.storeAs + '_opposite'] = opposite;
        }

        if (item.conditionalFollowUp && question.correctAnswer) {
            const isCorrect = response === question.correctAnswer;
            const followUpText = item.conditionalFollowUp.find(f =>
                f.condition === (isCorrect ? 'correct' : 'incorrect')
            );

            if (followUpText) {
                this.sessionData[`${item.id}_conditionalFollowUp`] = followUpText.text;
            }
        }
    }

    getOppositeChoice(options, selected) {
        return options.find(opt => opt !== selected) || '';
    }

    processQuestionText(text, item) {
        let processed = text;

        // Replace stored responses
        for (const [key, value] of Object.entries(this.freeResponseStorage)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            processed = processed.replace(regex, value);
        }

        return processed;
    }

    getCurrentQuestionIndex(item) {
        const itemResponses = this.responses.filter(r => r.itemId === item.id);
        return itemResponses.length;
    }

    recordResponse(questionId, response, type) {
        const item = this.getCurrentItem();
        const endTime = new Date();
        const responseTime = endTime - this.itemStartTime;

        const responseData = {
            itemId: item.id,
            itemNumber: item.number,
            itemType: item.type,
            questionId: questionId,
            questionType: type,
            response: response,
            timestamp: endTime.toISOString(),
            responseTime: responseTime
        };

        this.responses.push(responseData);
        this.sessionData.responses.push(responseData);
    }

    recordControlResponse(questionId) {
        this.recordResponse(questionId, 'completed', 'control');
        this.moveToNextQuestion();
    }

    async moveToNextQuestion() {
        const item = this.getCurrentItem();
        const currentQuestionIndex = this.getCurrentQuestionIndex(item);

        if (currentQuestionIndex < item.questions.length) {
            await this.renderCurrentItem();
        } else {
            this.nextItem();
        }
    }

    nextItem() {
        this.currentItemIndex++;
        this.tempSelection = null;

        if (this.currentItemIndex >= this.items.length) {
            this.completeAssessment();
        } else {
            this.renderCurrentItem();
        }
    }

    previousItem() {
        if (this.currentItemIndex > 0) {
            this.currentItemIndex--;

            const prevItem = this.getCurrentItem();
            this.responses = this.responses.filter(r => r.itemId !== prevItem.id);
            this.sessionData.responses = this.sessionData.responses.filter(r => r.itemId !== prevItem.id);

            this.renderCurrentItem();
        }
    }

    updateProgress() {
        const progress = ((this.currentItemIndex) / this.items.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `Item ${this.currentItemIndex + 1} of ${this.items.length}`;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        prevBtn.disabled = this.currentItemIndex === 0;
    }

    completeAssessment() {
        this.sessionData.endTime = new Date().toISOString();
        this.sessionData.totalDuration = new Date() - new Date(this.startTime);

        audioManager.stop();

        document.querySelector('.assessment-screen').classList.remove('active');
        document.querySelector('.completion-screen').classList.add('active');

        this.displayResults();
    }

    displayResults() {
        const resultsContainer = document.getElementById('resultsSummary');

        const totalItems = this.items.filter(i => i.scored !== false).length;
        const totalResponses = this.responses.length;
        const avgResponseTime = this.responses.reduce((sum, r) => sum + r.responseTime, 0) / totalResponses;

        resultsContainer.innerHTML = `
            <h3>Assessment Summary</h3>
            <div class="results-item">
                <strong>Participant ID:</strong> ${this.participantData.id}
            </div>
            <div class="results-item">
                <strong>Age:</strong> ${this.participantData.age} years
            </div>
            <div class="results-item">
                <strong>Language:</strong> ${languageManager.getLanguageName()}
            </div>
            <div class="results-item">
                <strong>Audio Enabled:</strong> ${this.sessionData.audioEnabled ? 'Yes' : 'No'}
            </div>
            <div class="results-item">
                <strong>Booklet:</strong> ${this.currentBooklet}
            </div>
            <div class="results-item">
                <strong>Total Scored Items:</strong> ${totalItems}
            </div>
            <div class="results-item">
                <strong>Total Responses:</strong> ${totalResponses}
            </div>
            <div class="results-item">
                <strong>Average Response Time:</strong> ${(avgResponseTime / 1000).toFixed(2)} seconds
            </div>
            <div class="results-item">
                <strong>Total Duration:</strong> ${(this.sessionData.totalDuration / 60000).toFixed(2)} minutes
            </div>
        `;
    }

    downloadJSON() {
        const dataStr = JSON.stringify(this.sessionData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ToM_${this.participantData.id}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    downloadCSV() {
        let csv = 'ParticipantID,Age,Language,AudioEnabled,Booklet,Examiner,ItemID,ItemNumber,ItemType,QuestionID,QuestionType,Response,HasAudioRecording,Timestamp,ResponseTime\n';

        this.responses.forEach(r => {
            const hasAudio = this.audioRecordings[r.questionId] ? 'Yes' : 'No';
            const row = [
                this.participantData.id,
                this.participantData.age,
                this.sessionData.language,
                this.sessionData.audioEnabled,
                this.currentBooklet,
                this.participantData.examiner,
                r.itemId,
                r.itemNumber,
                r.itemType,
                r.questionId,
                r.questionType,
                `"${r.response.replace(/"/g, '""')}"`,
                hasAudio,
                r.timestamp,
                r.responseTime
            ].join(',');
            csv += row + '\n';
        });

        const dataBlob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ToM_${this.participantData.id}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    downloadAudioRecordings() {
        if (Object.keys(this.audioRecordings).length === 0) {
            alert('No audio recordings to download.');
            return;
        }

        // Create a zip-like structure using multiple downloads
        const participantId = this.participantData.id;
        const dateStr = new Date().toISOString().split('T')[0];

        Object.entries(this.audioRecordings).forEach(([questionId, recording], index) => {
            setTimeout(() => {
                const url = URL.createObjectURL(recording.blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ToM_${participantId}_${questionId}_${dateStr}.webm`;
                link.click();
                URL.revokeObjectURL(url);
            }, index * 500); // Stagger downloads by 500ms
        });

        alert(`Downloading ${Object.keys(this.audioRecordings).length} audio recording(s)...`);
    }
}

// Global assessment instance
let assessment = new EnhancedToMAssessment();

// UI Functions
function updateLanguage() {
    const languageCode = document.getElementById('languageSelect').value;
    languageManager.setLanguage(languageCode);
    audioManager.loadVoices();
}

function toggleAudio() {
    const enabled = document.getElementById('audioEnabled').checked;
    const audioInfo = document.getElementById('audioInfo');
    const audioControls = document.getElementById('audioControls');

    if (enabled) {
        audioManager.enable();
        audioInfo.style.display = 'block';
    } else {
        audioManager.disable();
        audioInfo.style.display = 'none';
    }
}

function togglePlayPause() {
    if (audioManager.isSpeaking()) {
        if (audioManager.isPaused()) {
            audioManager.resume();
            document.getElementById('playPauseText').textContent = 'Pause';
            document.getElementById('audioStatus').textContent = 'Playing...';
        } else {
            audioManager.pause();
            document.getElementById('playPauseText').textContent = 'Resume';
            document.getElementById('audioStatus').textContent = 'Paused';
        }
    } else {
        replayAudio();
    }
}

function stopAudio() {
    audioManager.stop();
    document.getElementById('playPauseBtn').classList.remove('playing');
    document.getElementById('playPauseText').textContent = 'Play Audio';
    document.getElementById('audioStatus').textContent = 'Stopped';
}

async function replayAudio() {
    const item = assessment.getCurrentItem();
    if (item) {
        const scriptElement = document.getElementById('scriptText');
        const text = scriptElement.textContent || scriptElement.innerText;

        document.getElementById('audioStatus').textContent = 'Playing...';
        document.getElementById('playPauseBtn').classList.add('playing');
        document.getElementById('playPauseText').textContent = 'Pause';

        try {
            await audioManager.speak(text);
            document.getElementById('audioStatus').textContent = 'Complete';
            document.getElementById('playPauseBtn').classList.remove('playing');
            document.getElementById('playPauseText').textContent = 'Replay';
        } catch (error) {
            console.error('Audio replay error:', error);
            document.getElementById('audioStatus').textContent = 'Error';
        }
    }
}

function startAssessment() {
    const participantId = document.getElementById('participantId').value.trim();
    const participantAge = document.getElementById('participantAge').value;
    const bookletSelect = document.getElementById('bookletSelect').value;
    const examinerName = document.getElementById('examinerName').value.trim();

    if (!participantId) {
        alert('Please enter a Participant ID');
        return;
    }

    if (!participantAge || participantAge < 3 || participantAge > 18) {
        alert('Please enter a valid age (3-18 years)');
        return;
    }

    if (!bookletSelect) {
        alert('Please select a booklet');
        return;
    }

    const participantData = {
        id: participantId,
        age: participantAge,
        examiner: examinerName
    };

    assessment.initialize(participantData, bookletSelect);

    document.querySelector('.setup-screen').classList.remove('active');
    document.querySelector('.assessment-screen').classList.add('active');

    // Show audio controls if enabled
    if (audioManager.isEnabled()) {
        document.getElementById('audioControls').classList.add('active');
    }

    assessment.renderCurrentItem();
}

function nextItem() {
    const item = assessment.getCurrentItem();
    const currentQuestionIndex = assessment.getCurrentQuestionIndex(item);

    if (currentQuestionIndex < item.questions.length) {
        alert('Please complete the current question before proceeding.');
        return;
    }

    assessment.nextItem();
}

function previousItem() {
    assessment.previousItem();
}

function downloadResults() {
    assessment.downloadJSON();
}

function downloadCSV() {
    assessment.downloadCSV();
}

function downloadAudioFiles() {
    assessment.downloadAudioRecordings();
}

function resetAssessment() {
    if (confirm('Are you sure you want to start a new assessment? Current data will be lost.')) {
        audioManager.stop();
        assessment = new EnhancedToMAssessment();
        document.querySelector('.completion-screen').classList.remove('active');
        document.querySelector('.setup-screen').classList.add('active');

        document.getElementById('participantId').value = '';
        document.getElementById('participantAge').value = '';
        document.getElementById('examinerName').value = '';
        document.getElementById('bookletSelect').value = '';
        document.getElementById('audioEnabled').checked = false;
        document.getElementById('audioInfo').style.display = 'none';
        document.getElementById('audioControls').classList.remove('active');
    }
}

// URL Parameter Support
function getURLParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        participantId: params.get('pid') || params.get('PROLIFIC_PID') || '',
        studyId: params.get('study_id') || params.get('STUDY_ID') || '',
        sessionId: params.get('session_id') || params.get('SESSION_ID') || '',
        language: params.get('lang') || 'en-US'
    };
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Update language selector
    updateLanguage();

    // Auto-fill from URL parameters
    const urlParams = getURLParameters();
    if (urlParams.participantId) {
        document.getElementById('participantId').value = urlParams.participantId;
    }
    if (urlParams.language) {
        document.getElementById('languageSelect').value = urlParams.language;
        updateLanguage();
    }
});
