import React  from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';



export default function HomeMenu(){
    const navigate = useNavigate();
    const Changeview = (referencia) => {
        navigate(referencia);
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