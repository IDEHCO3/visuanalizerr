import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Box, Paper } from '@material-ui/core';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'; //Select Components
import { InputBase, Divider, Tooltip } from '@material-ui/core'; // Text input components
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { Button, Radio  } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import axios from 'axios';
import { request } from '../../utils/requests';
import { OptionsLayer } from '../../utils/LayerResource';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
    flexGrow: 1,
  },
  stepper:{
    width: '100%',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  LayerPropertyesContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 260,
    overflow: 'auto',
  },
  instructions: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  inputUrlContainer: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    height: 28,
    margin: 4,
  },
  formControl: {
    minWidth: "95%",
  },
  stepControlerButtons: {
    textAlign: 'center',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function getSteps() {
  return ['Escolher atributo da camada',
  'Escolher serviço para junção', 
  'Escolher atributo do serviço',
  'Escolher atributos para serem adicionados na camada'
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Escolha um atributo da camada para junção';
    case 1:
      return 'Escolha o serviço com recurso de dados não espaciais para junção';
    case 2:
      return 'Escolha um atributo do serviço para junção, lembrando que os valores desse atributo devem ser iguais aos da camada';
    case 3:
      return 'Escolha os novos atributos que serão adicionados na camada';
    default:
      return 'Uknown stepIndex';
  }
}

export default function OptionsDialog(props) {
  const classes = useStyles();
  const { layer, isOpen } = props;
  const steps = getSteps();
  const [ activeStep, setActiveStep ] = React.useState(0);

  const [ supportedProperties, setSuportedProperties ] = useState([])
  const [ selectedLayerProperty, setSelectedLayerProperty ] = useState('');

  const [ apiUrl, setApiUrl ] = useState('')
  const [ apiResourceList, setApiResourceList ] = useState([])

  useEffect(() => {
    if(layer.jsonOptions){
      setSuportedProperties(layer.supportedProperties)
    }
  }, [layer])

  const handleNextStep = () => {
    if(activeStep === steps.length - 1 ){
      console.log("Jutar dados")
    } else{
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBackStep = () => { 
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  function handleClose() {
    props.close()
  }

  const handleChangeInSelectedLayerProperty = event => {
    setSelectedLayerProperty(event.target.value);
  }

  const selectApiHandleChange = event => {
    setApiUrl(event.target.value)
  }

  function HandleChangeOnApiUrl(e) {
    setApiUrl(e.target.value)
  }

  function isEntryPoint(headers) {
    let id = headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())
    return id !== -1
  }

  async function iconHandleClickSearch() {
    if (!apiUrl || apiUrl.trim() === '')
      return 

    const headResponse = await request(apiUrl, axios.head);
    let arr = [];

    if (isEntryPoint(headResponse.headers)) {
      const result = await request(apiUrl);
      let json_entry_point = result.data;
      // Criando array de recursos
      Object.entries(json_entry_point).forEach( ([key, value]) => { arr.push({name: key, url: value}); });  
          
    } else {
      const response = await request(apiUrl, axios.options)
      const json = response.data
      let an_optionsLayer = new OptionsLayer(json, apiUrl)
      console.log('options')
      console.log(an_optionsLayer)
    }
    console.log(arr)
    setApiResourceList(arr);
  }

  function iconHandleClickHighlightOff() {
    setApiResourceList([]);
  }

  return (
    <div>
      <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Junção de dados não espaciais
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.stepper}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            <Typography variant="h6" gutterBottom className={classes.instructions}>{getStepContent(activeStep)}</Typography>

            <TabPanel value={activeStep} index={0}>                                                 {/* FIRST STEP */}
              <Paper className={classes.LayerPropertyesContainer}> 
                <List dense={false}>
                { supportedProperties.map( (property, index) => (
                  <ListItem button key={index}>

                    <ListItemText primary={property["hydra:property"]} />

                    <ListItemSecondaryAction>
                      <Radio
                        checked={selectedLayerProperty === property["hydra:property"]}
                        onChange={handleChangeInSelectedLayerProperty}
                        value={property["hydra:property"]}
                        name="radio-button-demo"
                      />                       
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                </List>
              </Paper>
            </TabPanel>

            <TabPanel value={activeStep} index={1}>                                                 {/* SECOND STEP */}
              <Grid container spacing={1}>
                
                <Grid container item xs={12} spacing={3}>
            
                  <Grid item xs={4}>
                    <Paper> 
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="age-simple">Serviços mais utilizados</InputLabel>
                      <Select
                        value={apiUrl}
                        onChange={selectApiHandleChange}
                        name='Api'
                        fullWidth
                      >
                        <MenuItem value={""}></MenuItem>
                        <MenuItem value={"http://ggt-des.ibge.gov.br/api/munic-2015/"}> Munic 2015 </MenuItem>
                        <MenuItem value={"http://ggt-des.ibge.gov.br/api/pib-municipio/"}> PIB Municipio </MenuItem>
                        <MenuItem value={"http://ggt-des.ibge.gov.br/api/estatistica-municipio/"}> Dados estatisticos Municipio </MenuItem>
                        <MenuItem value={"http://ggt-des.ibge.gov.br/api/analise-geo/"}> Analise GEO </MenuItem>
                        <MenuItem value={"http://ggt-des.ibge.gov.br/api/esporte-list/"}> Pesquisa Esporte </MenuItem>
                      </Select>
                    </FormControl>
                    </Paper>
                  </Grid>

                  <Grid item xs={8}>
                      <Paper className={classes.inputUrlContainer}>
                        <InputBase
                          className={classes.input}
                          placeholder="Insira a URL do serviço/recurso"
                          inputProps={{ 'aria-label': 'Insira a URL do serviço/recurso' }}
                          value={apiUrl} 
                          onChange={HandleChangeOnApiUrl}
                        />
                        <Tooltip title="Buscar serviço" aria-label="Add">
                          <IconButton className={classes.iconButton} aria-label="Buscar" onClick={iconHandleClickSearch}>
                            <SearchIcon color='primary'/>
                          </IconButton>  
                        </Tooltip>
                        <Divider className={classes.divider} orientation="vertical" />
                        <Tooltip title="Remover API e Recursos" aria-label="Add">
                          <IconButton className={classes.iconButton} aria-label="directions" onClick={iconHandleClickHighlightOff}>
                            <CheckCircleIcon/>
                          </IconButton>
                        </Tooltip>      
                      </Paper> 
                  </Grid>


                  <Grid container item xs={12} spacing={3}>
                    <Grid item xs={12}>
                      <Paper>
                        <TreeView
                          className={classes.root}
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpandIcon={<ChevronRightIcon />}
                        >
                          <TreeItem nodeId="1" label="Applications">
                            <TreeItem nodeId="2" label="Calendar" />
                            <TreeItem nodeId="3" label="Chrome" />
                            <TreeItem nodeId="4" label="Webstorm" />
                          </TreeItem>
                          <TreeItem nodeId="5" label="Documents">
                            <TreeItem nodeId="6" label="Material-UI">
                              <TreeItem nodeId="7" label="src">
                                <TreeItem nodeId="8" label="index.js" />
                                <TreeItem nodeId="9" label="tree-view.js" />
                              </TreeItem>
                            </TreeItem>
                          </TreeItem>
                        </TreeView>
                      </Paper>
                    </Grid>
                  </Grid>

                  
                </Grid>
              </Grid>            
            </TabPanel>

            <TabPanel value={activeStep} index={2}>                                                 {/* THIRD STEP */}
              CCC
            </TabPanel>

            <TabPanel value={activeStep} index={3}>                                                 {/* FOURTH STEP */}
              CCC
            </TabPanel>

            <div className={classes.stepControlerButtons}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBackStep}
                className={classes.backButton}
              >
                Voltar
              </Button>
              <Button variant="contained" color="primary" onClick={handleNextStep}>
                {activeStep === steps.length - 1 ? 'Juntar dados' : 'Proximo'}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

OptionsDialog.propTypes = {
  layer: PropTypes.any.isRequired,
};