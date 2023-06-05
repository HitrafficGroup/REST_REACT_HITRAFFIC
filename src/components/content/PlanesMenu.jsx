import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';

export default function PlanesMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Configuracion de Planes"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('planes')}>
                        <ListItemIcon>
                            <LibraryAddIcon  fontSize='large'/>
                        </ListItemIcon>
                        <ListItemText primary="Planes"/>
            </ListItemButton>
        </>
    )


}