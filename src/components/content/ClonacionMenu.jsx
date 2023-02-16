import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RouterIcon from '@mui/icons-material/Router';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';

import { useNavigate } from 'react-router-dom';



export default function ClonacionMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Clonacion de Controladores"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/clonacion')}>
                        <ListItemIcon>
                            <RouterIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Clonación De Equipos" />
            </ListItemButton>
        </>
    )


}