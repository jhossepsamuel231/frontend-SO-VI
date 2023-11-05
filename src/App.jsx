import { useState } from 'react';
import './App.css';
import ProductModal from './components/ProductModal';
import ProductTable from './components/ProductTable';
import CategoryModal from './components/CategoryModal';

function App() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAddProduct = () => {
    setShowProductModal(true);
  };

  const handleAddCategory = () => {
    setShowCategoryModal(true);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">TIENDA DE JHOSEP</h1>
      <button onClick={handleAddProduct} className="add-button">
        Agregar Producto
      </button>
      <button onClick={handleAddCategory} className="add-button">
        Agregar Categoría
      </button>
      <ProductTable />
      {showProductModal && <ProductModal />}
      {showCategoryModal && <CategoryModal />}
    </div>
  );
}

export default App;
