import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import LayersIcon from '@mui/icons-material/Layers';


export default function FasesMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/fases')}>
                        <ListItemIcon>
                            <LayersIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Fases" />
            </ListItemButton>
        </>
    )


}