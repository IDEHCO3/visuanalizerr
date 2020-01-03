import axios from 'axios'
import geobuf from 'geobuf'
import Pbf from 'pbf'

const  proxy_url = 'http://ggt-des.ibge.gov.br/cors-anywhere/' 

export async function request(url, http_method=axios.get) {
  let response = null
  try {
    response = await http_method(url);
    return response
  } catch (e) {
    console.log("Houve algum erro durante a requisição get.")
    console.log(url)
    console.log(e)
  }
} 

export async function requestGet(url) {
  let response = null
  try {
    response = await axios.get(url);
    return response
  } catch (e) {
    console.log("Exceção em requestGet - Erro de cors provavelmente")
    try {
      
      response = await axios.get(proxy_url + url)
      console.log("Requisição GET via proxy: " + proxy_url + url)
      return response
    } catch (e) {
      console.log('Houve algum erro durante requisição requestGet via proxy em Cors-anywhere')
      console.log(proxy_url + url)
      console.log(e)
      alert('Houve algum erro durante requisição')
      return null
    }
  }
} 
export async function requestOptions(url) {
  let response = null
  try {
    response = await axios.options(url)
    return response 
    
  } catch (e) {
    console.log("Exceção em requestGet - Erro de cors provavelmente")
    try {
      
      response = await axios.get(proxy_url + url)
      console.log("Requisitei novamente GET via proxy: " + proxy_url + url)
      return response
    } catch (e) {
      console.log("Houve algum erro durante a requisição options.")
      console.log(url)
      console.log(e)
      alert('Houve algum erro durante requisição')
      return null
    } 
  }
} 

// request binary data and convert to geojson
export async function requestGeobuf(url){

  let response = null
  const requestConfig = {
    responseType: 'arraybuffer',
    headers: {'Accept': 'application/octet-stream'}
  }

  try {
    response = await axios.get(url, requestConfig)
    response.data = geobuf.decode(new Pbf(response.data))
    return response
  } catch (e) {
    console.log("Exceção em requestGeoBuf - Erro de cors provavelmente")
    try {
      
      response = await axios.get(proxy_url + url)
      response.data = geobuf.decode(new Pbf(response.data))
      console.log("Requisitei novamente GET via proxy: " + proxy_url + url)
      return response
    } catch (e) {  
      console.log("Houve algum erro durante a requisição geobuff. ");
      console.log(url)
      console.log(e)
      alert('Houve algum erro durante requisição.')
      return null
    }
  }
}
