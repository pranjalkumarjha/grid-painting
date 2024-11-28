import React, { useEffect } from 'react'; 
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook
import { createGroup } from '../utils/createGroup.js';
import { GoPencil } from "react-icons/go";
import { CiLocationArrow1 } from "react-icons/ci";

const Navbar = () => {
    const { 
            chosenColor, setChosenColor,
            pointerType, setPointerType,
            play, setPlay,
            group, setGroup,
            allGroups,
        } = useRowCol();  
    
    useEffect(() => {
        console.log('pointerType: ', pointerType);
    }, [pointerType]);

    return (
        <div className="navbar absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-4 p-4 bg-white border rounded shadow-lg">
            <button 
                onClick={() => setPointerType("precise")} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Draw"
            >
                <GoPencil />
            </button>
            <button 
                onClick={() => setPointerType("selector")} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Select Curve"
            >
                <CiLocationArrow1 />
            </button>
            <button 
                onClick={() => setPointerType("animatePath")} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Animate Path"
            >
                Animate Path
            </button>
            <button 
                onClick={() => setPlay(!play)} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Play Animation"
            >
                Play Animation
            </button>
            <button 
                onClick={() => createGroup(group, allGroups, setGroup)} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Group Selected Curves"
            >
                Group
            </button>
            <button 
                onClick={() => setPointerType("eraser")} 
                className="border-solid border-2 p-2 rounded hover:bg-gray-100"
                title="Eraser"
            >
                Eraser
            </button>
        </div>
    );
}

export default Navbar;
