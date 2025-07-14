import React, { useEffect, useRef } from 'react';

const CanvasMap = ({ path }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Strong check to avoid undefined errors
        if (!Array.isArray(path) || path.length < 2 || !path[0] || !path[1]) {
            return;
        }

        const baseLat = path[0].latitude;
        const baseLng = path[0].longitude;

        const originX = canvas.width / 2;
        const originY = canvas.height / 2;

        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') continue;

            const px = originX + (point.longitude - baseLng) * 500000;
            const py = originY - (point.latitude - baseLat) * 500000;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Red dot at last valid point
        const last = path[path.length - 1];
        if (last && typeof last.latitude === 'number' && typeof last.longitude === 'number') {
            const lx = originX + (last.longitude - baseLng) * 500000;
            const ly = originY - (last.latitude - baseLat) * 500000;

            ctx.beginPath();
            ctx.arc(lx, ly, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    }, [path]);

    return (
        <div style={{ marginTop: '20px' }}>
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ border: '1px solid black', backgroundColor: '#fff' }}
            />
        </div>
    );
};

export default CanvasMap;
