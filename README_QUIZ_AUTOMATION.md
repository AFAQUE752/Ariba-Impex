# 🎓 Automated Quiz Answering System

An intelligent system that automatically reads quiz questions from your screen and answers them at rapid speed using AI.

## ⚡ Features

- **Screen Capture**: Captures your entire screen in real-time
- **OCR (Optical Character Recognition)**: Reads questions from screen using Tesseract
- **AI-Powered Answers**: Uses Google's Gemini AI to generate accurate answers
- **Auto-Typing**: Automatically types answers at high speed
- **Fullscreen Overlay**: Semi-transparent overlay indicates when system is active
- **Configurable Speed**: Adjust answer delay and typing speed
- **Emergency Stop**: Press ESC key to stop at any time

## 📋 Prerequisites

### System Requirements
- Python 3.8 or higher
- Windows, macOS, or Linux
- Tesseract OCR installed on your system

### Install Tesseract OCR

#### Windows:
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location (C:\\Program Files\\Tesseract-OCR)
3. Add to PATH environment variable

#### macOS:
```bash
brew install tesseract
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

## 🚀 Installation

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Get a Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy the key for later use

3. **Configure the system:**
   - Run the program once to create `quiz_config.json`
   - Or manually edit the config file with your API key

## 🎮 Usage

### Starting the Program

```bash
python quiz_automation.py
```

### Configuration Steps

1. **Enter API Key**: Paste your Gemini API key in the configuration field
2. **Set Answer Delay**: Adjust the delay between detecting question and answering (default: 0.5 seconds)
3. **Enable Auto-Click**: Toggle automatic answer submission
4. **Save Configuration**: Click "Save Configuration" button

### Running Quiz Mode

1. Click **"▶️ Start Quiz Mode"**
2. The window will minimize in 3 seconds
3. A green overlay will appear indicating the system is active
4. Navigate to your quiz website/application
5. The system will automatically:
   - Detect questions on screen
   - Generate answers using AI
   - Type answers rapidly
   - Submit them automatically

### Stopping the System

- Press **ESC** key anywhere to stop immediately
- Or click **"⏹️ Stop"** button in the main window

## 🔧 Advanced Configuration

Edit `quiz_config.json` for advanced settings:

```json
{
  "gemini_api_key": "YOUR_API_KEY_HERE",
  "answer_delay": 0.5,
  "confidence_threshold": 0.7,
  "screen_region": null,
  "auto_click": true,
  "click_speed": 0.3
}
```

### Parameters:
- **gemini_api_key**: Your Google Gemini API key
- **answer_delay**: Seconds to wait between scans (lower = faster)
- **confidence_threshold**: Minimum confidence for OCR (0.0-1.0)
- **screen_region**: Specific region to monitor (null = full screen)
- **auto_click**: Automatically submit answers (true/false)
- **click_speed**: Delay between typing characters (seconds)

## 🎯 Tips for Best Performance

1. **Screen Clarity**: Ensure quiz questions are clearly visible and not obscured
2. **Font Size**: Larger text is easier for OCR to read
3. **Contrast**: High contrast (dark text on light background) works best
4. **Delay Settings**: Start with 0.5s delay, adjust based on quiz platform speed
5. **Test First**: Use "Test OCR" button to verify OCR is working properly

## 📊 System Flow

```
┌─────────────────┐
│  Quiz appears   │
│   on screen     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Screen Capture  │
│   (continuous)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OCR Processing │
│  (Tesseract)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Question        │
│ Detection       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Answer      │
│  (Gemini API)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auto-Type &     │
│ Submit Answer   │
└─────────────────┘
```

## 🛡️ Safety Features

- **Emergency Stop**: ESC key stops everything immediately
- **Visual Indicator**: Green overlay shows when system is active
- **Activity Log**: All actions logged in real-time
- **Configurable Speed**: Control answer speed to appear natural
- **Manual Override**: Can disable auto-submit and review answers first

## ⚠️ Important Notes

### Educational Use
This tool is designed for:
- **Personal practice quizzes**
- **Self-assessment tools**
- **Learning assistance**
- **Accessibility support**

### Ethical Considerations
- Do not use for graded assessments
- Do not use for competitive exams
- Respect academic integrity policies
- Use responsibly and ethically

### Legal Notice
This software is provided for educational purposes only. Users are responsible for ensuring their use complies with applicable laws, regulations, and policies. The authors assume no liability for misuse.

## 🐛 Troubleshooting

### OCR Not Working
- Verify Tesseract is installed: `tesseract --version`
- Check PATH environment variable includes Tesseract
- Ensure screen text is clear and readable

### API Errors
- Verify API key is correct and active
- Check internet connection
- Ensure Gemini API quota is not exceeded

### Auto-Click Not Working
- Check that auto_click is enabled in config
- Verify cursor is in correct text field
- Try adjusting click_speed parameter

### Performance Issues
- Increase answer_delay to reduce CPU usage
- Close unnecessary applications
- Reduce screen resolution if needed

## 🔄 Updates and Improvements

### Version 1.0 Features
- ✅ Screen capture and OCR
- ✅ AI-powered answers
- ✅ Auto-typing and submission
- ✅ Fullscreen overlay
- ✅ Configuration system

### Planned Features
- 🔜 Multiple choice detection
- 🔜 Answer confidence scoring
- 🔜 Multiple AI model support
- 🔜 Screenshot saving for review
- 🔜 Statistics and analytics

## 📝 License

This project is provided as-is for educational purposes. Use responsibly.

## 🤝 Support

For issues, questions, or improvements:
1. Check the troubleshooting section
2. Review the activity log for error messages
3. Verify all prerequisites are installed
4. Test OCR functionality with test button

## 🎓 How It Works

The system uses a combination of technologies:

1. **PyAutoGUI**: Screen capture and keyboard control
2. **Tesseract OCR**: Text extraction from images
3. **Google Gemini AI**: Natural language understanding and answer generation
4. **Tkinter**: User interface
5. **PIL (Pillow)**: Image processing

The workflow is fully automated once started, continuously monitoring the screen for new questions and responding within the configured delay time.

---

**Remember**: Use this tool responsibly and ethically. It's designed to assist learning, not to circumvent academic integrity.
