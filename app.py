from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from yt_dlp import YoutubeDL
import os
import requests
import json

app = Flask(__name__)

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flashcards')
def flashcards_page():
    return render_template('flashcards.html')

def fetch_subtitles(youtube_link):
    """Fetch subtitles from a YouTube video using yt-dlp."""
    ydl_opts = {
        'skip_download': True,
        'writesubtitles': True,
        'subtitlesformat': 'vtt',
        'quiet': True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(youtube_link, download=False)
        subtitles = result.get('subtitles')

        if subtitles and 'en' in subtitles:  # Check for English subtitles
            # Get the URL of the subtitle file
            subtitle_url = subtitles['en'][0]['url']

            # Fetch the subtitle content
            response = requests.get(subtitle_url)
            if response.status_code == 200:
                return response.text  # Return the raw subtitle content
        return None  # Return None if subtitles are unavailable

def parse_vtt_to_text(vtt_content):
    """Parse VTT subtitle content into plain text."""
    lines = vtt_content.splitlines()
    text = []
    for line in lines:
        # Skip lines with timestamps, metadata, or irrelevant text
        if '-->' not in line and line.strip() and not line.lower().startswith("caption"):
            text.append(line.strip())
    return ' '.join(text)  # Combine all text into a single string

def extract_json_from_response(response_text):
    """Backend preprocessing."""
    start_index = response_text.find('[')  # Find the start of the JSON array
    end_index = response_text.rfind(']')  # Find the end of the JSON array
    if start_index != -1 and end_index != -1:
        json_str = response_text[start_index:end_index + 1]
        return json.loads(json_str)  # Convert to Python object
    raise ValueError("No JSON found in response")

def get_video_duration(youtube_link):
    """Retrieve the duration of a YouTube video in seconds."""
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'force_generic_extractor': False,
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_link, download=False)
            duration = info.get("duration", 0)  # Duration in seconds
            return duration
    except Exception:
        return None  # Unable to retrieve duration

@app.route('/generate', methods=['POST'])
def generate_flashcards():
    try:
        # Get the YouTube link from the request
        data = request.get_json()

        # Check if the request contains uploaded flashcards
        flashcards = data.get('flashcards')
        if flashcards:
            # Validate the flashcards format
            if not isinstance(flashcards, list) or not all('question' in card and 'answer' in card for card in flashcards):
                return jsonify({"error": "Invalid flashcard format"}), 400
            return jsonify({"flashcards": flashcards})

        # Check if the request contains a YouTube link
        youtube_link = data.get('link')
        if not youtube_link:
            return jsonify({"error": "YouTube link is required"}), 400

        # Check video duration
        duration = get_video_duration(youtube_link)
        if duration is None:
            return jsonify({"error": "Unable to determine video duration. Please try a different link."}), 400
        if duration > 1200:  # 1200 seconds = 20 minutes
            return jsonify({"error": "Video too long. Please provide a video that is 20 minutes or shorter."}), 400

        # Fetch and parse subtitles
        vtt_content = fetch_subtitles(youtube_link)
        if not vtt_content:
            return jsonify({"error": "Subtitles not available for this video"}), 404

        video_content = parse_vtt_to_text(vtt_content)

        # Define the prompt for the ChatGPT model
        messages = [
            {"role": "developer", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Generate flashcards in JSON format with 'question' and 'answer' fields based on the provided content. Focus only on meaningful and educational content. Ignore irrelevant or repeated lines:\n\n{video_content}"}
        ]

        # Call the OpenAI API to generate flashcards
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        # Extract the flashcards from the response
        raw_flashcards = response.choices[0].message.content.strip()

        try:
            flashcards = extract_json_from_response(raw_flashcards)
        except ValueError as e:
            return jsonify({"error": "Invalid JSON format in the response"}), 500

        return jsonify({"flashcards": flashcards})

    except Exception as e:
        error_message = str(e)
        if "not a valid URL" in error_message:
            return jsonify({"error": "Invalid link detected. Please enter a valid YouTube URL."}), 400
        return jsonify({"error": "An unexpected error occurred. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)
