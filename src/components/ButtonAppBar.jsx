import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
import ResumenMenu from '../components/content/ResumenMenu';
import SalirMenu from '../components/content/SalirMenu';
import HomeMenu from './content/HomeMenu';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GruposMenu from './content/GruposMenu.jsx'
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import "../css/ButtonAppBar.css"
export default function ButtonAppBar(props) {

  const [state, setState] = React.useState({
    left: false,
  });
  const navigate = useNavigate(); // hook para navegar entre urls o vistas

  const menuState = useSelector(state => state.menu);
  const userState = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
      navigate('/');
  };
  const menuData = [
    {
      child: <SalirMenu />,
      visibility: true,
      key: 110
    },

    {
      child: <HomeMenu />,
      visibility: true,
      key: 10
    },
    {
      child: <ResumenMenu />,
      visibility: true,
      key: 10
    },
    {
      child: <MapaUniversalMenu />,
      visibility: false,
      key: 11
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
      visibility: false,
      key: 100
    },

  ]

  // funcion para hacer funcionar el drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
      sx: {
          bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
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

  return (
    <>
      <AppBar  style={{height:"10vh"}} position="static" sx={{ backgroundColor: "#273444" }}>

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
          <Typography sx={{ display: { md: 'flex' },flexGrow: 1 }} variant="h6" component="div">
            {menuState.menu}
          </Typography>
          <IconButton aria-label="delete" color="verde2" size="medium">
                        <HomeIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" color="anaranjado1" size="medium">
                        <SettingsRemoteIcon fontSize="inherit" />
                    </IconButton>
                    <Stack direction="row" spacing={2}>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <Avatar {...stringAvatar(`${userState.name} ${userState.lastname}`)} />
                            </Button>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>

                    </Stack>
        </Toolbar>
      </AppBar>
      <div style={{height:"90vh",overflowY:"scroll" }}>
        {props.children}
      </div>
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
