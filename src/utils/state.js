
import { createStore} from 'react-hookstore';
import {FacadeOL} from './facade_openlayers';
import {ContainerResource} from './LayerResource';
export var facadeOL = createStore('facadeOL', new FacadeOL());
export var containerResource = createStore('containerResource', new ContainerResource([]));

 
    