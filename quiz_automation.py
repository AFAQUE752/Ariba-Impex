#!/usr/bin/env python3
"""
Automated Quiz Answering System
This program captures screen, reads questions using OCR, and answers automatically
"""

import tkinter as tk
from tkinter import messagebox, ttk
import pyautogui
import pytesseract
from PIL import Image, ImageGrab, ImageTk
import time
import json
import os
import threading
from datetime import datetime
import google.generativeai as genai

class QuizAutomation:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Quiz Automation System")
        self.root.geometry("800x600")
        self.root.configure(bg='#1e1e1e')

        # Configuration
        self.config = self.load_config()
        self.is_running = False
        self.overlay_window = None
        self.captured_questions = []

        # Configure AI
        if self.config.get('gemini_api_key'):
            genai.configure(api_key=self.config['gemini_api_key'])
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

        self.setup_ui()

    def load_config(self):
        """Load configuration from file"""
        config_file = 'quiz_config.json'
        default_config = {
            'gemini_api_key': '',
            'answer_delay': 0.5,
            'confidence_threshold': 0.7,
            'screen_region': None,
            'auto_click': True,
            'click_speed': 0.3
        }

        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                config = json.load(f)
                return {**default_config, **config}
        return default_config

    def save_config(self):
        """Save configuration to file"""
        with open('quiz_config.json', 'w') as f:
            json.dump(self.config, f, indent=2)

    def setup_ui(self):
        """Setup the main user interface"""
        # Title
        title_label = tk.Label(
            self.root,
            text="🎓 Quiz Automation System",
            font=("Arial", 24, "bold"),
            bg='#1e1e1e',
            fg='#00ff00'
        )
        title_label.pack(pady=20)

        # Status frame
        status_frame = tk.Frame(self.root, bg='#2d2d2d', relief=tk.RAISED, borderwidth=2)
        status_frame.pack(pady=10, padx=20, fill=tk.X)

        self.status_label = tk.Label(
            status_frame,
            text="Status: Ready",
            font=("Arial", 12),
            bg='#2d2d2d',
            fg='#ffffff'
        )
        self.status_label.pack(pady=10)

        # Configuration frame
        config_frame = tk.LabelFrame(
            self.root,
            text="Configuration",
            font=("Arial", 12, "bold"),
            bg='#2d2d2d',
            fg='#00ff00',
            relief=tk.GROOVE,
            borderwidth=2
        )
        config_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)

        # API Key
        tk.Label(
            config_frame,
            text="Gemini API Key:",
            bg='#2d2d2d',
            fg='#ffffff',
            font=("Arial", 10)
        ).grid(row=0, column=0, sticky='w', padx=10, pady=5)

        self.api_key_entry = tk.Entry(config_frame, width=50, show='*')
        self.api_key_entry.insert(0, self.config.get('gemini_api_key', ''))
        self.api_key_entry.grid(row=0, column=1, padx=10, pady=5)

        # Answer Delay
        tk.Label(
            config_frame,
            text="Answer Delay (seconds):",
            bg='#2d2d2d',
            fg='#ffffff',
            font=("Arial", 10)
        ).grid(row=1, column=0, sticky='w', padx=10, pady=5)

        self.delay_scale = tk.Scale(
            config_frame,
            from_=0.1,
            to=5.0,
            resolution=0.1,
            orient=tk.HORIZONTAL,
            bg='#2d2d2d',
            fg='#ffffff',
            length=300
        )
        self.delay_scale.set(self.config.get('answer_delay', 0.5))
        self.delay_scale.grid(row=1, column=1, padx=10, pady=5)

        # Auto-click toggle
        self.auto_click_var = tk.BooleanVar(value=self.config.get('auto_click', True))
        auto_click_check = tk.Checkbutton(
            config_frame,
            text="Enable Auto-Click",
            variable=self.auto_click_var,
            bg='#2d2d2d',
            fg='#ffffff',
            selectcolor='#1e1e1e',
            font=("Arial", 10)
        )
        auto_click_check.grid(row=2, column=0, columnspan=2, padx=10, pady=5)

        # Save config button
        save_config_btn = tk.Button(
            config_frame,
            text="💾 Save Configuration",
            command=self.save_configuration,
            bg='#0066cc',
            fg='#ffffff',
            font=("Arial", 10, "bold"),
            relief=tk.RAISED,
            borderwidth=2,
            cursor='hand2'
        )
        save_config_btn.grid(row=3, column=0, columnspan=2, pady=10)

        # Control buttons frame
        button_frame = tk.Frame(self.root, bg='#1e1e1e')
        button_frame.pack(pady=20)

        # Start button
        self.start_btn = tk.Button(
            button_frame,
            text="▶️ Start Quiz Mode",
            command=self.start_quiz_mode,
            bg='#00cc00',
            fg='#ffffff',
            font=("Arial", 14, "bold"),
            width=20,
            height=2,
            relief=tk.RAISED,
            borderwidth=3,
            cursor='hand2'
        )
        self.start_btn.grid(row=0, column=0, padx=10)

        # Test OCR button
        test_ocr_btn = tk.Button(
            button_frame,
            text="🔍 Test OCR",
            command=self.test_ocr,
            bg='#cc6600',
            fg='#ffffff',
            font=("Arial", 14, "bold"),
            width=20,
            height=2,
            relief=tk.RAISED,
            borderwidth=3,
            cursor='hand2'
        )
        test_ocr_btn.grid(row=0, column=1, padx=10)

        # Stop button
        self.stop_btn = tk.Button(
            button_frame,
            text="⏹️ Stop (ESC)",
            command=self.stop_quiz_mode,
            bg='#cc0000',
            fg='#ffffff',
            font=("Arial", 14, "bold"),
            width=20,
            height=2,
            relief=tk.RAISED,
            borderwidth=3,
            cursor='hand2',
            state=tk.DISABLED
        )
        self.stop_btn.grid(row=1, column=0, columnspan=2, pady=10)

        # Log display
        log_frame = tk.LabelFrame(
            self.root,
            text="Activity Log",
            font=("Arial", 10, "bold"),
            bg='#2d2d2d',
            fg='#00ff00'
        )
        log_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)

        self.log_text = tk.Text(
            log_frame,
            height=8,
            bg='#1e1e1e',
            fg='#00ff00',
            font=("Courier", 9),
            wrap=tk.WORD
        )
        self.log_text.pack(padx=5, pady=5, fill=tk.BOTH, expand=True)

        # Add scrollbar
        scrollbar = tk.Scrollbar(self.log_text)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_text.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=self.log_text.yview)

        self.log("System initialized. Ready to start.")

    def log(self, message):
        """Add message to log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)
        print(log_message.strip())

    def save_configuration(self):
        """Save current configuration"""
        self.config['gemini_api_key'] = self.api_key_entry.get()
        self.config['answer_delay'] = self.delay_scale.get()
        self.config['auto_click'] = self.auto_click_var.get()
        self.save_config()

        # Reconfigure AI if API key changed
        if self.config['gemini_api_key']:
            genai.configure(api_key=self.config['gemini_api_key'])
            self.model = genai.GenerativeModel('gemini-pro')

        self.log("Configuration saved successfully!")
        messagebox.showinfo("Success", "Configuration saved!")

    def test_ocr(self):
        """Test OCR on screen capture"""
        self.log("Testing OCR... Capturing screen in 3 seconds...")
        self.root.after(3000, self._perform_ocr_test)

    def _perform_ocr_test(self):
        """Perform the OCR test"""
        try:
            screenshot = ImageGrab.grab()
            text = pytesseract.image_to_string(screenshot)

            if text.strip():
                self.log(f"OCR Test Success! Detected {len(text)} characters")
                self.log(f"Sample text: {text[:100]}...")
            else:
                self.log("OCR Test: No text detected")

        except Exception as e:
            self.log(f"OCR Test Error: {str(e)}")
            messagebox.showerror("OCR Error", f"Failed to perform OCR: {str(e)}")

    def start_quiz_mode(self):
        """Start the quiz automation mode"""
        if not self.config.get('gemini_api_key'):
            messagebox.showwarning(
                "API Key Required",
                "Please configure your Gemini API key first!"
            )
            return

        self.is_running = True
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        self.status_label.config(text="Status: ACTIVE - Monitoring for questions...")

        self.log("Quiz mode STARTED! Press ESC to stop.")
        self.log("Minimizing in 3 seconds...")

        # Minimize after 3 seconds and start monitoring
        self.root.after(3000, self._start_monitoring)

    def _start_monitoring(self):
        """Start monitoring screen for questions"""
        self.root.iconify()
        self.create_overlay()

        # Start monitoring thread
        monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        monitor_thread.start()

    def create_overlay(self):
        """Create fullscreen overlay indicator"""
        self.overlay_window = tk.Toplevel()
        self.overlay_window.attributes('-fullscreen', True)
        self.overlay_window.attributes('-alpha', 0.3)
        self.overlay_window.attributes('-topmost', True)
        self.overlay_window.configure(bg='green')

        # Add indicator label
        indicator = tk.Label(
            self.overlay_window,
            text="🤖 QUIZ AUTO-ANSWER ACTIVE\nPress ESC to stop",
            font=("Arial", 20, "bold"),
            bg='green',
            fg='white'
        )
        indicator.pack(expand=True)

        # Bind escape key
        self.overlay_window.bind('<Escape>', lambda e: self.stop_quiz_mode())

    def _monitor_loop(self):
        """Main monitoring loop"""
        while self.is_running:
            try:
                # Capture screen
                screenshot = ImageGrab.grab()

                # Extract text using OCR
                text = pytesseract.image_to_string(screenshot)

                if text.strip():
                    # Check if this looks like a question
                    if self._is_question(text):
                        self.log(f"Question detected!")
                        answer = self._get_answer(text)

                        if answer:
                            self.log(f"Answer: {answer}")

                            if self.config.get('auto_click'):
                                self._auto_answer(answer)

                # Wait before next scan
                time.sleep(self.config.get('answer_delay', 0.5))

            except Exception as e:
                self.log(f"Error in monitoring: {str(e)}")
                time.sleep(1)

    def _is_question(self, text):
        """Check if text contains a question"""
        question_indicators = ['?', 'what', 'which', 'where', 'when', 'who', 'how', 'why']
        text_lower = text.lower()
        return any(indicator in text_lower for indicator in question_indicators)

    def _get_answer(self, question_text):
        """Get answer using AI"""
        try:
            if not self.model:
                return None

            prompt = f"""You are answering a quiz question. Provide ONLY the answer, no explanations.

Question: {question_text}

Answer (one word or short phrase only):"""

            response = self.model.generate_content(prompt)
            answer = response.text.strip()

            return answer

        except Exception as e:
            self.log(f"AI Error: {str(e)}")
            return None

    def _auto_answer(self, answer):
        """Automatically type and submit answer"""
        try:
            time.sleep(0.2)

            # Type the answer
            pyautogui.write(answer, interval=0.05)

            time.sleep(0.1)

            # Press Enter to submit
            pyautogui.press('enter')

            self.log(f"Auto-answered: {answer}")

        except Exception as e:
            self.log(f"Auto-answer error: {str(e)}")

    def stop_quiz_mode(self):
        """Stop the quiz automation"""
        self.is_running = False
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Status: Stopped")

        if self.overlay_window:
            self.overlay_window.destroy()
            self.overlay_window = None

        self.root.deiconify()
        self.log("Quiz mode STOPPED!")

    def run(self):
        """Run the application"""
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.root.mainloop()

    def on_closing(self):
        """Handle window closing"""
        if self.is_running:
            self.stop_quiz_mode()
        self.root.destroy()

if __name__ == "__main__":
    try:
        app = QuizAutomation()
        app.run()
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        messagebox.showerror("Error", f"Application failed to start: {str(e)}")
