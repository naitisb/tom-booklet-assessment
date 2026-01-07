# ToM Assessment - Qualtrics & Prolific Integration Guide

## Overview

This guide explains how to integrate the Theory of Mind (ToM) Booklet Assessment into Qualtrics surveys and use it with Prolific for participant recruitment.

---

## Option 1: Qualtrics Integration (Embedded HTML)

### Method A: Upload as HTML Question Type

1. **Create a New Question in Qualtrics**
   - In your Qualtrics survey, add a new question
   - Change question type to "Text/Graphic"
   - Click on the question text and select "HTML View" (< > icon)

2. **Copy the HTML Code**
   - Open `qualtrics-integration.html`
   - Copy the ENTIRE file contents (including `<style>` and `<script>` tags)
   - Paste into the Qualtrics HTML view

3. **Set Up Embedded Data**
   - Go to Survey Flow
   - Add "Embedded Data" block at the start
   - Create fields for:
     - `age` (participant age)
     - `booklet` (booklet1, booklet2, or booklet2_young)
     - All question IDs (e.g., `ToMB1_2AFC_01`, `ToMB1_EXPL_05`, etc.)

4. **Collect Responses**
   - The assessment automatically saves each response as embedded data
   - Responses will appear in your Qualtrics data export

### Method B: External Link with iFrame

1. **Host the Assessment**
   - Upload `index.html`, `tom-booklet-data.js`, and `tom-booklet-app.js` to a web server
   - Or use GitHub Pages (free hosting)

2. **Embed in Qualtrics**
   - Add a "Text/Graphic" question
   - Click HTML View
   - Add an iframe:
   ```html
   <iframe src="https://your-domain.com/index.html?pid=${e://Field/ResponseID}&age=${e://Field/age}"
           width="100%" height="800px" frameborder="0">
   </iframe>
   ```

3. **Capture Data via URL Parameters**
   - The assessment will automatically read URL parameters
   - Use Qualtrics piped text to pass participant info

---

## Option 2: Prolific Integration

### Setup Steps

1. **Host Your Assessment**
   - Upload files to a web server or use GitHub Pages
   - Get the full URL (e.g., `https://yourdomain.com/index.html`)

2. **Create Prolific Study**
   - Go to Prolific.co
   - Create a new study
   - Set study link to: `https://yourdomain.com/index.html?pid={{%PROLIFIC_PID%}}&study_id={{%STUDY_ID%}}&session_id={{%SESSION_ID%}}`

3. **Automatic Participant ID Capture**
   - The assessment automatically reads Prolific parameters
   - Participant ID will be auto-filled from URL

4. **Completion Handling**

   **Option A: Redirect to Prolific**
   - After assessment completion, add this to the completion screen:
   ```javascript
   window.location.href = "https://app.prolific.co/submissions/complete?cc=YOUR_COMPLETION_CODE";
   ```

   **Option B: Display Completion Code**
   - Show a unique completion code on the final screen
   - Participants manually enter it in Prolific

---

## Option 3: Qualtrics + Prolific Combined

### Best Practice Workflow

1. **Create Qualtrics Survey**
   - Add demographic questions
   - Embed ToM assessment (using Method A or B above)
   - Add post-assessment questions

2. **Set Up Survey Flow**
   ```
   Survey Flow:
   1. Embedded Data
      - PROLIFIC_PID (from URL)
      - STUDY_ID (from URL)
      - SESSION_ID (from URL)
      - age, booklet, etc.

   2. Demographic Block
      - Age, gender, etc.

   3. ToM Assessment Block
      - Embedded HTML or iframe

   4. Post-Assessment Block
      - Follow-up questions

   5. End of Survey
      - Redirect to Prolific completion
   ```

3. **Get Qualtrics Anonymous Link**
   - Distributions → Anonymous Link
   - Copy the link

4. **Create Prolific Study**
   - Study link: Your Qualtrics anonymous link with parameters:
   ```
   https://yoursurvey.qualtrics.com/jfe/form/SV_xxx?
   PROLIFIC_PID={{%PROLIFIC_PID%}}&
   STUDY_ID={{%STUDY_ID%}}&
   SESSION_ID={{%SESSION_ID%}}
   ```

5. **Set Qualtrics Redirect**
   - Survey Options → End of Survey
   - Redirect to: `https://app.prolific.co/submissions/complete?cc=COMPLETION_CODE`

---

## Branching Logic Implementation

### How Branching Works

The assessment includes automatic branching logic for:

1. **Preference-Based Branching**
   - Child's preference is asked first
   - Stored as `childChoice`
   - Later questions use this value

   Example:
   ```javascript
   Question 1: "What do you like better- fish or dinosaurs?"
   Response: "Fish"

   Question 2: "Laura likes {opposite} better. Which will she pick?"
   Auto-filled: "Laura likes Dinosaurs better. Which will she pick?"
   ```

2. **Conditional Follow-Ups**
   - Based on correct/incorrect answers
   - Different text shown depending on response

   Example:
   ```javascript
   if (response === correctAnswer) {
       followUp = "Oh great! There's his book!";
   } else {
       followUp = "Uh oh. It's not there. Can you help?";
   }
   ```

3. **Age-Based Item Filtering**
   - Items marked with `*` in Booklet 2 are excluded for ages 3-4
   - Automatically filtered during initialization

### Implementing Custom Branching

To add custom branching logic:

```javascript
// In tom-booklet-data.js, add to a question:
{
    id: "your_question_id",
    text: "Your question text",
    type: "2AFC",
    options: ["Option A", "Option B"],
    branchingLogic: {
        "Option A": {
            nextItem: "B1_05", // Skip to specific item
            conditionalText: "Custom text for A"
        },
        "Option B": {
            nextItem: "B1_06", // Different path
            conditionalText: "Custom text for B"
        }
    }
}
```

---

## Data Export and Analysis

### Qualtrics Data Export

1. **Download Data**
   - Data & Analysis → Export & Import → Export Data
   - Choose CSV or SPSS format

2. **Embedded Data Columns**
   - Each question ID will be a column
   - Response times stored as `questionId_time`
   - Metadata stored (booklet type, duration, etc.)

3. **Data Structure**
   ```
   ResponseID | age | booklet | ToMB1_2AFC_01 | ToMB1_2AFC_01_time | ToMB1_EXPL_05 | ...
   R_xxx      | 8   | booklet1| Bicycles      | 2341               | Because...    | ...
   ```

### JSON Export (Standalone Version)

The standalone version exports data in this format:

```json
{
  "participantId": "P001",
  "age": 8,
  "grade": "3",
  "booklet": "booklet1",
  "examiner": "Dr. Smith",
  "startTime": "2026-01-06T10:30:00Z",
  "endTime": "2026-01-06T11:05:00Z",
  "totalDuration": 2100000,
  "responses": [
    {
      "itemId": "B1_S1_01",
      "itemNumber": 1,
      "itemType": "Common Desires",
      "questionId": "ToMB1_2AFC_01",
      "questionType": "2AFC",
      "response": "Bicycles",
      "timestamp": "2026-01-06T10:31:23Z",
      "responseTime": 12500
    }
  ]
}
```

### CSV Export (Standalone Version)

Headers:
```
ParticipantID,Age,Grade,Booklet,Examiner,ItemID,ItemNumber,ItemType,QuestionID,QuestionType,Response,Timestamp,ResponseTime
```

---

## Scoring Guidelines

### Data Coding

Based on the ToMBookletExamples.pdf:

#### 2AFC Questions (Two-Alternative Forced Choice)
- Code as: 1 = Correct, 0 = Incorrect
- Use `correctAnswer` field in data structure
- Example: "Where will she look?" → "Behind the chair" = correct

#### Explanation Questions
- Code as: 2 = Correct + Complete, 1 = Partially Correct, 0 = Incorrect
- Criteria:
  - **Correct**: References mental state (thinks, knows, believes)
  - **Incorrect**: References reality or desires only

Examples from documentation:
- Correct: "Because she thinks it's on top of the shelf"
- Incorrect: "Because she wants it"

#### Filler Items
- DO NOT score (excluded from total)
- Marked with `scored: false` in data

### Scoring Script (R Example)

```r
# Load data
data <- read.csv("ToM_responses.csv")

# Calculate scores by item type
library(dplyr)

scores <- data %>%
  filter(ItemType != "Filler") %>%
  group_by(ParticipantID, ItemType) %>%
  summarise(
    total_items = n(),
    correct_items = sum(Response == correctAnswer, na.rm = TRUE),
    accuracy = correct_items / total_items
  )

# Overall ToM score
overall <- data %>%
  filter(ItemType != "Filler", QuestionType == "2AFC") %>%
  group_by(ParticipantID) %>%
  summarise(
    tom_score = sum(Response == correctAnswer, na.rm = TRUE),
    total_items = n(),
    proportion_correct = tom_score / total_items
  )
```

---

## Troubleshooting

### Common Issues

**1. Assessment not loading in Qualtrics**
- Check that all HTML tags are properly closed
- Verify JavaScript is enabled in question settings
- Try using Method B (iframe) instead

**2. Images not displaying**
- Upload images to Qualtrics Graphics Library
- Update image paths to Qualtrics URLs
- Or use absolute URLs to externally hosted images

**3. Data not saving to embedded fields**
- Verify embedded data fields are created in Survey Flow
- Check field names match exactly (case-sensitive)
- Test with Survey Preview and check embedded data values

**4. Prolific participants not auto-filling**
- Verify URL parameters are included: `?pid={{%PROLIFIC_PID%}}`
- Check JavaScript console for errors
- Test the URL manually before launching study

**5. Branching logic not working**
- Check that prerequisite questions are answered
- Verify `storeAs` field names match in later questions
- Review browser console for JavaScript errors

### Testing Checklist

Before launching:
- [ ] Test complete flow start to finish
- [ ] Verify all images load correctly
- [ ] Check branching logic with different responses
- [ ] Confirm data exports correctly
- [ ] Test on mobile devices
- [ ] Verify Prolific/Qualtrics integration
- [ ] Test completion code/redirect
- [ ] Review data structure in export

---

## Advanced Customization

### Adding Custom Items

1. Edit `tom-booklet-data.js`
2. Add new item object:

```javascript
{
    id: "B1_NEW_01",
    number: 12,
    type: "Custom Item Type",
    illustration: "path/to/image.png",
    script: "Story script text here...",
    questions: [
        {
            id: "NEW_Q1",
            type: "2AFC",
            text: "Question text?",
            options: ["Option 1", "Option 2"],
            correctAnswer: "Option 1"
        }
    ],
    followUp: "Follow-up text"
}
```

### Modifying Appearance

Edit styles in `<style>` section:
- Colors: Change `#4CAF50` to your preferred color
- Fonts: Modify `font-family` properties
- Layout: Adjust `max-width`, `padding`, etc.

### Custom Completion Actions

In `complete()` function, add:

```javascript
// Send data to external database
fetch('https://your-api.com/save', {
    method: 'POST',
    body: JSON.stringify(this.sessionData)
});

// Redirect to custom URL
window.location.href = "https://your-thank-you-page.com";
```

---

## Support and Citation

### Original Materials
- OSF Repository: https://osf.io/g5zpv/
- Citation: Richardson, H., et al. (2020). Open dataset of theory of mind reasoning in early to middle childhood.

### Technical Support
For issues with this digital version, please check:
1. Browser console for JavaScript errors
2. Network tab for failed resource loads
3. Qualtrics/Prolific documentation for platform-specific issues

---

## License

This digital adaptation is provided for research and educational purposes. Please cite the original ToM Booklet materials when using this assessment in your research.
