import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function PruebasMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Vista de Pruebas"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/pruebas')}>
                        <ListItemIcon>
                            <BugReportIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Pruebas" />
            </ListItemButton>
        </>
    )


}