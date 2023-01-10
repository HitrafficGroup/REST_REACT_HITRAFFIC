import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Drawer from '@mui/material/Drawer';
import ClonacionMenu from '../components/content/ClonacionMenu';
import EntradasMenu from '../components/content/EntradasMenu';
import MapaUniversalMenu from './content/MapaUniversalMenu';
import FasesMenu from '../components/content/FasesMenu';
import HorariosMenu from '../components/content/HorariosMenu';
import PlanesMenu from '../components/content/PlanesMenu';
import RegistroErrores from '../components/content/RegistroErrores';
//import ResumenMenu from '../components/content/ResumenMenu';
import SalirMenu from '../components/content/SalirMenu';
import HomeMenu from './content/HomeMenu';
import SyncMenu from './content/SyncMenu.jsx'
import GruposMenu from './content/GruposMenu.jsx'
import { useSelector } from 'react-redux';
export default function ButtonAppBar() {

  const [state, setState] = React.useState({
    left: false,
  });

  const menuState = useSelector(state => state.menu);

  const menuData = [
   
    {
      child: <HomeMenu />,
      visibility: true,
      key: 10
    },
    {
      child: <MapaUniversalMenu/>,
      visibility: true,
      key:11
    },
    {
      child: <SyncMenu />,
      visibility: true,
      key: 20
    },
    {
      child: <GruposMenu />,
      visibility: true,
      key: 30
    },
    {
      child: <FasesMenu />,
      visibility: true,
      key: 40
    },
    {
      child: <PlanesMenu />,
      visibility: true,
      key: 50
    },
    {
      child: <HorariosMenu />,
      visibility: true,
      key: 60
    },
    {
      child: <EntradasMenu />,
      visibility: true,
      key: 80
    },
    {
      child: <RegistroErrores />,
      visibility: true,
      key: 90
    },
    {
      child: <ClonacionMenu />,
      visibility: true,
      key: 100
    },

    {
      child: <SalirMenu />,
      visibility: true,
      key: 110
    },
  ]

  // funcion para hacer funcionar el drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

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

  return (
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuState.menu}
          </Typography>
        Bienvenido!  david.diaz190799@gmail.com
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
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
          {menuData.filter(item => item.visibility).map((item, index) => (
            <div key={index}>
              {item.child}
            </div>

          ))
          }
        </List>
      </Drawer>
    </>

  );
}
