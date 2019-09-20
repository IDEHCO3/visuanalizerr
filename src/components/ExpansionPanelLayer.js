import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LayersIcon from '@material-ui/icons/Layers';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  iconButton: {
    padding: 10,
  }
});

async function clickedSearchButton(e, item) {
  console.log(e);
  console.log(item);
};

function ExpansionPanelLayer(props) {

  const classes = props;
  const [expanded, setExpanded] = useState(false);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  return (
    <div className={classes.root}>
      { props.items.map( item => (
        <ExpansionPanel expanded={expanded === item.key} onChange={handleChange(item.key)} key= {item.key}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={item.key} id= {item.key} >
            <Typography className={classes.heading}>{item.key}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails id= {item.key}>
            <Typography>
              {item.value}
            </Typography>
            <IconButton color="primary" className={classes.iconButton} aria-label="Imagem" onClick={(e) =>clickedSearchButton(e, item)}><LayersIcon/></IconButton>
            <IconButton color="primary" className={classes.iconButton} aria-label="Filtro" onClick={(e) =>clickedSearchButton(e, item)}><FilterListIcon/></IconButton>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}

export default withStyles(styles)(ExpansionPanelLayer);