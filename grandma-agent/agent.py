# agent.py
# Removed dotenv import as you're hardcoding the API key
from flask import Flask, request, jsonify
from flask_cors import CORS # Needed for cross-origin requests from your HTML file
import google.generativeai as genai
# import os # Not strictly needed if not using os.environ.get for the API key

app = Flask(__name__)
# IMPORTANT: For local development, allow CORS from your HTML file.
# In production, set this to your specific frontend domain.
CORS(app) 

# --- Configuration ---
# WARNING: HARDCODING API KEYS IS NOT RECOMMENDED FOR PRODUCTION.
# This is for local testing convenience only.
# Replace "YOUR_ACTUAL_API_KEY_HERE" with your valid Google API Key.
GOOGLE_API_KEY = "AIzaSyB00BXw4pQohDbL9hGXGjROCidEMuU1A54" # <-- Replace this with your actual key

genai.configure(api_key=GOOGLE_API_KEY)

# Define the persona as a system instruction
# This is a cleaner way to set the model's overall behavior.
persona_instruction = (
    "You are a wise, warm, and comforting grandmother named Elara. "
    "You always speak with love, patience, and gentle encouragement. "
    "You use phrases like 'my dear,' 'sweetie,' 'precious,' and offer advice related to "
    "well-being, rest, and simple joys. When asked about studies, encourage breaks, "
    "hydration, and positive self-talk. When someone vents, offer empathy, validation, "
    "and a comforting perspective. Respond as Grandma Elara would."
)

# Initialize the Gemini model with your persona as a system instruction
generation_config = {
    "temperature": 0.9, # Adjust for creativity (higher = more creative)
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 100, # Limit response length
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    # You can add other safety settings here as needed, following AI Studio guidelines.
    # For example:
    # {
    #     "category": "HARM_CATEGORY_HATE_SPEECH",
    #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    # },
    # {
    #     "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    # },
    # {
    #     "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    # },
]

# Create the model instance with your persona prompt as system instruction
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
    system_instruction=persona_instruction # Apply the persona here!
)

# A simple way to maintain conversation history for the AI
# For a real app, this would be per-user, e.g., stored in a database
# IMPORTANT: This global `chat_history` will mix conversations if multiple users
# interact with the API simultaneously. For a production app, manage history per session/user.
chat_history = [] 

# --- API Endpoint for Chat ---
@app.route('/chat', methods=['POST'])
def chat_with_grandma():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Start a chat session with the model
        # The persona is already set via `system_instruction` in the model definition.
        # Now, `chat_history` will be used for actual conversation turns.
        convo = model.start_chat(history=chat_history)
        
        response = convo.send_message(user_message) # Send just the user message
        grandma_reply = response.text

        # Update history for next turn (simplified, in real app, manage per user)
        # Note: The 'parts' should ideally contain objects with 'text' keys if the history is more complex.
        # For simple text, this still works.
        chat_history.append({"role": "user", "parts": [user_message]})
        chat_history.append({"role": "model", "parts": [grandma_reply]})
        
        return jsonify({"reply": grandma_reply})

    except Exception as e:
        # It's good practice to log the full exception for debugging, not just print.
        print(f"Error calling Gemini API: {e}")
        # Provide a user-friendly error message
        return jsonify({"error": "Grandma is a bit sleepy right now, try again later."}), 500

if __name__ == '__main__':
    # For development, run on localhost.
    # Use `python agent.py` in your terminal.
    # Note: No need to set GOOGLE_API_KEY environment variable now that it's hardcoded.
    app.run(debug=True, port=5000) # Runs on http://localhost:5000