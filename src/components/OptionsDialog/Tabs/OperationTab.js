import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Tooltip from '@material-ui/core/Tooltip';

import LaunchIcon from '@material-ui/icons/Launch';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  parameterDescripition:{
    textAlign: "center",
  },
}));

export default function InteractiveList(props) {
  const classes = useStyles();
  const { optionsLayer } = props
  const [ supportedOperations, setSupportedOperations ] = useState([])
  const [ expanded, setExpanded ] = React.useState(false);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
    
  function parametersMap (parameterList) {
    //console.log(parameterList)
    if (parameterList.length === 0){
      return ''
    } else {
     return parameterList.map( (item, index) => (
      <Tooltip title="Abrir definição em nova aba" key={index}>
        <Button variant="outlined" color="primary" className={classes.button} href={item.parameter} target="new"> 
          {transformDefinitionUrlInName(item.parameter)}
          <LaunchIcon/>
        </Button>
      </Tooltip>
      ));
    }
  
  }

  useEffect(() => {
    if(optionsLayer.jsonOptions){
      setSupportedOperations(optionsLayer.supportedOperations)
    }
  }, [optionsLayer])

  function transformDefinitionUrlInName(expects) {
    if (expects.includes('schema'))
      return expects.split('/').reverse()[0]
    else
      return expects.split('#').reverse()[0]
  }

  return (
    <div>
      { supportedOperations.map( ( operation , index ) => (
      <ExpansionPanel key={index} square expanded={expanded === index} onChange={handleChange(index)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{operation["hydra:operation"]}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography component={'div'} className={classes.parameterDescripition}>
            
            <strong>Esta é a descrição da operação, alterar futuramente  </strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.

            <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row"> Método HTTP: </TableCell>
                    <TableCell align="right">{ operation["hydra:method"] }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"> Semantica: </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Abrir definição em nova aba">
                        <a href={ operation["@id"]} target="new"> 
                          {operation["@id"]}
                        </a>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"> Retorno da operação: </TableCell>
                    <TableCell align="right">
                      
                      <Tooltip title="Abrir definição em nova aba">
                        <Button variant="outlined" color="primary" className={classes.button} href={ operation["hydra:returns"]} target="new"> 
                          {transformDefinitionUrlInName(operation["hydra:returns"])}
                          <LaunchIcon/>
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"> Parametros: </TableCell>
                      <TableCell align="right" >
                       { parametersMap(operation['hydra:expects'])}
                      </TableCell> 
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row"> Exemplo: </TableCell>
                    <TableCell align="right"> BUSCAR DA API  </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </Paper>
          </Typography>
          
        </ExpansionPanelDetails>
      </ExpansionPanel>
      ))}
  </div>
  );
}