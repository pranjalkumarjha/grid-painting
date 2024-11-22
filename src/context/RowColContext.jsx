//RowColContext.jsx
import React, {createContext, useState,useContext, useRef} from 'react'; 

const rowColContext = createContext(); 

const Provider = ({children})=>{
    const [row,setRow] = useState(null); 
    const [column,setColumn] = useState(null); 
    const [chosenColor,setChosenColor] = useState('#ff0000');
    const [pointerType,setPointerType] = useState('precise');
    const [play,setPlay] = useState(false);
    const [group,setGroup] = useState([]);
    const curves = useRef([]);
    const allGroups = useRef([]);
    return (
        <rowColContext.Provider value = {{row,column,setRow,setColumn,chosenColor,setChosenColor,pointerType,setPointerType,play,setPlay,group,setGroup,curves,allGroups}}>
            {children}
        </rowColContext.Provider>
    );
}
export const useRowCol = () => {
    return useContext(rowColContext); // Custom hook to use context easily
}

export {Provider,rowColContext};