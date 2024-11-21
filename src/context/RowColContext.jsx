//RowColContext.jsx
import React, {createContext, useState,useContext} from 'react'; 

const rowColContext = createContext(); 

const Provider = ({children})=>{
    const [row,setRow] = useState(null); 
    const [column,setColumn] = useState(null); 
    const [chosenColor,setChosenColor] = useState('#ff0000');
    const [pointerType,setPointerType] = useState('precise');

    return (
        <rowColContext.Provider value = {{row,column,setRow,setColumn,chosenColor,setChosenColor,pointerType,setPointerType}}>
            {children}
        </rowColContext.Provider>
    );
}
export const useRowCol = () => {
    return useContext(rowColContext); // Custom hook to use context easily
}

export {Provider,rowColContext};