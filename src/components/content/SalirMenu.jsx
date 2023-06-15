import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


export default function SalirMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/equipos')}>
                        <ListItemIcon>
                            <MenuOpenIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Menu Principal" />
            </ListItemButton>
        </>
    )


}