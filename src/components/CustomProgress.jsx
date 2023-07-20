
import React,{useState,useEffect, useRef} from 'react';


export default function CustomProgress({red,yellow,green,apagado,destello,modo}) {
    const [porcentRed,setPorcentRed] = useState(20);
    const [porcentYellow,setPorcentYellow] = useState(50);
    const [porcentGreen,setPorcentGreen] = useState(30);
    const [porcentApagado,setPorcentApagado] = useState(20);
    const [porcentDestello,setPorcentDestello] = useState(10);

    const calculatePorcentajes = () => {  
       
        let total = red+yellow+green+destello+apagado;
        let pyellow = (yellow*100)/total;
        let pgreen = (green*100)/total;
        let pred = (red*100)/total;
        let papagado = (apagado*100)/total;
        let pdestello = (destello*100)/total;


        if(modo=== "Destello"){
            total = red+yellow+green;
            setPorcentGreen(0);
            setPorcentYellow(total);
            setPorcentRed(0);
        }else if(modo ==="Todo en Rojo"){
            total = red+yellow+green;
            setPorcentGreen(0);
            setPorcentYellow(0);
            setPorcentRed(total);
        }
        else{           
            setPorcentGreen(pgreen);
            setPorcentYellow(pyellow);
            setPorcentRed(pred);
        }


    }
    const BarIndicator = (props) =>{
        const modo = props.modo;
        const aux_rojo = props.red;
        const aux_verde = props.green;
        if (modo === "Destello") {
          return (<>
                <div className="b-destello" style={{width:"100%"}}>
                    Destello Activado
                </div>
          </>);
        }else if(aux_verde === 0){
            return (<>
              <div className="b-enrojo" style={{width:"100%"}}>
                    Semaforo  en Rojo
                </div>
          </>);
        
        }else if(modo === "Todo en Rojo"){
            return (<>
              <div className="b-enrojo" style={{width:"100%"}}>
                    Todo en Rojo Activado
                </div>
          </>);
        
        }
        else if(aux_rojo === 0){
            return (<>
              <div className="b-todo-verde" style={{width:"100%"}}>
                    Semaforo en Verde
                </div>
          </>);
        
        }else{
            return (
            <>
              <div className="b-red" style={{width:`${red*2}%`}}>
                    {red}
                </div>
                <div className="b-yellow" style={{width:`${yellow*4}%`}}>
                    {yellow}
                </div>

                <div className="b-green" style={{width:`${green*2}%`}}>
                    {green}
                </div>
            </>
            );
        }
       
    }
    useEffect(() => {
        calculatePorcentajes();
        // eslint-disable-next-line
    },[])
    return (
        <div>
            <div className='bar-container'>
               <BarIndicator modo={modo} red={red} green={green}/>
            </div>
        </div>
    );
}