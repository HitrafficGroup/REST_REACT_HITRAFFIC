import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';



export default function HorariosMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/horarios')}>
                        <ListItemIcon>
                            <AccessTimeIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Horarios" />
            </ListItemButton>
        </>
    )


}