# ToM Assessment v2.0 - Prototype

## Overview
This prototype demonstrates the core new features for the rebuilt Theory of Mind assessment, using **Item 1.5: Implicit False Belief (Rachel's Raisins)** as the test case.

## Features Demonstrated

### 1. ✅ Sentence-by-Sentence Audio Narration
- Script is read aloud automatically (no toggle)
- Each sentence appears progressively as it's narrated
- Active sentence is highlighted in yellow
- Synchronized with speech synthesis

### 2. ✅ Drag-and-Drop Interaction
- Rachel figure can be dragged to containers
- Drop zones highlight on hover
- Records where the child places Rachel
- Visual feedback for successful drops

### 3. ✅ Audio Recording + Transcription
- Explanation questions record actual audio
- Simultaneous live transcription
- Saves both audio file (WebM) and text
- MediaRecorder API + Web Speech API

### 4. ✅ Progressive Reveal
- Text appears sentence-by-sentence during narration
- No text is shown before it's narrated
- Smooth animations and transitions

### 5. ✅ Mandatory Audio
- Audio narration is always enabled
- No option to disable (as requested)
- Ensures consistent experience

## File Structure
```
prototype-v2/
├── index.html           # Main prototype page
├── audio-engine.js      # Sentence-by-sentence narration engine
├── drag-drop.js         # Drag-and-drop system
├── prototype-app.js     # Item 1.5 implementation
├── cutouts/            # Cutout images (Rachel, containers, etc.)
│   └── rachel-placeholder.png
└── README.md           # This file
```

## How to Run

### Option 1: Local File
1. Open `index.html` in a modern browser (Chrome, Edge, or Firefox recommended)
2. Allow microphone permissions when prompted
3. Follow the assessment flow

### Option 2: Local Server
```bash
cd prototype-v2
python3 -m http.server 8000
# Open http://localhost:8000
```

## Browser Compatibility

### Full Support
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox

### Partial Support
- ⚠️ Safari (Audio recording requires HTTPS)

### Not Supported
- ❌ Internet Explorer

## Technologies Used

1. **Web Speech API**
   - SpeechSynthesis for text-to-speech narration
   - SpeechRecognition for live transcription

2. **HTML5 Drag and Drop API**
   - Native drag-and-drop for cutout manipulation
   - Touch support could be added for tablets

3. **MediaRecorder API**
   - Records audio in WebM format
   - Captures participant's verbal explanations

4. **Vanilla JavaScript**
   - No frameworks required
   - Pure DOM manipulation

## Next Steps for Full Implementation

### Phase 1: Complete Booklet 2
- [ ] Implement all 19 items with this structure
- [ ] Create all cutout images from extra parts PDFs
- [ ] Add numbered variables for all childChoice instances
- [ ] Implement conditional logic and branching

### Phase 2: Enhanced Features
- [ ] Add British English translation alignment
- [ ] Implement pause/replay controls
- [ ] Add progress indicators
- [ ] Create data export system

### Phase 3: Booklet 1
- [ ] Apply same structure to Booklet 1
- [ ] Map Booklet 1 variables
- [ ] Create Booklet 1 cutouts

### Phase 4: Testing & Deployment
- [ ] Cross-browser testing
- [ ] Mobile/tablet optimization
- [ ] Accessibility features
- [ ] Deploy to GitHub Pages

## Variables Used in This Prototype

This prototype demonstrates the variable system:

### Item 1.5 Variables
- **No childChoice variables** (implicit false belief doesn't require preference)
- **Drag-drop result**: Where Rachel figure was placed (yellow vs blue container)

### Future Variables (not in this item)
- `{childChoice1}` - Apple vs strawberry (Item 1)
- `{opposite1}` - The non-selected option
- `{childChoice2}` - Trail mix vs granola (Item 2)
- `{opposite2}` - The non-selected option
- etc.

## Known Limitations

1. **Cutout Images**: Currently using placeholder for Rachel figure. Actual cutouts need to be extracted from the extra parts PDFs.

2. **HTTPS Requirement**: Audio recording requires HTTPS in Safari. Works on localhost or GitHub Pages.

3. **Microphone Permissions**: User must grant microphone access for audio recording to work.

4. **Voice Selection**: Uses default system voice. Could be enhanced with voice selection UI.

## Testing the Prototype

1. **Narration Test**: Verify sentences appear one at a time with highlighting
2. **Drag-Drop Test**: Drag Rachel to both containers, verify recording
3. **Audio Recording Test**: Record explanation, check transcription accuracy
4. **Data Collection Test**: Complete full flow, verify JSON output at end

## Data Captured

```javascript
{
  "responses": [
    {
      "questionId": "ToMS_2AFCImp_1.5.1",
      "response": "rachel-figure -> yellow-container",
      "type": "drag_drop",
      "timestamp": "2026-01-07T..."
    },
    {
      "questionId": "ToMS_Expl_1.5.2",
      "response": "Because she put her raisins there",
      "type": "explanation",
      "timestamp": "2026-01-07T..."
    }
  ],
  "audioRecordings": {
    "ToMS_Expl_1.5.2": {
      "blob": [AudioBlob],
      "timestamp": "2026-01-07T..."
    }
  }
}
```

## Feedback & Iteration

This prototype is designed to validate the approach before full implementation. Key questions:

1. Does the sentence-by-sentence narration feel natural?
2. Is the drag-and-drop intuitive for children?
3. Does the audio recording + transcription work reliably?
4. Is the pacing appropriate?

Once validated, this structure will be applied to all items across both booklets.
