import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SdCardAlertIcon from '@mui/icons-material/SdCardAlert';
import { useNavigate } from 'react-router-dom';



export default function RegistroErrores(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/errores')}>
                            <ListItemIcon>
                                <SdCardAlertIcon fontSize='large' />
                            </ListItemIcon>
                        <ListItemText primary="Registro de Errores" />
            </ListItemButton>
        </>
    )


}