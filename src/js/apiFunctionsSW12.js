import axios from 'axios';
import Swal from 'sweetalert2';
import { convertToFases, convertToPlanes,createHorariosObject,convertToGrupos,convertirDiasEspeciales } from './manageData'
const BASE_HT200 = 'http://127.0.0.1:8000';


async function getFasesSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getFasesSW12?ip=${ip}`).then(response => {
		res = convertToFases(response.data);
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
async function getOrdinaryScheduleSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getOrdinaryScheduleSW12?ip=${ip}`).then(response => {
		res = response.data;
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
async function getWeekendScheduleSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getWeekendScheduleSW12?ip=${ip}`).then(response => {
		res = response.data;
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
async function getFestivalScheduleSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getFestivalScheduleSW12?ip=${ip}`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		res = []
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}
async function getPlan1SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan1SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		res = []
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}
async function getPlan2SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan2SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		res = []
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}


async function getPlan3SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan3SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = []
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


async function getPlan4SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan4SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = []
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

async function getPlan5SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan5SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = []
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


async function getPlan6SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan6SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = []
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


async function getPlan7SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan7SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = []
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


async function getPlan8SW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlan8SW12`).then(response => {
		res = response.data;
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		console.log(res);
		res = []
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
			footer: '<a href="">Click Aquí Para Notificar el error</a>'
		  })
	})
	return res
}

async function getOperativeParamsSW12() {
	var res;
	await axios.get(`${BASE_HT200}/rest/getOperativeParamsSW12`).then(response => {
		res = response.data;
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



async function getGruposSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getGruposSW12?ip=${ip}`).then(response => {
		res = convertToGrupos(response.data)
		
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

async function getGreenConflictSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getGreenConflictSW12?ip=${ip}`).then(response => {
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
	return res;
}

async function getTimeControllerSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getTimeControllerSW12?ip=${ip}`).then(response => {
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
	return res;
}


async function getSpecialDaysSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getSpecialDaysSW12?ip=${ip}`).then(response => {
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
	return res;
}


async function getEntradasSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getEntradasSW12?ip=${ip}`).then(response => {
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
	return res;
}

async function getErroresSW12(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getErroresSW12?ip=${ip}`).then(response => {
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
	return res;
}






export { 
	getFasesSW12,getOrdinaryScheduleSW12,getWeekendScheduleSW12,getFestivalScheduleSW12,getPlan1SW12,
	getPlan2SW12,getPlan3SW12,getPlan4SW12,getPlan5SW12,getPlan6SW12,getPlan7SW12,getPlan8SW12,getOperativeParamsSW12,
	getGruposSW12,getGreenConflictSW12,getTimeControllerSW12,getSpecialDaysSW12,getEntradasSW12,getErroresSW12
}