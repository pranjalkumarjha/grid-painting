import React, { useRef, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null); 
  const x = useRef(0);
  const y = useRef(0); 
  const startingX = useRef(-1); 
  const startingY = useRef(-1); 
  const mouseDown = useRef(false);
  let canvas=null;
  let ctx=null;
  let offsetTop=null; // adjusting for the canvas not being on the topmost part of the page
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
    if(mouseDown.current){
      x.current = e.clientX; 
      y.current = e.clientY;
      console.log('mouseup: starting(x,y) and ending(x,y):',startingX.current,startingY.current,x.current,y.current);
      ctx.beginPath();
      ctx.moveTo(startingX.current,startingY.current-offsetTop);
      ctx.lineTo(x.current,y.current-offsetTop);
      ctx.stroke(); 
      startingX.current = x.current; 
      startingY.current = y.current;
    } 
  }
  useEffect(()=>{
    canvas = canvasRef.current
    ctx = canvas.getContext("2d");
    offsetTop = canvas.getBoundingClientRect().top; 

  },[]);

  return (
    <div className='w-screen h-screen overflow-auto border border-black cursor-crosshair' 
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
      <canvas ref={canvasRef} width="1500" height="1500" />
    </div>
  );
};
export default Canvas;
