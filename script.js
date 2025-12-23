const canvas = document.getElementById('galtonCanvas');
const ctx = canvas.getContext('2d');
const ballCountDisplay = document.getElementById('ballCount');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const themeSelect = document.getElementById('themeSelect');
const distSelect = document.getElementById('distSelect');
const pauseBtn = document.getElementById('pauseBtn');

// Populate Themes
if (typeof themeMetadata !== 'undefined' && themeSelect) {
    themeMetadata.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.group;

        Object.entries(group.themes).forEach(([key, data]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data.label;
            optgroup.appendChild(option);
        });

        themeSelect.appendChild(optgroup);
    });
    // Set default
    themeSelect.value = 'neon';
}

// System Configuration
let width, height;
let animationId;
let balls = [];
let pegs = [];
let bins = [];
let ballCount = 0;

/**
 * Configuration object for the simulation
 * @type {Object}
 */
const config = {
    pegRows: 12,
    pegSpacing: 40,
    pegRadius: 4,
    ballRadius: 3.5,
    spawnSpeed: 10,
    gravity: 0.25,
    restitution: 0.5,
    friction: 0.96,
    wind: 0,
    distribution: 'normal',
    isPaused: false,
    colors: themes.neon
};

// Controls
const speedInput = document.getElementById('speedInput');
const speedWarning = document.getElementById('speedWarning');
const SMOOTHNESS_LIMIT = 20;

/**
 * Updates the spawn speed configuration and UI displays
 * @param {number} val - The new speed value
 */
function updateSpeed(val) {
    config.spawnSpeed = val;

    let label = '';
    if (val <= 10) {
        label = `x${(val / 10).toFixed(1)}`;
    } else {
        label = `x${val - 9}`;
    }
    speedValue.textContent = label;

    if (val > SMOOTHNESS_LIMIT) {
        speedWarning.style.display = 'inline';
    } else {
        speedWarning.style.display = 'none';
    }

    if (document.activeElement !== speedInput) speedInput.value = val;
    if (document.activeElement !== speedSlider) speedSlider.value = Math.min(val, 20);
}

speedSlider.addEventListener('input', (e) => {
    updateSpeed(parseInt(e.target.value));
});

speedInput.addEventListener('input', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    updateSpeed(val);
});

themeSelect.addEventListener('change', (e) => {
    config.colors = themes[e.target.value];
});

distSelect.addEventListener('change', (e) => {
    config.distribution = e.target.value;

    config.wind = 0;

    if (config.distribution === 'skewed-left') config.wind = -0.015;
    if (config.distribution === 'skewed-right') config.wind = 0.015;
});

// Init label
speedValue.textContent = 'x1.0';

if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        config.isPaused = !config.isPaused;
        pauseBtn.textContent = config.isPaused ? 'Play' : 'Pause';
        pauseBtn.style.background = config.isPaused ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.05)';
        pauseBtn.style.color = config.isPaused ? '#000' : 'var(--text-color)';
    });
}
// Row Adjustment
const rowsDecrease = document.getElementById('rowsDecrease');
const rowsIncrease = document.getElementById('rowsIncrease');
const rowCountDisplay = document.getElementById('rowCount');

/**
 * Updates the number of peg rows in the board
 * @param {number} delta - The change in number of rows (e.g. +1 or -1)
 */
function updateRows(delta) {
    let newRows = config.pegRows + delta;

    if (newRows < 6) newRows = 6;
    if (newRows > 15) newRows = 15;

    if (newRows !== config.pegRows) {
        config.pegRows = newRows;
        rowCountDisplay.textContent = newRows;
        init();
    }
}

rowsDecrease.addEventListener('click', () => updateRows(-1));
rowsIncrease.addEventListener('click', () => updateRows(1));

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    spawnBall(x);
});


/**
 * Represents a 2D vector
 */
class Vector {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents a ball in the simulation
 */
class Ball {
    /**
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     */
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector((Math.random() - 0.5) * 0.2, 0);
        this.radius = config.ballRadius;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.active = true;
    }

    /**
     * Updates the ball's position and velocity based on physics
     */
    update() {
        this.vel.y += config.gravity;
        this.vel.x += config.wind;
        this.vel.x *= config.friction;
        this.vel.y *= config.friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -0.5;
        } else if (this.pos.x > width - this.radius) {
            this.pos.x = width - this.radius;
            this.vel.x *= -0.5;
        }
    }

    /**
     * Draws the ball on the canvas
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * Represents a static peg on the board
 */
class Peg {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.radius = config.pegRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * Initializes the simulation
 */
function init() {
    resize();
    setupBoard();
    balls = [];
    ballCount = 0;

    bins = new Array(25).fill(0);

    updateStatDisplay();

    if (animationId) cancelAnimationFrame(animationId);
    animate();
}

/**
 * Resizes the canvas to match the container
 */
function resize() {
    const container = document.querySelector('.simulation-container');
    width = canvas.width = container.clientWidth - 40;
    height = canvas.height = 600;
}

let pegGrid = [];

/**
 * Sets up the board with pegs in a triangular arrangement
 */
function setupBoard() {
    pegs = [];
    pegGrid = [];

    const startX = (width) / 2;
    const startY = 80;

    for (let row = 0; row < config.pegRows; row++) {
        const rowPegs = [];
        for (let col = 0; col <= row; col++) {
            const rowWidth = row * config.pegSpacing;
            const x = startX - (rowWidth / 2) + (col * config.pegSpacing);
            const y = startY + row * (config.pegSpacing * 0.866);

            const p = new Peg(x, y);
            pegs.push(p);
            rowPegs.push(p);
        }
        pegGrid.push(rowPegs);
    }
}

/**
 * Resolves collisions between a ball and the pegs
 * @param {Ball} ball
 */
function resolveCollisions(ball) {
    const startY = 80;
    const rowHeight = config.pegSpacing * 0.866;

    const relativeY = ball.pos.y - startY;
    const approxRow = Math.floor(relativeY / rowHeight);

    const startRow = Math.max(0, approxRow);
    const endRow = Math.min(config.pegRows - 1, approxRow + 1);

    for (let r = startRow; r <= endRow; r++) {
        const rowPegs = pegGrid[r];
        if (!rowPegs) continue;

        for (const peg of rowPegs) {
             if (Math.abs(ball.pos.x - peg.pos.x) > 10) continue;

            const dx = ball.pos.x - peg.pos.x;
            const dy = ball.pos.y - peg.pos.y;
            const distSq = dx * dx + dy * dy;
            const minDist = ball.radius + peg.radius;
            const minDistSq = minDist * minDist;

            if (distSq < minDistSq) {
                const distance = Math.sqrt(distSq);

                const nx = dx / distance;
                const ny = dy / distance;

                const overlap = minDist - distance;
                ball.pos.x += nx * overlap;
                ball.pos.y += ny * overlap;

                const randomFactor = (Math.random() - 0.5) * 0.15;

                const dot = ball.vel.x * (nx + randomFactor) + ball.vel.y * ny;

                ball.vel.x = (ball.vel.x - 2 * dot * nx) * config.restitution;
                ball.vel.y = (ball.vel.y - 2 * dot * ny) * config.restitution;
            }
        }
    }
}

function updateStatDisplay() {
    ballCountDisplay.textContent = ballCount.toLocaleString();
}

/**
 * Draws the histogram bins at the bottom of the board
 */
function drawBins() {
    const lastRowIndex = config.pegRows - 1;
    const bottomPegY = 80 + lastRowIndex * (config.pegSpacing * 0.866);

    const binY = bottomPegY + 40;
    const binHeight = height - binY;

    const binWidth = config.pegSpacing;
    const totalBinsWidth = bins.length * binWidth;
    const startX = (width - totalBinsWidth) / 2;

    const maxCount = Math.max(10, Math.max(...bins));

    for (let i = 0; i < bins.length; i++) {
        const x = startX + i * binWidth;
        const count = bins[i];

        const barH = (count / maxCount) * (binHeight - 20);

        if (count > 0) {
            const hue = 200 + (i / bins.length) * 60;
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
            ctx.fillRect(x + 2, height - barH, binWidth - 4, barH);

            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '10px Outfit';
            ctx.textAlign = 'center';
            if (barH > 15) {
                ctx.fillText(count, x + binWidth/2, height - barH - 5);
            }
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(x, binY);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

/**
 * Checks for balls that have reached the bins and updates statistics
 */
function processFinishedBalls() {
    const lastRowIndex = config.pegRows - 1;
    const bottomPegY = 80 + lastRowIndex * (config.pegSpacing * 0.866);
    const binThresholdY = bottomPegY + 20;

    const binWidth = config.pegSpacing;
    const totalBinsWidth = bins.length * binWidth;
    const startX = (width - totalBinsWidth) / 2;

    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (ball.pos.y > height + 10) {
             balls.splice(i, 1);
             continue;
        }

        if (ball.active && ball.pos.y > binThresholdY) {
            ball.active = false;

            let binIdx = Math.floor((ball.pos.x - startX) / binWidth);

            if (binIdx >= 0 && binIdx < bins.length) {
                bins[binIdx]++;
                ballCount++;
                updateStatDisplay();
            } else {
                 if (binIdx < 0) bins[0]++;
                 if (binIdx >= bins.length) bins[bins.length - 1]++;
                 ballCount++;
                 updateStatDisplay();
            }
        }

        if (!ball.active && ball.pos.y > height) {
             balls.splice(i, 1);
        }
    }
}

/**
 * Spawns a new ball at the top
 * @param {number} [xOverride] - Optional X position override
 */
function spawnBall(xOverride) {
    let x = width / 2;

    if (xOverride !== undefined) {
        x = xOverride;
    } else {
        if (config.distribution === 'bimodal') {
            x = (Math.random() > 0.5) ? (width/2 - 80) : (width/2 + 80);
        } else if (config.distribution === 'uniform') {
            const range = 300;
            x = (width/2) + (Math.random() - 0.5) * range;
        }
    }

    balls.push(new Ball(x, 20));
}

/**
 * Main animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    if (!config.isPaused) {
        if (config.spawnSpeed <= 10) {
            const delay = 11 - config.spawnSpeed;
            if (frames % delay === 0) {
               spawnBall();
            }
        } else {
            const count = config.spawnSpeed - 9;
            for(let k=0; k<count; k++) {
                spawnBall();
            }
        }
    }
    frames++;

    drawBins();

    for (const ball of balls) {
        if (ball.active) {
            ball.update();
            resolveCollisions(ball);
        } else {
            ball.pos.y += 10;
        }
        ball.draw();
    }

    for (const peg of pegs) {
        peg.draw();
    }

    processFinishedBalls();
}

let frames = 0;

window.addEventListener('resize', () => {
    const oldWidth = width;
    resize();
    const newWidth = width;

    const shiftX = (newWidth - oldWidth) / 2;

    balls.forEach(ball => {
        ball.pos.x += shiftX;
    });

    setupBoard();
});

resetBtn.addEventListener('click', init);

// Start
init();
