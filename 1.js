//This is where I got instructions from Copilot and Claude to complete the code
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio objects
    const introAudio = new Audio('sound/for2-intro.mp3');
    const textAudio = new Audio('sound/for2-text.mp3');
    const clickAudio = new Audio('sound/click.mp3');
    
    // Set audio properties for better user experience
    [introAudio, textAudio, clickAudio].forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.6; // Adjust volume as needed
    });

    function playClickSound() {
        clickAudio.currentTime = 0; // Reset to beginning
        clickAudio.play().catch(e => console.log('Audio play failed:', e));
    }

    function playIntroSound() {
        introAudio.currentTime = 0;
        introAudio.play().catch(e => console.log('Audio play failed:', e));
    }

    function playTextSound() {
        textAudio.currentTime = 0;
        textAudio.play().catch(e => console.log('Audio play failed:', e));
    }

    const floatingIcon = document.getElementById('floatingIcon');
    if (floatingIcon) {
        floatingIcon.addEventListener('click', function() {
            playClickSound();
            playIntroSound(); 
            showIntroText();
        });
    }

    // Show images button click handler
    const showImagesBtn = document.getElementById('showImagesBtn');
    if (showImagesBtn) {
        showImagesBtn.addEventListener('click', function() {
            playClickSound();
            playTextSound(); 
            showImageSeries();
        });
    }

    // Series image click handler
    const seriesImage = document.getElementById('seriesImage');
    if (seriesImage) {
        seriesImage.addEventListener('click', function() {
            playClickSound(); 
            nextImage();
        });
    }

    // Loading fragment button click handler
    const loadingFragmentBtn = document.getElementById('loadingFragmentBtn');
    if (loadingFragmentBtn) {
        loadingFragmentBtn.addEventListener('click', function() {
            playClickSound(); 
            showLetter();
        });
    }

    // Loading next page button click handler
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            playClickSound(); 
            goToPage2();
        });
    }
});

let isIntroShown = false;

const introTextContent = `In this world, going to university has become meaningless to most. If they want to know something, they simply archive it. Sound familiar? This verb is now as common as "google" once was.

The Archive is everywhere. People learn, listen, share, connect, even live inside it.

But not everyone follows this new way. Some still cling to the old values. Universities are one of the last relics of that past.

She is one of those people. The kind who always felt she was born in the wrong era. She sees the world with dreamy eyes and refuses to accept the meaning the Archive promises.

And today - the day she graduates - is also the first time she enters the Archive.`;

function showIntroText() {
    if (isIntroShown) {
        showVideo();
        return;
    }

    const container = document.getElementById('introTextContainer');
    const textElement = document.getElementById('introText');
    
    container.classList.add('show');
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    typeWriter(textElement, introTextContent, 10, () => {
        isIntroShown = true;
        setTimeout(() => {
            container.classList.remove('show');
            setTimeout(() => {
                showVideo();
            }, 500);
        }, 3000);
    });
}

function typeWriter(element, text, speed, callback) {
    element.innerHTML = '';
    let i = 0;
    let isInTag = false;
    let currentTag = '';

    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            
            if (char === '<') {
                isInTag = true;
                currentTag = char;
            } else if (char === '>' && isInTag) {
                isInTag = false;
                currentTag += char;
                element.innerHTML += currentTag;
                currentTag = '';
            } else if (isInTag) {
                currentTag += char;
            } else {
                element.innerHTML += char;
            }
            
            i++;
            
            if (!isInTag || char === '>') {
                setTimeout(type, speed);
            } else {
                type();
            }
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

function showVideo() {
    const container = document.getElementById('videoContainer');
    const video = document.getElementById('videoPlayer');
    const showImagesBtn = document.getElementById('showImagesBtn');
    const loadingFragmentBtn = document.getElementById('loadingFragmentBtn');
    
    if (container.classList.contains('show')) {
        closeVideo();
    } else {
        container.classList.add('show');
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        video.play();
        
        // Hide the button initially
        showImagesBtn.classList.remove('show');
        
        // Show the button after 15 seconds
        setTimeout(() => {
            showImagesBtn.classList.add('show');
        }, 15000);

        // Show the loading fragment button after 10 seconds
        setTimeout(() => {
            loadingFragmentBtn.classList.add('show');
        }, 20000);
    }
}

function closeVideo() {
    const container = document.getElementById('videoContainer');
    const video = document.getElementById('videoPlayer');
    const showImagesBtn = document.getElementById('showImagesBtn');
    const imageContainer = document.getElementById('imageSeriesContainer');
    const letterContainer = document.getElementById('letterContainer');
    const loadingFragmentBtn = document.getElementById('loadingFragmentBtn');
    
    container.classList.remove('show');
    imageContainer.classList.remove('show');
    letterContainer.classList.remove('show');
    showImagesBtn.classList.remove('show');
    loadingFragmentBtn.classList.remove('show');
    video.pause();
    video.currentTime = 0;
    
    // Reset image series
    currentImageIndex = 1;
    updateImageDisplay();
}

function showImageSeries() {
    const imageContainer = document.getElementById('imageSeriesContainer');
    imageContainer.classList.add('show');
    imageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showLetter() {
    const letterContainer = document.getElementById('letterContainer');
    const letterContent = document.getElementById('letterContent');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    letterContainer.classList.add('show');
    letterContent.classList.add('show');
    nextPageBtn.classList.add('show');
    letterContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize image series
let currentImageIndex = 1;
const totalImages = 7;

const imageDescriptions = [
    "Inside the Archive feels like a game interface - floating objects and pieces of knowledge drift through the space. The most captivating feature is a running clock or compass, spinning elegantly as part of the decor. A monitor board stands in the center, where you can search for any kind of knowledge you wish to learn. Click on the image to get to the next one.",
    "'Wow, this is magnificent!' says the girl with an excited tone. Tons of books, articles, maps, and more appear before her eyes. 'Now I understand why... This place is too charming for any knowledge seeker to resist.'",
    "She can't help but leap from one area to another - from the B.C. era to the Mid-Century, from the Hua Xia civilization to medieval times, and even to pre-AI periods. This is pure paradise for her.",
    "Oops. Suddenly, she steps on something by accident. It seems to have triggered a hidden system.",
    " 'Should I…?' she hesitates. 'But what if the people who made this don't want strangers to find it…?' She pauses, eyes widening. 'But it said from 2032!'",
    "I'm sorry… I will.",
    "A letter?",
];

function nextImage() {
    if (currentImageIndex < totalImages) {
        currentImageIndex++;
        updateImageDisplay();
    }
}

function updateImageDisplay() {
    const image = document.getElementById('seriesImage');
    const text = document.getElementById('imageText');
    const counter = document.getElementById('currentImage');
    
    image.src = `image/${currentImageIndex}.PNG`;
    text.textContent = imageDescriptions[currentImageIndex - 1];
    counter.textContent = currentImageIndex;
}

function handleImageError(img) {
    // If PNG doesn't work, try png
    if (img.src.includes('.PNG')) {
        img.src = img.src.replace('.PNG', '.png');
    } else {
        // Show error message
        img.alt = `Image ${currentImageIndex} not found`;
        img.style.background = '#6e6e24';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        console.log(`Image not found: ${img.src}`);
    }
}

// Generate stars and setup star field
$(function() {
    var nightsky = ["#25250c", "#494919", "#6e6e24", "#929232", "#b7b73e"];

    var star0 = "<div class='star star-0' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;'></div>";
    var star1 = "<div class='star star-1 blink' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;'></div>";
    var star2 = "<div class='star star-2 blink' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;'></div>";
    var star3 = "<div class='star star-3' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;'></div>";
    var star4 = "<div class='star star-4 blink' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;'></div>";
    var star5 = "<div class='star star-5' style='top:{{top}}vh;left:{{left}}vw;animation-duration:{{duration}}s;background-color:{{color}}'></div>";
    var star1pt = "<div class='star star-1 blink' style='top:{{top}}%;left:{{left}}%;animation-duration:{{duration}}s;background-color:{{color}};box-shadow:0px 0px 6px 1px {{shadow}}'></div>";
    var star2pt = "<div class='star star-2' style='top:{{top}}%;left:{{left}}%;animation-duration:{{duration}}s;background-color:{{color}};box-shadow:0px 0px 10px 1px {{shadow}};opacity:0.7'></div>";
    var blur = "<div class='blur' style='top:{{top}}%;left:{{left}}%;background-color:{{color}}'></div>";

    // Generate stars (multiple loops for different star types and positions)
    for (i = 0; i < 500; i++) {
        $(".stars").append(
            star1
                .replace("{{top}}", getRandomInt(0, 40))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(2, 5))
        );

        $(".stars").append(
            star2
                .replace("{{top}}", getRandomInt(20, 70))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(4, 8))
        );
    }

    for (i = 0; i < 150; i++) {
        $(".stars").append(
            star0
                .replace("{{top}}", getRandomInt(0, 50))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(1, 2.5))
        );

        $(".stars").append(
            star1
                .replace("{{top}}", getRandomInt(0, 50))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(2.5, 4))
        );

        $(".stars").append(
            star2
                .replace("{{top}}", getRandomInt(0, 50))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(4, 5))
        );
    }

    for (i = 0; i < 100; i++) {
        $(".stars").append(
            star0
                .replace("{{top}}", getRandomInt(40, 75))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(1, 3))
        );

        $(".stars").append(
            star1
                .replace("{{top}}", getRandomInt(40, 75))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(2, 4))
        );
    }

    for (i = 0; i < 250; i++) {
        $(".stars").append(
            star0
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(1, 2))
        );

        $(".stars").append(
            star1
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(2, 5))
        );

        $(".stars").append(
            star2
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(1, 4))
        );

        $(".stars").append(
            star4
                .replace("{{top}}", getRandomInt(0, 70))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(5, 7))
        );
    }

    for (i = 0; i < 150; i++) {
        $(".stars").append(
            star4
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(5, 7))
        );

        $(".stars-cross").append(
            blur
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{color}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
        );

        $(".stars-cross").append(
            star1pt
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(6, 12))
                .replace("{{color}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
                .replace("{{shadow}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
        );
    }

    for (i = 0; i < 50; i++) {
        if(i%2 == 0){
            $(".stars").append(
                star5
                    .replace("{{top}}", getRandomInt(0, 50))
                    .replace("{{left}}", getRandomInt(0, 100))
                    .replace("{{duration}}", getRandomInt(5, 7))
                    .replace("{{color}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
            );
        }

        $(".stars-cross-aux").append(
            blur
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{color}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
        );

        $(".stars-cross-aux").append(
            star2pt
                .replace("{{top}}", getRandomInt(0, 100))
                .replace("{{left}}", getRandomInt(0, 100))
                .replace("{{duration}}", getRandomInt(4, 10))
                .replace("{{color}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
                .replace("{{shadow}}", nightsky[Math.ceil(getRandomInt(0, nightsky.length - 1))])
        );
    }
});

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

// Close video with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideo();
    }
});

function goToPage2() {
    console.log('next-page-btn clicked - navigating to 2.html');
    window.location.href = '2.html';
}