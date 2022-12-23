import Container from '@mui/material/Container';
import "../css/ClonacionView.css";
import CardController from '../components/CardController';
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
    console.log('lista',newChecked)
    console.log(currentIndex)
    setChecked(newChecked);
  };

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
              button
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
          <h4>Clonacion del Controlador</h4>
        </div>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12}> 
          <Button variant="contained">Cargar Datos</Button>
          </Grid>
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
      <Grid item xs={12} md={12}> 
          <Button variant="contained">Clonar Equipos</Button>
      </Grid>
    </Grid>
      </Container>

    </>
  );
}

const datosIniciales1 = [
  {ip: '192.168.0.178', mac: '00:14:97:F2:D1:39', status: 'offline', seleccionado: false, index:0},
  {ip: '192.168.5.150', mac: '00:14:97:F2:E5:B7', status: 'offline', seleccionado: false, index:1},
  {ip: '192.168.1.150', mac: '00:14:97:F6:53:48', status: 'offline', seleccionado: false, index:2},
  {ip: '192.168.5.160', mac: '00:14:97:F6:53:B1', status: 'offline', seleccionado: false, index:3},
  {ip: '192.168.5.178', mac: '00:14:97:F6:59:28', status: 'offline', seleccionado: false, index:4},
  {ip: '192.168.1.178', mac: '00:14:97:F6:5A:20', status: 'offline', seleccionado: false, index:5},
  {ip: '192.168.5.155', mac: '00:14:97:F6:5A:25', status: 'offline', seleccionado: false, index:6},
  {ip: '192.168.5.155', mac: '00:14:97:F6:5A:35', status: 'offline', seleccionado: false, index:7}

]
const datosIniciales2 = [

]
