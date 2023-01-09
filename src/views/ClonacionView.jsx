import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import Container from '@mui/material/Container';
import "../css/ClonacionView.css";
import { getIpsFromRestApi, setClonarControlador } from '../js/apiFunctions';
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}


export default function ClonacionView() {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(datosIniciales1);
  const [right, setRight] = React.useState(datosIniciales2);
  const controlerState = useSelector(state => state.controlers);
  const [deshabilitar,setDeshabilitar] = React.useState(true);
  const [deshabilitar2,setDeshabilitar2] = React.useState(false);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log('lista', newChecked)
    console.log(currentIndex)
    setChecked(newChecked);
  };
  const obtenerIps = async () => {
    try {
      setDeshabilitar2(true);
      setRight([])
      let ips = await getIpsFromRestApi();
      console.log(ips)
      let ips_online = ips['Ips_disponibles'].filter(item => item.status === "online")
      let ips_disponibles = ips_online.filter(item => item.mac !== controlerState.mac)
      let ips_formateadas = ips_disponibles.map((item, index) => {
        item["index"] = index
        return item
      })
      console.log(ips_formateadas)
      setLeft(ips_formateadas)
      setDeshabilitar(false)
      setDeshabilitar2(false);
    } catch (error) {
      setDeshabilitar2(false)
    }
  }
  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const clonarEquipos = async() => {
    if(right.length >0 ){
      setDeshabilitar2(true)
      console.log("equipos de clonacion")
      console.log(right)
      let jasonData = {
        ip: controlerState.ip,
        lista_controladores: [],
        mac: controlerState.mac
      }
      let destino = right
      let destino_format = destino.map(item => (
        {
          ip: item.ip,
          mac: item.mac
        }
      ))
      console.log(destino_format)
      jasonData["lista_controladores"] = destino_format;
      console.log(jasonData)
      await setClonarControlador(jasonData)
      setDeshabilitar2(false);
    }else{
        Swal.fire({
          icon: 'warning',
          title: 'No hay dispositivo Destino',
          text: 'Selecciona un dispositivo de destino',
        })
    }
  }
  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 350,
          height: 350,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.index}-label`;

          return (
            <ListItem
              key={value.index}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`mac:${value.mac}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>
      <Container maxWidth="md" >
        <div className='titulos-clonacion'>
          <h5>Equipo de referencia: </h5> <p className='parrafos-clonacion'>{controlerState.mac}</p>
        </div>
        <Grid container spacing={2} justifyContent="center" alignItems="center">

          <Grid item xs={12} md={5}>{customList('Dispositivos Disponibles', left)}</Grid>
          <Grid item xs={12} md={2}>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>{customList('Dispositivos Seleccionados', right)}</Grid>
          <Grid item xs={6} md={6}>
            <Button variant="contained" color='verde' disabled={deshabilitar2} onClick={obtenerIps}>Leer Datos</Button>
          </Grid>
          <Grid item xs={6} md={6}>
            <Button variant="contained" disabled={deshabilitar} onClick={clonarEquipos}>Clonar Equipos</Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <div style={{ height: 90 }}>

            </div>
          </Grid>
        </Grid>
      </Container>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </>
  );
}

const datosIniciales1 = [
  
]
const datosIniciales2 = [

]
