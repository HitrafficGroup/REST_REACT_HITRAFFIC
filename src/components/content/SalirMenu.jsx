import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';



export default function SalirMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/')}>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Salir" />
            </ListItemButton>
        </>
    )


}