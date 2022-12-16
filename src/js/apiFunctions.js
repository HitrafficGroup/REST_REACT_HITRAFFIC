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
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetFasesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = convertToFases(response.data, mac);

		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
	return datos;
}
async function postFasesFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetFasesControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
}
async function getPlanesFromRestApi(mac, ip) {

	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetPlanesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = convertToPlanes(response.data, mac);


		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
	return datos;
}

async function setPlanesFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetPlanesControlador?mac=${jsonData['mac']}`, jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
}

async function getOtrosParametrosFromRestApi(mac,ip) {
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetOtrosParamControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = response.data
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
	return datos;
}

async function setOtrosParametrosFromRestApi(jsonData) {
	await axios.post(`${BASE_PATH_WS}/rest/restSetOtrosParamControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
			console.log(response.data)
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
}


async function getHorariosFromRestApi(mac, ip) {

	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetHorariosControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = createHorariosObject(response.data,mac)
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
	return datos;
}

async function postHorariosFromRestApi(jsonData) {

	await axios.post(`${BASE_PATH_WS}/rest/restSetHorariosControlador?mac=${jsonData['mac']}`,jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});

		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: 'Datos no Cargados!',
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
}


async function getTimeControlador(mac,ip) {
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetTimeControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = response.data
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
	return datos;
}
async function setTimeControlador(jsonData) {
	
	await axios.post(`${BASE_PATH_WS}/rest/restSetTimeControlador?mac=${jsonData.mac}`,jsonData)
		.then(response => {
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: 'Datos no Cargados!',
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
}
async function  getGruposControlador(mac,ip) {
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetGruposControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = convertToGrupos(response.data,mac)
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;
	
}
async function setGruposControlador(jsonData){
	await axios.post(`${BASE_PATH_WS}/rest/restSetGruposControlador?mac=${jsonData.mac}`,jsonData)
	.then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Éxito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: 'Datos no Cargados!',
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	});

}

async function getConflictoVerdesControlador(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetConflictoVerdesControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = response.data

		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}

async function setConflictoVerdesControlador(jsonData){	
	await axios.post(`${BASE_PATH_WS}/rest/restSetConflictoVerdesControlador?mac=${jsonData.mac}`,jsonData).then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Éxito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
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
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}

async function setDiasEspecialesControlador(jsonData){
	await axios.post(`${BASE_PATH_WS}/rest/restSetDiasEspecialesControlador?mac=${jsonData.mac}`,jsonData).then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Éxito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	});
}

async function getEntradasControlador(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetEntradasControlador?mac=${mac}`, {
		ip: ip
	})
		.then(response => {
			datos = response.data;
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}

async function setEntradasControlador(jsonData){
	await axios.post(`${BASE_PATH_WS}/rest/restSetEntradasControlador?mac=${jsonData.mac}`,jsonData).then(response => {
		console.log(response.data)
		Swal.fire({
			title: "Completado!",
			text: "Cambios Cargados Con Éxito",
			icon: "success",
		});
	})
	.catch(function (error) {
		console.error(error);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	});
}

async function getRegistrosControlador(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetRegistrosControlador?mac=${mac}`, {
		ip: ip,
		pagina:"0"
	})
		.then(response => {
			datos = response.data;
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}
/*
Revisar despues esta peticion api , debido a que la peticion requiere otros parametros.
*/
async function getResumenControlador(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetResumenControlador?mac=${mac}`, {
		ip: ip,
	})
		.then(response => {
			datos = response.data;
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}

async function getAllDataIp(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/conectarIp?mac=${mac}&umbralCache=0`, {
		ip: ip,
	})
		.then(response => {
			datos = response.data;
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;
}

async function getFirmwareVersion(mac,ip){
	
	var datos;
	await axios.post(`${BASE_PATH_WS}/rest/restGetVersionFirmware?mac=${mac}`, {
		ip: ip,
	})
		.then(response => {
			datos = response.data;
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
				footer: '<a href="">Click Aquí Para Notificar el error</a>'
			  })
		});
		return datos;

}




export { getIpsFromRestApi, getFasesFromRestApi,
	 getPlanesFromRestApi,getHorariosFromRestApi,
	 postHorariosFromRestApi,postFasesFromRestApi,
	 setPlanesFromRestApi,getOtrosParametrosFromRestApi,
	 setOtrosParametrosFromRestApi,getTimeControlador,
	 setTimeControlador,getGruposControlador,
	 getConflictoVerdesControlador,setGruposControlador,
	 setConflictoVerdesControlador,getDiasEspecialesControlador,
	 setDiasEspecialesControlador,getEntradasControlador,setEntradasControlador,
	getRegistrosControlador,getResumenControlador,
	getAllDataIp,getFirmwareVersion
}