import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LanIcon from '@mui/icons-material/Lan';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';



export default function GruposMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Configuracion de Grupos y Conflictos"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/grupos')}>
                        <ListItemIcon>
                            <LanIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Grupos" />
            </ListItemButton>
        </>
    )


}