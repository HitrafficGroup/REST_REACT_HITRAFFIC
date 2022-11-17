import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SdCardAlertIcon from '@mui/icons-material/SdCardAlert';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';


export default function RegistroErrores(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Tabla de Registro de Errores del Controlador"))
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