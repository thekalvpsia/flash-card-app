from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def home():
    return "AI Flashcard Generator Backend is running!"

@app.route('/generate', methods=['POST'])
def generate_flashcards():
    try:
        # Get the YouTube link from the request
        data = request.get_json()
        youtube_link = data.get('link')

        if not youtube_link:
            return jsonify({"error": "YouTube link is required"}), 400

        # Placeholder for video content extraction
        video_content = f"Placeholder content extracted from {youtube_link}"

        # Define the prompt for the ChatGPT model
        messages = [
            {"role": "developer", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Generate flashcards based on the following content:\n\n{video_content}"}
        ]

        # Call the OpenAI API to generate flashcards
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        # Extract the flashcards from the response
        flashcards = response.choices[0].message.content.strip()

        return jsonify({"flashcards": flashcards})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
