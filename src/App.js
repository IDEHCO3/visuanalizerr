import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { FacadeOL } from './utils/facade_openlayers.js';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LayersIcon from '@material-ui/icons/Layers';

import BaseLayer from './components/BaseLayer';
import BaseHyperResource from './components/BaseHyperResource';
import BaseWMS from './components/BaseWMS';
import SelectedListLayer from './components/SelectedListLayer';
import {request} from './utils/requests';

const drawerWidth = "30%";
const useStyles = makeStyles( () => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  }
}))

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

export default function App() {
    const classes = useStyles();
    const [facadeOL, setFacadeOL] = useState(new FacadeOL());
    const [drawerIsOpen, setDrawerIsOpen] = useState(true);
    const [layersResource, setLayersResource] = useState([]);
    const [popupElementRef]  = useState(React.createRef())
    const [expanded, setExpanded] = React.useState([false,true,false,true]);

    const handleChangeOnPanel = position => (event) => {
      let temporaryIsExpanded = expanded.slice(0);
      temporaryIsExpanded[position] = !temporaryIsExpanded[position]
      setExpanded(temporaryIsExpanded);
    }
    
    function baseLayerChanged(value) {
      facadeOL.setBaseLayer(value);
    }

    function deleteSelectedLayerResource(a_resource_layer) {
      let arr = layersResource.filter(layer =>  layer !== a_resource_layer);
      setLayersResource(arr)
      facadeOL.map.removeLayer(a_resource_layer.layer)
    }

    async function getUpdatedLayerFromLayersResource(layer_resource_name, is_checked) {
      let a_resource_layer = null
      const arr = layersResource.map( (layer_resource) => {
          if (layer_resource.name ===  layer_resource_name) { // VERIFICAR SE É CORRETO USAR O NOME AO INVES DE URL PARA VERIFICAÇAO
            layer_resource.activated = is_checked
            a_resource_layer = layer_resource
          }
          return layer_resource                  
      })
      setLayersResource(arr)
      return a_resource_layer
    }

    async function switchSelectedLayerResource(layer_resource_name, is_checked) {
      let a_resource_layer = await getUpdatedLayerFromLayersResource(layer_resource_name, is_checked)
      
      if (!a_resource_layer)
        return 
      //debugger
      if (a_resource_layer.activated === true) 
        facadeOL.map.addLayer(a_resource_layer.layer)
      else
        facadeOL.map.removeLayer(a_resource_layer.layer)
    }

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
    }

    async function addLayerFromHyperResource(a_GeoHyperLayerResource) {
      
      if (a_GeoHyperLayerResource.is_image){
        let  image_layer_ol = await facadeOL.addHyperResourceImageLayer(a_GeoHyperLayerResource.iri)  
        a_GeoHyperLayerResource.layer = image_layer_ol
      } else {
        const response = await request(a_GeoHyperLayerResource.iri)
        const headers = response.headers
        const style_iri = styleFromHeaders(headers)
        let  vector_layer_ol = await facadeOL.addVectorLayerFromGeoJSON(response.data, style_iri)
        a_GeoHyperLayerResource.layer = vector_layer_ol
      } 

      let arr = layersResource.concat([a_GeoHyperLayerResource])
      // FALHA AO REQUISITAR CAMADAS GRANDES E ACRESCENTAR OUTRAS ANTES DELA CARREGAR - sobrescreve o layersResource com valor errado
      setLayersResource(arr)
      //console.log("Tamanho do array no app: " + layersResource.length)
      a_GeoHyperLayerResource.layer.setZIndex(arr.length)
    }

    async function addLayerFromWMS(a_WMSCapabilityLayer) {
      let  wms_layer =  facadeOL.addWMSLayer(a_WMSCapabilityLayer)
      let arr = layersResource.concat([wms_layer]) 
      setLayersResource(arr)
    }

    function getPropertiesFromFeatures(featureList) {
      const propertyList = facadeOL.getPropertiesFromFeatures(featureList)
      return propertyList
    }

    function getFeaturesFromVectorLayerOnMap(ZIndexOfTheLayer) {
      const featureList = facadeOL.getFeaturesFromVectorLayerOnMap(ZIndexOfTheLayer)
      return featureList
    }

    function addPropertiesInAFeature(OlFeature, newProperties) {
      facadeOL.addPropertiesInAFeature(OlFeature, newProperties)
      //console.log(layersResource)
    }

    useEffect(() => {
      setFacadeOL(new FacadeOL())
      //facadeOL.setPopupInElement(document.getElementById('popup'))
    }, [facadeOL.currentBaseLayerName]) // Only re-run the effect if facadeOL.currentBaseLayerName changes
        
    return (
        
        <div>
          <div id="map" style={{position: "fixed", width: "100%", height: "100%",  bottom: 0, zindex: 0 }}><div id="popup" ref = {popupElementRef} ></div></div>
          <Fab color="primary" aria-label="Add"  size="small" style = {{position: "fixed", top: 25}}  onClick={() => setDrawerIsOpen(!drawerIsOpen)}  >
              <TouchAppIcon />
          </Fab>
                    
          <Drawer 
            open={drawerIsOpen} 
            variant="persistent" 
            classes={{
            paper: classes.drawerPaper,
            }}
          >
              <div >
                <IconButton onClick={() => setDrawerIsOpen(!drawerIsOpen)}>
                  {<ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider /> 
              <div>
                <ExpansionPanel expanded={expanded[0] === true} onChange={handleChangeOnPanel(0)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                    <LayersIcon className={classes.icon } color="disabled"/>
                    <Typography > Camada Base </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseLayer baseLayerChanged={baseLayerChanged} />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded[1] === true} onChange={handleChangeOnPanel(1)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <LayersIcon className={classes.icon } color="primary"/>
                    <Typography > API Hipercamadas </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseHyperResource addLayerFromHyperResource = {addLayerFromHyperResource}/>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded[2] === true} onChange={handleChangeOnPanel(2)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <LayersIcon className={classes.icon } color="secondary"/>
                  <Typography > Geo serviços WMS </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <BaseWMS facadeOL={facadeOL} addLayerFromWMS={addLayerFromWMS}/>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded[3] === true} onChange={handleChangeOnPanel(3)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <LayersIcon className={classes.icon } color="inherit" />
                    <Typography > Camadas selecionadas </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>  
                    <SelectedListLayer 
                      layersResource={layersResource} 
                      deleteSelectedLayerResource={deleteSelectedLayerResource}
                      switchSelectedLayerResource={switchSelectedLayerResource}
                      getFeaturesFromVectorLayerOnMap={getFeaturesFromVectorLayerOnMap}
                      getPropertiesFromFeatures={getPropertiesFromFeatures}
                      addPropertiesInAFeature={addPropertiesInAFeature}
                      addLayerFromHyperResource={addLayerFromHyperResource}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
          </Drawer>
       
        </div>
      )
      
}    
