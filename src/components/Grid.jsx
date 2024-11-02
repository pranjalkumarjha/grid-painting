import React,{useEffect, useState} from 'react';
import { useRowCol } from '../context/RowColContext';

const Grid = ()=>{ 
    const {row,column,chosenColor} = useRowCol();   
    const [mouseDown,setMouseDown] = useState(false); 
    const [click,setClick] = useState(false);  
    const defaultColor = 'white';
    const [cellColor,setCellColor] = useState(Array(row * column).fill(defaultColor)); 
    console.log('row and column changed');
    const handleClick = (key)=>{
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; // cannot do let curColor = cellColor as curColor & cellColor both will end up having the same reference and react doesn't rerender if the reference doesn't change 
            if(curColor[key]===defaultColor){
                curColor[key] = chosenColor;
            }
            else{
                curColor[key] = defaultColor;

            }
            return curColor;
        });
        console.log(chosenColor);
        console.log(cellColor);
    } 
    const handleMouseEnter =(key)=>{ 
        if(mouseDown){
        setCellColor((prevColor)=>{
            const curColor = [...prevColor]; 
            if(curColor[key]===defaultColor){
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

                        onMouseDown={()=>setMouseDown(true)} 
                        onMouseUp={()=>setMouseDown(false)} 
                        onClick = {()=>{setClick(!click);handleClick(key)}} 
                        onMouseEnter={() => {handleMouseEnter(key)}}
                        > </div>); 
                }
            }
            return grid;
    }
    useEffect(() => {
        // reset all the colors on change in row and columns
        setCellColor(Array(row * column).fill(defaultColor));
    }, [row, column]);

    return(
        <div className='flex justify-center flex-col items-center gap-1'> 
        GRID
        <div className="grid" style={{gridTemplateColumns:`repeat(${column},${'100'/column}%)`,height:'500px',width:'500px'}}>
           
           {renderColumns()}
           {console.log('row and column changed and component rerendered')}

        </div>
        </div>
    );
} 

export default Grid; 
