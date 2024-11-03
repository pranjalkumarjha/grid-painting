// Navbar.jsx
import React, { useEffect } from 'react'; 
import { useRowCol } from '../context/RowColContext.jsx'; // Import the custom hook

const Navbar = () => {
    const { row, column, setRow, setColumn,chosenColor,setChosenColor} = useRowCol(); //   Use the hook to access context values

    return (
        <>
            <div className="navbar flex justify-center items-center gap-2 pt-2">
                <input
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
                />
                Color Picker
                <input type="color" id="chosenColor" name="chosenColor" value={chosenColor} onChange={(e)=>{setChosenColor(e.target.value)}}/>
            </div>
            Rows: {row} <br />
            Columns: {column}
        </>
    );
}

export default Navbar;
