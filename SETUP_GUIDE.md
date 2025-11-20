# 🚀 Quick Setup Guide - Quiz Automation System

## Step-by-Step Installation

### 1️⃣ Install Tesseract OCR

**Windows:**
```bash
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Run installer, then add to PATH:
# Control Panel → System → Advanced → Environment Variables
# Add: C:\Program Files\Tesseract-OCR
```

**Mac:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

### 2️⃣ Install Python Packages

```bash
pip install pyautogui pytesseract Pillow google-generativeai
```

### 3️⃣ Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with "AI...")

### 4️⃣ Run the Program

```bash
python quiz_automation.py
```

### 5️⃣ Configure

1. Paste your API key in the "Gemini API Key" field
2. Adjust "Answer Delay" slider (0.5 seconds is good)
3. Click "💾 Save Configuration"

### 6️⃣ Start Quiz Mode

1. Open your quiz/class in browser
2. Click "▶️ Start Quiz Mode" in the program
3. Window minimizes automatically
4. Green overlay appears = ACTIVE
5. System automatically reads and answers questions!

### 7️⃣ Stop Anytime

- Press **ESC** key to stop immediately
- Or click "⏹️ Stop" button

## 🎯 Quick Tips

- **Test first**: Use "🔍 Test OCR" button to verify OCR works
- **Adjust speed**: Lower delay = faster answers (but may be obvious)
- **Stay hidden**: Program minimizes so you can focus on quiz
- **Check logs**: Activity Log shows all actions in real-time

## ⚡ Speed Settings

- **Fast Mode**: 0.3 seconds delay (very rapid)
- **Normal Mode**: 0.5 seconds delay (recommended)
- **Safe Mode**: 1.0 seconds delay (appears more natural)

## 🛠️ Troubleshooting

**"OCR not working"**
- Run: `tesseract --version` to check installation
- Restart terminal/command prompt

**"API Key error"**
- Verify key is correct (no spaces)
- Check internet connection

**"Program won't start"**
- Install dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (need 3.8+)

## 📱 During Your Quiz

1. Start the program first
2. Configure and save settings
3. Click "Start Quiz Mode"
4. Switch to your quiz window
5. System takes over automatically!
6. Press ESC when done

That's it! The system will handle the rest automatically.
