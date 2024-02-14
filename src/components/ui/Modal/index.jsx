import './style.scss';

import { useEffect } from 'react';

import MuiModal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ children, containerClass, contentClass, handleClose, ...props }) => {
  return (
    <MuiModal className={`modal-container ${containerClass || ''}`} {...props}>
      <div className={`modal-content ${contentClass || ''}`}>
        {children}
        <IconButton
          onClick={handleClose}
          aria-label="close"
          className="modal-close-button"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </MuiModal>
  );
};

export default Modal;
