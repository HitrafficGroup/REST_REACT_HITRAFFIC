import axios from 'axios';
import { convertToFases, convertToPlanes,createHorariosObject } from './manageData'
const BASE_PATH_WS = 'http://127.0.0.1:8000';
async function getIpsFromRestApi() {
	console.log('se ejecuta peticion');
	const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
	return res
}
async function getFasesFromRestApi(mac, ip) {
	var fases;
	await axios.post(`http://127.0.0.1:8000/rest/restGetFasesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			fases = convertToFases(response.data, mac);

		})
		.catch(function (error) {
			console.error(error);
		});
	return fases;
}
async function getPlanesFromRestApi(mac, ip) {

	var planes;
	await axios.post(`http://127.0.0.1:8000/rest/restGetPlanesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			planes = convertToPlanes(response.data, mac);


		})
		.catch(function (error) {
			console.error(error);
		});
	return planes;
}
async function getHorariosFromRestApi(mac, ip) {

	var horarios;
	await axios.post(`http://127.0.0.1:8000/rest/restGetHorariosControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
	
	
			horarios = createHorariosObject(response.data,mac)


		})
		.catch(function (error) {
			console.error(error);
		});
	return horarios;
}

async function postHorariosFromRestApi(jsonData) {

	await axios.post(`http://127.0.0.1:8000/rest/restSetHorariosControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
		})
		.catch(function (error) {
			console.error(error);
		});
}

export { getIpsFromRestApi, getFasesFromRestApi, getPlanesFromRestApi,getHorariosFromRestApi,postHorariosFromRestApi }