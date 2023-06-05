import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';


export default function ResumenMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Tabla de Registro de Resumen del Controlador"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('resumen')}>
                        <ListItemIcon>
                            <DescriptionIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Resumen" />
            </ListItemButton>
        </>
    )


}