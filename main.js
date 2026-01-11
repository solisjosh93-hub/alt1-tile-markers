// main.js

// Configuration
let tileWidth = 50;
let tileHeight = 35; // RS tiles are flattened diamonds, so height < width
let isOverlayMode = false;

// DOM Elements
const canvas = document.getElementById('overlayCanvas');
const ctx = canvas.getContext('2d');
const inputW = document.getElementById('tile-width');
const inputH = document.getElementById('tile-height');
const displayW = document.getElementById('val-w');
const displayH = document.getElementById('val-h');
const controls = document.getElementById('controls');
const toggleBtn = document.getElementById('toggle-overlay');

// Resize canvas to fit window
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
window.addEventListener('resize', resize);

// Load saved settings
if (localStorage.getItem('tileWidth')) {
    tileWidth = parseInt(localStorage.getItem('tileWidth'));
    tileHeight = parseInt(localStorage.getItem('tileHeight'));
    inputW.value = tileWidth;
    inputH.value = tileHeight;
}

// Update loop
function updateSettings() {
    tileWidth = parseInt(inputW.value);
    tileHeight = parseInt(inputH.value);
    
    displayW.innerText = tileWidth;
    displayH.innerText = tileHeight;
    
    // Save for next time
    localStorage.setItem('tileWidth', tileWidth);
    localStorage.setItem('tileHeight', tileHeight);
    
    draw();
}

inputW.addEventListener('input', updateSettings);
inputH.addEventListener('input', updateSettings);

// Toggle visibility of controls
toggleBtn.addEventListener('click', () => {
    isOverlayMode = !isOverlayMode;
    if (isOverlayMode) {
        controls.style.opacity = '0.1'; // Make controls barely visible
        toggleBtn.innerText = "Show Menu";
    } else {
        controls.style.opacity = '1';
        toggleBtn.innerText = "Toggle Guides";
    }
});

// Main Draw Function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Draw Center (Player Position)
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Draw Guides
    // Since you face North, East is Right, North is Up
    // RS Perspective is roughly: X axis is horizontal, Y axis is vertical (screen space)
    
    // Distances to mark: 2 and 4
    const distances = [2, 4];
    
    distances.forEach(dist => {
        // Calculate offsets
        // Note: As you move further away, perspective might shift slightly, 
        // but for 2-4 tiles, linear scaling is usually "close enough" for clicking.
        
        let xOffset = dist * tileWidth;
        let yOffset = dist * tileHeight;

        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow, transparent
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;

        // EAST (Right)
        drawTile(cx + xOffset, cy);
        
        // WEST (Left)
        drawTile(cx - xOffset, cy);

        // NORTH (Up)
        drawTile(cx, cy - yOffset);

        // SOUTH (Down)
        drawTile(cx, cy + yOffset);
    });
}

function drawTile(x, y) {
    // Draws a diamond shape or box representing the tile area
    // RS tiles are diamonds. Let's draw a simple diamond.
    
    ctx.beginPath();
    ctx.moveTo(x, y - tileHeight/2); // Top
    ctx.lineTo(x + tileWidth/2, y);  // Right
    ctx.lineTo(x, y + tileHeight/2); // Bottom
    ctx.lineTo(x - tileWidth/2, y);  // Left
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    // ctx.fillText('X', x, y + 3); 
}

// Init
updateSettings();
resize();