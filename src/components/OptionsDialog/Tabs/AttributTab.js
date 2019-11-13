import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function InteractiveList(props) {
  const classes = useStyles();
  const { optionsLayer } = props
  const [ propertyList, setPropertyList ] = useState([])

  useEffect(() => {
    if(optionsLayer.jsonOptions){
      setPropertyList(optionsLayer.propertyListFromContext)
    }
  }, [optionsLayer])

  return (
    <List dense={false}>
    { propertyList.map( (property, index) => (
      <ListItem button key={index}>

        <ListItemText primary={property.name} />

        <ListItemSecondaryAction>
          <Tooltip title="Abrir em nova aba">
            <Button variant="contained" color="primary" className={classes.button} href={property.type} target="blank">
              Tipo <LaunchIcon className={classes.rightIcon}/>
            </Button>
          </Tooltip>
          <Tooltip title="Abrir em nova aba">
            <Button variant="contained" color="primary" className={classes.button} href={property.id} target="blank">
              Semantica <LaunchIcon  className={classes.rightIcon}/>
            </Button>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
  );
}