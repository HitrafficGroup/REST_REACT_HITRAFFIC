import AppBar from '@mui/material/AppBar';
import React,{useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import "../css/ButtonAppBar.css"
import { Routes, Route } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
export default  function HT200AppBar(){
    const [state, setState] =  useState({left: false,});
    const [drawerHT,setDrawerHT] = useState({left:false})
    const navigate = useNavigate(); // hook para navegar entre urls o vistas
      // funcion para hacer funcionar el drawer
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerHT({ ...drawerHT, [anchor]: open });
      };
      const cerrarSesion = ()=>{
        navigate('/');
    }
      //drawer a mostrar
      const list = (anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <Divider />
    
        </Box>
      );
    return(
    <>
        <AppBar position="static" sx={{ backgroundColor: "#34495E" }}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer('left', true)}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography sx={{ display: { xs: 'none', md: 'flex' },flexGrow: 1 }} variant="h6" component="div">
           
            </Typography>

            <Button variant="text" sx={{color:"white"}} onClick={cerrarSesion} endIcon={<LogoutIcon />} >Cerrar Sesion</Button>
            </Toolbar>
        </AppBar>
        <Drawer
        anchor={'left'}
        open={drawerHT['left']}
        onClose={toggleDrawer('left', false)}
      >
        
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <h3>HiTraffic Menu</h3>
            </ListSubheader>
          }
        >
            <ListItemButton >
                        <ListItemIcon>
                            <AdminPanelSettingsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Excel" />
            </ListItemButton>
        </List>
      </Drawer>
    </>
    );
}