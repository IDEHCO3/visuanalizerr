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
import ListLayer from './ListLayer';
import {request} from './../utils/requests';

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

function BaseWMS(props) {
  const classes = props;
  const [select_url] = useState('');
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
        props.addLayerFromWMS(an_item)
      }
      
    };

    return (
      <div>
        <FormControl className={classes.formControl}>
          <Typography variant="h6">Urls de entrada </Typography>
          <NativeSelect value={select_url} onChange={selectHandleChange} >
            <option value=""/>
            
            <option value="http://www.geoservicos.inde.gov.br/geoserver/BNDES/wms">Banco Nacional de Desenvolvimento Econômico e Social-BNDES</option>
            <option value="https://geoservicos.ibge.gov.br/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities">Instituto Brasileiro de Geografia e Estatística-IBGE</option>
            <option value="http://ggt-des.ibge.gov.br/geoserver-ccar/ows?service=wms&version=1.3.0&request=GetCapabilities">DES/IBGE/CCAR</option>
            
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
              <IconButton className={classes.iconButton} aria-label="Search" onClick={iconHandleClickHighlightOff} bottom="true" >
                <HighlightOffIcon  color="error"/>
              </IconButton>
              </Tooltip >
            </Grid>
          </Grid>
        </FormControl>
        <ListLayer items={items} selectedItemName={selectedItemName}/>
      </div>
  );
}

export default withStyles(styles)(BaseWMS);