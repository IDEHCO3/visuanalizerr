import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FacadeOL } from './utils/facade_openlayers.js';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LayersIcon from '@material-ui/icons/Layers';

import BaseLayer from './components/BaseLayer';
import BaseHyperResource from './components/BaseHyperResource';
import BaseWMS from './components/BaseWMS';
import SelectedListLayer from './components/SelectedListLayer';
import {request} from './utils/requests';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },  
  formControl: {
      margin: 10,
      minWidth: 120,
  },
  selectEmpty: {
      marginTop: 10,
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 200,
  },
  icon: {
    margin: 10,
    fontSize: 32,
  },
  
  
});
function App(props) {
    const classes = props;
    const [facadeOL, setFacadeOL] = useState(new FacadeOL());
    const [drawerIsOpen, setDrawerIsOpen] = useState(true);
    const [layersResource, setLayersResource] = useState([]);
    const [popupElementRef]  = useState(React.createRef())
    
    function buttonClicked(e)    {
      setDrawerIsOpen(!drawerIsOpen)
      //console.log(e)
    };
    
    function baseLayerChanged(value) {
       facadeOL.setBaseLayer(value);
       
    };
    
    function infoSelectedLayerResource(a_selected_layer) {
        console.log(a_selected_layer)
    };

    function deleteSelectedLayerResource(a_resource_layer) {
      let arr = layersResource.filter(layer =>  layer !== a_resource_layer);
      setLayersResource(arr)
      facadeOL.map.removeLayer(a_resource_layer.layer)
      
    };

    async function getUpdatedLayerFromLayersResource(layer_resource_name, is_checked) {
      let a_resource_layer = null
      const arr = layersResource.map( (layer_resource) => {
          if (layer_resource.name ===  layer_resource_name) {
            layer_resource.activated = is_checked
            a_resource_layer = layer_resource
          }
          return layer_resource                  
      })
      setLayersResource(arr)
      return a_resource_layer
    };

    async function switchSelectedLayerResource(layer_resource_name, is_checked) {
      let a_resource_layer = await getUpdatedLayerFromLayersResource(layer_resource_name, is_checked)
      
      if (!a_resource_layer)
        return 
      //debugger
      if (a_resource_layer.activated === true) 
        facadeOL.map.addLayer(a_resource_layer.layer)
      else
        facadeOL.map.removeLayer(a_resource_layer.layer)
      
    };
    function extractIRIFromLinkHeaders(name_in_the_link, headers) {
      const link = headers.link
      const idx_end_of_stylesheet = link.lastIndexOf(name_in_the_link)
      let start_iri_style = -1
      let end_iri_style = -1
      let i = idx_end_of_stylesheet 
      while (i > 0) {
        i--
        if (link[i] === '>')
          end_iri_style = i
        if (link[i] === '<') {
          start_iri_style = i + 1
          break
        }
      }
      
      return link.substring(start_iri_style, end_iri_style )

    }
    function styleFromHeaders(headers) {
      return extractIRIFromLinkHeaders('stylesheet', headers)
    };

    async function addLayerFromHyperResource(a_GeoHyperLayerResource) {

      if (a_GeoHyperLayerResource.is_image)
      {
        let  image_layer_ol = await facadeOL.addHyperResourceImageLayer(a_GeoHyperLayerResource.iri)  
        a_GeoHyperLayerResource.layer = image_layer_ol
        let arr = layersResource.concat([a_GeoHyperLayerResource]) 
        setLayersResource(arr)
        a_GeoHyperLayerResource.layer.setZIndex(arr.length)
        return
      } else {
        const response = await request(a_GeoHyperLayerResource.iri);
        const headers = response.headers
        const style_iri = styleFromHeaders(headers)
        //console.log(style_iri)
        let  vector_layer_ol = await facadeOL.addVectorLayerFromGeoJSON(response.data, style_iri)
        a_GeoHyperLayerResource.layer = vector_layer_ol
        let arr = layersResource.concat([a_GeoHyperLayerResource]) 
        setLayersResource(arr)
        a_GeoHyperLayerResource.layer.setZIndex(arr.length)
        //console.log(layersResource)
      }  
      
    };

    async function addLayerFromWMS(a_WMSCapabilityLayer) {
      let  wms_layer =  facadeOL.addWMSLayer(a_WMSCapabilityLayer)
      let arr = layersResource.concat([wms_layer]) 
      setLayersResource(arr)
      
    };
    useEffect(() => {
      setFacadeOL(new FacadeOL())
      //facadeOL.setPopupInElement(document.getElementById('popup'))
    
    }, [facadeOL.currentBaseLayerName]); // Only re-run the effect if facadeOL.currentBaseLayerName changes
    
        
    return (
        
        <div>
          <div id="map" style={{position: "fixed", width: "100%", height: "100%",  bottom: 0, zindex: 0 }}><div id="popup" ref = {popupElementRef} ></div></div>
          <Fab color="primary" aria-label="Add"  size="small" style = {{position: "fixed", top: 25}}  onClick={buttonClicked}  >
              <TouchAppIcon />
          </Fab>
                    
          <Drawer open={drawerIsOpen} variant="persistent">
              <div >
                <IconButton onClick={(e) => setDrawerIsOpen(!drawerIsOpen)}>
                  {<ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider /> 
              <div>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                    <LayersIcon className={classes.icon } color="disabled"/>
                    <Typography > Camada Base </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseLayer baseLayerChanged={baseLayerChanged} />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={true}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <LayersIcon className={classes.icon } color="primary"/>
                    <Typography > API Hipercamadas </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseHyperResource addLayerFromHyperResource = {addLayerFromHyperResource}/>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <LayersIcon className={classes.icon } color="secondary"/>
                  <Typography > Geo serviços WMS </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseWMS facadeOL={facadeOL} addLayerFromWMS={addLayerFromWMS}/>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <LayersIcon className={classes.icon } color="inherit" />
                    <Typography > Camadas selecionadas </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>  
                    <SelectedListLayer 
                      layersResource={layersResource} 
                      infoSelectedLayerResource={infoSelectedLayerResource}
                      deleteSelectedLayerResource={deleteSelectedLayerResource}
                      switchSelectedLayerResource={switchSelectedLayerResource}
                    /> 
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
          </Drawer>
       
        </div>
      )
      
}    

export default  withStyles(styles)(App);
