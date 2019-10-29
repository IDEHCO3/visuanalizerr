import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper } from '@material-ui/core';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { InputBase, Divider, Tooltip } from '@material-ui/core'; // Text input components
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { Button, IconButton, Radio, Checkbox } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

//import { green } from '@material-ui/core/colors';
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
  stepControlerButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'flex-end',
  },
  centerContent: {
    justifyContent: 'center',
  }
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
  const classes = useStyles()
  const { layer, isOpen, indexOfLayer } = props;
  const steps = getSteps();
  const [ activeStep, setActiveStep ] = React.useState(0);

  const [ supportedProperties, setSuportedProperties ] = useState([])
  const [ selectedLayerProperty, setSelectedLayerProperty ] = useState('')

  const [ apiUrl, setApiUrl ] = useState('')
  const [ urlIsValid, setUrlIsValid ] = useState(false)
  const [ apiList, setApiList ] = useState([
    {name: 'Munic 2015', url: 'http://ggt-des.ibge.gov.br/api/munic-2015/', resources: []},
    {name: 'PIB Municipio', url: 'http://ggt-des.ibge.gov.br/api/pib-municipio/', resources: []},
    {name: 'Dados estatisticos Municipio', url: 'http://ggt-des.ibge.gov.br/api/estatistica-municipio/', resources: []},
    {name: 'Analise GEO', url: 'http://ggt-des.ibge.gov.br/api/analise-geo/', resources: []},
    {name: 'Pesquisa Esporte', url: 'http://ggt-des.ibge.gov.br/api/esporte-list/', resources: []},
  ]) // a array with objects with apis features 

  const [ resourcePropertiesList, setResourcePropertiesList ] = useState([])
  const [ selectedResourceProperty, setSelectedResourceProperty ] = useState('')

  const [ propertiesToAddOnLayer, setPropertiesToAddOnLayer ] = useState([])

  useEffect(() => {
    if(layer.jsonOptions){
      setSuportedProperties(layer.supportedProperties)
    }
  }, [layer])

  const handleNextStep = () => {
    if(activeStep === steps.length - 1 ){
      console.log("Juntar dados")
      handleAddProperties()
      //handleClose()
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBackStep = () => { 
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  function handleClose() {
    props.close()
  }

  function HandleChangeOnApiUrl(e) {
    setApiUrl(e.target.value)
  }

  async function checkEntryPoint(URL) { // verify if a url of a Hyper API is a entry point

    const { headers } = await request(URL, axios.head);
    let id = headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())

    if (id !== -1)
      return true
    else
      return false

  }

  async function handleClickSearchAPI(URL) {
    setApiUrl(URL)

    if (!URL || URL.trim() === '')
      return 

    if (await checkEntryPoint(URL)) {
      setUrlIsValid(false)
      const result = await request(URL);
      let json_entry_point = result.data;
      let resourcesList = []
      Object.entries(json_entry_point).forEach( ([key, value]) => { resourcesList.push({name: key, url: value, resources: []}) })// Criando array de recursos

      let temporaryApiList = apiList.slice(0)
      let index = temporaryApiList.findIndex((item) => item.url === URL)
      temporaryApiList[index].resources = resourcesList
      setApiList(temporaryApiList)

    } else {
      setUrlIsValid(true)
      const response = await request(URL, axios.options)
      const json = response.data
      let an_optionsResource = new OptionsLayer(json, URL)
      setResourcePropertiesList(an_optionsResource.jsonOptions['hydra:supportedProperties'])
    }
    
  }

  function handleClickOnCheckBox(property) {

    let temporaryPropertyList = propertiesToAddOnLayer.slice(0)
    
    if (temporaryPropertyList.includes(property)){
      let index = temporaryPropertyList.findIndex(item => item === property)
      temporaryPropertyList.splice(index , 1)
    } else {
      temporaryPropertyList.push(property)
    }
    setPropertiesToAddOnLayer(temporaryPropertyList)
  }

  function nextStepIsDisable(){
    if (activeStep === 0 && selectedLayerProperty === '')
      return true
    else if(activeStep === 1 && urlIsValid === false)
      return true
    else if(activeStep === 2 && selectedResourceProperty === '')
      return true
    else if(activeStep === 3 && propertiesToAddOnLayer.length < 1)
      return true
    else
      return false
  }

  async function handleAddProperties() {
    
    let featureList = props.getFeaturesFromVectorLayerOnMap(indexOfLayer)
    const propertiesOfFeaturesOnLayer = props.getPropertiesFromFeatures(featureList)
    const urlLengthLimit = 1024  
    let url = ''
    console.log(propertiesOfFeaturesOnLayer)
    for( let i = 0; i < propertiesOfFeaturesOnLayer.length; i++ ){
      if( url.length === 0 ){
        url = `${apiUrl}/filter/${selectedResourceProperty}/in/${propertiesOfFeaturesOnLayer[i][selectedLayerProperty]}`
      } else if ( url.length > 0 && (url + `/${propertiesOfFeaturesOnLayer[i][selectedLayerProperty]}`).length <= urlLengthLimit ) {
        url+= `&${propertiesOfFeaturesOnLayer[i][selectedLayerProperty]}` 
      } else if ( (url + `/${propertiesOfFeaturesOnLayer[i][selectedLayerProperty]}`).length > urlLengthLimit ) {
        
        let response = await request(url)
        
        response.data.forEach( apiPropertyObject => {
          Object.keys(apiPropertyObject).forEach( propertyKey => {
            if (propertiesToAddOnLayer.includes(propertyKey)) {
              const IndexOfItem = propertiesOfFeaturesOnLayer.findIndex( propertyObject => propertyObject[selectedLayerProperty] === apiPropertyObject[selectedResourceProperty])
              let newProperty = {[propertyKey]: apiPropertyObject[propertyKey]}
              console.log(newProperty)
              props.addPropertiesInAFeature(featureList[IndexOfItem], newProperty)
              console.log(propertiesOfFeaturesOnLayer[IndexOfItem])
            }
          })
        })
        
        
                
        url = `${apiUrl}/filter/${selectedResourceProperty}/in/${propertiesOfFeaturesOnLayer[i][selectedLayerProperty]}`
      }
    }
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
                        onChange={(event) => setSelectedLayerProperty(event.target.value)}
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
              <Grid container spacing={1} >
                
                <Grid container className={classes.centerContent} item xs={12} spacing={3}>

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
                          <IconButton className={classes.iconButton} aria-label="Buscar" onClick={() => handleClickSearchAPI(apiUrl)}>
                            <SearchIcon color='primary'/>
                          </IconButton>  
                        </Tooltip>
                        <Divider className={classes.divider} orientation="vertical" />
                        <Tooltip title="Recurso valido" aria-label="Add">
                          <IconButton className={classes.iconButton} aria-label="directions">
                            <CheckCircleIcon color={urlIsValid? "primary" : 'disabled'}/>
                          </IconButton>
                        </Tooltip> 
                
                      </Paper> 
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Paper>
                      <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultExpanded={['1']}
                      >
                        <TreeItem nodeId="1" label="Serviços mais utilizados">
                          { apiList.map( (item, index) => (
                            <TreeItem 
                              key={index} 
                              nodeId={item.url} 
                              label={item.name}
                              onClick={() => {handleClickSearchAPI(item.url)}} 
                            >
                              { item.resources.length>0 ? 
                                  item.resources.map((A_resource, indexR) => (
                                    <TreeItem 
                                      key={indexR}
                                      nodeId={A_resource.url} 
                                      label={A_resource.name}
                                      onClick={ () => {handleClickSearchAPI(A_resource.url)} } 
                                    /> 
                                  ))
                                  : 
                                  <div/>
                              }
                            </TreeItem>
                          ))}
                        </TreeItem>
                      </TreeView>
                    </Paper>
                  </Grid>
                  
                </Grid>
              </Grid>            
            </TabPanel>

            <TabPanel value={activeStep} index={2}>                                                 {/* THIRD STEP */}
              <Paper className={classes.LayerPropertyesContainer}> 
                <List dense={false}>
                { resourcePropertiesList.map( (property, index) => (
                  <ListItem button key={index}>

                    <ListItemText primary={property["hydra:property"]} />

                    <ListItemSecondaryAction>
                      <Radio
                        checked={selectedResourceProperty === property["hydra:property"]}
                        onChange={(event) => setSelectedResourceProperty(event.target.value)}
                        value={property["hydra:property"]}
                      />                       
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                </List>
              </Paper>
            </TabPanel>

            <TabPanel value={activeStep} index={3}>                                                 {/* FOURTH STEP */}
              <Paper className={classes.LayerPropertyesContainer}> 
                <List dense={false}>
                { resourcePropertiesList.map( (property, index) => (
                  <ListItem button key={index}>

                    <ListItemText primary={property["hydra:property"]} />

                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={propertiesToAddOnLayer.includes(property["hydra:property"])}
                        onChange={() => handleClickOnCheckBox(property["hydra:property"])}
                      />                     
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                </List>
              </Paper>
            </TabPanel>

            
          </div>
        </div>
        <div className={classes.stepControlerButtons}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBackStep}
            className={classes.backButton}
          >
            Voltar
          </Button>
          <Button variant="contained" color="primary" disabled={nextStepIsDisable()} onClick={handleNextStep}>
            {activeStep === steps.length - 1 ? 'Juntar dados' : 'Proximo'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

OptionsDialog.propTypes = {
  layer: PropTypes.any.isRequired,
};