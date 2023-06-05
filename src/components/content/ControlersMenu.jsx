import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


export default function ControlersMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Administración de Controladores"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('admin')}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Administración De Equipos" />
            </ListItemButton>
        </>
    )
}