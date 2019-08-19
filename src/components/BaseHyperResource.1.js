import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import {request} from './../utils/requests';
import {GeoHyperLayerResource, OptionsLayer} from './../utils/LayerResource';
import OptionsHyperResourceDialog from './OptionsHyperResourceDialog'
const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },  
    formControl: {
        margin: 10,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: 10,
    },
    textField: {
      marginLeft: 10,
      marginRight: 10,
      width: 200,
    },
  
 });

function BaseHyperResource(props) {
  const classes = props;
  const [select_url,setSelect_url ] = useState('');
  const [text_url, setText_url] =  useState('');
  const [items, setItems] = useState([]);
  const [isOpen,setIsOpen ] = useState(false);
  const [optionsLayer, setOptionsLayer] = useState(null);

  function isEntryPoint(headers) {
    let id = headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())
    return id !== -1
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
      Object.entries(json_entry_point).forEach( ([key, value]) => { arr.push({name: key, url: value}); });  
          
    } else {
       let url_entrada = text_url
       arr.push({name: url_entrada, url: url_entrada})
    }
    setItems(arr);
  }
  function iconHandleClickHighlightOff() {
    setItems([]);
  }
  
  function switchHandleChange(event, is_ckecked) {
    
    let item_name = event.target.value
    let an_item = null
    event.target.disabled = true
    items.forEach((item, index) => {
        if (item.name === item_name)
          return an_item = item;
    })
    if (an_item) {
      props.addLayerFromHyperResource(new GeoHyperLayerResource(null, an_item.url, an_item.name ))
    }
  }
  async function iconHandleClickInfo(event, item) {
    
    setIsOpen(true)
    let response = await request(item.url, axios.options)
    let json = response.data
    console.log(json)
    let an_optionsLayer = new OptionsLayer(json[["hydra:supportedProperties"]],json[["hydra:supportedOperations"]],json[["@context"]], json[["hydra:iriTemplate"]], item.name, item.url)
    setOptionsLayer(an_optionsLayer )
    
  };
  function closeHyperResourceDialog() {
    setIsOpen(false)
  }
  

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Typography variant="h6">Urls de entrada </Typography>
        <NativeSelect value={select_url} onChange={selectHandleChange} >
          <option value=""/>
          <option value="http://ggt-des.ibge.gov.br/api/bcim/">Base Cartográfica Contínua do Brasil ao Milionésimo-IBGE</option>
          <option value="http://ggt-des.ibge.gov.br/api/osm-2017-06/">Base vetorial do OpenStreetMap de 2017-06</option>
        </NativeSelect>
        <Grid container spacing={8}>
          <Grid item xs={10}>
             <TextField  id="standard-name" label="Url"  className={classes.textField} value={text_url} onChange={textHandleChange} margin="normal"  fullWidth/>
          </Grid>
          <Grid item xs={1}>
              <Tooltip title="Pesquisar camadas" aria-label="Add">
                <IconButton className={classes.iconButton} aria-label="Search" onClick={iconHandleClickSearch} bottom="true" ><SearchIcon color="primary"/></IconButton>
              </Tooltip>  
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Remover camadas" aria-label="Add">
              <IconButton className={classes.iconButton} aria-label="Search" onClick={iconHandleClickHighlightOff} bottom="true" ><HighlightOffIcon  color="error" /></IconButton>
            </Tooltip >
          </Grid>
        </Grid>
      </FormControl>
      
      <List subheader={<ListSubheader>Url das camadas</ListSubheader>} className={classes.root}>
        { items.map( item => (
          <ListItem key={item.name}>
            <ListItemIcon>
              <IconButton className={classes.iconButton} color="primary" aria-label="Info" onClick={(e) =>iconHandleClickInfo(e, item)}><InfoIcon /></IconButton>
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi"  primary={item.name} />
            <ListItemSecondaryAction>
              <Switch edge="end"  onChange={switchHandleChange} value={item.name}  inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}  
      </List>
      <OptionsHyperResourceDialog closeHyperResourceDialog={closeHyperResourceDialog} optionsLayer={optionsLayer} items={props.items} isOpen={isOpen}   />
    </div>
  );
}

export default withStyles(styles)(BaseHyperResource);