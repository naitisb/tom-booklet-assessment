# Theory of Mind (ToM) Booklet Assessment - Digital Version

An interactive, web-based implementation of the Theory of Mind Booklet Task with full Qualtrics and Prolific integration support.

## 📋 Overview

This repository contains a complete digital adaptation of the ToM Booklet Assessment, originally developed for measuring Theory of Mind reasoning in children ages 3-12. The assessment has been transformed into an interactive web application with support for online administration via Qualtrics and Prolific.

### Features

✅ **Two Complete Booklets**
- Booklet 1: 41 items (ages 5-10) - 2 stories
- Booklet 2: 70 items (ages 5-12) - 1 story, with modified version for ages 3-4

✅ **Intelligent Branching Logic**
- Automatic preference-based question adaptation
- Conditional follow-ups based on responses
- Age-appropriate item filtering

✅ **Multiple Deployment Options**
- Standalone web application
- Qualtrics embedded HTML
- Qualtrics iframe integration
- Prolific-compatible with auto-fill

✅ **Comprehensive Data Export**
- JSON format with full response metadata
- CSV format for statistical analysis
- Qualtrics embedded data integration
- Response time tracking

✅ **Professional Interface**
- Responsive design (desktop/mobile)
- Progress tracking
- Illustration support
- Child-friendly UI

---

## 🚀 Quick Start

### Option 1: Standalone Web Version

1. **Download Files**
   ```bash
   # Clone or download these files:
   - index.html
   - tom-booklet-data.js
   - tom-booklet-app.js
   - ToM_Booklet_1_illustrations/ (folder)
   - ToM_Booklet_2_illustrations/ (folder)
   ```

2. **Open in Browser**
   ```bash
   # Simply open index.html in any modern web browser
   open index.html
   ```

3. **Set Up Assessment**
   - Enter participant information
   - Select booklet type
   - Click "Begin Assessment"

### Option 2: Qualtrics Integration

1. **Open qualtrics-integration.html**
2. **Copy entire file contents**
3. **In Qualtrics:**
   - Create new "Text/Graphic" question
   - Click HTML View (< > icon)
   - Paste the code
4. **Set up embedded data fields** (see QUALTRICS_PROLIFIC_GUIDE.md)

### Option 3: Prolific Integration

1. **Host files on web server** (or use GitHub Pages)
2. **Create Prolific study with URL:**
   ```
   https://yourdomain.com/index.html?pid={{%PROLIFIC_PID%}}&study_id={{%STUDY_ID%}}
   ```
3. **Assessment auto-fills participant ID**

---

## 📁 File Structure

```
digitized_ToM_booklet/
├── index.html                          # Main standalone application
├── tom-booklet-data.js                 # Assessment items and questions
├── tom-booklet-app.js                  # Core application logic
├── qualtrics-integration.html          # Qualtrics-ready version
├── QUALTRICS_PROLIFIC_GUIDE.md         # Detailed integration guide
├── README.md                           # This file
├── ToM_Booklet_1_Digital.md            # Booklet 1 reference
├── ToM_Booklet_2_Digital.md            # Booklet 2 reference
├── ToM_Booklet_1_script.pdf            # Original script
├── ToM_Booklet_2_script.pdf            # Original script
├── ToM_Booklet_Instructions.pdf        # Administration instructions
├── ToMBookletExamples.pdf              # Coding examples
├── ToM_Booklet_1_illustrations/        # Booklet 1 images
│   ├── ToM_Booklet_01.png
│   ├── ToM_Booklet_02.png
│   └── ... (24 images + pieces)
└── ToM_Booklet_2_illustrations/        # Booklet 2 images
    ├── MIT_BOOKLET_ColorFINAL_0.png
    ├── MIT_BOOKLET_ColorFINAL_1.png
    └── ... (20 images + extra parts)
```

---

## 🎯 Assessment Types

### Booklet 1 (5-10 years, 41 items)

**Story 1: The Classroom**
- Common desires
- Diverse desires
- Diverse beliefs
- Reference (easy & hard)
- False beliefs (reality known)
- Moral reasoning based on false beliefs
- Expectations
- Interpretation

**Story 2: The Park**
- Common/diverse desires
- False belief (reality known)
- Moral reasoning based on false beliefs
- Emotion reminder
- Expectation
- Interpretation
- False beliefs about moral harms/deception

### Booklet 2 (5-12 years, 70 items; 3-4 years modified)

**Single Story: Classroom Snacks**
- All Booklet 1 concepts PLUS:
- Implicit false belief
- Sarcasm (ages 5+)*
- Lies and deception (ages 5+)*
- 2nd order belief-desire reasoning (ages 5+)*
- Action explanation with true belief

*Items excluded for ages 3-4

---

## 💡 Key Features Explained

### Branching Logic

The assessment automatically adapts questions based on participant responses:

**Example 1: Preference-Based**
```
Q1: "What do you like better- fish or dinosaurs?"
Child: "Fish"

Q2: "Laura likes [dinosaurs] better. Which will she pick?"
    ↑ Automatically filled with opposite choice
```

**Example 2: Conditional Follow-Up**
```
Q: "Where will Madison look for her book?"
Child: "Behind the chair" (correct)
Follow-up: "Oh great! There's her book!"

Child: "Under the rug" (incorrect)
Follow-up: "Uh oh. It's not there. Can you help?"
```

### Response Types

1. **Two-Alternative Forced Choice (2AFC)**
   - Present two options
   - Record selection
   - Track response time

2. **Explanation Questions**
   - Free-text response
   - Captures verbal reasoning
   - Requires manual coding

3. **Control Items (Fillers)**
   - Not scored
   - Maintain engagement
   - Provide breaks

### Data Collection

Every response captures:
- Participant metadata (ID, age, grade)
- Item information (ID, type, number)
- Question details (ID, type)
- Response content
- Response time (milliseconds)
- Timestamp

---

## 📊 Data Export Formats

### JSON Export
```json
{
  "participantId": "P001",
  "age": 8,
  "booklet": "booklet1",
  "responses": [
    {
      "itemId": "B1_S1_01",
      "questionId": "ToMB1_2AFC_01",
      "response": "Bicycles",
      "responseTime": 2341,
      "timestamp": "2026-01-06T10:30:00Z"
    }
  ]
}
```

### CSV Export
```
ParticipantID,Age,Grade,Booklet,ItemID,QuestionID,Response,ResponseTime
P001,8,3,booklet1,B1_S1_01,ToMB1_2AFC_01,Bicycles,2341
```

### Qualtrics Embedded Data
- Automatic integration
- Each question as separate field
- Response times tracked
- Ready for data export

---

## 🔧 Customization

### Adding New Items

Edit `tom-booklet-data.js`:

```javascript
{
    id: "B1_NEW_01",
    number: 15,
    type: "Custom Type",
    illustration: "path/to/image.png",
    script: "Your story script here...",
    questions: [
        {
            id: "NEW_Q1",
            type: "2AFC",
            text: "Your question?",
            options: ["Option A", "Option B"],
            correctAnswer: "Option A"
        },
        {
            id: "NEW_Q2",
            type: "explanation",
            text: "Why?"
        }
    ],
    followUp: "Follow-up text"
}
```

### Styling

Modify CSS in `index.html` or `qualtrics-integration.html`:

```css
/* Change primary color */
.btn {
    background: #your-color-here;
}

/* Adjust font sizes */
.question-text {
    font-size: 1.5em;
}
```

### Age Restrictions

Add age filters to items:

```javascript
{
    id: "B2_17",
    ageRestriction: { min: 5, max: 100 },
    excludeForYoung: true,  // Exclude for ages 3-4
    // ... rest of item
}
```

---

## 📖 Administration Guidelines

### Before Starting

1. **Review materials:**
   - Read `ToM_Booklet_Instructions.pdf`
   - Review `ToMBookletExamples.pdf` for scoring
   - Familiarize yourself with the script

2. **Technical setup:**
   - Test internet connection
   - Verify images load correctly
   - Check audio/video if recording

3. **Environment:**
   - Quiet room
   - Minimal distractions
   - Comfortable seating

### During Assessment

1. **Reading script:**
   - Use natural, child-directed speech
   - Emphasize key words where indicated
   - Maintain consistent pacing

2. **Forced-choice questions:**
   - Point to both options equally
   - Wait for child's response
   - Repeat answer verbatim

3. **Explanation questions:**
   - Allow time for thinking
   - Transcribe response exactly
   - Do not prompt or correct

### After Assessment

1. **Save data immediately**
2. **Review responses for completeness**
3. **Code explanation questions** (see ToMBookletExamples.pdf)
4. **Store securely with participant ID**

---

## 📈 Scoring and Analysis

### Item Scoring

**2AFC Questions:**
- 1 = Correct
- 0 = Incorrect

**Explanation Questions:**
- 2 = Correct + Complete (references mental state)
- 1 = Partially correct
- 0 = Incorrect (no mental state reasoning)

**Filler Items:**
- Not scored (excluded from analysis)

### Composite Scores

Calculate by item type:
- Common Desires
- Diverse Desires
- Diverse Beliefs
- False Beliefs
- Moral Reasoning
- Reference
- Interpretation
- etc.

### Example R Code

```r
library(dplyr)

# Load CSV export
data <- read.csv("ToM_P001_2026-01-06.csv")

# Calculate accuracy by item type
scores <- data %>%
  filter(ItemType != "Filler") %>%
  group_by(ParticipantID, ItemType) %>%
  summarise(
    accuracy = mean(Response == correctAnswer, na.rm = TRUE)
  )

# Overall ToM score
overall <- data %>%
  filter(ItemType != "Filler") %>%
  group_by(ParticipantID) %>%
  summarise(
    tom_score = sum(Response == correctAnswer, na.rm = TRUE),
    total_items = n()
  )
```

---

## 🌐 Qualtrics Integration Details

### Method 1: Embedded HTML

**Pros:**
- All-in-one solution
- No external hosting needed
- Data auto-saves to Qualtrics

**Cons:**
- Large HTML code block
- Limited debugging
- Image hosting needed

**Best for:** Simple deployments, single studies

### Method 2: iFrame

**Pros:**
- Cleaner Qualtrics survey
- Easier debugging
- Independent versioning

**Cons:**
- Requires web hosting
- Cross-origin considerations
- More setup steps

**Best for:** Multiple studies, frequent updates

See `QUALTRICS_PROLIFIC_GUIDE.md` for detailed instructions.

---

## 🔍 Troubleshooting

### Images Not Loading

**Problem:** Placeholder text instead of illustrations

**Solutions:**
1. Check file paths in `tom-booklet-data.js`
2. Verify images are in correct folders
3. Use absolute URLs for remote hosting
4. Upload to Qualtrics Graphics Library (for Qualtrics version)

### Branching Logic Not Working

**Problem:** Questions not adapting to previous responses

**Solutions:**
1. Check `storeAs` field in preference questions
2. Verify placeholder syntax: `{childChoice}` not `${childChoice}`
3. Review browser console for JavaScript errors
4. Test with different response patterns

### Data Not Saving (Qualtrics)

**Problem:** Embedded data fields empty

**Solutions:**
1. Create fields in Survey Flow BEFORE testing
2. Match field names exactly (case-sensitive)
3. Check that `Qualtrics.SurveyEngine.setEmbeddedData()` is called
4. Use Survey Preview to debug

### Mobile Display Issues

**Problem:** Layout breaks on small screens

**Solutions:**
1. Test with `@media` queries
2. Adjust `max-width` and `padding`
3. Use relative font sizes (`em`, `rem`)
4. Check viewport meta tag

---

## 📚 References and Citation

### Original Materials

**OSF Repository:** https://osf.io/g5zpv/

**Citation:**
```
Richardson, H., Lisandrelli, G., Riobueno-Naylor, A., & Saxe, R. (2018).
Development of the social brain from age three to twelve years.
Nature Communications, 9(1), 1027.
```

**Publication:**
```
Richardson, H., Lisandrelli, G., Riobueno-Naylor, A., & Saxe, R. (2020).
Open dataset of theory of mind reasoning in early to middle childhood.
Scientific Data, 7(1), 386.
```

### Digital Adaptation

This digital version created: January 2026

For technical questions about this implementation, please refer to this documentation.

---

## 📝 License

This digital adaptation is provided for research and educational purposes. The original ToM Booklet materials are available at OSF (https://osf.io/g5zpv/). Please cite both the original materials and this digital adaptation when using in research.

---

## 🤝 Contributing

To extend or improve this assessment:

1. **Add items:** Edit `tom-booklet-data.js`
2. **Modify logic:** Edit `tom-booklet-app.js`
3. **Update styling:** Edit CSS in respective HTML files
4. **Test thoroughly:** Use different age groups and response patterns
5. **Document changes:** Update this README

---

## ✅ Version Information

**Current Version:** 1.0.0
**Last Updated:** January 6, 2026
**Compatible With:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Qualtrics (all current versions)
- Prolific (all current versions)

---

## 📞 Support

For questions about:
- **Original assessment:** See OSF repository
- **Administration:** Review ToM_Booklet_Instructions.pdf
- **Scoring:** Review ToMBookletExamples.pdf
- **Qualtrics/Prolific:** See QUALTRICS_PROLIFIC_GUIDE.md
- **Technical issues:** Check browser console, review code comments

---

## 🎓 Acknowledgments

Original ToM Booklet Task developed by:
- Hilary Richardson
- Grace Lisandrelli
- Alexa Riobueno-Naylor
- Rebecca Saxe

Digital adaptation developed with all materials from the OSF repository.

---

**Happy assessing! 🧠**
