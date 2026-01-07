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

        // Introduction
        this.introduction = {
            script: `This is a story about a classroom. What grade are you in? Well these kids are in {gradeChoice} grade, just like you, and their teacher, Mr. Cook, just told all the kids that it is snack time. So now all of the children are going to get their snacks, and we're going to help them. Are you ready?`
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
            { type: 'narration', content: this.introduction.script },
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
        }
    }

    async handleNarration(text) {
        const scriptContainer = document.getElementById('scriptContainer');
        scriptContainer.innerHTML = '';
        scriptContainer.classList.remove('hidden');

        // Start narration
        await audioEngine.narrateText(text, scriptContainer, () => {
            // Narration complete
            this.showContinueButton();
        });
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

            // Save final transcript
            if (this.currentTranscript && this.recordingQuestionId) {
                this.recordResponse(this.recordingQuestionId, this.currentTranscript, 'explanation');
            }
        }
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
