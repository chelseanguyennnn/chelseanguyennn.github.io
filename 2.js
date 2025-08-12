        //This is where I got instructions from Copilot and Claude to complete the code
        // Firefly animation code
        const canvas = document.getElementById('grassCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let enableBloom = true;

        const particle = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 3,
            glowRadius: 15,
            angle: 0
        };

        // Audio elements for sound effects
        const summerSound = new Audio('sound/summer.mp3');
        const clickSound = new Audio('sound/click.mp3');
        summerSound.loop = true; 
        summerSound.volume = 0.5; 

        // Flag to track if summer sound has started
        let summerSoundStarted = false;

        // Preload audio files
        summerSound.load();
        clickSound.load();
        const mouse = { x: particle.x, y: particle.y };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class GrassBlade {
            constructor(x, baseY) {
                this.x = x;
                this.baseY = baseY;
                this.height = 90 + Math.random() * 80;
                this.width = 4 + Math.random() * 2;
                this.swayAmplitude = 2 + Math.random() * 2;
                this.swaySpeed = 0.0003 + Math.random() * 0.0005;
                this.phase = Math.random() * Math.PI * 2;
            }

            draw(time, glowPos, flicker) {
                const tipXBase = this.x;
                const tipYBase = this.baseY - this.height;
                const distToGlow = Math.hypot(glowPos.x - tipXBase, glowPos.y - tipYBase);

                function hslToRgb(h, s, l) {
                    s /= 100;
                    l /= 100;
                    const k = n => (n + h / 30) % 12;
                    const a = s * Math.min(l, 1 - l);
                    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
                    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
                }

                const baseH = 60, baseS = 10, baseL = 13, tipL = 18;
                const illuminationRadius = 80;
                const illumination = Math.max(0, (illuminationRadius - distToGlow) / illuminationRadius);
                const illumFlicker = illumination * flicker;

                const baseLightness = baseL + illumFlicker * 30;
                const tipLightness = tipL + illumFlicker * 40;

                const [rBase, gBase, bBase] = hslToRgb(baseH, baseS, baseLightness);
                const [rTip, gTip, bTip] = hslToRgb(baseH, baseS, tipLightness);
                const colorBase = `rgb(${rBase}, ${gBase}, ${bBase})`;
                const colorTip = `rgb(${rTip}, ${gTip}, ${bTip})`;

                let swayAmp = this.swayAmplitude;
                let swaySpd = this.swaySpeed;
                if (distToGlow < illuminationRadius) {
                    const factor = (illuminationRadius - distToGlow) / illuminationRadius;
                    swayAmp += factor * 10;
                    swaySpd += factor * 0.005;
                }

                this.phase += swaySpd;
                const sway = Math.sin(this.phase + time * swaySpd) * swayAmp;
                const tipX = this.x + sway;
                const tipY = this.baseY - this.height;

                const baseLeftX = this.x - this.width / 2;
                const baseRightX = this.x + this.width / 2;
                const cpLeftX = this.x - this.width / 2;
                const cpLeftY = this.baseY - this.height * 0.5;
                const cpRightX = this.x + this.width / 2;
                const cpRightY = cpLeftY;

                ctx.beginPath();
                ctx.moveTo(baseLeftX, this.baseY);
                ctx.quadraticCurveTo(cpLeftX, cpLeftY, tipX, tipY);
                ctx.quadraticCurveTo(cpRightX, cpRightY, baseRightX, this.baseY);
                ctx.closePath();

                const gradient = ctx.createLinearGradient(this.x, this.baseY, this.x, tipY);
                gradient.addColorStop(0, colorBase);
                gradient.addColorStop(1, colorTip);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        let grassBlades = [];
        const numBlades = Math.floor(canvas.width / 2);

        function initGrass() {
            grassBlades = [];
            for (let i = 0; i < numBlades; i++) {
                const x = Math.random() * canvas.width;
                const baseY = canvas.height;
                grassBlades.push(new GrassBlade(x, baseY));
            }
        }

        function drawGlowLayer(glow, flicker) {
            const maxLayers = 4;
            for (let i = 1; i <= maxLayers; i++) {
                const radius = glow * (i * 0.8);
                const alpha = 0.12 / i;
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, radius
                );
                gradient.addColorStop(0, `rgba(193, 141, 75, ${alpha * flicker})`);
                gradient.addColorStop(0.5, `rgba(224, 194, 108, ${alpha * flicker * 0.8})`);
                gradient.addColorStop(1, 'rgba(255, 246, 141, 0)');

                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function animate(time = 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particle.x += (mouse.x - particle.x) * 0.1;
            particle.y += (mouse.y - particle.y) * 0.1;

            particle.angle += 0.1;
            const flicker = 0.5 + 0.5 * Math.sin(particle.angle * 2);
            const glow = particle.glowRadius * flicker;

            for (const blade of grassBlades) {
                blade.draw(time, particle, flicker);
            }

            if (enableBloom) {
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                drawGlowLayer(glow, flicker);
                ctx.restore();
            }

            const coreGlow = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glow
            );
            coreGlow.addColorStop(0, 'rgba(193, 141, 75, 0.8)');
            coreGlow.addColorStop(0.5, 'rgba(224, 194, 108, 0.6)');
            coreGlow.addColorStop(1, 'rgba(255, 246, 141, 0)');
            ctx.fillStyle = coreGlow;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, glow, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = 'rgb(193, 141, 75)';
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(animate);
        }

        // image and video sequence logic
        const image = document.getElementById('image');
        const introContainer = document.getElementById('introContainer');
        const videoContainer = document.getElementById('videoContainer');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoPlayer2 = document.getElementById('videoPlayer2');
        const content = document.getElementById('content');

        let sequenceStarted = false;
        let imageChanged = false; // Track if image has been changed

        // Show content slowly after 2 seconds
        setTimeout(() => {
            content.classList.add('visible');
        }, 2000);

        // Show image after 5 seconds
        setTimeout(() => {
            image.classList.add('visible');
        }, 5000);
        setTimeout(() => {
            introContainer.classList.add('visible');
        }, 5000);

        // image click handler with sound effect
        image.addEventListener('click', () => {
            // Play click sound
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Click audio play failed:', e));
            
            // Start summer sound on first click
            if (!summerSoundStarted) {
                summerSoundStarted = true;
                summerSound.play().catch(e => console.log('Summer audio play failed:', e));
            }
            
            // First click: change image from 9.PNG to 10.PNG
            if (!imageChanged) {
                image.src = 'image/10.PNG';
                imageChanged = true;
                return; 
            }
            
            // Second click: start video sequence (only if image has been changed and sequence hasn't started)
            if (imageChanged && !sequenceStarted) {
                sequenceStarted = true;
                
                      // Fade out the content first
                content.classList.add('fade-out');
                
                // After content fades out, show video container
                setTimeout(() => {
                    videoContainer.classList.add('visible');
                    // SAFARI FIX: User-initiated play (has sound since it's triggered by click)
                    videoPlayer.load();
                    videoPlayer.play().catch(e => {
                        console.log('Video play failed:', e);
                        // Fallback: Make video clickable to start playback
                        videoPlayer.style.cursor = 'pointer';
                        videoPlayer.title = 'Click to play video';
                        
                        const playVideo = () => {
                            videoPlayer.play().then(() => {
                                videoPlayer.style.cursor = 'default';
                                videoPlayer.title = '';
                                videoPlayer.removeEventListener('click', playVideo);
                            }).catch(e2 => console.log('Manual play failed:', e2));
                        };
                        videoPlayer.addEventListener('click', playVideo);
                    });
                }, 1000); 
            }
        });

        // Video event handlers
        videoPlayer.addEventListener('ended', () => {
            // Hide first video and show second
            videoPlayer.style.display = 'none';
            videoPlayer2.style.display = 'block';
            // SAFARI FIX: Should work since first video was user-initiated
            videoPlayer2.load();
            videoPlayer2.play().catch(e => {
                console.log('Video 2 play failed:', e);
                // Fallback: Make second video clickable too
                videoPlayer2.style.cursor = 'pointer';
                videoPlayer2.title = 'Click to play video';
                
                const playVideo2 = () => {
                    videoPlayer2.play().then(() => {
                        videoPlayer2.style.cursor = 'default';
                        videoPlayer2.title = '';
                        videoPlayer2.removeEventListener('click', playVideo2);
                    }).catch(e2 => console.log('Manual play failed:', e2));
                };
                videoPlayer2.addEventListener('click', playVideo2);
            });
        });

        videoPlayer2.addEventListener('ended', () => {
        // Sequence complete - redirect to 3.html
            window.location.href = '3.html';
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGrass();
        });

        // Initialize and start animation
        initGrass();
        animate();