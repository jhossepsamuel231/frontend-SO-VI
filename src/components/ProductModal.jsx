import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types'; // Importa PropTypes


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

function ProductModal({ productToEdit, onClose }) {
  const [modalIsOpen, setIsOpen] = useState(true);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    estado: true, // Inicializado como true (Activo)
    category: '',
  });

  useEffect(() => {
    if (productToEdit) {
      // Si hay un producto para editar, establece los datos en el formulario
      setProductFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        stock: productToEdit.stock,
        estado: productToEdit.estado,
        category: productToEdit.category.nameCategory,
      });
    }
  }, [productToEdit]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cargar las categorías desde la API
    fetch('http://192.168.101.113:3000/api/v1/category')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  function afterOpenModal() {
    // Puedes agregar lógica personalizada aquí
  }

  function closeModal() {
    setIsOpen(false);
    onClose(); // Cierra el modal y ejecuta la función onClose pasada como prop
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Si el tipo de campo es "checkbox," establece el valor booleano directamente
    if (type === 'checkbox') {
      setProductFormData({
        ...productFormData,
        [name]: e.target.checked,
      });
    } else {
      setProductFormData({
        ...productFormData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    // Corregir los valores del precio y stock para que sean números
    const numericPrice = parseFloat(productFormData.price);
    const numericStock = parseInt(productFormData.stock);

    // Buscar la categoría por su nombre y obtener su ID
    const selectedCategory = categories.find((category) => category.nameCategory === productFormData.category);

    if (numericPrice && numericStock && selectedCategory) {
      if (productToEdit) {
        // Realiza la solicitud PATCH para actualizar el producto
        const dataToSend = {
          name: productFormData.name,
          price: numericPrice,
          stock: numericStock,
          estado: productFormData.estado,
          category: selectedCategory.nameCategory,
        };

        try {
          const response = await fetch(`http://192.168.101.113:3000/api/v1/product/${productToEdit.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });

          if (response.status === 200) {
            // Si la actualización fue exitosa, cierra el modal de edición
            setIsOpen(false);
            onClose();
          } else {
            console.log('ERROR: No se pudo actualizar el producto');
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        // Crear el objeto de datos a enviar para agregar un nuevo producto
        const dataToSend = {
          name: productFormData.name,
          price: numericPrice,
          stock: numericStock,
          estado: productFormData.estado,
          category: selectedCategory.nameCategory, // Enviar el nombre de la categoría
        };

        console.log('JSON a enviar:', JSON.stringify(dataToSend)); // Agregar esta línea para imprimir el JSON

        try {
          const response = await fetch('http://192.168.101.113:3000/api/v1/product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });

          if (response.status === 201) {
            // Si el producto se creó con éxito, cierra el modal
            setIsOpen(false);
            onClose();
          } else {
            console.log('ERROR: No se pudo agregar el producto');
          }
        } catch (error) {
          console.error(error);
          // Maneja errores de red u otros errores
        }
      }
    } else {
      console.log('ERROR: Los datos ingresados son inválidos.');
    }
  };

  // Comprueba si al menos un campo obligatorio está vacío
  const isSubmitDisabled =
    productFormData.name.trim() === '' ||
    productFormData.price <= 0 ||
    productFormData.stock <= 0 ||
    productFormData.category === '';

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel={productToEdit ? 'Editar Producto' : 'Agregar Producto'} // Cambia el título según si estás editando o agregando
      ariaHideApp={false}
    >
      <form>
        <h2>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</h2> {/* Cambia el título del formulario */}
        <label>Nombre:
          <input
            type="text"
            name="name"
            value={productFormData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>Precio:
          <input
            type="number"
            name="price"
            value={productFormData.price}
            onChange={handleInputChange}
          />
        </label>
        <label>Stock:
          <input
            type="number"
            name="stock"
            value={productFormData.stock}
            onChange={handleInputChange}
          />
        </label>
        <label>Estado:
          <input
            type="checkbox"
            name="estado"
            checked={productFormData.estado}
            onChange={handleInputChange}
          />
        </label>
        <label>Categoría:
          <select
            name="category"
            value={productFormData.category}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nameCategory}>
                {category.nameCategory}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSubmit} disabled={isSubmitDisabled}>
          {productToEdit ? 'Editar' : 'Agregar'} {/* Cambia el texto del botón según si estás editando o agregando */}
        </button>
      </form>
    </Modal>
  );
}
ProductModal.propTypes = {
  productToEdit: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    estado: PropTypes.bool,
    category: PropTypes.shape({
      nameCategory: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ProductModal;
