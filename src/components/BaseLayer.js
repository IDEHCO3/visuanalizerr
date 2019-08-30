import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  group: {
    margin: `${theme.spacing(3)}px 0`,
  },
});

function RadioButtonsGroup(props) {
  
  const [value, setValue] = useState();
  const { classes } = props;  
  
  function handleChange(event) {
    
    props.baseLayerChanged(event.target.value)
    setValue( event.target.value);
  };

  return  (
      
      <div className={classes.root}>
             
                <RadioGroup aria-label="CamadaBase" name="camadaBase"  className={classes.group}  value={value}  onChange={handleChange}  defaultValue="OSM">
                    <FormControlLabel value="OSM" control={<Radio />} label="OpenStreetMap" />
                    <FormControlLabel value="google" control={<Radio />} label="Google Maps" />
                    <FormControlLabel value="satelite" control={<Radio />} label="Satelite" />
                    <FormControlLabel value="wikimedia" control={<Radio />} label="Wikimedia" />
                    <FormControlLabel value="watercolor" control={<Radio />} label="Water Color" />
                    <FormControlLabel value="" control={<Radio />} label="Nenhuma" />
                    
                </RadioGroup>
        </div>
    );
  
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);
