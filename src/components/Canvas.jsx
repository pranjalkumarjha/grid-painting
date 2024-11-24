import React, { useRef, useEffect, useState } from 'react';
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook
import pointerToClassMap from '../constants/pointerTypeToClassNameMap.js';
import { redrawCanvas } from '../utils/redrawCanvas.js';
import { createAnimation } from '../utils/createAnimation.js';
import { createOutline } from '../utils/createOutline.js';
import { playAnimation } from '../utils/playAnimation.js';
const Canvas = () => {
  const canvasRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { pointerType, play, setPlay, group, setGroup, curves, allGroups, eraserWidth} = useRowCol();
  const currentCurve = useRef([]);
  const startingX = useRef(-1);
  const startingY = useRef(-1);
  const [canvasColor, setCanvasColor] = useState('white');
  const mouseDown = useRef(false);
  const ctx = useRef(null);
  const previouslySelected = useRef(-1);
  const selectedCurve = useRef(-1);
  let canvas = null;
  const selectionResolution = 10; // number of pixels +- we select something
  const animationList = useRef([]);
  const [offsetTop, setOffsetTop] = useState(0); // adjusting for the canvas not being on the topmost part of the page
  const currentPath = useRef([]);
  const longestAnimationLength = useRef(0);
  
  const handleMouseUp = (e) => {
    console.log('mouseUp');
    if (currentCurve.current.length !== 0) {
      curves.current.push(currentCurve.current);
      console.log(curves.current);
      currentCurve.current = [];
    }

    selectedCurve.current = -1;
    if (pointerType === 'animatePath' && previouslySelected.current !== -1 && currentPath.current.length !== 0) {
      createAnimation(longestAnimationLength,currentPath,allGroups,animationList,previouslySelected,curves);
    }
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
          if ((mouseObject.x - selectionResolution <= e.clientX && mouseObject.x + selectionResolution >= e.clientX) && ((mouseObject.y - selectionResolution <= e.clientY - offsetTop) && (mouseObject.y + selectionResolution >= e.clientY - offsetTop))) {
            selectedCurve.current = index;
            previouslySelected.current = index;
            break;
          }
        }

        if (selectedCurve.current !== -1) {
          break;
        }

      }
      if (selectedCurve.current !== -1) {
        // store selected curve in group 

        let isInGroup = group.find((curve) => curve === selectedCurve.current);
        if (!isInGroup) {
          setGroup([...group, selectedCurve.current]);
        }
        //create outline rectangle
        createOutline(curves,selectedCurve,ctx);
        
      }
      console.log('curve index selected: ', selectedCurve.current);
    }
    else if (pointerType === 'eraser') {
      for (let index = 0; index < curves.current.length; index++) {
        const curve = curves.current[index];
        for (let i = 0; i < curve.length; i++) {
          const point = curve[i];
        
          if (
            Math.abs(point.x - e.clientX) <= eraserWidth / 2 &&
            Math.abs(point.y - (e.clientY - offsetTop)) <= eraserWidth / 2
          ) {
            curves.current.splice(index, 1); // Remove the curve
            index--; // Adjust index due to removal
            break; // Break out of the inner loop
          }
        }
      }
      redrawCanvas(ctx, canvasRef, curves, offsetTop); // Redraw after erasing
    }
    if (startingX.current === -1 && startingY.current === -1) { // starting(x,y) of an arc drawing

      startingX.current = e.clientX;
      startingY.current = e.clientY;
      if (pointerType === 'precise') {
        currentCurve.current.push({ x: e.clientX, y: e.clientY - offsetTop }); // storing the current position of the cursor
      }
      else if (pointerType === 'animatePath') {
        currentPath.current.push({ x: e.clientX, y: e.clientY - offsetTop });
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

      if (pointerType === 'precise') {
        currentCurve.current.push({ x: e.clientX, y: e.clientY - offsetTop });
      }
      else if (pointerType === 'animatePath') {
        currentPath.current.push({ x: e.clientX, y: e.clientY - offsetTop });
      }
      else  if (pointerType === 'eraser' && mouseDown.current) {
        for (let index = 0; index < curves.current.length; index++) {
          const curve = curves.current[index];
          for (let i = 0; i < curve.length; i++) {
            const point = curve[i];
           
            if (
              Math.abs(point.x - e.clientX) <= eraserWidth / 2 &&
              Math.abs(point.y - (e.clientY - offsetTop)) <= eraserWidth / 2
            ) {
              curves.current.splice(index, 1); // Remove the curve
              index--; // Adjust index due to removal
              break; // Break out of the inner loop
            }
          }
        }
        redrawCanvas(ctx, canvasRef, curves, offsetTop); // Redraw after erasing
      }
      
      
      if(pointerType!=='eraser'){
        console.log('mouseup: starting(x,y) and ending(x,y):', startingX.current, startingY.current, cursorPosition.x, cursorPosition.y);
        ctx.current.beginPath();
        ctx.current.moveTo(startingX.current, startingY.current - offsetTop);
        ctx.current.lineTo(cursorPosition.x, cursorPosition.y - offsetTop);
        ctx.current.stroke();
        startingX.current = cursorPosition.x;
        startingY.current = cursorPosition.y;
      }
      
    }
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
      redrawCanvas(ctx,canvasRef,curves,offsetTop);
      startingX.current = e.clientX;
      startingY.current = e.clientY;
    }
   
  }

  useEffect(() => {
    playAnimation(canvas,canvasRef,ctx,curves,animationList,offsetTop,setOffsetTop,longestAnimationLength,play,setPlay);
  }, [play]);



  return (
    <div className={`canvas-container w-screen h-screen overflow-auto border border-black  ${((pointerToClassMap[pointerType] !== 'custom-dot') && (pointerToClassMap[pointerType] !== 'eraser')) ? 'cursor-default' : 'cursor-none'}`}

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
      <canvas ref={canvasRef} width={window. innerWidth} height={window. innerHeight}/>

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