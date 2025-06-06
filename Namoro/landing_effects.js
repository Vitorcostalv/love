const canvas = document.getElementById('landingEffectsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Function to draw a heart shape
function drawHeart(context, x, y, size, color) {
    context.save(); // Save current state
    context.translate(x, y); // Move context to heart center
    context.beginPath();
    context.moveTo(0, size / 4); // Start at bottom point
    context.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size); // Right curve
    context.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, size / 4); // Left curve
    context.closePath();
    context.fillStyle = color;
    context.fill();
    context.restore(); // Restore context to original state
}

// Heart Particle Class
class HeartParticle {
    constructor(x, y, size, color, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.type = type; // 'rising' or 'sideways'
        this.opacity = 1;
        this.fadeRate = Math.random() * 0.01 + 0.005; // How fast it fades
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Fade out over time
        this.opacity -= this.fadeRate;

        // Optional: Add some randomness to sideways movement
        if (this.type === 'sideways') {
             this.vx += (Math.random() - 0.5) * 0.1; // Slight horizontal sway
             // Keep vx within a reasonable range
             if (this.vx > 1) this.vx = 1;
             if (this.vx < -1) this.vx = -1;
        }
    }

    draw() {
        ctx.globalAlpha = Math.max(0, this.opacity); // Apply opacity
        drawHeart(ctx, this.x, this.y, this.size, this.color);
        ctx.globalAlpha = 1; // Reset global alpha
    }
}

// Array to hold particles
const particles = [];
const maxParticles = 80; // Limit the number of particles

// Function to create a new particle
function createParticle() {
    const size = Math.random() * 15 + 10; // Size between 10 and 25
    const color = '#ff3333'; // Neon Red Color
    const speed = Math.random() * 1 + 0.5; // Speed between 0.5 and 1.5

    let x, y, vx, vy;

    // Randomly choose a starting edge (0: top, 1: bottom, 2: left, 3: right)
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
        case 0: // Top edge
            x = Math.random() * canvas.width;
            y = -size; // Start above the canvas
            vx = (Math.random() - 0.5) * speed; // Move horizontally
            vy = Math.random() * speed; // Move downwards
            break;
        case 1: // Bottom edge
            x = Math.random() * canvas.width;
            y = canvas.height + size; // Start below the canvas
            vx = (Math.random() - 0.5) * speed; // Move horizontally
            vy = -Math.random() * speed; // Move upwards
            break;
        case 2: // Left edge
            x = -size; // Start left of the canvas
            y = Math.random() * canvas.height;
            vx = Math.random() * speed; // Move rightwards
            vy = (Math.random() - 0.5) * speed; // Move vertically
            break;
        case 3: // Right edge
            x = canvas.width + size; // Start right of the canvas
            y = Math.random() * canvas.height;
            vx = -Math.random() * speed; // Move leftwards
            vy = (Math.random() - 0.5) * speed; // Move vertically
            break;
    }

    // Ensure some movement if vx or vy is too small
     if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
         if (edge === 0 || edge === 1) vx = speed * (Math.random() < 0.5 ? 1 : -1);
         else vy = speed * (Math.random() < 0.5 ? 1 : -1);
     }

    particles.push(new HeartParticle(x, y, size, color, vx, vy, 'free')); // 'free' type for general movement
}

// Animation Loop
function animate() {
    // Clear canvas with a slight fade effect (trails)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Clear with a more subtle fade
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add new particles if below limit
    if (particles.length < maxParticles && Math.random() < 0.5) { // Increased spawn rate slightly
         createParticle();
    }

    // Update and draw particles, remove if faded or off-screen
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        // Remove particle if it's faded out or off-screen from any edge
        if (particle.opacity <= 0 || particle.y < -particle.size || particle.y > canvas.height + particle.size || particle.x < -particle.size || particle.x > canvas.width + particle.size) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Add canvas styles to cover the background
const style = document.createElement('style');
style.textContent = `
    #landingEffectsCanvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Allow clicks to pass through */
        z-index: -1; /* Behind the content */
    }
`;
document.head.appendChild(style); 