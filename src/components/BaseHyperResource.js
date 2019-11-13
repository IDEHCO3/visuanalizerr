import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { request, requestOptions } from './../utils/requests';
import { GeoHyperLayerResource } from './../utils/LayerResource';
import ListLayer from './ListLayer';

import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'; //Select Components
import { Paper, InputBase, Divider, IconButton, Tooltip } from '@material-ui/core'; // Text input components

const useStyles = makeStyles( theme => ({
  buttonGroup: {
    marginTop: "30px",
  },
  textField:{
    width: "100%",
  },
  root: {
    marginTop: '10px',
    marginBottom: '10px',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
 }));

export default function BaseHyperResource(props) {
  const classes = useStyles();
  const [text_url, setText_url] =  useState(''); 
  const [layersInAwaiting, setLayersInAwaiting] = useState([]);
  
  function isEntryPoint(resposeObject) {
    if(resposeObject.headers.link){
      let id = resposeObject.headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())
      return id !== -1
    } else if (resposeObject.data["@type"]) { // options body
      return resposeObject.data["@type"].includes("entrypoint")
    } else {
      return false
    }
  };
  
  function selectedItemName(item_name, isImage) {
    let an_item = null
    layersInAwaiting.forEach( item => {
      //console.log("nome do array: ",item.name, "nome passado:", item_name) 
      if (item.name === item_name){
        return an_item = item;
      }  
    })

    if (an_item) {
      props.addLayerFromHyperResource(new GeoHyperLayerResource(null, an_item.url, an_item.name, null, null, isImage ))
    }
  };

  const selectHandleChange = event => {
    setText_url(event.target.value);
  };

  function textHandleChange(e) {
    setText_url(e.target.value)
  };

  async function iconHandleClickSearch() {
    if (!text_url || text_url.trim() === '')
      return 
    
    const optionsResponse = await requestOptions(text_url)
    let arr = []

    if (isEntryPoint(optionsResponse)) {
      const result = await request(text_url);
      let json_entry_point = result.data;
      // Criando array de camadas
      Object.entries(json_entry_point).forEach( ([key, value]) => { arr.push({name: key, url: value, isImage: false}); });  
    } else {
      let url_entrada = text_url
      arr.push({name: url_entrada, url: url_entrada})
    }
    setLayersInAwaiting(arr);
  }

  function iconHandleClickHighlightOff() {
    setLayersInAwaiting([]);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Urls de entrada </Typography>
      </Grid>
      <Grid item xs={12}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">Serviços mais utilizados</InputLabel>
        <Select
          value={text_url}
          onChange={selectHandleChange}
          name='Api'
          autoWidth
        >
          <MenuItem value={""}></MenuItem>
          <MenuItem value={"http://ggt-des.ibge.gov.br/api/bcim/"}>Base Cartográfica Contínua do Brasil ao Milionésimo-IBGE</MenuItem>
          <MenuItem value={"http://ggt-des.ibge.gov.br/api/osm-2017-06/"}>Base vetorial do OpenStreetMap de 2017-06</MenuItem>
          <MenuItem value={"http://ggt-des.ibge.gov.br/api/ibge/geografia/atlas/demografico/2010/"}>Atlas Demográfico 2010</MenuItem>
          <MenuItem value={"http://ggt-des.ibge.gov.br/api/ibge/recursos-naturais/cobertura-uso-terra/"}>CREN - Cobertura de terra</MenuItem>
        </Select>
      </FormControl>
      </Grid>

      <Grid item xs={12}>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Insira a URL da camada"
          inputProps={{ 'aria-label': 'Insira a URL da camada' }}
          value={text_url} 
          onChange={textHandleChange}
        />
        <Tooltip title="Pesquisar camadas" aria-label="Add">
          <IconButton className={classes.iconButton} aria-label="Buscar" onClick={iconHandleClickSearch}>
            <SearchIcon />
          </IconButton>  
        </Tooltip>
        <Divider className={classes.divider} orientation="vertical" />
        <Tooltip title="Remover camadas" aria-label="Add">
          <IconButton className={classes.iconButton} aria-label="directions" onClick={iconHandleClickHighlightOff}>
            <HighlightOffIcon  color="error" /> 
          </IconButton>
        </Tooltip>      
      </Paper>
      </Grid>
      <Grid item xs={12}>
      <ListLayer 
        items={layersInAwaiting} 
        selectedItemName={selectedItemName} 
        addLayerFromHyperResource={props.addLayerFromHyperResource}
        type={'HypeResource'}
      />
      </Grid>
    </Grid>
  );
}