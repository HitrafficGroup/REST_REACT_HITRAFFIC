import axios from 'axios';
import { convertToFases, convertToPlanes,createHorariosObject,convertToGrupos,convertirDiasEspeciales } from './manageData'
import Swal from 'sweetalert2';
const BASE_PATH_WS = 'http://127.0.0.1:8000';
async function getIpsFromRestApi() {
	console.log('se ejecuta peticion');
	const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
	return res
}
async function getFasesFromRestApi(mac, ip) {
	var fases;
	await axios.post(`${BASE_PATH_WS}/rest/restGetFasesControlador?mac=${mac}`, {
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
async function postFasesFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetFasesControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Exito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'Datos No Cargados',
				title: 'Error de Conexion',
				text: `${error}`,
				footer: '<a href="">Click Aqui Para Notificar el error</a>'
			  })
		});
}
async function getPlanesFromRestApi(mac, ip) {

	var planes;
	await axios.post(`${BASE_PATH_WS}/rest/restGetPlanesControlador?mac=${mac}`, {
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

async function setPlanesFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetPlanesControlador?mac=${jsonData['mac']}`, jsonData)
		.then(response => {
			console.log(response.data)
		})
		.catch(function (error) {
			console.error(error);
		});
}

async function getOtrosParametrosFromRestApi(mac,ip) {
	var parametros;
	await axios.post(`${BASE_PATH_WS}/rest/restGetOtrosParamControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			parametros = response.data
		})
		.catch(function (error) {
			console.error(error);
		});
	return parametros;
}

async function setOtrosParametrosFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetOtrosParamControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
		})
		.catch(function (error) {
			console.error(error);
		});
}


async function getHorariosFromRestApi(mac, ip) {

	var horarios;
	await axios.post(`${BASE_PATH_WS}/rest/restGetHorariosControlador?mac=${mac}`, {
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

	await axios.post(`${BASE_PATH_WS}/rest/restSetHorariosControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Exito",
				icon: "success",
			});

		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexion',
				text: 'Datos no Cargados!',
				footer: '<a href="">Click Aqui Para Notificar el error</a>'
			  })
		});
}


async function getTimeControlador(mac,ip) {
	var tiempo;
	await axios.post(`${BASE_PATH_WS}/rest/restGetTimeControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			tiempo = response.data
		})
		.catch(function (error) {
			console.error(error);
		});
	return tiempo;
}
async function setTimeControlador(jsonData) {
	
	await axios.post(`${BASE_PATH_WS}/rest/restSetTimeControlador?mac=${jsonData.mac}`,jsonData)
		.then(response => {
			console.log(response.data)
		})
		.catch(function (error) {
			console.error(error);
		});
}
async function  getGruposControlador(mac,ip) {
	var grupos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetGruposControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			grupos = convertToGrupos(response.data,mac)
		})
		.catch(function (error) {
			console.error(error);
		});
		return grupos;
	
}
async function setGruposControlador(jsonData){
	await axios.post(`${BASE_PATH_WS}/rest/restSetGruposControlador?mac=${jsonData.mac}`,jsonData)
	.then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Exito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexion',
			text: 'Datos no Cargados!',
			footer: '<a href="">Click Aqui Para Notificar el error</a>'
		  })
	});

}

async function getConflictoVerdesControlador(mac,ip){
	
	var conflictos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetConflictoVerdesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			conflictos = response.data

		})
		.catch(function (error) {
			console.error(error);
		});
		return conflictos;

}

async function setConflictoVerdesControlador(jsonData){	
	await axios.post(`${BASE_PATH_WS}/rest/restSetConflictoVerdesControlador?mac=${jsonData.mac}`,jsonData).then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Exito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'Datos No Cargados',
			title: 'Error de Conexion',
			text: `${error}`,
			footer: '<a href="">Click Aqui Para Notificar el error</a>'
		  })
	});
	

}

async function getDiasEspecialesControlador(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetDiasEspecialesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = convertirDiasEspeciales(response.data,mac);
		})
		.catch(function (error) {
			console.error(error);
		});
		return datos;

}

async function setDiasEspecialesControlador(jsonData){
	await axios.post(`${BASE_PATH_WS}/rest/restSetDiasEspecialesControlador?mac=${jsonData.mac}`,jsonData).then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Exito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'Datos No Cargados',
			title: 'Error de Conexion',
			text: `${error}`,
			footer: '<a href="">Click Aqui Para Notificar el error</a>'
		  })
	});
}


export { getIpsFromRestApi, getFasesFromRestApi,
	 getPlanesFromRestApi,getHorariosFromRestApi,
	 postHorariosFromRestApi,postFasesFromRestApi,
	 setPlanesFromRestApi,getOtrosParametrosFromRestApi,
	 setOtrosParametrosFromRestApi,getTimeControlador,
	 setTimeControlador,getGruposControlador,
	 getConflictoVerdesControlador,setGruposControlador,
	 setConflictoVerdesControlador,getDiasEspecialesControlador,
	 setDiasEspecialesControlador}