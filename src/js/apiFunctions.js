import axios from 'axios';


async function getIpsFromRestApi(){
    console.log('se ejecuta peticion');
   const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
   return res
}



export{getIpsFromRestApi}