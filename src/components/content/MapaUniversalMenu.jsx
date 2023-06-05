import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';
import MapIcon from '@mui/icons-material/Map';


export default function MapaUniversalMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Mapa Universal de la APP"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('mapa-universal')}>
                        <ListItemIcon>
                            <MapIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Mapa Universal" />
            </ListItemButton>
        </>
    )


}