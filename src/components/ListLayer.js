import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import {InfoIcon, Image} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { request } from '../utils/requests';

import axios from 'axios';
import OptionsHyperResourceDialog from './OptionsHyperResourceDialog'
import { OptionsLayer} from './../utils/LayerResource';
import { Button } from '@material-ui/core';
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
  }
});


function ListLayer(props) {
  const classes = props;
  const [isOpen,setIsOpen ] = useState(false);
  const [optionsLayer, setOptionsLayer] = useState(null);
  
    function handleClick(event, item) {
      props.selectedItemName(item.name)
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
        <List subheader={<ListSubheader>Url das camadas</ListSubheader>} className={classes.root}>
          { props.items.map( item => (
            <ListItem key={item.name}>
              <ListItemIcon>
                <IconButton className={classes.iconButton} color="primary" aria-label="Info" onClick={(e) =>iconHandleClickInfo(e, item)}><InfoIcon /></IconButton>
              </ListItemIcon>
              <ListItemText  primary={item.name} />
              <ListItemSecondaryAction>
                <Button variant="contained" color="primary" className={classes.Button} onClick={(e) => handleClick(e,item)}> imagem </Button>
                <Button variant="contained" color="primary" className={classes.Button} onClick={(e) => handleClick(e,item)}> Baixar </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}  
        </List>
        <OptionsHyperResourceDialog closeHyperResourceDialog={closeHyperResourceDialog} optionsLayer={optionsLayer} items={props.items} isOpen={isOpen}   />
      </div>
    );
}

export default withStyles(styles)(ListLayer);