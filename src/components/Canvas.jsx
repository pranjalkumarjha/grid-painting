import React, { useRef, useEffect, useState } from 'react';
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook
import pointerToClassMap from '../constants/pointerTypeToClassNameMap.js';
const Canvas = () => {
  const canvasRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { pointerType, play, setPlay, group, setGroup, curves, allGroups } = useRowCol();
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
  const redrawCanvas = () => {
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
  const handleMouseUp = (e) => {
    console.log('mouseUp');
    if (currentCurve.current.length !== 0) {
      curves.current.push(currentCurve.current);
      console.log(curves.current);
      currentCurve.current = [];
    }

    selectedCurve.current = -1;
    if (pointerType === 'animatePath' && previouslySelected.current !== -1 && currentPath.current.length !== 0) {
      longestAnimationLength.current = Math.max(longestAnimationLength.current, currentPath.current.length);
      let found = false;
      for (let i = 0; i < allGroups.current.length; i++) {
        

        // Check if `previouslySelected.current` belongs to this group
        for (let j = 0; j < allGroups.current[i].length; j++) {
          if (allGroups.current[i][j] === previouslySelected.current) {
            found = true;

            // Iterate through all curves in the group
            for (let k = 0; k < allGroups.current[i].length; k++) {
              const curveIndex = allGroups.current[i][k];
              const curvePoints = curves.current[curveIndex];

              // Find the closest point in `curvePoints` to `currentPath.current[0]`
              let offset = { x: 0, y: 0 }; // Default offset
              if (curvePoints && curvePoints.length > 0) {
                const closestPoint = curvePoints.reduce((closest, point) => {
                  const currentDistance = Math.hypot(
                    point.x - currentPath.current[0].x,
                    point.y - currentPath.current[0].y
                  );
                  const closestDistance = Math.hypot(
                    closest.x - currentPath.current[0].x,
                    closest.y - currentPath.current[0].y
                  );
                  return currentDistance > closestDistance ? point : closest;
                }, curvePoints[0]);

                // Calculate the offset as the difference between the closest point and `currentPath.current[0]`
                offset = {
                  x: closestPoint.x - currentPath.current[0].x,
                  y: closestPoint.y - currentPath.current[0].y
                };
              }

              // Adjust `currentPath.current` by subtracting the offset
              const adjustedPath = currentPath.current.map((point) => ({
                x: point.x + offset.x,
                y: point.y + offset.y
              }));

              // Push to `animationList` (replacing existing entry if necessary)
              const existingAnimationIndex = animationList.current.findIndex(
                (entry) => entry.curveIndex === curveIndex
              );

              if (existingAnimationIndex !== -1) {
                animationList.current[existingAnimationIndex] = {
                  curveIndex,
                  path: adjustedPath
                };
              } else {
                animationList.current.push({ curveIndex, path: adjustedPath });
              }
            }

            // Exit the outer loops once the group is processed
            break;
          }
        }

        if (found) {
          break;
        }
      }
      if(!found){
        animationList.current.push({ curveIndex:previouslySelected.current, path: currentPath.current });

      }
      console.log('animation list: ', animationList.current);
      currentPath.current = [];
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
        const curve = curves.current[selectedCurve.current];
        let outlineRectanglePosition = {
          smallX: 100000,
          smallY: 100000,
          largeX: 0,
          largeY: 0
        };
        // getting the dimension of outline rectangle shown to highlight the curve selected (aka: blue rectangle)
        for (let i = 0; i < curve.length; i++) {
          outlineRectanglePosition.smallX = Math.min(outlineRectanglePosition.smallX, curve[i].x);
          outlineRectanglePosition.smallY = Math.min(outlineRectanglePosition.smallY, curve[i].y);
          outlineRectanglePosition.largeX = Math.max(outlineRectanglePosition.largeX, curve[i].x);
          outlineRectanglePosition.largeY = Math.max(outlineRectanglePosition.largeY, curve[i].y);

        }
        // draw highlighted outline rectangle of selected curve
        ctx.current.save();
        console.log(outlineRectanglePosition);
        ctx.current.strokeStyle = "blue";
        ctx.current.lineWidth = 1;
        ctx.current.strokeRect(
          outlineRectanglePosition.smallX,
          outlineRectanglePosition.smallY,
          Math.abs(outlineRectanglePosition.smallX - outlineRectanglePosition.largeX),
          Math.abs(outlineRectanglePosition.smallY - outlineRectanglePosition.largeY)
        );
        ctx.current.restore();
      }
      console.log('curve index selected: ', selectedCurve.current);
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
      console.log('mouseup: starting(x,y) and ending(x,y):', startingX.current, startingY.current, cursorPosition.x, cursorPosition.y);
      ctx.current.beginPath();
      ctx.current.moveTo(startingX.current, startingY.current - offsetTop);
      ctx.current.lineTo(cursorPosition.x, cursorPosition.y - offsetTop);
      ctx.current.stroke();
      startingX.current = cursorPosition.x;
      startingY.current = cursorPosition.y;
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
      redrawCanvas();
      startingX.current = e.clientX;
      startingY.current = e.clientY;
    }
  }
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const animate = async () => {
      canvas = canvasRef.current;
      ctx.current = canvas.getContext("2d");
      setOffsetTop(canvas.getBoundingClientRect().top);
      let tempCurves = structuredClone(curves.current); // Preferred method
      console.log('temp Curves: ', tempCurves);
      if (play) {
        console.log("Play Clicked");

        // Initialize animation control for each curve
        const animateFor = {};
        animationList.current.forEach((path) => (animateFor[path.curveIndex] = 1));
        console.log("animate for object: ", animateFor);

        let it = 0;

        while (it < longestAnimationLength.current) {
          ctx.current.clearRect(
            0,
            0 - offsetTop,
            canvasRef.current.width,
            canvasRef.current.height
          );

          curves.current.forEach((curve, index) => {
            console.log("true or false", index, animateFor[index]);

            const path = animationList.current.find(
              (path) => path.curveIndex === index
            )?.path;

            if (animateFor[index] === 1 && path?.length >= it + 1) {
              console.log("animated path for:", path);

              const initialDisplacement = { x: 0, y: 0 };

              for (let i = 0; i < curve.length; i++) {
                let dx = 0;
                let dy = 0;

                if (it === 0) {
                  // Compute displacement for the first iteration
                  if (i === 0) {
                    initialDisplacement.x = path[it].x - curve[i].x;
                  }

                  // Apply the same displacement to all points
                  dx = initialDisplacement.x;
                } else {
                  // Incremental movement along the path for subsequent iterations
                  dx = path[it].x - path[it - 1].x;
                  dy = path[it].y - path[it - 1].y;
                }

                // Apply the computed displacement
                curve[i].x += dx;
                curve[i].y += dy;
              }
            }

            // Update the curve positions
            curves.current[index] = curve;
          });

          // Redraw the updated canvas
          redrawCanvas();
          console.log("it: ", it);
          it++;

          await delay(10);
        }
        console.log('temp Curves final: ', tempCurves);
        curves.current = tempCurves;
        redrawCanvas();
        setPlay(false); // Stop animation
      }
    };

    animate(); // Start the animation
  }, [play]);



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