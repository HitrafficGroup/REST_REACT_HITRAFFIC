import axios from 'axios';
import Swal from 'sweetalert2';
import { convertToFases,convertToGrupos } from './manageData'
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

async function postFasesSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postFasesSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postGruposSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postGruposSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postGreenConflictSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postGreenConflictSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postPlanesSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postPlanesSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postOtrosParametrosSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postOtrosParametrosSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postHorariosSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postHorariosSW12?mac=${jsonData['mac']}`,jsonData)
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
async function postDiasEspecialesSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postDiasEspecialesSW12?mac=${jsonData['mac']}`,jsonData)
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

async function postEntradasSW12(jsonData) {
	await axios.post(`${BASE_HT200}/rest/postEntradasSW12?mac=${jsonData['mac']}`,jsonData)
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


export { 
	getFasesSW12,getOrdinaryScheduleSW12,getWeekendScheduleSW12,getFestivalScheduleSW12,getPlan1SW12,
	getPlan2SW12,getPlan3SW12,getPlan4SW12,getPlan5SW12,getPlan6SW12,getPlan7SW12,getPlan8SW12,getOperativeParamsSW12,
	getGruposSW12,getGreenConflictSW12,getTimeControllerSW12,getSpecialDaysSW12,getEntradasSW12,getErroresSW12,postFasesSW12,
	postGruposSW12,postGreenConflictSW12,postPlanesSW12,postOtrosParametrosSW12,postHorariosSW12,postDiasEspecialesSW12,postEntradasSW12
}