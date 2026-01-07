// ToM Booklet Assessment Application Logic
// Handles assessment flow, branching logic, data collection, and export

class ToMAssessment {
    constructor() {
        this.participantData = {};
        this.currentBooklet = null;
        this.currentItemIndex = 0;
        this.responses = [];
        this.startTime = null;
        this.itemStartTime = null;
        this.sessionData = {};
    }

    initialize(participantData, bookletType) {
        this.participantData = participantData;
        this.currentBooklet = bookletType;
        this.startTime = new Date().toISOString();
        this.currentItemIndex = 0;
        this.responses = [];

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
            grade: participantData.grade,
            booklet: bookletType,
            examiner: participantData.examiner,
            startTime: this.startTime,
            responses: []
        };
    }

    loadBookletItems(bookletType) {
        if (bookletType === 'booklet1') {
            // Combine Story 1 and Story 2 items
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

    renderCurrentItem() {
        const item = this.getCurrentItem();

        if (!item) {
            this.completeAssessment();
            return;
        }

        this.itemStartTime = new Date();

        // Update progress
        this.updateProgress();

        // Render illustration
        this.renderIllustration(item.illustration);

        // Render metadata
        this.renderMetadata(item);

        // Render script
        this.renderScript(item.script);

        // Render questions
        this.renderQuestions(item);

        // Update navigation buttons
        this.updateNavigation();
    }

    renderIllustration(illustrationPath) {
        const container = document.getElementById('illustrationContainer');

        // Try to load the actual image
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

    renderScript(scriptText) {
        const scriptElement = document.getElementById('scriptText');

        // Replace placeholders with actual values
        let processedScript = scriptText;
        processedScript = processedScript.replace('{grade}', this.participantData.grade || 'X');

        scriptElement.innerHTML = processedScript;
    }

    renderQuestions(item) {
        const questionContainer = document.getElementById('questionContainer');
        const questionText = document.getElementById('questionText');
        const responseArea = document.getElementById('responseArea');

        // Get current question index for this item
        const currentQuestionIndex = this.getCurrentQuestionIndex(item);

        if (currentQuestionIndex >= item.questions.length) {
            // All questions answered, show follow-up if exists
            if (item.followUp) {
                questionText.innerHTML = item.followUp;
                responseArea.innerHTML = `
                    <p style="color: #6c757d; font-style: italic;">Read the follow-up text above, then proceed to the next item.</p>
                `;
            }
            return;
        }

        const question = item.questions[currentQuestionIndex];

        // Process question text with branching logic
        let processedQuestionText = this.processQuestionText(question.text, item);
        questionText.innerHTML = processedQuestionText;

        // Render response options based on question type
        responseArea.innerHTML = '';

        switch (question.type) {
            case '2AFC':
            case 'preference':
            case 'implicit_action':
                this.renderMultipleChoice(question, responseArea);
                break;

            case 'explanation':
            case '2AFC_explanation':
                this.renderTextResponse(question, responseArea);
                if (question.type === '2AFC_explanation') {
                    // First show 2AFC, then explanation
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

    renderMultipleChoice(question, container) {
        const div = document.createElement('div');
        div.className = 'response-options';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'response-btn';
            button.textContent = option;
            button.onclick = () => this.selectResponse(question.id, option, button);
            div.appendChild(button);
        });

        container.appendChild(div);

        // Add confirm button
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
        const textarea = document.createElement('textarea');
        textarea.className = 'text-response';
        textarea.placeholder = "Type the participant's verbal response here...";
        textarea.id = `response_${question.id}`;

        container.appendChild(textarea);

        // Add confirm button
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
        container.appendChild(confirmBtn);
    }

    selectResponse(questionId, response, button) {
        // Remove previous selection
        document.querySelectorAll('.response-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Mark this as selected
        button.classList.add('selected');

        // Store temporary selection
        this.tempSelection = { questionId, response };

        // Enable confirm button
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.disabled = false;
    }

    confirmResponse(question) {
        if (!this.tempSelection) {
            alert('Please select a response.');
            return;
        }

        this.recordResponse(question.id, this.tempSelection.response, '2AFC');

        // Apply branching logic
        this.applyBranchingLogic(question, this.tempSelection.response);

        this.moveToNextQuestion();
    }

    applyBranchingLogic(question, response) {
        const item = this.getCurrentItem();

        // Store response for conditional text replacement
        if (question.type === 'preference') {
            this.sessionData[`${item.id}_childChoice`] = response;
            this.sessionData[`${item.id}_opposite`] = this.getOppositeChoice(question.options, response);
        }

        // Check for conditional follow-ups
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

        // Replace {childChoice} with stored preference
        const childChoice = this.sessionData[`${item.id}_childChoice`];
        if (childChoice) {
            processed = processed.replace('{childChoice}', childChoice);
        }

        // Replace {opposite} with opposite of preference
        const opposite = this.sessionData[`${item.id}_opposite`];
        if (opposite) {
            processed = processed.replace('{opposite}', opposite);
        }

        return processed;
    }

    getCurrentQuestionIndex(item) {
        // Count how many questions have been answered for this item
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

    moveToNextQuestion() {
        const item = this.getCurrentItem();
        const currentQuestionIndex = this.getCurrentQuestionIndex(item);

        if (currentQuestionIndex < item.questions.length) {
            // More questions in this item
            this.renderCurrentItem();
        } else {
            // Move to next item
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

            // Remove responses for the previous item
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

        // Show completion screen
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
        let csv = 'ParticipantID,Age,Grade,Booklet,Examiner,ItemID,ItemNumber,ItemType,QuestionID,QuestionType,Response,Timestamp,ResponseTime\n';

        this.responses.forEach(r => {
            const row = [
                this.participantData.id,
                this.participantData.age,
                this.participantData.grade,
                this.currentBooklet,
                this.participantData.examiner,
                r.itemId,
                r.itemNumber,
                r.itemType,
                r.questionId,
                r.questionType,
                `"${r.response.replace(/"/g, '""')}"`,
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

    // Qualtrics/Prolific integration methods
    getQualtricsEmbeddedData() {
        // Returns data in format suitable for Qualtrics embedded data
        const embeddedData = {};

        this.responses.forEach((r, index) => {
            embeddedData[`${r.questionId}_response`] = r.response;
            embeddedData[`${r.questionId}_time`] = r.responseTime;
        });

        embeddedData.tom_total_items = this.items.length;
        embeddedData.tom_duration = this.sessionData.totalDuration;
        embeddedData.tom_booklet = this.currentBooklet;

        return embeddedData;
    }

    getProlificCompletionCode() {
        // Generate a completion code for Prolific
        const code = `TOM-${this.currentBooklet.toUpperCase()}-${Date.now().toString(36)}`;
        return code;
    }
}

// Global assessment instance
let assessment = new ToMAssessment();

// UI Functions
function startAssessment() {
    const participantId = document.getElementById('participantId').value.trim();
    const participantAge = document.getElementById('participantAge').value;
    const participantGrade = document.getElementById('participantGrade').value;
    const bookletSelect = document.getElementById('bookletSelect').value;
    const examinerName = document.getElementById('examinerName').value.trim();

    // Validation
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

    // Initialize assessment
    const participantData = {
        id: participantId,
        age: participantAge,
        grade: participantGrade,
        examiner: examinerName
    };

    assessment.initialize(participantData, bookletSelect);

    // Switch screens
    document.querySelector('.setup-screen').classList.remove('active');
    document.querySelector('.assessment-screen').classList.add('active');

    // Render first item
    assessment.renderCurrentItem();
}

function nextItem() {
    // Check if current question is answered before proceeding
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

function resetAssessment() {
    if (confirm('Are you sure you want to start a new assessment? Current data will be lost.')) {
        assessment = new ToMAssessment();
        document.querySelector('.completion-screen').classList.remove('active');
        document.querySelector('.setup-screen').classList.add('active');

        // Reset form
        document.getElementById('participantId').value = '';
        document.getElementById('participantAge').value = '';
        document.getElementById('participantGrade').value = '';
        document.getElementById('bookletSelect').value = '';
        document.getElementById('examinerName').value = '';
    }
}

// URL Parameter Support (for Qualtrics/Prolific integration)
function getURLParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        participantId: params.get('pid') || params.get('PROLIFIC_PID') || '',
        studyId: params.get('study_id') || params.get('STUDY_ID') || '',
        sessionId: params.get('session_id') || params.get('SESSION_ID') || ''
    };
}

// Auto-fill from URL parameters on page load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = getURLParameters();
    if (urlParams.participantId) {
        document.getElementById('participantId').value = urlParams.participantId;
    }
});
