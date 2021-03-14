import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ConfirmPopup = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      className={props.className}
      backdrop={props.backdrop}
      keyboard={props.keyboard}
    >
      <ModalHeader className="border-0">{props.title}</ModalHeader>
      <ModalBody>{props.message}</ModalBody>
      <ModalFooter style={{ borderTop: "none" }}>
        <Button
          disabled={props.disabled}
          color={props.closeButtonColor ? props.closeButtonColor : "secondary"}
          style={props.closeButtonStyle ? props.closeButtonStyle : {}}
          onClick={props.onClose}
        >
          {props.closeButtonText}
        </Button>
        {props.confirmButtonText && (
          <Button
            disabled={props.disabled}
            color={
              props.confirmButtonColor ? props.confirmButtonColor : "primary"
            }
            style={props.confirmButtonStyle ? props.confirmButtonStyle : {}}
            onClick={props.onConfirm}
          >
            {props.confirmButtonText}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmPopup;
