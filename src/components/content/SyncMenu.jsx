import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from 'react-router-dom';



export default function SyncMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/sincronizar-tiempos')}>
                        <ListItemIcon>
                            <SyncIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Sincronizar Tiempos" />
            </ListItemButton>
        </>
    )


}