import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';


export default function SyncMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Configuracion de Sincronizacion"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('sincronizar-tiempos')}>
                        <ListItemIcon>
                            <SyncIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Sincronizar Tiempos" />
            </ListItemButton>
        </>
    )


}