import React, { useRef, useEffect, useState } from 'react';
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook
import pointerToClassMap from '../constants/pointerTypeToClassNameMap.js';
const Canvas = () => {
  const canvasRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { pointerType } = useRowCol();
  const curves = useRef([]);
  const currentCurve = useRef([]);
  const startingX = useRef(-1);
  const startingY = useRef(-1);
  const [canvasColor, setCanvasColor] = useState('white');
  const mouseDown = useRef(false);
  const ctx = useRef(null);
  const selectedCurve = useRef(-1);
  let canvas = null;
  const selectionResolution = 5; // number of pixels +- we select something
  const [offsetTop, setOffsetTop] = useState(0); // adjusting for the canvas not being on the topmost part of the page
  const handleMouseUp = (e) => {

    if (mouseDown.current && pointerType === 'selector' && selectedCurve.current !== -1) {
      let dx = Number(e.clientX) - Number(startingX.current);
      let dy = Number(e.clientY) - Number(startingY.current);
      let curve = curves.current[selectedCurve.current];
      console.log(dx);
      // deleting old path
      for (let i = 0; i < curve.length; i++) {
        curve[i].x = curve[i].x + dx;
        curve[i].y = curve[i].y + dy;
      }
      // redrawing the whole canvas
      console.log(canvasRef.current.width, canvasRef.current.height);
      ctx.current.clearRect(0, 0 - offsetTop, canvasRef.current.width, canvasRef.current.height); // maybe we could just clear a specific part in future and redraw only relevent curves and parts
      curves.current.forEach((curve) => {
        for (let i = 1; i < curve.length; i++) {
          ctx.current.beginPath();
          ctx.current.moveTo(curve[i - 1].x, curve[i - 1].y);
          ctx.current.lineTo(curve[i].x, curve[i].y);
          ctx.current.stroke();
        }
      });

    }

    console.log('mouseUp');
    if (currentCurve.current.length !== 0) {
      curves.current.push(currentCurve.current);
      console.log(curves.current);
      currentCurve.current = [];
    }
    selectedCurve.current = -1;

    startingX.current = -1;
    startingY.current = -1;
    mouseDown.current = false;
  }
  const handleMouseDown = (e) => {
    console.log('mouseDown');
    if (pointerType === 'selector') {
      for (let index = 0; index < curves.current.length; index++) {
        const curve = curves.current[index];
        console.log(curve.length);
        for (let i = 0; i < curve.length; i++) {
          const mouseObject = curve[i];
          console.log(mouseObject.x, mouseObject.y, e.clientX, e.clientY - offsetTop);
          if ((mouseObject.x - 5 <= e.clientX && mouseObject.x + 5 >= e.clientX) && ((mouseObject.y - 5 <= e.clientY - offsetTop) && (mouseObject.y + 5 >= e.clientY - offsetTop))) {
            selectedCurve.current = index;
            break;
          }
        }

        if (selectedCurve.current !== -1) {
          break;
        }

      }
      if(selectedCurve.current!==-1){
        const curve = curves.current[selectedCurve.current];
        let outlineRectanglePosition = {
          smallX:100000,
          smallY:100000,
          largeX:0,
          largeY:0
        }; 
        for(let i=0;i<curve.length;i++){
            outlineRectanglePosition.smallX = Math.min(outlineRectanglePosition.smallX,curve[i].x);
            outlineRectanglePosition.smallY = Math.min(outlineRectanglePosition.smallY,curve[i].y);
            outlineRectanglePosition.largeX = Math.max(outlineRectanglePosition.largeX,curve[i].x);
            outlineRectanglePosition.largeY = Math.max(outlineRectanglePosition.largeY,curve[i].y);

          }
          // draw outline of selected curve
          ctx.current.save();
          console.log(outlineRectanglePosition);
          ctx.current.strokeStyle = "blue";
          ctx.current.lineWidth = 1;
          ctx.current.strokeRect(
            outlineRectanglePosition.smallX,
            outlineRectanglePosition.smallY, 
            Math.abs(outlineRectanglePosition.smallX-outlineRectanglePosition.largeX),
            Math.abs(outlineRectanglePosition.smallY-outlineRectanglePosition.largeY)
          );
          ctx.current.restore();
      }
      console.log('curve index selected: ', selectedCurve.current);
    }
    if (startingX.current === -1 && startingY.current === -1) { // starting(x,y) of an arc drawing

      startingX.current = e.clientX;
      startingY.current = e.clientY;
      if (pointerType !== 'selector') {
        currentCurve.current.push({ x: e.clientX, y: e.clientY - offsetTop }); // storing the current position of the cursor
      }
      mouseDown.current = true;
    }
  }
  const handleMouseMove = (e) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    }
    )
    if (mouseDown.current && pointerType !== 'selector') {

      currentCurve.current.push({ x: e.clientX, y: e.clientY - offsetTop });
      console.log('mouseup: starting(x,y) and ending(x,y):', startingX.current, startingY.current, cursorPosition.x, cursorPosition.y);
      ctx.current.beginPath();
      ctx.current.moveTo(startingX.current, startingY.current - offsetTop);
      ctx.current.lineTo(cursorPosition.x, cursorPosition.y - offsetTop);
      ctx.current.stroke();
      startingX.current = cursorPosition.x;
      startingY.current = cursorPosition.y;
    }

  }
  useEffect(() => {
    canvas = canvasRef.current
    ctx.current = canvas.getContext("2d");
    setOffsetTop(canvas.getBoundingClientRect().top);
    console.log('context changed', ctx.current);
  }, [ctx.current]);
  useEffect(() => {
    console.log('canvas pointerType: ', pointerToClassMap[pointerType]);

    console.log('curves array: ', curves.current);
  }, [pointerType, curves.current]);

  return (
    <div className={`canvas-container w-screen h-screen overflow-auto border border-black  ${pointerToClassMap[pointerType] !== 'custom-dot' ? 'cursor-default' : 'cursor-none'}`}

      onMouseDown={(e) => {
        handleMouseDown(e);
      }}
      onMouseUp={(e) => {
        handleMouseUp(e);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
      }}
    >
      <canvas ref={canvasRef} width="1500" height="1500" />

      <div
        className={`${pointerToClassMap[pointerType]}`}

        style={{
          top: `${cursorPosition.y - offsetTop}px`,
          left: `${cursorPosition.x}px`,
        }}
      ></div>
    </div>
  );
};
export default Canvas;