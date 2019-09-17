import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';


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


  function switchHandleChange(event, is_ckecked) {
    // console.log(event.target)    

    props.switchSelectedLayerResource(event.target.value, is_ckecked)
    //event.target.forceUpdate()
  };
  function iconHandleClickInfo(e, layer) {
    props.infoSelectedLayerResource(layer)
  }

  function iconHandleClickDelete(e, layer) {
    props.deleteSelectedLayerResource(layer);
  }

  return (
    <div className={classes.root}>
      <List>
        {props.layersResource.map( ( layer, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <IconButton className={classes.iconButton} value={layer} color="primary" aria-label="Info" onClick={(e) => iconHandleClickInfo(e, layer)}><InfoIcon /></IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton className={classes.iconButton} color="secondary" aria-label="Info" onClick={(e) => iconHandleClickDelete(e, layer)}><DeleteIcon /></IconButton>
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" primary={layer.name} />
            <ListItemSecondaryAction>
            <Switch edge="end" onChange={switchHandleChange} checked={layer.activated} value={layer.name} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default withStyles(styles)(ListLayer);