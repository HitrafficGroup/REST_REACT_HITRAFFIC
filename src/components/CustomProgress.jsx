
import React,{useState,useEffect, useRef} from 'react';
import '../css/HomeView.css'

export default function CustomProgress({red,yellow,green}) {
    const [porcentRed,setPorcentRed] = useState(20);
    const [porcentYellow,setPorcentYellow] = useState(50);
    const [porcentGreen,setPorcentGreen] = useState(30);
    const verde = useRef()
    const rojo = useRef()
    const amarillo = useRef()
    const calculatePorcentajes = () => {    
        const yellowm = yellow + 5
        const total = red+yellowm+green;
        const pyellow = (yellowm*100)/total;
        const pgreen = (green*100)/total;
        const pred = (red*100)/total;
        verde.current = pgreen
        rojo.current = pred
        setPorcentGreen(pgreen);
        setPorcentYellow(pyellow);
        setPorcentRed(pred);
    
        console.log()

    }
    useEffect(() => {
        calculatePorcentajes();
        // eslint-disable-next-line
    },[])
    return (
        <div>
            <div className='bar-container'>
                <div className="b-red" style={{width:`${red*2}%`}}>
                    {red}
                </div>
                <div className="b-yellow" style={{width:`${yellow*4}%`}}>
                    {yellow}
                </div>

                <div className="b-green" style={{width:`${green*2}%`}}>
                    {green}
                </div>

            </div>
        </div>
    );
}