import {transformExtent} from 'ol/proj'
export class OptionsLayer {

  constructor(supportedProperties, supportedOperations, context,  iriTemplate, name ,iri) {
    this.supported_properties = supportedProperties;
    this.supported_operations = supportedOperations.sort((a,b) => a['hydra:operation'] < b['hydra:operation'] ? -1 : 1);
    this.context = context;
    this.iri_template = iriTemplate;
    this.name = name;
    this.iri = iri
  }
}
class AbstractLayerResource {
  constructor(layer, iri, name) {
    this.layer = layer
    this.iri = iri
    this.name = this.nameOrNameFromURL(name, iri)
    this.activated = true
  }
  nameOrNameFromURL(name, url) {
    if(name)
      return name
    let arr_url = url.split('/');
    let size_arr = arr_url.length;
    if (arr_url[size_arr-1] === "")
      return arr_url[size_arr-2].toUpperCase();
    return arr_url[size_arr-1].toUpperCase();
  }
}

export class GeoHyperLayerResource extends AbstractLayerResource {
  constructor(layer, iri, name, iri_style, iri_metadata, is_image) {
    super(layer, iri, name,)
    this.iri_style= iri_style
    this.iri_metadata =  iri_metadata
    this.is_image = is_image
  }
  
}
//This class adresses the Layer in the GetCapabilities from WMS
export class WMSCapabilityLayer extends AbstractLayerResource {

  constructor(layerFromGetCapability,wms_version, wms_online_resource) {
    if (layerFromGetCapability != null) {
      super(null,layerFromGetCapability.url, layerFromGetCapability.Name)
      this.name = layerFromGetCapability.Name
      this.title = layerFromGetCapability.Title
      this.metadata = layerFromGetCapability.MetadataURL
      this.version = wms_version
      this.entryPoint = wms_online_resource
      this.was_requested = false
      this.crsName= layerFromGetCapability.CRS[0] // NÃO ESTÁ FUNCIONANDO PARA EPSG:4674 => FORÇADO PARA 'EPSG:4326'
      let extent = layerFromGetCapability.EX_GeographicBoundingBox
      let bbox = transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
      this.bbox = bbox
      this.layer = null
    }

    else {
      super()
      this.json = null;
      this.url = null;
      this.options_response = null;
      this.vector_layer = null;
      this.options_layer = [];
    }
  }

   short_name() {
    let arr_url = this.url.split('/');
    let size_arr = arr_url.length;
    if (arr_url[size_arr-1] === "")
      return arr_url[size_arr-2].toUpperCase();
    return arr_url[size_arr-1].toUpperCase();
  }

}
export class ContainerResource {
    
    constructor(array_resource) {
      this.array_resource = array_resource
      
    }
    addLayerResource ( a_layer_resource) {
      this.array_resource.push(a_layer_resource)
    }
    
    removeLayerResource(a_layer_resource) {
      const index = this.array_resource.indexOf(a_layer_resource);
      this.array_resource.splice(index, 1);
    }
}