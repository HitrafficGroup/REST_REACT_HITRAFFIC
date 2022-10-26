import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RouterIcon from '@mui/icons-material/Router';

import { useNavigate } from 'react-router-dom';



export default function ClonacionMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/clonacion')}>
                        <ListItemIcon>
                            <RouterIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Clonación De Equipos" />
            </ListItemButton>
        </>
    )


}