import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';


export default function EntradasMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Configuracion de Entradas del Controlador"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/entradas')}>
                        <ListItemIcon>
                            <AutoStoriesIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Entradas" />
            </ListItemButton>
        </>
    )


}