
import axios from 'axios';

export async function request(url, http_method=axios.get) {
   let result = null;
   try {
       result = await http_method(url);
       return result;

    } catch (e) {

        console.log("Houve algum erro durante a requisição. ");
       console.log(url);
       console.log(e);

    }
} 
