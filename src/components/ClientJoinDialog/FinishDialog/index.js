import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FinishDialog(props) {
  const [statusTitle, setStatusTitle] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    function selectDialogContent(){
      if(props.success===true){
        setStatusTitle("Sucesso !")
        setStatusMessage('Junção realizada com sucesso')
      } else {
        setStatusTitle("Erro !")
        setStatusMessage('Sua junção não foi bem sucedida por favor tente novamente')
      }
    }

    selectDialogContent()
  }, [props.success])

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => props.close()}
    >
      <DialogTitle >{statusTitle}</DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {statusMessage}
          </DialogContentText>
        </DialogContent>
      <DialogActions>
        <Button onClick={() => props.close()} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}