
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import Button from '@mui/material/Button';
import MemoryIcon from '@mui/icons-material/Memory';
import WifiIcon from '@mui/icons-material/Wifi';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../css/CardController.css"
import BadgeIcon from '@mui/icons-material/Badge';

export default function CardControllerHT200() {
    const controlerState = useSelector(state => state.controlerht200)
    const navigate = useNavigate();
    const Changeview = () => {
        navigate('/equipos');
    }

    return (
        <div className='card-structure card-controller'>

            <div className='titulo-card'>
                <h5 className='title-c' style={{color:"white"}}>Controlador Activo</h5>
                <MemoryIcon fontSize="large" sx={{color:"white"}}/>
            </div>
            <div className='card-body'>
                <div className='card-text'>
                    <WifiIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Ip:</h6>  <p style={{ marginBottom: 0 }}>{controlerState.ip}</p>
                </div>
                <div className='card-text'>
                    <AdUnitsIcon sx={{marginRight:1}}/>
                    <h6 style={{ marginBottom: 0, marginRight: 5 }}>Mac:</h6>  <p style={{ marginBottom: 0 }}>{controlerState.mac}</p>
                </div>
                <div className='card-text'>
                    <FmdGoodIcon sx={{marginRight:1}} />
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Ubi: </h6> <p style={{ marginBottom: 0 }}>{controlerState.canton}</p>
                </div>
                <div className='card-text'>
                    <BadgeIcon sx={{marginRight:1}} />
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Nombre: </h6> <p style={{ marginBottom: 0 }}>{controlerState.nombre}</p>
                </div>

                <div className='card-actions'>
                    <Button size="small" variant="contained" color="primary" onClick={Changeview}>Escoger Otro Controlador</Button>
                </div>
            </div>
        </div>
    );
}