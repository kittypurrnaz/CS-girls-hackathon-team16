# **🏡 I Miss My Grandma's House**

A comforting web application designed to provide a supportive and nostalgic environment, featuring a wise grandma-like chatbot and a helpful Pomodoro timer. This project was built to offer emotional support and study assistance.

## **✨ Features**

* **Grandma Chatbot**: A kind and empathetic AI agent (powered by Google Gemini) that offers gentle encouragement, advice on well-being, rest, and simple joys. Perfect for emotional venting or getting study reminders.  
* **Pomodoro Timer**: A customizable timer to help you focus on your study sessions with built-in breaks and notifications.  
* **Nostalgic UI**: A warm and inviting visual design reminiscent of a grandma's cozy home.

## **📁 Project Structure**

The repository is organized for clarity and ease of setup:

Hackathon/  
├── .gitignore             \# Specifies intentionally untracked files to ignore  
├── README.md              \# This file  
├── LICENSE                \# Project licensing information  
│  
├── assets/                \# Contains project media files  
│   ├── homepage.gif       \# Animated background for the main page  
│   └── environment1.jpg   \# Background image for other rooms  
│  
├── css/                   \# Stylesheets for styling the application  
│   ├── style.css  
│   └── chat.css           \# Specific styles for the chatbot room  
│  
├── js/                    \# JavaScript files for interactive functionality  
│   └── script.js  
│  
├── pages/                 \# HTML pages for different sections/rooms  
│   ├── index.html         \# Main landing page  
│   ├── room1.html         \# The Study Room (Pomodoro Timer)  
│   └── room2.html         \# Grandma Chatbot Room  
│  
└── backend/               \# Python Flask backend for the chatbot API  
    └── grandma-agent/  
        ├── \_\_init\_\_.py  
        ├── agent.py       \# The core Flask application  
        └── requirements.txt \# Python dependencies  
        └── .env           \# (Optional) Environment variables for API key (excluded from Git)

## **🚀 Local Setup Guide**

Follow these steps to get the "I Miss My Grandma's House" application running on your local machine. This project runs the Grandma Agent backend locally using a Python Flask server, and the frontend is served directly from your browser.

### **📋 Prerequisites**

Ensure you have the following installed:

* **Python 3.8+**: Download from [python.org](https://www.python.org/downloads/).  
  * **Important:** During installation, check "Add Python.exe to PATH" for easy command-line access.  
* **pip**: Python's package installer (usually comes with Python).  
* **A Web Browser**: (e.g., Google Chrome, Mozilla Firefox, Microsoft Edge)  
* **VS Code (Recommended)**: A popular code editor that simplifies Python development and running local servers.

### **🖥️ 1\. Backend Setup (Python Flask API)**

The backend powers the Grandma Chatbot by communicating with the Google Gemini API.

1. Clone the Repository:  
   Open your terminal (or VS Code's integrated terminal) and clone this GitHub repository:  
   git clone https://github.com/YOUR\_USERNAME/YOUR\_REPO\_NAME.git  
   cd YOUR\_REPO\_NAME/Hackathon \# Adjust 'YOUR\_REPO\_NAME' to your actual repo name

2. **Navigate to the Backend Directory:**  
   cd backend/grandma-agent

3. Create and Activate a Virtual Environment:  
   (Highly Recommended for dependency management)  
   \# Create the virtual environment (do this once)  
   python \-m venv venv

   \# Activate the virtual environment:  
   \# On Windows (PowerShell):  
   .\\venv\\Scripts\\activate  
   \# On macOS/Linux (Bash/Zsh):  
   source venv/bin/activate

   Your terminal prompt should change to include (venv), indicating it's active.  
4. Install Python Dependencies:  
   With the virtual environment activated, install all required libraries:  
   pip install \-r requirements.txt

   **requirements.txt content:**  
   flask  
   flask-cors  
   google-generativeai  
   python-dotenv  
   gunicorn

5. Configure Google Gemini API Key:  
   The chatbot requires a Google Gemini API key.  
   * **Option A: Using a .env file (Recommended for Security):**  
     * In the backend/grandma-agent/ directory, create a new file named .env.  
     * Add your Gemini API key to it (replace YOUR\_ACTUAL\_GOOGLE\_API\_KEY with your real key):  
       GOOGLE\_API\_KEY="YOUR\_ACTUAL\_GOOGLE\_API\_KEY"

     * This file is automatically ignored by Git for security.  
   * **Option B: Hardcoding (For Quick Local Testing ONLY \- Not for Production\!):**  
     * Open agent.py in the backend/grandma-agent/ directory.  
     * Find the line GOOGLE\_API\_KEY \= "AIzaSyB00BXw4pQohDbL9hGXGjROCidEMuU1A54" (or similar).  
     * Replace "AIzaSyB00BXw4pQohDbL9hGXGjROCidEMuU1A54" with your actual Google Gemini API Key.  
     * **Security Warning:** Never commit your actual API key directly into your code in a public repository\! This option is purely for immediate local testing if .env setup proves challenging.  
6. Run the Flask Server:  
   From within the backend/grandma-agent/ directory (and with your virtual environment activated), run:  
   py agent.py

   You should see output indicating the Flask development server is running on http://127.0.0.1:5000. Keep this terminal window open; the server needs to be running for the chatbot to function.

### **🌐 2\. Frontend Access (HTML, CSS, JavaScript)**

The frontend is a static web application that runs directly in your browser.

1. Navigate to the Frontend Pages:  
   In your file explorer, go to the pages/ directory within your cloned repository.  
2. Open index.html in your Web Browser:  
   Double-click index.html to open it in your default web browser.  
   Alternatively, you can copy its full file path (e.g., file:///C:/Users/User/Desktop/Work/team-16/Hackathon/pages/index.html) and paste it into your browser's address bar.

### **🎉 That's It\!**

You should now have:

* Your Python Flask backend running (in a terminal window).  
* Your web frontend open in your browser.

Navigate through the rooms and interact with the Grandma AI chatbot in "Grandma Chatbot Room". Ensure the Flask server remains active in its terminal window while you use the chatbot.

## **📄 License**

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).