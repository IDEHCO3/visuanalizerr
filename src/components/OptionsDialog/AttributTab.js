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
  const [ supportedProperties, setSuportedProperties ] = useState([]) // [{'hydra:property': "aaaaa"}]

  useEffect(() => {
    if(optionsLayer.jsonOptions){
      setSuportedProperties(optionsLayer.supportedProperties)
    }
  }, [optionsLayer])

  return (
    <List dense={false}>
    { supportedProperties.map( (property, index) => (
      <ListItem button key={index}>

        <ListItemText primary={property["hydra:property"]} />

        <ListItemSecondaryAction>
          <Tooltip title="Abrir em nova aba">
            <Button variant="contained" color="primary" className={classes.button} href={property["contextType"]} target="blank">
              Tipo <LaunchIcon className={classes.rightIcon}/>
            </Button>
          </Tooltip>
          <Tooltip title="Abrir em nova aba">
            <Button variant="contained" color="primary" className={classes.button} href={property["contextId"]} target="blank">
              Semantica <LaunchIcon  className={classes.rightIcon}/>
            </Button>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
  );
}