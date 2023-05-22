import axios from 'axios';
import Swal from 'sweetalert2';
const BASE_HT200 = 'http://127.0.0.1:8000';


async function getUnitHT200(mac,ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getUnitHT200?mac=${mac}&ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}
async function PostUnitHT200(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setUnitHT200?mac=${jsonData['mac']}`,jsonData)
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

async function getFasesHT200(mac,ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getFasesHT200?mac=${mac}&ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}


async function PostFasesHT200(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setFasesHT200?mac=${jsonData['mac']}`,jsonData)
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

async function getSecuencyHT200(mac,ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getSecuenciaHT200?mac=${mac}&ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}

async function PostSecuenciasHT200(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setSecuenciasHT200?mac=${jsonData['mac']}`,jsonData)
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


export { getUnitHT200,PostUnitHT200,getFasesHT200,PostFasesHT200,getSecuencyHT200,PostSecuenciasHT200}