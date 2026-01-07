/**
 * ToM Assessment v2 Prototype - Item 1.5: Implicit False Belief
 * Demonstrates: Sentence-by-sentence narration, drag-and-drop, audio recording
 */

class PrototypeAssessment {
    constructor() {
        this.currentStep = 0;
        this.responses = [];
        this.audioRecordings = {};
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.storedVariables = {}; // Store {gradeChoice}, etc.

        // Introduction
        this.introduction = {
            script1: `This is a story about a classroom.`,
            gradeQuestion: {
                id: 'Introduction_Grade',
                type: 'free_response_audio',
                text: 'What grade are you in?',
                storeAs: 'gradeChoice',
                requiresAudio: true
            },
            script2: `Well these kids are in {gradeChoice} grade, just like you, and their teacher, Mr. Cook, just told all the kids that it is snack time. So now all of the children are going to get their snacks, and we're going to help them.`,
            readyQuestion: {
                id: 'Introduction_Ready',
                type: 'yes_confirmation',
                text: 'Are you ready?',
                requiresAudio: true
            }
        };

        // Item 1.5 data with numbered variables
        this.itemData = {
            id: 'Item_1_5',
            type: 'Implicit False Belief',
            script: `This is Rachel. And Rachel brought raisins to have during snack time. Rachel walks into this room and sees two containers on the rug- There's one container on a yellow mat, and one container on a blue mat. Rachel decides to put her raisins in the container on the yellow mat. Then Rachel goes away. Now, while Rachel is away, we're going to play a trick on Rachel. We're going to take her raisins out of this container, on the yellow mat, and move them to this container on the blue mat! And then we're going to put these heavy lids on the containers.`,
            questions: [
                {
                    id: 'ToMS_2AFCImp_1.5.1',
                    type: 'drag_drop',
                    text: 'So now Rachel comes back in. What happens next- can you show me with Rachel?',
                    requiresDrag: 'rachel-figure',
                    dropZones: ['yellow-container', 'blue-container']
                },
                {
                    id: 'ToMS_Expl_1.5.2',
                    type: 'explanation',
                    text: 'Why does Rachel go there?',
                    requiresAudio: true
                }
            ]
        };

        this.steps = [
            { type: 'narration', content: this.introduction.script1 },
            { type: 'intro_question', question: this.introduction.gradeQuestion },
            { type: 'narration', content: this.introduction.script2 },
            { type: 'intro_question', question: this.introduction.readyQuestion },
            { type: 'narration', content: this.itemData.script },
            { type: 'question', questionIndex: 0 },
            { type: 'question', questionIndex: 1 }
        ];
    }

    async start() {
        console.log('Starting prototype assessment...');
        await this.executeStep();
    }

    async executeStep() {
        const step = this.steps[this.currentStep];

        if (!step) {
            this.complete();
            return;
        }

        switch (step.type) {
            case 'narration':
                await this.handleNarration(step.content);
                break;
            case 'question':
                await this.handleQuestion(step.questionIndex);
                break;
            case 'intro_question':
                await this.handleIntroQuestion(step.question);
                break;
        }
    }

    async handleNarration(text) {
        const scriptContainer = document.getElementById('scriptContainer');
        scriptContainer.innerHTML = '';
        scriptContainer.classList.remove('hidden');

        // Replace variables in text
        const processedText = this.replaceVariables(text);

        // Start narration
        await audioEngine.narrateText(processedText, scriptContainer, () => {
            // Narration complete
            this.showContinueButton();
        });
    }

    replaceVariables(text) {
        let result = text;
        for (const [key, value] of Object.entries(this.storedVariables)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, value);
        }
        return result;
    }

    async handleIntroQuestion(question) {
        const questionContainer = document.getElementById('questionContainer');
        const questionText = document.getElementById('questionText');
        const responseArea = document.getElementById('responseArea');

        questionContainer.classList.remove('hidden');
        questionText.textContent = question.text;
        responseArea.innerHTML = '';

        // Narrate the question
        const scriptContainer = document.getElementById('scriptContainer');
        await audioEngine.narrateText(question.text, scriptContainer, null);

        // Render based on question type
        switch (question.type) {
            case 'free_response_audio':
                this.renderFreeResponseAudio(question, responseArea);
                break;
            case 'yes_confirmation':
                this.renderYesConfirmation(question, responseArea);
                break;
        }
    }

    renderFreeResponseAudio(question, container) {
        const recordingDiv = document.createElement('div');
        recordingDiv.className = 'audio-recording';
        recordingDiv.innerHTML = `
            <p style="margin-bottom: 10px; font-weight: 600;">
                <span style="font-size: 1.2em;">🎤</span> Record the participant's response
            </p>
            <p style="margin-bottom: 15px; color: #666; font-size: 0.95em;">
                Click "Start Recording" to capture their answer.
            </p>
        `;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'recording-controls';

        const recordBtn = document.createElement('button');
        recordBtn.className = 'record-btn start';
        recordBtn.id = 'recordBtn';
        recordBtn.innerHTML = '🔴 Start Recording';
        recordBtn.onclick = () => this.toggleRecording(question.id);

        const statusSpan = document.createElement('span');
        statusSpan.id = 'recordStatus';
        statusSpan.textContent = 'Ready to record';

        controlsDiv.appendChild(recordBtn);
        controlsDiv.appendChild(statusSpan);
        recordingDiv.appendChild(controlsDiv);

        const transcriptBox = document.createElement('div');
        transcriptBox.className = 'transcript-box';
        transcriptBox.id = 'transcriptBox';
        transcriptBox.textContent = 'Transcription will appear here...';
        recordingDiv.appendChild(transcriptBox);

        container.appendChild(recordingDiv);
    }

    renderYesConfirmation(question, container) {
        const confirmDiv = document.createElement('div');
        confirmDiv.style.cssText = 'text-align: center; padding: 20px;';
        confirmDiv.innerHTML = `
            <p style="margin-bottom: 15px; font-size: 1.1em; color: #666;">
                Wait for the participant to say "Yes" or "Ready"
            </p>
        `;

        const recordBtn = document.createElement('button');
        recordBtn.className = 'record-btn start';
        recordBtn.innerHTML = '🎤 Listen for Response';
        recordBtn.style.cssText = 'margin: 10px;';
        recordBtn.onclick = async () => {
            recordBtn.disabled = true;
            recordBtn.innerHTML = '👂 Listening...';
            await this.listenForYes(question.id);
        };

        confirmDiv.appendChild(recordBtn);

        const manualBtn = document.createElement('button');
        manualBtn.className = 'continue-btn';
        manualBtn.textContent = 'Child Said Yes (Manual Continue)';
        manualBtn.onclick = () => {
            this.recordResponse(question.id, 'Yes (manual)', 'confirmation');
            this.nextStep();
        };

        confirmDiv.appendChild(manualBtn);
        container.appendChild(confirmDiv);
    }

    async listenForYes(questionId) {
        // Start transcription and wait for "yes" or "ready"
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = audioEngine.language;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log('Heard:', transcript);

                if (transcript.includes('yes') || transcript.includes('ready') ||
                    transcript.includes('yeah') || transcript.includes('yep')) {
                    this.recordResponse(questionId, transcript, 'confirmation');
                    this.nextStep();
                } else {
                    alert(`Heard: "${transcript}"\n\nPlease ask the child to say "Yes" and try again.`);
                    document.querySelector('.record-btn').disabled = false;
                    document.querySelector('.record-btn').innerHTML = '🎤 Listen for Response';
                }
            };

            recognition.onerror = () => {
                alert('Could not hear response. Please use manual continue.');
                document.querySelector('.record-btn').disabled = false;
                document.querySelector('.record-btn').innerHTML = '🎤 Listen for Response';
            };

            recognition.start();
        }
    }

    async handleQuestion(questionIndex) {
        const question = this.itemData.questions[questionIndex];
        const questionContainer = document.getElementById('questionContainer');
        const questionText = document.getElementById('questionText');
        const responseArea = document.getElementById('responseArea');

        questionContainer.classList.remove('hidden');
        questionText.textContent = question.text;
        responseArea.innerHTML = '';

        // Narrate the question
        await audioEngine.narrateText(question.text, scriptContainer, null);

        // Render based on question type
        switch (question.type) {
            case 'drag_drop':
                this.renderDragDropQuestion(question, responseArea);
                break;
            case 'explanation':
                this.renderExplanationQuestion(question, responseArea);
                break;
        }
    }

    renderDragDropQuestion(question, container) {
        // Create drop zones
        const illustrationArea = document.getElementById('illustrationArea');

        // Yellow mat container drop zone (left side)
        dragDropSystem.createDropZone({
            id: 'yellow-container',
            x: 100,
            y: 200,
            width: 150,
            height: 150,
            label: 'Yellow Mat',
            container: illustrationArea,
            onDrop: (itemId, zoneId) => {
                this.recordDragResponse(question.id, itemId, zoneId);
                this.showContinueButton();
            }
        });

        // Blue mat container drop zone (right side)
        dragDropSystem.createDropZone({
            id: 'blue-container',
            x: 400,
            y: 200,
            width: 150,
            height: 150,
            label: 'Blue Mat',
            container: illustrationArea,
            onDrop: (itemId, zoneId) => {
                this.recordDragResponse(question.id, itemId, zoneId);
                this.showContinueButton();
            }
        });

        // Create Rachel figure (draggable)
        // Using Rachel story PDF page as the cutout
        dragDropSystem.createDraggable({
            id: 'rachel-figure',
            imageUrl: '../ToM_Booklet_2_illustrations/Rachel_Story.pdf',
            initialX: 250,
            initialY: 50,
            width: 80,
            height: 120,
            container: illustrationArea
        });

        // Add instruction
        const instruction = document.createElement('div');
        instruction.style.cssText = 'text-align: center; margin-top: 20px; font-size: 1.1em; color: #667eea; font-weight: 600;';
        instruction.textContent = '👆 Drag Rachel to show where she will go';
        container.appendChild(instruction);
    }

    renderExplanationQuestion(question, container) {
        const recordingDiv = document.createElement('div');
        recordingDiv.className = 'audio-recording';
        recordingDiv.innerHTML = `
            <p style="margin-bottom: 10px; font-weight: 600;">
                <span style="font-size: 1.2em;">🎤</span> Record the participant's explanation
            </p>
            <p style="margin-bottom: 15px; color: #666; font-size: 0.95em;">
                Click "Start Recording" and ask the participant to explain their answer.
                The audio will be recorded and transcribed automatically.
            </p>
        `;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'recording-controls';

        const recordBtn = document.createElement('button');
        recordBtn.className = 'record-btn start';
        recordBtn.id = 'recordBtn';
        recordBtn.innerHTML = '🔴 Start Recording';
        recordBtn.onclick = () => this.toggleRecording(question.id);

        const statusSpan = document.createElement('span');
        statusSpan.id = 'recordStatus';
        statusSpan.textContent = 'Ready to record';

        controlsDiv.appendChild(recordBtn);
        controlsDiv.appendChild(statusSpan);
        recordingDiv.appendChild(controlsDiv);

        const transcriptBox = document.createElement('div');
        transcriptBox.className = 'transcript-box';
        transcriptBox.id = 'transcriptBox';
        transcriptBox.textContent = 'Transcription will appear here...';
        recordingDiv.appendChild(transcriptBox);

        container.appendChild(recordingDiv);
    }

    async toggleRecording(questionId) {
        if (this.isRecording) {
            await this.stopRecording();
        } else {
            await this.startRecording(questionId);
        }
    }

    async startRecording(questionId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.audioChunks = [];
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordingQuestionId = questionId;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.audioRecordings[questionId] = {
                    blob: audioBlob,
                    timestamp: new Date().toISOString()
                };

                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;

            // Update UI
            document.getElementById('recordBtn').innerHTML = '⏹️ Stop Recording';
            document.getElementById('recordBtn').className = 'record-btn stop';
            document.getElementById('recordStatus').textContent = 'Recording...';

            // Start transcription
            this.startTranscription();

        } catch (error) {
            console.error('Recording error:', error);
            alert('Could not access microphone: ' + error.message);
        }
    }

    async stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;

            // Stop transcription
            this.stopTranscription();

            // Update UI
            document.getElementById('recordBtn').innerHTML = '✓ Recording Complete';
            document.getElementById('recordBtn').disabled = true;
            document.getElementById('recordStatus').textContent = 'Recording saved';

            // Show continue button
            this.showContinueButton();
        }
    }

    startTranscription() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = audioEngine.language;

            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                document.getElementById('transcriptBox').textContent = transcript;
                this.currentTranscript = transcript;
            };

            this.recognition.start();
        }
    }

    stopTranscription() {
        if (this.recognition) {
            this.recognition.stop();

            // Save final transcript and store variable if needed
            if (this.currentTranscript && this.recordingQuestionId) {
                this.recordResponse(this.recordingQuestionId, this.currentTranscript, 'free_response_audio');

                // Store variable if this question has storeAs
                const question = this.findQuestionById(this.recordingQuestionId);
                if (question && question.storeAs) {
                    // Parse the response to extract the actual value
                    let value = this.currentTranscript;

                    // If this is the grade question, extract grade from response
                    if (question.id === 'Introduction_Grade') {
                        value = this.parseGradeResponse(this.currentTranscript);
                    }

                    this.storedVariables[question.storeAs] = value;
                    console.log(`Stored ${question.storeAs}:`, value);
                }
            }
        }
    }

    parseGradeResponse(transcript) {
        const text = transcript.toLowerCase();

        // List of grade patterns to match
        const gradePatterns = [
            // Numeric grades
            { regex: /\b(first|1st)\s+grade\b/, value: 'first' },
            { regex: /\b(second|2nd)\s+grade\b/, value: 'second' },
            { regex: /\b(third|3rd)\s+grade\b/, value: 'third' },
            { regex: /\b(fourth|4th)\s+grade\b/, value: 'fourth' },
            { regex: /\b(fifth|5th)\s+grade\b/, value: 'fifth' },
            { regex: /\b(sixth|6th)\s+grade\b/, value: 'sixth' },
            { regex: /\b(seventh|7th)\s+grade\b/, value: 'seventh' },
            { regex: /\b(eighth|8th)\s+grade\b/, value: 'eighth' },

            // Just numbers with optional "grade"
            { regex: /\b(first|1st)\b/, value: 'first' },
            { regex: /\b(second|2nd)\b/, value: 'second' },
            { regex: /\b(third|3rd)\b/, value: 'third' },
            { regex: /\b(fourth|4th)\b/, value: 'fourth' },
            { regex: /\b(fifth|5th)\b/, value: 'fifth' },
            { regex: /\b(sixth|6th)\b/, value: 'sixth' },
            { regex: /\b(seventh|7th)\b/, value: 'seventh' },
            { regex: /\b(eighth|8th)\b/, value: 'eighth' },

            // Kindergarten
            { regex: /\bkindergarten\b/, value: 'kindergarten' },
            { regex: /\bkinder\b/, value: 'kindergarten' },

            // Preschool
            { regex: /\bpreschool\b/, value: 'preschool' },
            { regex: /\bpre-k\b/, value: 'preschool' },

            // Just digit grades
            { regex: /\b1\b/, value: 'first' },
            { regex: /\b2\b/, value: 'second' },
            { regex: /\b3\b/, value: 'third' },
            { regex: /\b4\b/, value: 'fourth' },
            { regex: /\b5\b/, value: 'fifth' },
            { regex: /\b6\b/, value: 'sixth' },
            { regex: /\b7\b/, value: 'seventh' },
            { regex: /\b8\b/, value: 'eighth' }
        ];

        // Try each pattern
        for (const pattern of gradePatterns) {
            if (pattern.regex.test(text)) {
                console.log(`Matched grade pattern: "${text}" -> "${pattern.value}"`);
                return pattern.value;
            }
        }

        // If no pattern matched, return the original transcript
        console.log(`No grade pattern matched, using original: "${transcript}"`);
        return transcript;
    }

    findQuestionById(questionId) {
        // Check intro questions
        if (this.introduction.gradeQuestion && this.introduction.gradeQuestion.id === questionId) {
            return this.introduction.gradeQuestion;
        }
        if (this.introduction.readyQuestion && this.introduction.readyQuestion.id === questionId) {
            return this.introduction.readyQuestion;
        }
        // Check item questions
        return this.itemData.questions.find(q => q.id === questionId);
    }

    recordDragResponse(questionId, itemId, zoneId) {
        this.recordResponse(questionId, `${itemId} -> ${zoneId}`, 'drag_drop');
    }

    recordResponse(questionId, response, type) {
        this.responses.push({
            questionId,
            response,
            type,
            timestamp: new Date().toISOString()
        });
        console.log('Recorded response:', { questionId, response, type });
    }

    showContinueButton() {
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.classList.remove('hidden');
        continueBtn.disabled = false;
        continueBtn.onclick = () => this.nextStep();
    }

    nextStep() {
        // Hide continue button
        document.getElementById('continueBtn').classList.add('hidden');

        // Move to next step
        this.currentStep++;
        this.executeStep();
    }

    complete() {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <h1>Prototype Complete!</h1>
            <div style="text-align: center; margin-top: 40px;">
                <p style="font-size: 1.3em; margin-bottom: 30px;">
                    ✅ Item 1.5 (Implicit False Belief) completed successfully
                </p>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-bottom: 20px;">Features Demonstrated:</h3>
                    <ul style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 1.1em; line-height: 2;">
                        <li>✓ Sentence-by-sentence audio narration with highlighting</li>
                        <li>✓ Drag-and-drop interaction (Rachel figure)</li>
                        <li>✓ Audio recording with transcription</li>
                        <li>✓ Progressive text reveal</li>
                        <li>✓ Mandatory audio (always on)</li>
                    </ul>
                </div>
                <h3 style="margin-top: 40px; color: #667eea;">Collected Data:</h3>
                <pre style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: left; overflow: auto;">
${JSON.stringify(this.responses, null, 2)}
                </pre>
                <button class="continue-btn" onclick="location.reload()" style="margin-top: 30px;">
                    Restart Prototype
                </button>
            </div>
        `;
    }
}

// Initialize and start the prototype
let assessment;
window.addEventListener('DOMContentLoaded', () => {
    assessment = new PrototypeAssessment();
    assessment.start();
});
