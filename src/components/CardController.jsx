import Box from '@mui/material/Box';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import Button from '@mui/material/Button';
import MemoryIcon from '@mui/icons-material/Memory';
import WifiIcon from '@mui/icons-material/Wifi';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../css/CardController.css"
const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        :
    </Box>
);

export default function CardController() {
    const controlerState = useSelector(state => state.controlers)
    const navigate = useNavigate();
    const Changeview = () => {
        navigate('/david-diaz/home');
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
                    <h6 style={{ marginBottom: 0, marginRight: 5 }} >Ubi: </h6> <p style={{ marginBottom: 0 }}>Sector Ricaurte</p>
                </div>


                <div className='card-actions'>
                    <Button size="small" variant="contained" color="primary" onClick={Changeview}>Escoger Otro</Button>
                </div>
            </div>
        </div>
    );
}