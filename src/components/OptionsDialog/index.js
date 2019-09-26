import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Box, Paper } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from '@material-ui/core/Slide';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AttributTab from './AttributTab'
import OperationTab from './OperationTab'
import RequestTab from './RequestTab'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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

export default function OptionsDialog(props) {
  const classes = useStyles();
  const [ value, setValue ] = React.useState(0); // index of the tab
  const { layer, isOpen } = props;

  /*useEffect( () => 
    {
      console.log("layer")
      console.log(layer)
    }
  ,[layer])*/

  function handleTabChange(event, newValue) {
    setValue(newValue);
  }

  function handleClose() {
    props.close()
  };

  
  return (
    <div>
      <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Opções da camada - {layer.iri}
            </Typography>
          </Toolbar>

          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Atributos" />
              <Tab label="Operações" />
              <Tab label="Requisições" />
              <Tab label="Junções no cliente" />
            </Tabs>
          </Paper>
        </AppBar>

        <TabPanel value={value} index={0}>
          <AttributTab optionsLayer={layer}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <OperationTab optionsLayer={layer}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RequestTab optionsLayer={layer}/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          DDDD
        </TabPanel>

      </Dialog>
    </div>
  );
}

OptionsDialog.propTypes = {
  layer: PropTypes.any.isRequired,
};