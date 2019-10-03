import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { ButtonGroup, Button, Fab, Tooltip  } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import SearchIcon from '@material-ui/icons/Search';
import SamountIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { green, red } from '@material-ui/core/colors';

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
  urlContainer: {
    textAlign: 'center',
  },
}));

const GreenButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Fab);

const RedButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Fab);

export default function RequestTab(props) {
  const classes = useStyles();
  const { optionsLayer } = props
  const [ supportedProperties, setSuportedProperties ] = useState([])
  const [ supportedOperations, setSupportedOperations ] = useState([])
  const [ attributeSearchRange, setAttributeSearchRange ] = useState({start: 1, amount: 30})
  const [ attributeSamples, setAttributeSamples ] = useState([])
  const [ uriList, setUriList ] = useState([]) // array of objects [{name: 'bbcontains', value: '{geometry}'}]
  const [ expressionUrl, setExpressionUrl ] = useState('')

  useEffect(() => {
    if(optionsLayer.jsonOptions){
      setSuportedProperties(optionsLayer.supportedProperties)
      setSupportedOperations(optionsLayer.supportedOperations)
      setExpressionUrl(optionsLayer.iri)
    }
  }, [optionsLayer])

  useEffect(() => {

    function setExpressionUrlOnUriListChange() { //transform the array of uri in a url (string)
      const uris = uriList.map(
        operation => {
          let expression = ''
  
          if (operation.name) {
            expression = operation.name + '/'
            if (operation.value)
              expression = `${expression}${operation.value}/`
          }
          return expression
        }
      ).join('')
  
      setExpressionUrl(optionsLayer.iri + '/' + uris)
      return optionsLayer.iri + uris
    }

    setExpressionUrlOnUriListChange()
  },[uriList,optionsLayer.iri])

  function hasOperator (uris) {
    return uris.filter(uri => uri.value.includes('{operator}'))
  }

  function includeOperator(value) {
    if (hasOperator(uriList).length) {
      const uri = uriList.find(item => item.value.includes('{operator}'))
      const uriIndex = uriList.indexOf(uri)
      const newValue = uri.value.replace(/{operator}/, value)
      let temporaryUriList = uriList.slice(0)
      temporaryUriList[uriIndex].value = newValue
      setUriList(temporaryUriList)

    } else {
      let temporaryUriList = uriList.slice(0)
      temporaryUriList.push({value})
      setUriList(temporaryUriList)
    }
  }

  function handleChangeOnStartValue(event) {
    let value = parseInt(event.target.value)
    if(value <= 0){
      setAttributeSearchRange(attributeSearchRange)
    } else {
      let {amount} = attributeSearchRange
      setAttributeSearchRange({start: value, amount})
    }
  }

  function handleChangeOnAmountValue(event) {
    let value = parseInt(event.target.value)
    if(value <= 0){
      setAttributeSearchRange(attributeSearchRange)
    } else {
      let {start} = attributeSearchRange
      setAttributeSearchRange({start, amount: value})
    }
  }

  async function showAttribute(attribute) {

    let url = `${optionsLayer.iri}/projection/${attribute}/offset-limit/${attributeSearchRange.start}&${attributeSearchRange.amount}`
    const response = await request(url)
    let parsedResponse = response.data.filter(e => e[attribute] !== null ).map(e => e[attribute])

    if(parsedResponse.length === 0)
      parsedResponse = ['Nenhuma amostra encontrada']

    setAttributeSamples(parsedResponse)
    
  }

  function includeAttribute(attribute){
    const uri = uriList.find(item => item.value.includes('{attribute}'))
    const uriIndex = uriList.indexOf(uri)
    const newValue = uri.value.replace(/{attribute}/, attribute)
    let temporaryUriList = uriList.slice(0)
    temporaryUriList[uriIndex].value = newValue
    setUriList(temporaryUriList)
  }

  function includeValue(value){
    const uri = uriList.find(item => item.value.includes('{value}'))
    const uriIndex = uriList.indexOf(uri)
    const newValue = uri.value.replace(/{value}/, value)
    let temporaryUriList = uriList.slice(0)
    temporaryUriList[uriIndex].value = newValue
    setUriList(temporaryUriList)
  }

  function filterExpects(expects) {
    if (expects) {
      return expects.map(
        expect => {
          if (expect.parameter.includes('schema'))
            return expect.parameter.split('/').reverse()[0]
          else
            return expect.parameter.split('#').reverse()[0]
        }
      )
    }
  }

  function handleAddOperation (operation) {
    let operationName = operation['hydra:operation']
    let expects = filterExpects(operation['hydra:expects'])
    let temporaryUriList = uriList.slice(0) // using slice to make a copy of the array

    if (expects.length === 0) {
      temporaryUriList.push({ name: operationName })
      setUriList(temporaryUriList)
      return

    } else if (operationName === 'collect') {
      expects = '{attribute}&{operation}'

    } else if (expects.includes('expression')) {
      expects = "{attribute}/{operator}/{value}"

    } else {
      let expressions = expects.map(e => `{${e}}`)
      expects = expressions.join('&')
    }

    temporaryUriList.push({ name: operationName, value: expects })
    setUriList(temporaryUriList)
  }

  function handleRemoveOperation (filter) {
    const filterIndex = uriList.indexOf(filter)
    let temporaryUriList = uriList.slice(0)
    temporaryUriList.splice(filterIndex, 1)
    setUriList(temporaryUriList)
  }

  function handleClearUri(){
    setUriList([])
  }
  
  function expressionUrlHandleChange(e) {
    setExpressionUrl(e.target.value)
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
                    { expressionUrl.includes('{attribute}') ?
                      <Tooltip title="Adicionar atributo na expressão">
                        <GreenButton size="small" color="primary" aria-label="add" className={classes.margin} onClick={() => includeAttribute(property["hydra:property"])}>
                          <AddIcon />
                        </GreenButton>
                      </Tooltip>
                    : 
                      <Tooltip title="Buscar amostras">
                        <Fab size="small" color="primary" aria-label="add" className={classes.margin} onClick={() => showAttribute(property["hydra:property"])}>
                          <SearchIcon />
                        </Fab>
                      </Tooltip>
                    }
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <TextField
                label="Apartir de: "
                value={attributeSearchRange.start}
                onChange={handleChangeOnStartValue}
                type="number"
                margin="normal"
                variant="filled"
              />
              <TextField
                label="Quantidade: "
                value={attributeSearchRange.amount}
                onChange={handleChangeOnAmountValue}
                type="number"
                margin="normal"
                variant="filled"
              />
              <List dense={false}>
              { attributeSamples.map( (item, index) => (
                <ListItem button key={index}>
                  <ListItemText primary={ attributeSearchRange.start + index + ' - ' + item }/>
                  <ListItemSecondaryAction>
                    { expressionUrl.includes('{value}') ?
                      <Tooltip title="Adicionar valor na expressão">
                        <GreenButton size="small" color="primary" aria-label="add" className={classes.margin} onClick={() => includeValue(item)}>
                          <AddIcon />
                        </GreenButton>
                      </Tooltip>
                    : 
                      <div></div>
                    }
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
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
                    <Tooltip title="Adicionar operação">
                      <Fab size="small" color="primary" aria-label="add" className={classes.margin} onClick={() => handleAddOperation(operation)}>
                        <SamountIcon />
                      </Fab>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper}> 
              <Typography variant="h6" gutterBottom> Operações Selecionadas  </Typography>
              <List dense={false}>
              { uriList.map( (SeletedOperation, index) => (
                <ListItem button key={index}>
                
                  <ListItemText primary={SeletedOperation.name} />

                  <ListItemSecondaryAction>
                    <Tooltip title="Remover operação">
                      <RedButton size="small" color="primary" aria-label="remove" className={classes.margin} onClick={() => handleRemoveOperation(SeletedOperation)}>
                        <ClearIcon />
                      </RedButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              </List>
            </Paper>
          </Grid>

        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            { expressionUrl.includes('{operator}') ? 
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
            :
              <div></div>
            }
            
          </Grid>

          <Grid item xs={12} className={classes.urlContainer}>
            <TextField
              value={expressionUrl}
              label="Expressão de filtragem"
              onChange={expressionUrlHandleChange}
              margin="normal"
              variant="outlined"
              fullWidth
            /> 
            <Button variant="contained" className={classes.button} color="primary" onClick={handleClearUri}> Limpar </Button>
            <Button variant="contained" className={classes.button} color="primary" onClick={(e) => console.log(e)}> Buscar </Button>
          </Grid>         
        </Grid>
      </Grid>
    </div>
  );
}