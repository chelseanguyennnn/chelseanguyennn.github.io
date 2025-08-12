//This is where I got instructions from Copilot and Claude to complete the code
let currentStage = 0;
let isImageSwapping = false;
let conversationStage = 0;
let hasPlayedFirstClickAudio = false; // Track if first click audio has been played

// Initialize the page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

function expandLight() {
    console.log('expandLight called, current stage:', currentStage);
    
    const glowCircle = document.getElementById('glowCircle');
    const darkOverlay = document.getElementById('darkOverlay');
    const conversationBox = document.getElementById('conversationBox');
    const conversationText = document.getElementById('conversationText');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const compassIcon = document.getElementById('compassIcon');
    const introContainer = document.getElementById('introContainer');
    
    currentStage++;
    console.log('Moving to stage:', currentStage);

    // Hide intro container on stage 1 (first click)
    if (currentStage === 1 && introContainer) {
        introContainer.classList.add('hide');
        console.log('Hiding intro container on stage 1');
    }
    
    if (glowCircle && darkOverlay) {
        // Remove previous stage classes
        glowCircle.classList.remove('stage-1', 'stage-2', 'stage-3', 'stage-4');
        darkOverlay.classList.remove('stage-1', 'stage-2', 'stage-3', 'stage-4');
        
        // Add new stage class
        if (currentStage <= 4) {
            glowCircle.classList.add(`stage-${currentStage}`);
            darkOverlay.classList.add(`stage-${currentStage}`);
            console.log('Added stage-' + currentStage + ' to glow and overlay');
        }
    }
    
    // Show conversation box and update text based on stage
    if (conversationBox && conversationText) {
        conversationBox.classList.add('show');
        
        switch(currentStage) {
            case 1:
                conversationText.textContent = "Hi! Have you seen the sun and moon dancing around yet? If not, click on me to light up the dark.";
                break;
            case 2:
                conversationText.textContent = "Well, you found something! Click the compass to see the references and guiding page. To find the sun and moon, maybe try clicking once more?";
                // Show compass icon on stage 2
                if (compassIcon) {
                    compassIcon.classList.add('show');
                }
                break;
            case 3:
                conversationText.textContent = "If this is your first visit, catch the moon to explore the world-building. If you already know the world, skip and click once more to find the sun.";
                // Show only moon icon on stage 3
                if (moonIcon) {
                    moonIcon.classList.add('show');
                }
                break;
            case 4:
                conversationText.textContent = "Catch the sun to begin the journey.";
                // Show sun icon on stage 4
                if (sunIcon) {
                    sunIcon.classList.add('show');
                }
                break;
            default:
                break;
        }
    }
}

function playClickSound() {
    console.log('Playing click sound');
    
    const clickAudio = new Audio('sound/click.mp3');
    
    // Set up error handling for click audio
    clickAudio.addEventListener('error', function(e) {
        console.error('Error loading click audio file:', e);
    });
    
    // Play click audio
    clickAudio.play().then(() => {
        console.log('Click audio started playing');
    }).catch(error => {
        console.error('Error playing click audio:', error);
    });
}

function playFirstClickAudio() {
    console.log('Playing first click audio sequence');
    
    // Create first audio element
    const audio1 = new Audio('sound/forindex.mp3');
    
    // Set up error handling for first audio
    audio1.addEventListener('error', function(e) {
        console.error('Error loading first audio file:', e);
    });
    
    // Play first audio
    audio1.play().then(() => {
        console.log('First audio started playing');
    }).catch(error => {
        console.error('Error playing first audio:', error);
    });
    
    // When first audio ends, play second audio
    audio1.addEventListener('ended', function() {
        console.log('First audio ended, starting second audio');
        
        const audio2 = new Audio('sound/forindex2.mp3');
        
        // Set up error handling for second audio
        audio2.addEventListener('error', function(e) {
            console.error('Error loading second audio file:', e);
        });
        
        // Play second audio
        audio2.play().then(() => {
            console.log('Second audio started playing');
        }).catch(error => {
            console.error('Error playing second audio:', error);
        });
        
        // Optional: Log when second audio ends
        audio2.addEventListener('ended', function() {
            console.log('Second audio ended');
        });
    });
}

function handleImageClick() {
    console.log('Image clicked! isImageSwapping:', isImageSwapping, 'currentStage:', currentStage);
    
    // Prevent multiple clicks during the swap
    if (isImageSwapping) return;
    
    // Play click sound on every image click
    playClickSound();
    
    const centerImage = document.getElementById('centerImage');
    console.log('Center image element:', centerImage);
    
    // Play audio sequence on first click only
    if (!hasPlayedFirstClickAudio) {
        playFirstClickAudio();
        hasPlayedFirstClickAudio = true;
        console.log('First click - audio sequence initiated');
    }
    
    // Only expand light if we haven't reached stage 4 (since both icons appear by stage 4)
    if (currentStage < 4) {
        expandLight();
    }
    
    // Start image swap
    if (centerImage) {
        isImageSwapping = true;
        console.log('Changing image to 10.PNG');
        centerImage.src = 'image/10.PNG';
        
        // After 1.5 seconds, change back to original image
        setTimeout(() => {
            console.log('Changing image back to 9.PNG');
            centerImage.src = 'image/9.PNG';
            isImageSwapping = false;
        }, 1500);
    }
}

function showTextSection() {
    console.log('Moon clicked - showing text section');
    const textSection = document.getElementById('text');
    const conversationBox = document.getElementById('conversationBox');
    
    if (textSection) {
        textSection.classList.add('show');
    }
    
    // Hide conversation box when text section appears
    if (conversationBox) {
        conversationBox.classList.remove('show');
    }
}

function goToPage1() {
    console.log('Sun clicked - navigating to 1.html');
    window.location.href = '1.html';
}

function showRefPopup() {
    console.log('Compass clicked - showing references popup');
    const refPopup = document.getElementById('refPopup');
    if (refPopup) {
        refPopup.classList.add('show');
    }
}

function closeRefPopup() {
    console.log('Closing references popup');
    
    // Play click sound
    playClickSound();
    
    const refPopup = document.getElementById('refPopup');
    if (refPopup) {
        refPopup.classList.remove('show');
    }
}

function closeTextSection() {
    console.log('Closing text section');
    
    // Play click sound
    playClickSound();
    
    const textSection = document.getElementById('text');
    const conversationBox = document.getElementById('conversationBox');
    
    if (textSection) {
        textSection.classList.remove('show');
    }
    
    // Show conversation box again when text section closes
    if (conversationBox) {
        conversationBox.classList.add('show');
    }
}

// Close popup when clicking on overlay
document.getElementById('refPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRefPopup();
    }
});