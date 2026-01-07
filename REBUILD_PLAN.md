# ToM Booklet Rebuild Plan

## Project Overview
Complete rebuild of the Theory of Mind assessment with enhanced features, starting with Booklet 2, then Booklet 1.

## Key Requirements

### 1. Variable Naming System
- All {childChoice} variables must be numbered uniquely
- Format: `{childChoice1}`, `{childChoice2}`, etc.
- Each has corresponding `{opposite1}`, `{opposite2}`, etc.
- Track all variables in a master list to prevent conflicts

### 2. Audio Narration (Mandatory)
- Always enabled (remove toggle option)
- Sentence-by-sentence reveal with highlighting
- Align British/American English narration timing
- Gradual reveal: each sentence appears as it's narrated

### 3. Drag-and-Drop Cutouts
- Extract cutout pieces from illustrations folder
- Implement drag-and-drop for relevant questions
- Items: Rachel figure, containers, mats, etc.
- Track dragging interactions

### 4. Response Capture
- ALL choice questions must capture responses (even if not coded)
- Store responses for later substitution
- Number all variables uniquely

### 5. Free Response Questions
- Mandatory audio recording (MediaRecorder API)
- Simultaneous transcription (Web Speech API)
- Save both audio file AND text transcription
- Multiple input methods: voice, typing, buttons

## Implementation Phases

### Phase 1: Data Structure Redesign
- Map all Booklet 2 questions
- Identify all variable substitutions
- Create numbered variable system
- Define which questions need cutouts

### Phase 2: Audio System Enhancement
- Remove audio toggle
- Implement sentence-by-sentence parsing
- Create synchronized reveal system
- Align British/American translations

### Phase 3: Drag-and-Drop System
- Extract and prepare cutout images
- Build drag-and-drop component
- Integrate with question flow
- Record drop positions

### Phase 4: Response System Overhaul
- Update all question types
- Ensure all choices captured
- Implement numbered variable storage
- Add opposite variable calculation

### Phase 5: Free Response Enhancement
- Mandatory audio recording
- Enhanced transcription
- Dual storage (audio + text)
- Improved UI

### Phase 6: Testing & Integration
- Test Booklet 2 thoroughly
- Verify all variables work
- Check drag-and-drop
- Validate audio/transcription

### Phase 7: Booklet 1 Implementation
- Apply same structure to Booklet 1
- Map unique variables
- Implement cutouts as needed
- Full testing

## Technical Stack

### Core Technologies
- HTML5 Drag and Drop API
- Web Speech API (TTS + STT)
- MediaRecorder API
- Canvas/Image manipulation for cutouts

### File Structure
```
tom-booklet-v2/
├── index.html
├── booklet-2-data.js (new structure)
├── booklet-1-data.js (new structure)
├── audio-engine.js (sentence-by-sentence)
├── drag-drop.js (cutout system)
├── response-manager.js (variable storage)
├── cutouts/
│   ├── rachel-figure.png
│   ├── container-yellow.png
│   ├── container-blue.png
│   └── ...
└── styles.css
```

## Variable Tracking (Booklet 2)

### Item 1: Common Desires
- `{childChoice1}`: apples or strawberries
- `{opposite1}`: the other option

### Item 1.5: Implicit False Belief
- Drag-and-drop: Rachel figure
- No variables

### Item 2: Diverse Desires
- `{childChoice2}`: trail mix or granola bar
- `{opposite2}`: the other option

### Item 3: Diverse Beliefs
- `{childChoice3}`: backpack or desk
- `{opposite3}`: the other option

### Item 4-19: (Continue mapping...)

## Commit Strategy
- Commit after each phase completion
- Commit after each major feature addition
- Commit after bug fixes
- Clear, descriptive commit messages

## Next Steps
1. Begin Phase 1: Data Structure Redesign
2. Map all Booklet 2 variables
3. Create new data structure
4. Commit initial structure
