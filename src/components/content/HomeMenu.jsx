import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useDispatch  } from 'react-redux';
import { setNameMenu } from '../../features/menu/menuSlice';


export default function HomeMenu(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        navigate(referencia);
        dispatch(setNameMenu("Dashboard Hitraffic"))
    }
    return(
        <>
            <ListItemButton onClick={() =>Changeview('/david-diaz/home')}>
                        <ListItemIcon>
                            <HomeIcon fontSize='large'  />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
            </ListItemButton>
        </>
    )


}