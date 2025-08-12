//This is where I got instructions from Copilot and Claude to complete the code
// Create audio objects for sound effects
const soundFor3 = new Audio('sound/for3.mp3');
const soundClick = new Audio('sound/click.mp3');

// Function to play sound with error handling
function playSound(audioElement) {
    try {
        audioElement.currentTime = 0; // Reset to beginning
        audioElement.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    } catch (error) {
        console.log('Audio error:', error);
    }
}

function showLetter() {
    // Play the main sound effect
    playSound(soundFor3);
    
    const content = document.getElementById('content');
    const letterContent = document.getElementById('letterContent');
    const originalContent = document.querySelector('.original-content');
    
    // Hide original content
    originalContent.classList.add('hide');
    
    // Show letter content and modify container
    content.classList.add('letter');
    letterContent.classList.add('show');
}

// Add click sound to moon and clouds
function addClickSounds() {
    const moon = document.querySelector('.moon');
    const cloud1 = document.querySelector('.cloud1');
    const cloud2 = document.querySelector('.cloud2');
    
    // Add click sound to moon (in addition to showLetter)
    moon.addEventListener('click', function() {
        playSound(soundClick);
    });
    
    // Add click sound to clouds (in addition to showLetter)
    cloud1.addEventListener('click', function() {
        playSound(soundClick);
    });
    
    cloud2.addEventListener('click', function() {
        playSound(soundClick);
    });
}

function showOriginal() {
    const content = document.getElementById('content');
    const letterContent = document.getElementById('letterContent');
    const originalContent = document.querySelector('.original-content');
    
    // Show original content
    originalContent.classList.remove('hide');
    
    // Hide letter content and reset container
    content.classList.remove('letter');
    letterContent.classList.remove('show');
}

function openEndNotes() {
    // Play click sound for the button
    playSound(soundClick);
    
    // Open 3(1).html in a new window with popup-like properties
    const popup = window.open(
        '3(1).html',
        'endNotes',
        'width=700,height=600,left=' + 
        (screen.width / 2 - 350) + ',top=' + 
        (screen.height / 2 - 300) + 
        ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    // Focus the popup window
    if (popup) {
        popup.focus();
    }
}

// Initialize sounds when the page loads
document.addEventListener('DOMContentLoaded', function() {
    addClickSounds();
    
    // Preload audio files
    soundFor3.preload = 'auto';
    soundClick.preload = 'auto';
});