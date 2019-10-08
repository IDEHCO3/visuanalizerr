import React, {useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import OptionsDialog from './OptionsDialog'
import axios from 'axios';
import { request } from '../utils/requests';
import { OptionsLayer } from '../utils/LayerResource';

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
  const [ optionsDialogIsOpen, setOptionsDialogIsOpen ] = useState(false);
  const [ optionsLayer, setOptionsLayer ] = useState(new OptionsLayer());

  function switchHandleChange(event, is_ckecked) {  
    props.switchSelectedLayerResource(event.target.value, is_ckecked)
  };

  function handleClickOptionDialog(item) { 
    requestOptionsLayerInfo(item)
    setOptionsDialogIsOpen(true)
  };

  async function requestOptionsLayerInfo(layer) {
    const response = await request(layer.iri, axios.options)
    const json = response.data
    let an_optionsLayer = new OptionsLayer(json, layer.iri)
    setOptionsLayer(an_optionsLayer)
  }

  function closeOptionsDialog () {
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
            <ListItemIcon>
              <IconButton className={classes.iconButton} value={layer} color="primary" aria-label="Info" onClick={() => handleClickOptionDialog(layer)}><Icon>settings</Icon></IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton className={classes.iconButton} color="secondary" aria-label="Info" onClick={() => iconHandleClickDelete(layer)}><DeleteIcon /></IconButton>
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary={layer.name} />
            <ListItemSecondaryAction>
            <Switch edge="end" onChange={switchHandleChange} checked={layer.activated} value={layer.name} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <OptionsDialog layer={optionsLayer} isOpen={optionsDialogIsOpen} close={closeOptionsDialog}/>
    </div>
  );
}

export default withStyles(styles)(ListLayer);