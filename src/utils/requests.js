
import axios from 'axios'
import geobuf from 'geobuf'
import Pbf from 'pbf'

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

export async function requestOptions(url) {
  let response = null
  try {
    response = await axios.options(url);
    return response
  } catch (e) {
    console.log("Houve algum erro durante a requisição options.")
    console.log(url)
    console.log(e)
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
    console.log("Houve algum erro durante a requisição geobuff. ");
    console.log(url);
    console.log(e);
  }
}
