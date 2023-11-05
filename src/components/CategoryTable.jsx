import { useEffect, useState } from 'react';
import axios from 'axios';

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('http://192.168.101.113:3000/api/v1/category').then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.nameCategory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CategoryTable;
