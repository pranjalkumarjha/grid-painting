import React, { useEffect, useRef } from 'react';

const BootUpAnimation = ({ onComplete }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animateBoard = () => {
            const text = 'animateBoard';
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
        
            let currentText = '';
            let index = 0;
        
            const typewriter = () => {
                if (index < text.length) {
                    currentText += text[index];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
        
                    // Text styles
                    ctx.font = '48px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#3498db'; // Primary text color
        
                    // Shadow styles
                    ctx.shadowColor = '#2c3e50'; // Shadow color
                    ctx.shadowBlur = 15; // Shadow blur
                    ctx.shadowOffsetX = 3; // Horizontal shadow offset
                    ctx.shadowOffsetY = 3; // Vertical shadow offset
        
                    // Render the text
                    ctx.fillText(currentText, centerX, centerY);
                    index++;
                    setTimeout(typewriter, 100); // Delay between each letter
                } else {
                    setTimeout(() => fadeOut(), 1000); // Wait for 1 second before fading out
                }
            };
        
            const fadeOut = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                onComplete(); // Notify when the animation is complete
            };
        
            typewriter();
        };
        
        

        animateBoard();
    }, [onComplete]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    );
};

export default BootUpAnimation;
