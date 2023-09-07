import axios from 'axios';
import Swal from 'sweetalert2';
// const BASE_HT200 = 'https://www.hitraffic-group.com';
//const BASE_HT200 = 'http://127.0.0.1:8000';

const BASE_HT200 = 'http://127.0.0.1:4000';

async function getTimeHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getTimeHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = false;
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
		  })
	})
	return res
}



async function getUnitHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getUnitHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = false
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
	})
	return res
}
async function PostUnitHT200(jsonData) {
	var res = false
	await axios.post(`${BASE_HT200}/rest/setUnitHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			res = true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return res;
}

async function getFasesHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getFasesHT200?ip=${ip}`).then(response => {
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

		  })
		res = false
	})
	return res
}


async function PostFasesHT200(jsonData) {
	var res = false ;
	await axios.post(`${BASE_HT200}/rest/setFasesHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			res = true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,

			  })
		});
		return res;
}

async function getSecuencyHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getSecuenciaHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
		res = false
	})
	return res
}

async function PostSecuenciasHT200(jsonData) {
	var res = false
	await axios.post(`${BASE_HT200}/rest/setSecuenciasHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			res = true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,

			  })
		});
	return res;
}





async function getSplitHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getSplitHT200?ip=${ip}`).then(response => {
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
		  })
		res = false;
	})
	return res
}


async function PostSplitHT200(jsonData) {
	var res = false;
	await axios.post(`${BASE_HT200}/rest/setSplitHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			res =true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
		return res;
}

async function getPatternHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPatternHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = false
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
		  })
	})
	return res
}


async function PostPatternHT200(jsonData) {
	var res = false
	await axios.post(`${BASE_HT200}/rest/setPatternHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			res = true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			res = false
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return res;
}



async function getAccionHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getAccionHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
		  })
		  res = false
	})
	return res
}

async function PostActionHT200(jsonData) {
	var res = false;
	await axios.post(`${BASE_HT200}/rest/setActionHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			res = true;
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return res;
}


async function getPlanHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getPlanesHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
		res = false
	})
	return res
}
async function PostPlanHT200(jsonData) {
	var result = false;
	await axios.post(`${BASE_HT200}/rest/setPlanHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			result =  true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			result = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return result
}

async function getHorarioHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getScneduleHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = false
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,
		  })
	})
	return res
}



async function PostHorariosHT200(jsonData) {
	var res = false;
	await axios.post(`${BASE_HT200}/rest/setHorariosHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data);
			res = true
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,

			  })
		});
	return res;
}

async function getChannelHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getChannelHT200?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Leidos Con Éxito",
			icon: "success",
		});
		
	}).catch(function (error) {
		res = false;
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
	})
	return res
}
async function PostChannelHT200(jsonData) {
	var res = false;
	await axios.post(`${BASE_HT200}/rest/setChannelHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			res = true;
			console.log(response.data)
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false;
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return res;
}

async function PostTimeHT200(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setTimeHT200?ip=${jsonData['ip']}`,jsonData)
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
			  })
		});
}


async function setBasicPlan(jsonData) {
	var res = false;
	await axios.post(`${BASE_HT200}/rest/setBasicPlan?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			res = true;
			Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
		})
		.catch(function (error) {
			console.error(error);
			res = false
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
	return res;
}


async function setClonacion(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setBasicPlan?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			console.log(response.data)
			
		})
		.catch(function (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error de Conexión',
				text: `${error}`,
			  })
		});
}

async function getRegErrores(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getErroresControlador?ip=${ip}`).then(response => {
		res = response.data
		Swal.fire({
			title: "Completado!",
			text: "Datos Cargados Con Éxito",
			icon: "success",
		});
	}).catch(function (error) {
		res = false;
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
	})
	return res
}

async function getWorkStateHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getWorkStateHT200?ip=${ip}`).then(response => {
		res = response.data

	}).catch(function (error) {
		res = false
		Swal.fire({
			icon: 'error',
			title: 'Error de Conexión',
			text: `${error}`,

		  })
	})
	return res
}

async function setModoManual(jsonData) {
	await axios.post(`${BASE_HT200}/rest/setControlManualHT200?ip=${jsonData['ip']}`,jsonData)
		.then(response => {
			
			
		})
		.catch(function (error) {
			console.error(error);
			
		});
}


async function getBasicInfoHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getBasicInfoHT200?ip=${ip}`).then(response => {
		res = response.data
		
	}).catch(function (error) {
		console.log(res);
	})
	return res
}
async function getDeviceInfoHT200(ip) {
	var res;
	await axios.get(`${BASE_HT200}/rest/getDeviceInfoHT200?ip=${ip}`).then(response => {
		res = response.data
		
	}).catch(function (error) {
		console.log(res);
	})
	return res
}


export { 
	getUnitHT200,PostUnitHT200,
	getFasesHT200,PostFasesHT200,
	getSecuencyHT200,PostSecuenciasHT200,
	getSplitHT200,PostSplitHT200,
	getPatternHT200,PostPatternHT200,
	getAccionHT200,PostActionHT200,
	getPlanHT200,PostPlanHT200,
	getHorarioHT200,PostHorariosHT200,
	getChannelHT200,PostChannelHT200,
	getTimeHT200,PostTimeHT200,setBasicPlan,
	getRegErrores,setClonacion,
	getWorkStateHT200,setModoManual,
	getBasicInfoHT200,getDeviceInfoHT200
}