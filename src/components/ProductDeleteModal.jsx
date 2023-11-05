import Modal from 'react-modal';
import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const DeleteConfirmationModal = ({ idProducto, productName, onDeleteSuccess }) => {
  const [modalIsOpen, setIsOpen] = useState(true);
  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.101.113:3000/api/v1/product/${idProducto}`);
      // Agrega aquí cualquier lógica adicional que desees después de la eliminación
      onDeleteSuccess(idProducto);
      setIsOpen(false);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  function afterOpenModal() {
    // Puedes agregar lógica personalizada aquí
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Agregar Categoría"
      ariaHideApp={false}
    >
      <h2>Confirmar Eliminación</h2>
      <p>¿Estás seguro que deseas eliminar el producto {productName}?</p>
      <button onClick={handleDelete}>Eliminar</button>
    </Modal>
  );
};
DeleteConfirmationModal.propTypes = {
  idProducto: PropTypes.any.isRequired,
  productName: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};
export default DeleteConfirmationModal;
