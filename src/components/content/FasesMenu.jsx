import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import LayersIcon from '@mui/icons-material/Layers';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';

export default function FasesMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Configuracion de fases"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/fases')}>
                        <ListItemIcon>
                            <LayersIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Fases" />
            </ListItemButton>
        </>
    )


}