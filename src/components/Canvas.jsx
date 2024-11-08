import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null); 
  const [cursorPosition,setCursorPosition] = useState({x:0,y:0});
  const startingX = useRef(-1); 
  const startingY = useRef(-1); 
  const mouseDown = useRef(false);
  const ctx = useRef(null);
  let canvas=null;
  const [offsetTop,setOffsetTop]=useState(0); // adjusting for the canvas not being on the topmost part of the page
  const handleMouseUp = (e)=>{ 
      startingX.current = -1; 
      startingY.current = -1;
      mouseDown.current= false;
  }
  const handleMouseDown = (e)=>{
    console.log('mouseDown');
    if(startingX.current===-1 && startingY.current===-1){ // starting(x,y) of an arc drawing
        
      startingX.current = e.clientX; 
       startingY.current = e.clientY;
       mouseDown.current = true;
    } 
  }
  const handleMouseMove = (e)=>{
    setCursorPosition({
      x:e.clientX,
      y: e.clientY
    }
    )
    if(mouseDown.current){
     
      console.log('mouseup: starting(x,y) and ending(x,y):',startingX.current,startingY.current,cursorPosition.x,cursorPosition.y);
      ctx.current.beginPath();
      ctx.current.moveTo(startingX.current,startingY.current-offsetTop);
      ctx.current.lineTo(cursorPosition.x,cursorPosition.y-offsetTop);
      ctx.current.stroke(); 
      startingX.current = cursorPosition.x; 
      startingY.current = cursorPosition.y;
    } 
  }
  useEffect(()=>{
    canvas = canvasRef.current
    ctx.current = canvas.getContext("2d");
    setOffsetTop(canvas.getBoundingClientRect().top); 

  },[]);

  return (
    <div className='canvas-container w-screen h-screen overflow-auto border border-black cursor-none' 
      onMouseDown={(e)=>{ 
        handleMouseDown(e);
      
      }}
      onMouseUp = {(e)=>{
        handleMouseUp(e);
      }}
      onMouseMove = {(e)=>{
        handleMouseMove(e);
      }}
    >
      <canvas ref={canvasRef} width="1500" height="1500"/> 
      
      <div
        className="custom-dot"
        
        style={{
          top: `${cursorPosition.y-offsetTop}px`, 
          left: `${cursorPosition.x }px`, 
        }}
      ></div>
    </div>
  );
};
export default Canvas;
