import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { request } from '../utils/requests';
import { Button, IconButton, Tooltip, ButtonGroup } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import axios from 'axios';
import OptionsHyperResourceDialog from './OptionsHyperResourceDialog'
import { OptionsLayer} from './../utils/LayerResource';
const styles = theme => ({
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

  urlStyle: {
    top: '20px' ,
    left: '-20px' 
  }
});

const urlStyle = {
  top: '20px',
  left: '-20px' 
};



function ListLayer(props) {
  const classes = props;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ optionsLayer, setOptionsLayer ] = useState(null);
  const [ isImageCopy, setIsImageCopy ] = useState(false);
  
    function handleClickAddLayer(event, item) {
      props.selectedItemName(item.name, item.isImage)
    };

    function handleClickImageOrVector(event, item) {
      setIsImageCopy(!isImageCopy)
      item.isImage = !item.isImage
    };
  
    async function iconHandleClickInfo(event, item) {      
      setIsOpen(true)
      
      let response = await request(item.url, axios.options)
      let json = response.data
      console.log(json)
      let an_optionsLayer = new OptionsLayer(json[["hydra:supportedProperties"]],json[["hydra:supportedOperations"]],json[["@context"]], json[["hydra:iriTemplate"]], item.name, item.url)
      setOptionsLayer(an_optionsLayer )
    };
    
    function closeHyperResourceDialog() {
      setIsOpen(false)
    }
    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>Url das camadas</ListSubheader>} className={classes.root} style={urlStyle}>
          { props.items.map( (item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <IconButton className={classes.iconButton} color="primary" aria-label="Info" onClick={(e) =>iconHandleClickInfo(e, item)}>
                    <Tooltip title="Informações da camada" aria-label="Add">
                      <Icon>info</Icon>
                    </Tooltip> 
                </IconButton>
              </ListItemIcon>
              <ListItemText  primary={item.name} />
              <ListItemSecondaryAction>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <Button variant="contained" color="primary" className={classes.Button} onClick={(e) => handleClickImageOrVector(e, item)}>
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
                    <Button variant="contained" color="primary" className={classes.Button} onClick={(e) => handleClickAddLayer(e, item)}> <Icon>queue</Icon> </Button>
                  </Tooltip>
                </ButtonGroup>
              </ListItemSecondaryAction>
            </ListItem>
          ))}  
        </List>
        <OptionsHyperResourceDialog closeHyperResourceDialog={closeHyperResourceDialog} optionsLayer={optionsLayer} items={props.items} isOpen={isOpen}   />
      </div>
    );
}

export default withStyles(styles)(ListLayer);