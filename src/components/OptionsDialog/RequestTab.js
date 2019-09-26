import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { ButtonGroup, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';

import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';

import { request } from '../../utils/requests';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 260,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function RequestTab(props) {
  const classes = useStyles();
  const { optionsLayer } = props
  const [ supportedProperties, setSuportedProperties ] = useState([]) // [{'hydra:property': "aaaaa"}]
  const [ supportedOperations, setSupportedOperations ] = useState([])

  useEffect(() => {
    if(optionsLayer.jsonOptions){
      setSuportedProperties(optionsLayer.supportedProperties)
      setSupportedOperations(optionsLayer.supportedOperations)
    }
  }, [optionsLayer])

  function includeOperator(aaa){
    console.log(aaa)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>

          <Grid item xs={6}>
            <Paper className={classes.paper}> 
              <Typography variant="h6" gutterBottom> Atributos  </Typography>
              <List dense={false}>
              { supportedProperties.map( (property, index) => (
                <ListItem button key={index}>

                  <ListItemText primary={property["hydra:property"]} />

                  <ListItemSecondaryAction>
                    <Fab size="small" color="secondary" aria-label="add" className={classes.margin}>
                      <SearchIcon />
                    </Fab>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper}>item</Paper>
          </Grid>

        </Grid>
        <Grid container item xs={12} spacing={3}>

          <Grid item xs={6}>
            <Paper className={classes.paper}> 
              <Typography variant="h6" gutterBottom> Operações </Typography>
              <List dense={false}>
              { supportedOperations.map( (operation, index) => (
                <ListItem button key={index}>

                  <ListItemText primary={operation["hydra:operation"]} />

                  <ListItemSecondaryAction>
                    <Fab size="small" color="secondary" aria-label="add" className={classes.margin}>
                      <SendIcon />
                    </Fab>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper}> Operações Selecionadas </Paper>
          </Grid>

        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="full-width contained primary button group"
              size="large"
              fullWidth
            >
              <Button onClick={() => includeOperator('eq')}> = </Button>
              <Button onClick={() => includeOperator('neq')}> != </Button>
              <Button onClick={() => includeOperator('gt')}> > </Button>
              <Button onClick={() => includeOperator('lt')}> {'<'} </Button>
              <Button onClick={() => includeOperator('gte')}> >= </Button>
              <Button onClick={() => includeOperator('lte')}> {'<='} </Button>
              <Button onClick={() => includeOperator('between')}> between </Button>
              <Button onClick={() => includeOperator('isnull')}> null </Button>
              <Button onClick={() => includeOperator('isnotnull')}> not null </Button>
              <Button onClick={() => includeOperator('like')}> like </Button>
              <Button onClick={() => includeOperator('notlike')}> not like </Button>
              <Button onClick={() => includeOperator('in')}> in </Button>
              <Button onClick={() => includeOperator('notin')}> not in </Button>
              <Button onClick={() => includeOperator('and')}> and </Button>
              <Button onClick={() => includeOperator('or')}> or </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Expressão de filtragem"
              multiline
              rows="2"
              margin="normal"
              variant="outlined"
              fullWidth
            /> 
          </Grid>         
        </Grid>

      </Grid>
    </div>
  );
}