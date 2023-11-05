import { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteConfirmationModal from './ProductDeleteModal';
import ProductModal from './ProductModal'; // Importa el componente ProductModal

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductDeleteModal, setShowProductDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Estado para almacenar el producto en edición

  useEffect(() => {
    axios.get('http://192.168.101.113:3000/api/v1/product').then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleAddProductDelete = (productId) => {
    setSelectedProductId(productId); // Establece el ID del producto seleccionado
    setShowProductDeleteModal(true); // Abre el modal de eliminación
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product); // Establece el producto que se está editando
  };

  const handleDeleteSuccess = (deletedProductId) => {
    // Actualiza la lista de productos excluyendo el producto eliminado
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deletedProductId));
    setShowProductDeleteModal(false); // Cierra el modal de eliminación
  };

  let productCount = 1;

  return (
    <div>
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Categorías</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{productCount++}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category.nameCategory}</td>
              <td>{product.stock}</td>
              <td>{product.estado ? 'Activo' : 'Inactivo'}</td>
              <td>{product.category.nameCategory}</td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Edit</button>
                <button onClick={() => handleAddProductDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Abre el modal de edición si hay un producto en edición */}
      {editingProduct && (
        <ProductModal productToEdit={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {/* Abre el modal de eliminación */}
      {selectedProductId && showProductDeleteModal && (
        <DeleteConfirmationModal
          idProducto={selectedProductId}
          productName={products.find((product) => product.id === selectedProductId)?.name}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

export default ProductTable;
