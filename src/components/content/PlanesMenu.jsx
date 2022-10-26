import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useNavigate } from 'react-router-dom';
export default function PlanesMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/planes')}>
                        <ListItemIcon>
                            <LibraryAddIcon  fontSize='large'/>
                        </ListItemIcon>
                        <ListItemText primary="Planes"/>
            </ListItemButton>
        </>
    )


}