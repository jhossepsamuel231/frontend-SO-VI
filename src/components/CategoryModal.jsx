import { useState } from 'react';
import Modal from 'react-modal';

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

function CategoryModal() {
  const [modalIsOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    nameCategory: '', // Inicializa el formulario con un objeto vacío
  });

  function afterOpenModal() {
    // Puedes agregar lógica personalizada aquí
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleNameChange = (e) => {
    setFormData({
      ...formData,
      nameCategory: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (formData.nameCategory.trim() === '') {
      // Verificar si el campo nameCategory está vacío o solo contiene espacios en blanco
      console.log("ERROR: El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      const response = await fetch('http://192.168.101.113:3000/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        // Si la categoría se creó con éxito, cierra el modal
        setIsOpen(false);
      } else {
        console.log("ERROR: No se pudo agregar la categoría");
      }
    } catch (error) {
      console.error(error);
      // Maneja errores de red u otros errores
    }
  }

  // Comprueba si el campo nameCategory está vacío o contiene solo espacios en blanco
  const isSubmitDisabled = formData.nameCategory.trim() === '';

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Agregar Categoría"
      ariaHideApp={false}
    >
      <form>
        <h2>Agregar Categoría</h2>
        <label>Nombre:
          <input
            type="text"
            value={formData.nameCategory}
            onChange={handleNameChange}
          />
        </label>
        <button onClick={handleSubmit} disabled={isSubmitDisabled}>
          Agregar
        </button>
      </form>
    </Modal>
  );
}

export default CategoryModal;
