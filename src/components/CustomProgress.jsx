
import React,{useState,useEffect} from 'react';
import '../css/HomeView.css'

export default function CustomProgress({red,yellow,green}) {
    const [procentRed,setPorcentRed] = useState(20);
    const [procentYellow,setPorcentYellow] = useState(50);
    const [procentGreen,setPorcentGreen] = useState(30);
    const calculatePorcentajes = () => {    
        const yellowm = yellow + 5
        const total = red+yellowm+green;
        const pyellow = (yellowm*100)/total;
        const pgreen = (green*100)/total;
        const pred = (red*100)/total;;
        setPorcentGreen(pgreen);
        setPorcentYellow(pyellow);
        setPorcentRed(pred);

    }
    useEffect(() => {
        calculatePorcentajes();
    },[])
    return (
        <div>
            <div className='bar-container'>
                <div className="b-red" style={{width:`${procentRed}%`}}>
                    {red}
                </div>
                <div className="b-yellow" style={{width:`${procentYellow}%`}}>
                    {yellow}
                </div>

                <div className="b-green" style={{width:`${procentGreen}%`}}>
                    {green}
                </div>

            </div>
        </div>
    );
}