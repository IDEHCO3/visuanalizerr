import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import { Button, Tooltip, ButtonGroup } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

import OptionsDialog from './OptionsDialog'
import ClientJoinDialog from './ClientJoinDialog'
import axios from 'axios';
import { request } from '../utils/requests';
import { OptionsLayer, GeoHyperLayerResource } from '../utils/LayerResource';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  iconButton: {
    padding: 10,
  },
  layerName:{
    margin: theme.spacing(1)
  },
}));

export default function ListLayer(props) {
  const classes = useStyles()
  const [ optionsDialogIsOpen, setOptionsDialogIsOpen ] = useState(false)
  const [ optionsLayer, setOptionsLayer ] = useState(new OptionsLayer())

  const [ clientJoinDialogIsOpen, setClientJoinDialogIsOpen ] = useState(false)
  const [ zIndexOfClickedLayer, setZIndexOfClickedLayer ] = useState(0)

  function switchHandleChange(event, is_ckecked) {
    props.switchSelectedLayerResource(event.target.value, is_ckecked)
  };

  async function requestOptionsLayerInfo(layer) {
    const response = await request(layer.iri, axios.options)
    const json = response.data
    let an_optionsLayer = new OptionsLayer(json, layer.iri)
    setOptionsLayer(an_optionsLayer)
  }

  function handleClickClientJoinDialog(item) {
    setZIndexOfClickedLayer(item.layer.values_.zIndex)
    requestOptionsLayerInfo(item)
    setClientJoinDialogIsOpen(true)
  }

  function iconHandleClickSubpor(item) {
    //setZIndexOfClickedLayer(item.layer.values_.zIndex)
    props.changeZOrderLayerResource(item, -1)
  }

  function iconHandleClickSobrepor(item) {
    props.changeZOrderLayerResource(item, 1)
  }

  function closeClientJoinDialog() {
    setClientJoinDialogIsOpen(false)
  }

  function handleClickOptionDialog(item) { 
    requestOptionsLayerInfo(item)
    setOptionsDialogIsOpen(true)
  }

  function closeOptionsDialog() {
    setOptionsDialogIsOpen(false)
  }

  function iconHandleClickDelete(layer) {
    props.deleteSelectedLayerResource(layer);
  }

  return (
    <div className={classes.root}>
      <List>
        {props.layersResource.map( ( layer, index) => (
          <ListItem key={index}>
          
            { layer instanceof GeoHyperLayerResource ?
              <ButtonGroup color="primary">
                <Tooltip title="Remover camada">
                  <Button variant="contained" color="primary" className={classes.Button} onClick={() => iconHandleClickDelete(layer)}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Opções da camada">
                  <Button variant="contained" color="primary" className={classes.Button} onClick={() => handleClickOptionDialog(layer)}> 
                    <Icon>settings</Icon> 
                  </Button>
                </Tooltip>
                <Tooltip title="Junção de dados">
                  <Button variant="contained" color="primary" className={classes.Button} onClick={() => handleClickClientJoinDialog(layer)}> 
                    <AddCircleOutlineIcon/>
                  </Button>
                </Tooltip>
              </ButtonGroup>
            : 
              <Tooltip title="Remover camada">
                <Button variant="contained" color="primary" className={classes.Button} onClick={() => iconHandleClickDelete(layer)}>
                  <DeleteIcon />
                </Button>
              </Tooltip>
            }
    
            <ListItemText id="switch-list-label-wifi" className={classes.layerName} primary={layer.name} />
            <ListItemSecondaryAction>
              <Switch edge="end" onChange={switchHandleChange} checked={layer.activated} value={layer.name} />
            </ListItemSecondaryAction>
            <ListItemSecondaryAction>
              <Tooltip title="Subpor camada">
                    <Button variant="contained" color="primary" className={classes.Button} onClick={() => iconHandleClickSubpor(layer)}> 
                      <ArrowUpwardIcon/>
                    </Button>
              </Tooltip>
              <Tooltip title="Sobrepor camada">
                    <Button variant="contained" color="primary" className={classes.Button} onClick={() => iconHandleClickSobrepor(layer)}> 
                      <ArrowDownwardIcon/>
                    </Button>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <OptionsDialog 
        layer={optionsLayer}
        isOpen={optionsDialogIsOpen}
        close={closeOptionsDialog}
        addLayerFromHyperResource={props.addLayerFromHyperResource}
      />
      <ClientJoinDialog 
        layer={optionsLayer} 
        indexOfLayer={zIndexOfClickedLayer}
        getFeaturesFromVectorLayerOnMap={props.getFeaturesFromVectorLayerOnMap}
        getPropertiesFromFeatures={props.getPropertiesFromFeatures}
        addPropertiesInAFeature={props.addPropertiesInAFeature}
        isOpen={clientJoinDialogIsOpen} 
        close={closeClientJoinDialog}
      />
    </div>
  );
}