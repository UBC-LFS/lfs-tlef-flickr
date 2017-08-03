import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const Modal = props => (
  <div>
      <Modal show={props.showModal} onHide={props.close}>
          <Modal.Header closeButton>
            <Modal.Title>props.keyWord </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>props.definition</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.close}>Close</Button>
          </Modal.Footer>
        </Modal>
  </div>
);

SearchBar.propTypes = {
  showModal: PropTypes.bool.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  keyWord: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
};

export default Modal;