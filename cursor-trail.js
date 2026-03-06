// Smooth Shooting Star Cursor Trail - Only on movement
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const points = [];
    const maxPoints = 15;
    let mouseX = -100;
    let mouseY = -100;
    let lastMouseX = -100;
    let lastMouseY = -100;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if mouse actually moved
        const moved = Math.abs(mouseX - lastMouseX) > 1 || Math.abs(mouseY - lastMouseY) > 1;

        if (moved) {
            points.unshift({ x: mouseX, y: mouseY });
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        } else {
            // Mouse stopped - remove points quickly
            if (points.length > 0) {
                points.pop();
                points.pop(); // Remove 2 at a time for faster fade
            }
        }

        // Keep tail short
        while (points.length > maxPoints) {
            points.pop();
        }

        if (points.length < 2) {
            requestAnimationFrame(draw);
            return;
        }

        // Draw tapered trail
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];

            const progress = i / (points.length - 1);

            // Strong taper: 5px at start, nearly 0 at end
            const width = 5 * Math.pow(1 - progress, 1.5);

            // Fade opacity
            const opacity = 0.5 * (1 - progress);

            if (width < 0.3) continue;

            // Get direction for perpendicular offset
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const px = -dy / len;
            const py = dx / len;

            // Next segment width
            const nextProgress = (i + 1) / (points.length - 1);
            const nextWidth = 5 * Math.pow(1 - nextProgress, 1.5);

            // Draw trapezoid segment
            ctx.beginPath();
            ctx.moveTo(p1.x + px * width / 2, p1.y + py * width / 2);
            ctx.lineTo(p2.x + px * nextWidth / 2, p2.y + py * nextWidth / 2);
            ctx.lineTo(p2.x - px * nextWidth / 2, p2.y - py * nextWidth / 2);
            ctx.lineTo(p1.x - px * width / 2, p1.y - py * width / 2);
            ctx.closePath();

            ctx.fillStyle = `rgba(128, 80, 128, ${opacity})`;
            ctx.fill();
        }

        // Rounded tip at cursor (only when moving)
        if (points.length > 2) {
            ctx.beginPath();
            ctx.arc(points[0].x, points[0].y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(128, 80, 128, 0.5)';
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    draw();
});
