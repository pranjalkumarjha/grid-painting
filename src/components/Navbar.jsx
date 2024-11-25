// Navbar.jsx
import React, { useEffect, useState } from 'react'; 
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook
import { createGroup } from '../utils/createGroup.js';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Navbar = () => {
    const { 
            row, column, 
            setRow, setColumn,
            chosenColor,setChosenColor,
            pointerType,setPointerType,
            play,setPlay,
            group,setGroup,
            curves,
            allGroups,
            roomId,setRoomId
        } = useRowCol();  
    
    useEffect(()=>{console.log('pointerType: ',pointerType);},[pointerType]);
    const handleKeyDown = (e)=>{
        if(e.key === 'Enter'){
            fetch(`${serverUrl}joinRoom?roomId=${roomId}`).then((response)=>{
                if(!response.ok){
                    throw new Error('Unable to connect to room')
                }
                return response.json();
            }).then((data)=>{
                console.log(data);
            }).catch((error)=>{
                console.log(error.message);
            })
        }
    }
    return (
        <>
        {/* keeping these two inputs  for memory sake */}
            <div className="navbar flex justify-center items-center gap-2 pt-2">
                {/* <input
                    type="number"
                    placeholder="Enter number of rows"
                    className="border-solid border-2 border-black pl-2"
                    onChange={(e) => { 
                        if(e.target.value<=100) 
                            setRow(Number(e.target.value))}} 
                    min="1"
                />
                <input
                    type="number"
                    placeholder="Enter number of columns"
                    className="border-solid border-2 border-black pl-2"
                    onChange={(e) => {
                        if(e.target.value<=100)
                            setColumn(Number(e.target.value))}} 
                    min="1"
                /> */}
                <input 
                    className='text-center' 
                    type="text" 
                    placeholder='Join Room' 
                    onKeyDown={e=>handleKeyDown(e)} 
                    onChange={
                        (e) => setRoomId(e.target.value)
                    }
                    value={roomId}/>
                Color Picker
                <input type="color" id="chosenColor" name="chosenColor" value={chosenColor} onChange={(e)=>{setChosenColor(e.target.value)}}/>
                select pointer type
                <button onClick={()=>{setPointerType("precise")}} className='border-solid border-2 p-1'>Precise</button>
                <button onClick={()=>{setPointerType("selector");}} className='border-solid border-2 p-1'>Selector</button>
                <button onClick={()=>{setPointerType("animatePath");}} className='border-solid border-2 p-1'>Animate Path</button>
                <button onClick={()=>{setPlay(!play)}} className='border-solid border-2 p-1'>Play Animation</button>
                <button onClick={()=>{createGroup(group,allGroups,setGroup);}} className='border-solid border-2 p-1'>Group Selection</button>
                <button onClick={()=>{setPointerType("eraser");}} className='border-solid border-2 p-1'>Eraser</button>
                
            {/* Rows: {row} <br />
            Columns: {column} */}
            </div>
        </>
    );
}

export default Navbar;
