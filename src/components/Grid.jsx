import React,{useEffect, useState} from 'react';
import { useRowCol } from '../context/RowColContext';

const Grid = ()=>{ 
    const {row,column,chosenColor} = useRowCol();   
    const [mouseDown,setMouseDown] = useState(false); 
    const [click,setClick] = useState(false); 
    const [cellColor,setCellColor] = useState(Array(row * column).fill(false));
    const handleClick = (key)=>{
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; // cannot do let curColor = cellColor as curColor & cellColor both will end up having the same reference and react doesn't rerender if the reference doesn't change 
            curColor[key] = !curColor[key]; 
            return curColor;
        });
    } 
    const handleMouseEnter =(key)=>{ 
        if(mouseDown){
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; 
            curColor[key] = !curColor[key]; 
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
                          backgroundColor: `${cellColor[key]?chosenColor:'white'}`
                        }} 

                        onMouseDown={()=>setMouseDown(true)} 
                        onMouseUp={()=>setMouseDown(false)} 
                        key = {key}
                        onClick = {()=>{setClick(!click);handleClick(key)}} 
                        onMouseEnter={() => {handleMouseEnter(key)}}
                        > </div>); 
                }
            }
            return grid;
    }
    useEffect(()=>{ 
        if((mouseDown) || click) 
        console.log(cellColor)
        console.log('fill color now')
    },[mouseDown,click])
    return(
        <div className='flex justify-center flex-col items-center gap-1'> 
        GRID
        <div className="grid" style={{gridTemplateColumns:`repeat(${column},${'100'/column}%)`,height:'500px',width:'500px'}}>
           
           {renderColumns()}

        </div>
        </div>
    );
} 

export default Grid; 
