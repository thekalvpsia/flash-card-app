const flashcards = []; // Will store flashcards dynamically
let currentIndex = 0;

// Load the YouTube link from localStorage
const youtubeLink = localStorage.getItem("youtubeLink");

if (!youtubeLink) {
    alert("No YouTube link found. Redirecting to the home page.");
    window.location.href = "/";
}

// Fetch flashcards from the backend
fetch('/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ link: youtubeLink })
})
    .then(response => response.json())
    .then(data => {
        if (data.flashcards) {
            // Clear and load new flashcards
            flashcards.push(...data.flashcards);

            // Update the flashcard viewer
            updateFlashcard();

            // Populate the flashcard list
            const list = document.getElementById("flashcard-list");
            list.innerHTML = ""; // Clear existing list
            flashcards.forEach(card => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>Q:</strong> ${card.question}<br><strong>A:</strong> ${card.answer}`;
                list.appendChild(li);
            });
        } else {
            alert("Error: Unable to generate flashcards.");
        }
    })
    .catch(error => {
        console.error("Error fetching flashcards:", error);
        alert("An error occurred while generating flashcards. Please try again.");
    });

// Update flashcard display
function updateFlashcard() {
    const flashcard = flashcards[currentIndex];
    document.getElementById("flashcard-question").innerText = flashcard.question;
    document.getElementById("flashcard-answer").innerText = flashcard.answer;

    // Reset the card to the front
    const flashcardElement = document.getElementById("flashcard");
    flashcardElement.classList.remove("flip");

    document.getElementById("prev-btn").style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
    document.getElementById("next-btn").style.visibility = currentIndex === flashcards.length - 1 ? 'hidden' : 'visible';
}

// Flip flashcard on click
document.getElementById("flashcard").addEventListener("click", () => {
    const flashcard = document.getElementById("flashcard");
    flashcard.classList.toggle("flip");
});

// Navigate flashcards
document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateFlashcard();
    }
});

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateFlashcard();
    }
});

// Navigate back to the home screen
function goBack() {
    window.location.href = "/";
}
