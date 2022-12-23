import Box from '@mui/material/Box';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Button from '@mui/material/Button';
import MemoryIcon from '@mui/icons-material/Memory';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TrafficIcon from '@mui/icons-material/Traffic';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../css/CardInformation.css"
const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        :
    </Box>
);

export default function CardInformation() {
    const controlerState = useSelector(state => state.controlers)
    const navigate = useNavigate();
    const Changeview = () => {
        navigate('/david-diaz/home');
    }

    return (
        <div className='card-structure-i card-location-i'>

            <div className='card-titulo-i'>
                <h5 className='title-c' style={{color:"white"}}>Resumen Controlador</h5>
                <MemoryIcon fontSize="large" sx={{color:"white"}}/>
            </div>
            <div className='card-body-i'>
                <div className='card-text-i'>
                    <TrafficIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Fases:</h6>  
                </div>
                <ul>
                    {controlerState.resumen.pasos.map((item,index)=>(
                        <li>Fases-{item.fase}</li>
                    ))}
                    </ul>
                <div className='card-text-i'>
                    <AccessTimeIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Horario:</h6>  <p style={{ marginBottom: 0 }}>{controlerState.resumen.horas}:{controlerState.resumen.minutos}</p>
                </div>
                <div className='card-text-i'>
                    <AssignmentTurnedInIcon sx={{marginRight:1}} />
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Plan: </h6> <p style={{ marginBottom: 0 }}>{controlerState.resumen.plan}</p>
                </div>
        
            </div>
        </div>
    );
}