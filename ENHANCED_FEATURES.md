# Enhanced Features - ToM Assessment v2.0

## 🎉 New Features Added

### 1. 🌍 British English Support

The assessment now supports both American and British English variants.

#### Language Differences

**American English → British English:**
- Grade → Year
- Kindergarten → Reception
- Preschool → Nursery
- Mom → Mum
- Sandbox → Sandpit
- Color → Colour
- Favorite → Favourite
- Realize → Realise

#### School Levels

**American English:**
- Preschool, Kindergarten, 1st-8th Grade

**British English:**
- Nursery, Reception, Year 1-8

#### How to Use

1. **Setup Screen:**
   - Select language from dropdown: "American English" or "British English"
   - School levels automatically update based on selection

2. **URL Parameter:**
   ```
   ?lang=en-GB  (British English)
   ?lang=en-US  (American English, default)
   ```

3. **Automatic Translation:**
   - All scripts and questions are automatically translated
   - Maintains child-friendly language
   - Preserves original meaning

---

### 2. 🔊 Audio Narration with Text-to-Speech

The assessment now includes automatic audio narration using the Web Speech API.

#### Features

**Automatic Narration:**
- Scripts read aloud automatically
- Age-appropriate speaking rate (0.9x speed)
- Natural-sounding voices

**Voice Selection:**
- Automatically selects British or American voice based on language
- Falls back to best available English voice

**Audio Controls:**
- ▶️ Play/Pause
- ⏹️ Stop
- 🔄 Replay
- Status indicator

#### How to Use

1. **Enable Audio:**
   - Check "Enable Audio Narration" on setup screen
   - Audio controls appear during assessment

2. **During Assessment:**
   - Script is read automatically when each item loads
   - Use controls to pause, stop, or replay
   - Continue when ready

3. **Customization:**
   ```javascript
   // In tom-booklet-language.js
   audioManager.speak(text, {
       rate: 0.9,    // Speaking speed (0.5-2.0)
       pitch: 1.0,   // Voice pitch (0-2)
       volume: 1.0   // Volume (0-1)
   });
   ```

---

### 3. ✨ Word-by-Word Text Highlighting

Text highlights synchronously as audio plays, helping participants follow along.

#### Features

**Real-time Highlighting:**
- Each word highlights as it's spoken
- Yellow highlight with bold text
- Auto-scrolls to keep highlighted word visible

**Visual Feedback:**
- Clear indication of current word
- Smooth transitions
- Accessible design

#### How It Works

```javascript
// Text is split into individual words
// Each word wrapped in <span> with tracking
<span class="word" data-word-index="0">Here</span>
<span class="word" data-word-index="1">is</span>
<span class="word" data-word-index="2">Sam</span>

// Highlighted word gets class
.word-highlighted {
    background: #ffeb3b;
    color: #000;
    font-weight: 600;
}
```

---

### 4. 🎤 Voice Input and Audio Recording for Free Responses

Participants can now respond verbally using speech recognition AND record actual audio files.

#### Features

**Multiple Choice with "Other" Option:**
- All free response questions present multiple choice buttons
- Options from the question displayed as clickable buttons
- "Other" button always available for custom responses
- Selected option auto-fills text field
- "Other" shows empty text field for custom input

**Speech-to-Text:**
- Click microphone button to start listening
- Real-time transcription into text field
- Supports both British and American English
- Works alongside multiple choice options

**Audio Recording:**
- Record actual audio of participant's verbal response
- Separate from speech-to-text (both can be used)
- Records in WebM format
- Shows duration after recording
- All recordings downloadable at end of assessment

**Flexible Input Methods:**
1. Click multiple choice button (bicycles, fire trucks, or Other)
2. Type manually in text field
3. Dictate with voice (speech-to-text)
4. Record audio (saves actual voice file)
5. Mix any combination of methods

#### Free Response Questions

**Example Usage:**

```
Question: "What do you like better- bicycles or fire trucks?"

Step 1: Select an answer
[Bicycles] [Fire trucks] [Other]  ← Click one

Step 2: Input options appear:
- Text field (auto-filled if choice selected, empty if "Other")
- [🎤 Start Voice Input (Speech-to-Text)] ← Transcribes to text
- [⏺️ Record Audio Response] ← Records actual audio file

Step 3: Save Response & Continue
```

**Data Captured:**
- Selected choice (if applicable)
- Text response (typed or transcribed)
- Audio recording (if recorded)
- Timestamp and response time

**Response Storage:**
- Free responses stored with unique keys
- Auto-substituted in later questions
- Example: `{childChoice}` → "bicycles"
- Audio recordings stored separately with question ID

---

### 5. 🔄 Dynamic Text Substitution

Free responses automatically replace placeholders in subsequent questions.

#### How It Works

**Question 1 (Free Response):**
```
"What do you like better- bicycles or fire trucks?"
Participant: "bicycles"
Stored as: childChoice = "bicycles"
```

**Question 2 (Uses Response):**
```
Template: "Sam also likes {childChoice}! Which will Sam choose?"
Rendered: "Sam also likes bicycles! Which will Sam choose?"
```

#### Substitution Patterns

**Stored Values:**
- `{childChoice}` → Direct response
- `{childChoice_opposite}` → Opposite option (for 2-choice questions)
- Any custom placeholder defined in `storeAs` field

**Example:**
```javascript
{
    id: "pref_01",
    text: "What do you like better, fish or dinosaurs?",
    type: "preference",
    options: ["Fish", "Dinosaurs"],
    storeAs: "animalChoice"
}

// Later question:
{
    text: "Laura likes {animalChoice_opposite} better..."
}
// If child said "Fish", renders: "Laura likes Dinosaurs better..."
```

---

## 🎯 Browser Compatibility

### Web Speech API Support

**Text-to-Speech (Narration):**
- ✅ Chrome/Edge (Excellent)
- ✅ Safari (Good)
- ✅ Firefox (Limited voices)
- ❌ IE (Not supported)

**Speech Recognition (Voice Input - Speech-to-Text):**
- ✅ Chrome/Edge (Excellent)
- ⚠️ Safari (Experimental, may need enabling)
- ❌ Firefox (Not supported)
- ❌ IE (Not supported)

**MediaRecorder API (Audio Recording):**
- ✅ Chrome/Edge (Excellent)
- ✅ Firefox (Excellent)
- ✅ Safari 14.1+ (Good, requires HTTPS)
- ❌ IE (Not supported)

**Important Notes:**
- Audio recording requires HTTPS (except on localhost)
- Microphone permissions must be granted by user
- WebM format widely supported for playback

### Fallback Behavior

- If audio narration not supported: Text-only mode continues to work
- If voice input not supported: Speech-to-text button hidden, text input remains
- If audio recording not supported: Recording button hidden, other input methods remain
- Graceful degradation ensures assessment always functions
- Multiple input methods ensure accessibility

---

## 📋 Usage Examples

### Example 1: British English with Audio

```html
Setup:
- Language: British English
- Audio: ✓ Enabled
- Age: 7
- Year: Year 2
- Booklet: Booklet 1

Result:
- All "grade" → "year"
- All "mom" → "mum"
- British voice reads script
- Words highlight as spoken
```

### Example 2: American English, Voice Input

```html
Setup:
- Language: American English
- Audio: ✗ Disabled
- Age: 6
- Grade: 1st Grade
- Booklet: Booklet 2

During Assessment:
- Free response questions show microphone button
- Click to dictate response
- Transcription appears in text box
- Can edit before saving
```

### Example 3: Combined Features

```html
Setup:
- Language: British English
- Audio: ✓ Enabled

Item 1:
Script (spoken): "Here is Sam. Sam is choosing between two books..."
[Words highlight as spoken]

Question: "What do you like better- bicycles or fire trucks?"
- Child responds: "Bicycles" (via voice input or typing)

Item 1, Question 2:
Script (spoken): "You do? That's great! Sam also likes bicycles!"
[Auto-substituted from free response]
```

---

## 🔧 Technical Implementation

### File Structure

```
tom-booklet-language.js     # Language manager, audio manager, text highlighter
tom-booklet-app.js          # Enhanced assessment logic
index.html                  # Updated UI with new controls
```

### Key Classes

**LanguageManager:**
- Manages translation dictionaries
- Provides school level options
- Handles term localization

**AudioManager:**
- Web Speech API wrapper
- Voice selection logic
- Playback controls

**TextHighlighter:**
- Word-by-word highlighting
- Scroll management
- Sync with audio

**VoiceRecognition:**
- Speech-to-text input
- Language-aware
- Error handling

**EnhancedToMAssessment:**
- Extends original assessment
- Integrates all new features
- Maintains backward compatibility

---

## 🎨 UI/UX Improvements

### Visual Indicators

**Audio Enabled:**
- Script box has blue border
- Audio controls visible
- Status messages (Playing, Paused, Complete)

**Current Word:**
- Yellow highlight
- Bold text
- Smooth transitions

**Voice Input:**
- Red dot when listening
- Button state changes
- Real-time feedback

### Accessibility

**Keyboard Support:**
- All controls keyboard-accessible
- Logical tab order
- Clear focus indicators

**Screen Readers:**
- ARIA labels where needed
- Semantic HTML
- Status announcements

**Visual Design:**
- High contrast highlighting
- Clear button states
- Responsive layout

---

## 📊 Data Collection

### New Data Fields

**Session Data:**
```json
{
  "language": "en-GB",
  "audioEnabled": true,
  "responses": [
    {
      "questionType": "free_response",
      "response": "bicycles",
      "responseTime": 3421,
      "hasAudioRecording": true
    }
  ]
}
```

**CSV Export:**
```
ParticipantID,Language,AudioEnabled,QuestionType,Response,HasAudioRecording,...
P001,en-GB,true,free_response,bicycles,Yes,...
```

**Audio Recordings Export:**
- Separate download for all audio recordings
- Files named: `ToM_{ParticipantID}_{QuestionID}_{Date}.webm`
- WebM format (widely supported, good quality)
- Button appears on completion screen
- Downloads multiple files (one per recording)

---

## 🚀 Deployment Options

### GitHub Pages

**URL Parameters:**
```
https://yourdomain.github.io/tom-assessment/?lang=en-GB&pid=P001
```

### Qualtrics

**Embedded Data:**
```javascript
// Set language
Qualtrics.SurveyEngine.setEmbeddedData('tom_language', 'en-GB');
Qualtrics.SurveyEngine.setEmbeddedData('tom_audio_enabled', 'true');
```

### Prolific

**Study Link:**
```
https://yourdomain.com/index.html?
  pid={{%PROLIFIC_PID%}}&
  lang=en-GB&
  audio=true
```

---

## 🐛 Troubleshooting

### Audio Not Playing

**Check:**
1. Browser supports Web Speech API
2. Audio not blocked by browser
3. Volume not muted
4. Try different browser (Chrome recommended)

**Solution:**
```javascript
// Test audio support
if ('speechSynthesis' in window) {
    console.log('Audio supported');
} else {
    console.log('Audio not supported');
}
```

### Voice Input Not Working

**Check:**
1. Microphone permissions granted
2. Browser supports Speech Recognition
3. HTTPS connection (required for microphone)

**Solution:**
- Use Chrome/Edge browser
- Enable microphone permissions
- Use HTTPS or localhost

### Text Not Highlighting

**Check:**
1. Audio is enabled
2. Script has loaded
3. Browser console for errors

**Solution:**
```javascript
// Verify highlighter created
if (assessment.currentHighlighter) {
    console.log('Highlighter active');
}
```

---

## 📱 Mobile Support

### Tested Devices

**iOS:**
- ✅ Safari - TTS works, Voice input limited
- ✅ Chrome - TTS works, Voice input limited

**Android:**
- ✅ Chrome - Full support
- ✅ Firefox - TTS only
- ✅ Samsung Internet - Full support

### Mobile-Specific Features

**Touch Optimized:**
- Large buttons
- Swipe-friendly
- Responsive layout

**Audio Considerations:**
- Auto-play may be blocked (user must tap play)
- Background audio supported
- Battery-efficient

---

## 🔒 Privacy & Security

### Voice Data

**Speech Recognition:**
- Processed in browser (Chrome) or server (Safari)
- Not stored by application
- Transcription only saved locally

**Text-to-Speech:**
- Uses system/browser voices
- No external API calls
- Completely offline-capable

### Data Storage

**Local Only:**
- All data stored in browser memory
- No automatic cloud upload
- User controls export

---

## 📝 Future Enhancements

### Planned Features

1. **Additional Languages:**
   - Australian English
   - Canadian English
   - Other languages (Spanish, French, etc.)

2. **Audio Recording:**
   - Record actual voice responses
   - Save as audio files
   - Offline coding support

3. **Custom Voices:**
   - Upload custom voice recordings
   - Professional narration
   - Character voices for engagement

4. **Advanced Highlighting:**
   - Sentence-level highlighting
   - Adjustable highlight colors
   - Reading speed control

---

## 💡 Tips for Researchers

### Best Practices

**Language Selection:**
- Match participant's native dialect
- Consistent across study
- Document in metadata

**Audio Usage:**
- Test with target age group
- Adjust speaking rate if needed
- Consider reading ability

**Voice Input:**
- Provide clear instructions
- Have text backup ready
- Test microphone setup

**Free Responses:**
- Review for accuracy
- Edit if needed before saving
- Consider manual coding for complex responses

---

## 📚 References

### Web APIs Used

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)

### Browser Compatibility

- [Can I Use: Speech Synthesis](https://caniuse.com/speech-synthesis)
- [Can I Use: Speech Recognition](https://caniuse.com/speech-recognition)

---

**Version:** 2.0
**Last Updated:** January 7, 2026
**Backward Compatible:** Yes (original features fully preserved)
