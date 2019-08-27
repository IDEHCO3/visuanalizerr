
import axios from 'axios';

export async function request(url, http_method=axios.get, type="vector") {
    let result = null;
    if(type==="vector"){
        try {
            result = await http_method(url);
            return result;
                       
        } catch (e) {
           
            console.log("Houve algum erro durante a requisição. ");
            console.log(url);
            console.log(e);
    
        }
    }
    else if(type==="image"){
        try {
            let imageUrl = url + "/.png"
            result = await http_method(imageUrl);
            console.log(result)
            return result;
                       
        } catch (e) {
           
            console.log("Houve algum erro durante a requisição. ");
            console.log(url);
            console.log(e);
    
        }
    }
    
}