import React,{useEffect, useRef, useState} from 'react';
import { useRowCol } from '../context/RowColContext';
import undoIcon from '../assets/undoIcon.svg'
import redoIcon from '../assets/redoIcon.svg'
import {calculateDiff, undo, redo} from '../utils/calculateDiff';
const Grid = ()=>{ 
    const {row,column,chosenColor} = useRowCol();   
    const [mouseDown,setMouseDown] = useState(false); 
    const [click,setClick] = useState(false);  
    const defaultColor = 'white';
    let history = useRef([]);
    const [cellColor,setCellColor] = useState(Array(row * column).fill(defaultColor)); 
    const lastCellColor = useRef(cellColor);
    const currentHead = useRef(0);

    console.log('row and column changed');
    const handleClick = (key)=>{
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; // cannot do let curColor = cellColor as curColor & cellColor both will end up having the same reference and react doesn't rerender if the reference doesn't change 
            if(curColor[key]===defaultColor || curColor[key]!==chosenColor){
                curColor[key] = chosenColor;
            }
            else{
                curColor[key] = defaultColor;

            }
            return curColor;
        });
    } 
    const handleMouseEnter =(key)=>{ 
        if(mouseDown){
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; 
            if(curColor[key]===defaultColor || curColor[key]!==chosenColor){
                curColor[key] = chosenColor;
            }
            else{
                curColor[key] = defaultColor;

            }
            return curColor;
        });
    }
    } 

    const renderColumns = ()=>{ 
            let grid = [];
            for(let i = 0;i<row;i++){
                for(let j=0;j<column;j++){
                    const key = i * column + j;
                    grid.push(<div  className="grid-item" 
                        style={{
                          border: '1px solid black',
                          padding: '1px',
                          textAlign: 'center',
                          backgroundColor: `${cellColor[key]}`,
                        }} 
                        key={key}
                        onMouseDown={()=>setMouseDown(true)} 
                        onMouseUp={()=>setMouseDown(false)} 
                        onClick = {()=>{setClick(!click);handleClick(key)}} 
                        onMouseEnter={() => {handleMouseEnter(key)}}
                        > </div>); 
                }
            }
            return grid;
    }
    const handleUndo = ()=>{
        const {newCellColor} = undo(currentHead,history,[...cellColor]); 
        lastCellColor.current = newCellColor; 
        console.log(lastCellColor.current);
          setCellColor(newCellColor); 
    } 
    const handleRedo = ()=>{ 
        const {newCellColor} = redo(currentHead,history,[...cellColor]); 
        lastCellColor.current = newCellColor;
        console.log(lastCellColor.current);
        setCellColor(newCellColor); 
    }
    useEffect(() => {
        // reset all the colors on change in row and columns
        setCellColor(Array(row * column).fill(defaultColor));
    }, [row, column]);
    useEffect(() => {
        if(!mouseDown || click){ // save changes upon mouseUp event
            const diff = calculateDiff(lastCellColor.current,cellColor);  
            console.log(currentHead.current)
            if (row && column && Object.keys(diff).length > 0) {
                // Truncate history if the currentHead is not at the latest entry
                if (currentHead.current < history.current.length - 1) {
                    history.current = history.current.slice(0, currentHead.current+1);
                }
                
                // Push new entry to history
                history.current.push({ row, column, diff });
                currentHead.current = history.current.length - 1;
                // update lastCellColor.current based on the latest entry in the history 
            }
            
        }
        lastCellColor.current = cellColor;

    }, [mouseDown,click]);
    return(
        <div className='flex justify-center flex-col items-center gap-1'> 
        GRID
        <div className="grid" style={{gridTemplateColumns:`repeat(${column},${'100'/column}%)`,height:'500px',width:'100%',maxHeight:'500px',maxWidth:'500px'}}>
           
           {renderColumns()}
           {console.log('row and column changed and component rerendered')}

        </div>
        <div className='flex gap-5'>
            <div className='undo w-5' onClick={handleUndo}><img src={undoIcon} alt="undo" /></div> 
            <div className='redo w-5' onClick={handleRedo}><img src={redoIcon} alt="redo" /></div>

        </div>
        </div>
    );
} 

export default Grid; 
