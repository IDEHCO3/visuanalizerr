import React, { useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Button, NativeSelect, Tooltip } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {request} from './../utils/requests';
import {GeoHyperLayerResource, OptionsLayer} from './../utils/LayerResource';
import ListLayer from './ListLayer';
import { width } from '@material-ui/system';

const useStyles = makeStyles( theme => ({
  buttonGroup: {
    marginTop: "30px",
  },
  textField:{
    width: "100%",
  },
 }));

export default function BaseHyperResource(props) {
  const classes = useStyles();
  const [select_url, setSelect_url ] = useState('');
  const [text_url, setText_url] =  useState('');
  const [items, setItems] = useState([]);
  
  function isEntryPoint(headers) {
    let id = headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())
    return id !== -1
  };
  
  function selectedItemName(item_name, isImage) {
    
    let an_item = null
    items.forEach((item, index) => {
      //console.log("nome do array: ",item.name, "nome passado:", item_name) 
      if (item.name === item_name){
        return an_item = item;
      }
          
    })
    if (an_item) {
      props.addLayerFromHyperResource(new GeoHyperLayerResource(null, an_item.url, an_item.name, null, null ,isImage ))
    }
  };

  function selectHandleChange(e) {
    textHandleChange(e)
  };
  function textHandleChange(e) {
    
    setText_url(e.target.value)
  };
  async function iconHandleClickSearch(e) {
    if (!text_url || text_url.trim() === '')
      return 
    
    const result = await request(text_url);
    let arr = [];
    if (isEntryPoint(result.headers)) { 
      let json_entry_point = result.data;
      // Criando array de camadas
      Object.entries(json_entry_point).forEach( ([key, value]) => { arr.push({name: key, url: value, isImage: false}); });  
          
    } else {
       let url_entrada = text_url
       arr.push({name: url_entrada, url: url_entrada})
    }
    setItems(arr);
  }
  function iconHandleClickHighlightOff() {
    setItems([]);
  }
  return (
    <div>
      <Typography variant="h6">Urls de entrada </Typography>
      <NativeSelect value={select_url} onChange={selectHandleChange} >
        <option value=""/>
        <option value="http://ggt-des.ibge.gov.br/api/bcim/">Base Cartográfica Contínua do Brasil ao Milionésimo-IBGE</option>
        <option value="http://ggt-des.ibge.gov.br/api/osm-2017-06/">Base vetorial do OpenStreetMap de 2017-06</option>
        <option value="http://ggt-des.ibge.gov.br/api/munic-2015/">Munic 2015</option>
        <option value="http://ggt-des.ibge.gov.br/api/ibge/geografia/atlas/demografico/2010/">Atlas Demográfico 2010</option>
        <option value="http://ggt-des.ibge.gov.br/api/ibge/recursos-naturais/cobertura-uso-terra/">CREN - Cobertura de terra</option>
      </NativeSelect>
      <Grid container spacing={2} >
        <Grid item xs={8} >
          <TextField label="Url" className={classes.textField} value={text_url} onChange={textHandleChange} margin="normal"/>
        </Grid>
        <Grid item xs={4} >
          <ButtonGroup variant="contained" className={classes.buttonGroup}  color="default">
            <Tooltip title="Pesquisar camadas" aria-label="Add">
              <Button color="primary" aria-label="Search" onClick={iconHandleClickSearch} >
                <SearchIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Remover camadas" aria-label="Add">
              <Button color="primary" aria-label="Limpar" onClick={iconHandleClickHighlightOff}> 
                <HighlightOffIcon  color="error" /> 
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      </Grid>
      <ListLayer items={items} selectedItemName={selectedItemName}/>
    </div>
  );
}