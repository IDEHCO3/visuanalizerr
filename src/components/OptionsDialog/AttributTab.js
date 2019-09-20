import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';

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
  const AsupportedProperties = props.layerAttributes.jsonOptions
  const supportedProperties = [{'hydra:property': "aaaaa"}]
  /*console.log("prop Prope ---")
  console.log(AsupportedProperties)
  console.log("---")*/
  const context = props.layerAttributes['@context']

  //console.log(props.layerAttributes)
  return (
    <List dense={false}>
    { supportedProperties.map( (property, index) => (
      <ListItem button key={index}>

        <ListItemText primary={property["hydra:property"]} />

        <ListItemSecondaryAction>
          <Button variant="contained" color="primary" className={classes.button} >
            Tipo <LaunchIcon className={classes.rightIcon}/>
          </Button>
          <Button variant="contained" color="primary" className={classes.button} href="aaaaaa" target="blank">
            Semantica <LaunchIcon  className={classes.rightIcon}/>
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
  );
}