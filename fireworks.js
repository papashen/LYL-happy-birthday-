// fireworks.js

// Get the canvas element and its context
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let fireworks = [];
let particles = [];
const colors = ['#ff4e50', '#fcab10', '#4a47a3', '#3cba92', '#f45078', '#3b5998', '#00aced'];

class Firework {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.speed = 3;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.fireworkParticles = [];
        this.createFirework();
    }

    createFirework() {
        for (let i = 0; i < 50; i++) {
            const particle = new Particle(this.x, this.y, this.color);
            this.fireworkParticles.push(particle);
        }
    }

    update() {
        if (!this.exploded) {
            this.x += this.vx;
            this.y += this.vy;

            const distance = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);
            if (distance < this.speed) {
                this.exploded = true;
                this.createParticles();
            }
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.fireworkParticles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
        }
    }

    createParticles() {
        this.fireworkParticles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                this.fireworkParticles.splice(index, 1);
            }
        });

        if (this.fireworkParticles.length === 0) {
            for (let i = 0; i < 200; i++) {
                const particle = new Particle(this.x, this.y, this.color);
                particles.push(particle);
            }
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.speed = Math.random() * 3 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function createFireworks() {
    const fireworkCount = Math.floor(Math.random() * 2) + 3; // Randomly create 3 or 4 fireworks
    for (let i = 0; i < fireworkCount; i++) {
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height / 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const firework = new Firework(canvas.width / 2, canvas.height, targetX, targetY, color);
        fireworks.push(firework);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.fireworkParticles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// Create fireworks every 2 seconds
setInterval(createFireworks, 2000);

// Start the animation
animate();
