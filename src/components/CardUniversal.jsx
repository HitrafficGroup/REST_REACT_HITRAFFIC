import Box from '@mui/material/Box';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import Button from '@mui/material/Button';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MemoryIcon from '@mui/icons-material/Memory';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TrafficIcon from '@mui/icons-material/Traffic';
import WifiIcon from '@mui/icons-material/Wifi';
import HelpIcon from '@mui/icons-material/Help';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../css/CardUniversal.css"
const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        :
    </Box>
);

export default function CardUniversal() {
    const controlerState = useSelector(state => state.controlers)
    const navigate = useNavigate();
    const Changeview = () => {
        navigate('/david-diaz/home');
    }

    return (
        <div className='card-structure-u card-controller-u'>

            <div className='titulo-card-u'>
                <h5 className='title-c-u' style={{color:"white"}}>Informacion del Controlador</h5>
                <HelpIcon fontSize="large" sx={{color:"white"}}/>
            </div>
            <div className='card-body-u'>
                <div className='card-text'>
                    <WifiIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Ip:</h6>  <p style={{ marginBottom: 0 }}>{controlerState.ip}</p>
                </div>
                <div className='card-text-u'>
                    <AdUnitsIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Mac:</h6>  <p style={{ marginBottom: 0 }}>{controlerState.mac}</p>
                </div>
                <div className='card-text-u'>
                    <FmdGoodIcon sx={{marginRight:1}} />
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Ubi: </h6> <p style={{ marginBottom: 0 }}>{controlerState.nombre}</p>
                </div>
                <div className='card-text-i'>
                    <TrafficIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Fases:</h6>  
                </div>
                <ul>
                    {controlerState.resumen.pasos.map((item,index)=>(
                        <li key={index}>Fases-{item.fase}</li>
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
                <div className='card-text-i'>
                    <PlayCircleIcon sx={{marginRight:1}} />
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Modo: </h6> <p style={{ marginBottom: 0 }}>{controlerState.resumen.modo}</p>
                </div>
            </div>
        </div>
    );
}