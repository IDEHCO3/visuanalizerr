import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelLayer  from './ExpansionPanelLayer';
import {request} from './../utils/requests';

const styles = {
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: 8,
      marginRight: 8,
      display: 'inline-block',
      flex: 3,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4,
    },
  };

 /*function ExpansionPanelLayer(props) {
   
  <List >
  { items.map(item => (
    <ListItem key={item.key}>
      <ListItemText primary={item.value}  /> 
    </ListItem>
  ))}
  
</List>
return (
  <div>
 
  </div>
)
 };
 */
function HyperResourceDialog(props) {
    const { classes } = props;
    const [urlDeEntrada, setUrlDeEntrada] = useState('');
    const [items, setItems] = useState([]);

    function handleClose() {
        setUrlDeEntrada('')
        props.closeHyperResourceDialog()
        setItems([])
    };

    function closeHyperResourceDialog(event) {
      console.log(props.optionsLayer)
      props.closeHyperResourceDialog();
    };

    function handleChange() {};
    function urlChangeInputBase(event) {
        setUrlDeEntrada(event.target.value);
    };
    
    function isEntryPoint(headers) {
      let id = headers.link.toUpperCase().indexOf('://schema.org/EntryPoint"'.toUpperCase())
      return id !== -1
    }

    function isNotEntryPoint(headers) {
       return !isEntryPoint(headers)
    }

    async function clickedSearchButton(e) {
      console.log(urlDeEntrada);
      if (!urlDeEntrada || urlDeEntrada.trim() === '')
        return 
      const result = await request(urlDeEntrada);
      if (isNotEntryPoint(result.headers)) { 
        let url_entrada = urlDeEntrada
        handleClose()
        props.clickSearchButtonDialog({name: url_entrada, url: url_entrada})
        return
      }
      let json_entry_point = result.data;
      let arr = [];
      Object.entries(json_entry_point).forEach( ([key, value]) => { arr.push({key: key, value: value}); });
      setItems(arr);
    };
    
    return (
      <div>
        <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Escolha ou informe um URL </DialogTitle>
          <DialogContent>
            <Select native value={''} onChange={handleChange} fullWidth>
              <option value="" />
              items.map(item =>
              <option value={'http://ggt-des.ibge.gov.br/api/bcim/'} >'ibge/bcim'</option>
              
            </Select>
              <Paper className={classes.root} elevation={1}>
                  <InputBase className={classes.input} placeholder="Escolha ou informe um URL" onChange={urlChangeInputBase} value={urlDeEntrada}/>
                  <IconButton className={classes.iconButton} aria-label="Search" onClick={(e) =>clickedSearchButton(e)}>
                      <SearchIcon />
                  </IconButton>
              </Paper> 
              <Divider/>
           
          </DialogContent>
          <DialogContent>
            <ExpansionPanelLayer items={items}/> 
          </DialogContent>
          <DialogActions>
            <Button onClick={closeHyperResourceDialog} color="primary">
              Cancel
            </Button>
           </DialogActions>
        </Dialog>
      </div>
    );
  
}
HyperResourceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
  export default withStyles(styles)(HyperResourceDialog);