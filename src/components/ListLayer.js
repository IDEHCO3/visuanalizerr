import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, IconButton, Tooltip, ButtonGroup } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import OptionsDialog from './OptionsDialog'

import axios from 'axios';
import { request } from '../utils/requests';
import { OptionsLayer } from '../utils/LayerResource';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function ListLayer(props) {
  const classes = useStyles();
  const [ isImageCopy, setIsImageCopy ] = useState(false);
  const [ optionsDialogIsOpen, setOptionsDialogIsOpen ] = useState(false);
  const [ optionsLayer, setOptionsLayer ] = useState(new OptionsLayer());
  
  function handleClickAddLayer(item) {
    props.selectedItemName(item.name, item.isImage)
  };

  function handleClickImageOrVector(item) {
    setIsImageCopy(!isImageCopy) // change this later, just to re render
    item.isImage = !item.isImage
  }; 

  function handleClickOptionDialog(item) { 
    requestOptionsLayerInfo(item)
    setOptionsDialogIsOpen(true)
  };

  async function requestOptionsLayerInfo(layer) {
    const response = await request(layer.url, axios.options)
    const json = response.data
    let an_optionsLayer = new OptionsLayer(json, layer.url)
    setOptionsLayer(an_optionsLayer)
  }

  function closeOptionsDialog () {
    setOptionsDialogIsOpen(false)
  }

  return (
    <div className={classes.root}>
      <List className={classes.root} >
        { props.items.map( (item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <IconButton className={classes.iconButton} color="primary" aria-label="Info" onClick={() => handleClickOptionDialog(item)}>
                <Tooltip title="Opções da camada" aria-label="Add">
                  <Icon>settings</Icon>
                </Tooltip> 
              </IconButton>
            </ListItemIcon>
            <ListItemText  primary={item.name} />
            <ListItemSecondaryAction>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button variant="contained" color="primary" className={classes.Button} onClick={() => handleClickImageOrVector(item)}>
                  { item.isImage ? 
                    <Tooltip title="Tipo da Camada: Imagem" aria-label="Add">
                      <Icon>image</Icon>
                    </Tooltip> 
                    : 
                    <Tooltip title="Tipo da Camada: Vetor" aria-label="Add">
                    <Icon>grain</Icon>
                    </Tooltip>
                  }
                </Button>
                <Tooltip title="Adicionar camada" aria-label="Add">
                  <Button variant="contained" color="primary" className={classes.Button} onClick={() => handleClickAddLayer(item)}> <Icon>queue</Icon> </Button>
                </Tooltip>
              </ButtonGroup>
            </ListItemSecondaryAction>
          </ListItem>
        ))}  
      </List>
      { props.type === "HypeResource" ? 
        <OptionsDialog 
          layer={optionsLayer} 
          isOpen={optionsDialogIsOpen} 
          close={closeOptionsDialog} 
          addLayerFromHyperResource={props.addLayerFromHyperResource}
        /> 
        :
        <div/>
      }
      
    </div>
  );
}

ListLayer.propTypes = {
  items: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
};