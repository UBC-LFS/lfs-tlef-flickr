import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

const ModalContainer = props => (
	<div className="modalContainer">
		<Modal show={props.showModal} onHide={props.close} enforceFocus={true}>
			<Modal.Header closeButton closeLabel=''>
				<Modal.Title>{props.keyWord}</Modal.Title>
			</Modal.Header>
			<Modal.Body dangerouslySetInnerHTML={{ __html: props.definition }}>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.close}>Close</Button>
			</Modal.Footer>
		</Modal>
	</div>
);

ModalContainer.propTypes = {
	showModal: PropTypes.bool.isRequired,
	close: PropTypes.func.isRequired,
	keyWord: PropTypes.string.isRequired,
	definition: PropTypes.string.isRequired
};

export default ModalContainer;
