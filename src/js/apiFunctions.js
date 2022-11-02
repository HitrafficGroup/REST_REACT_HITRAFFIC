import axios from 'axios';
import {convertToFases} from './manageData'
const BASE_PATH_WS = 'http://127.0.0.1:8000';
async function getIpsFromRestApi(){
    console.log('se ejecuta peticion');
   const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
   return res
}
async function getFasesFromRestApi(mac,ip){
    console.log('se ejecuta peticion');

   await axios.post(`http://127.0.0.1:8000/rest/restGetFasesControlador?mac=${mac}`, {
		ip: ip
	})
	.then(response => {
		console.log(response.data);
        var fases = convertToFases(response.data,mac);
        console.log(fases);
	})
	.catch(function (error) {
		console.error(error);
	});
}


export{getIpsFromRestApi,getFasesFromRestApi}