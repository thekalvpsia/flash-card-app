# AI Flashcard Generator

AI Flashcard Generator is a web application that converts YouTube videos into interactive flashcards using AI. Simply paste a YouTube link, and the app will generate flashcards based on the video’s subtitles, making studying more efficient and engaging.

## Features

- **AI-Powered Flashcard Generation** – Extracts key concepts from YouTube videos and turns them into structured flashcards.
- **Flashcard Navigation** – Flip through flashcards one at a time, with the ability to see all flashcards in a list.
- **File Upload & Save** – Users can upload previously saved flashcards or download new flashcards for future use.
- **YouTube Subtitle Extraction** – Automatically processes subtitles to create meaningful flashcards.
- **Flashcard Flipping** – Click on a card to reveal the answer.
- **Light-Themed UI** – A minimalist, sleek design for better readability.
- **Pagination Indicator** – Displays the current flashcard number out of the total count.
- **Error Handling & Validation** – Handles invalid YouTube links, missing subtitles, and long videos.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python Flask
- **AI Processing**: OpenAI API (gpt-4o-mini)
- **Subtitles Extraction**: yt-dlp
- **Storage**: LocalStorage for saving/restoring flashcards
- **Hosting**: Render

## Future Enhancements
- **Edit Flashcards** – Allow users to modify generated flashcards directly in the app.
- **Shuffle Feature** – Users can randomize the flashcards for a more dynamic study experience.
- **Category-Based Flashcards** – Enable users to classify flashcards into categories or subjects.
- **Text-Based Flashcard Input** – Let users manually input text (instead of a video) to generate flashcards.
- **Custom AI Model Parameters** – Offer adjustable AI settings for different levels of detail.
- **User Accounts & Storage** – Allow users to save their flashcards persistently across devices.
- **Flashcard Quiz Mode** – Add a self-testing feature where users can mark flashcards as "known" or "need to review".

## How to Use

1. Clone this repository:
   ```bash
   git clone https://github.com/thekalvpsia/flash-card-app.git
   ```
2. Navigate into the project folder:
   ```bash
   cd flash-card-app
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your OpenAI API key:
   - Create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Add your **OpenAI API Key** inside the `.env` file.
5. Run the application:
   ```bash
   python app.py
   ```
6. Open your browser and go to:
   ```
   http://127.0.0.1:5000
   ```

## Contributing

Contributions are welcome! If you have ideas for improving the AI Flashcard Generator, feel free to fork the repository and submit a pull request.

## Credits
- Icons by [Freepik](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com/).

## License

AI Flashcard Generator is licensed under the MIT License.

