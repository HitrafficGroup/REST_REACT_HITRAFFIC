import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MemoryIcon from '@mui/icons-material/Memory';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
        <Card sx={{ minWidth: 240,backgroundColor:"#EAEDED " }}>
            <CardContent>
                <Typography variant="h5" component="div">
                   Controlador Seleccionado <MemoryIcon  fontSize="large"/>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="primary">
                    Ip:{controlerState.ip}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="primary">
                    Mac:{controlerState.mac}
                </Typography>
               <div>
                <FmdGoodIcon/> 
                <Typography sx={{ mb: 1.5 }} color="secondary">
                    Sector Tres Puentes
                </Typography>
               </div>
            </CardContent>
            <CardActions>
                <Button size="small" variant="contained" color="primary" onClick={Changeview}>Escoger Otro</Button>
            </CardActions>
        </Card>
    );
}