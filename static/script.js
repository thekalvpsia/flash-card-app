const flashcards = []; // Will store flashcards dynamically
let currentIndex = 0;

// Show the loading screen and hide the flashcard content
function showLoadingScreen() {
    document.getElementById("loading-screen").classList.remove("hidden");
    document.getElementById("flashcard-container").classList.add("hidden");
}

// Hide the loading screen and show the flashcard content
function hideLoadingScreen() {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("flashcard-container").classList.remove("hidden");
}

// Check if new flashcards need to be generated
const youtubeLink = localStorage.getItem("youtubeLink");
const savedFlashcards = localStorage.getItem("flashcards");

if (youtubeLink) {
    showLoadingScreen(); // Show the loading screen
    
    // Fetch new flashcards from the backend
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: youtubeLink }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                throw new Error(data.error); // Trigger the catch block for errors
            }
            
            if (data.flashcards && data.flashcards.length > 0) {
                flashcards.length = 0; // Clear existing flashcards array
                flashcards.push(...data.flashcards); // Load new flashcards
                localStorage.setItem("flashcards", JSON.stringify(flashcards)); // Save new flashcards
                localStorage.removeItem("youtubeLink"); // Clear the link from localStorage
                updateFlashcard();
                populateFlashcardList();
            } else {
                throw new Error("No flashcards generated. Please check your input.");
            }
        })
        .catch((error) => {
            console.error("Error fetching flashcards:", error);
            alert(error.message);
            localStorage.removeItem("youtubeLink"); // Remove invalid link
            window.location.href = "/"; // Redirect back to home
        })
        .finally(() => {
            hideLoadingScreen(); // Hide the loading screen
        });
} else if (savedFlashcards) {
    // Load flashcards from localStorage
    flashcards.push(...JSON.parse(savedFlashcards));
    updateFlashcard();
    populateFlashcardList();
    hideLoadingScreen(); // Ensure flashcard content is visible if loaded from storage
} else {
    // Redirect to home if no flashcards or link are available
    alert("No flashcards or YouTube link found. Redirecting to the home page.");
    window.location.href = "/";
}

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

// Populate the flashcard list at the bottom
function populateFlashcardList() {
    const list = document.getElementById("flashcard-list");
    list.innerHTML = ""; // Clear existing list
    flashcards.forEach(card => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Q:</strong> ${card.question}<br><strong>A:</strong> ${card.answer}`;
        list.appendChild(li);
    });
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

// Save flashcards as a JSON file
function saveFlashcards() {
    if (flashcards.length === 0) {
        alert("No flashcards to save.");
        return;
    }

    const blob = new Blob([JSON.stringify(flashcards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flashcards.json";
    link.click();
    URL.revokeObjectURL(url); // Clean up
}
