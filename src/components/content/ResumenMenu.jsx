import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';



export default function ResumenMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/resumen')}>
                        <ListItemIcon>
                            <DescriptionIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Resumen" />
            </ListItemButton>
        </>
    )


}