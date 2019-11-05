import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Grid from '@material-ui/core/Grid';
import ListLayer from './ListLayer';
import {request} from './../utils/requests';

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


export default function BaseWMS(props) {

  const classes = useStyles();
  const [text_url, setText_url] =  useState('');
  const [items, setItems] = useState([]);

  function isWMSGetMap(url) {
      let parsed_url = url.replace(/\s+/g, '')
      return  parsed_url.toUpperCase().indexOf('request=GetMap'.toUpperCase()) !== -1
  };
    
  function selectHandleChange(e) {
    textHandleChange(e)
  };

  function textHandleChange(e) {
    setText_url(e.target.value)
  };

  async function iconHandleClickSearch(e) {
        
    let arr = []

      if (!text_url || text_url ==='')
        return
      if (isWMSGetMap(text_url)) {
        arr.push({name: text_url, url: text_url})
      }
      else {
        let response = await request(text_url)
        arr = props.facadeOL.getWMSCapabilityLayers(response.data)
      }
      
    setItems(arr);
  };

  function iconHandleClickHighlightOff() {
    setItems([]);
  };

  function selectedItemName(item_name) { 
    let an_item = null
    items.forEach((item, index) => {
        if (item.name === item_name)
          return an_item = item;
    })
    if (an_item) {
      console.log(an_item)
      props.addLayerFromWMS(an_item)
    }
  };

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
          <MenuItem value={"https://geoservicos.ibge.gov.br/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities"}>
            Instituto Brasileiro de Geografia e Estatística-IBGE
          </MenuItem>
          <MenuItem value={"https://geoservicos.inde.gov.br/geoserver/BNDES/wms/?service=wms&version=1.3.0&request=GetCapabilities"}>
            Banco Nacional de Desenvolvimento Econômico e Social-BNDES
          </MenuItem>
          <MenuItem value={"http://ggt-des.ibge.gov.br/geoserver-ccar/ows?service=wms&version=1.3.0&request=GetCapabilities"}>
            DES/IBGE/CCAR
          </MenuItem>
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
          items={items} 
          selectedItemName={selectedItemName}
          type={"WMS"}
        />
      </Grid>
    </Grid>
  )
}