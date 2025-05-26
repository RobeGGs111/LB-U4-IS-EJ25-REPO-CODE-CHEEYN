'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Products.module.css';

const Products = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch('/api/productos', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Error al cargar productos');
        }
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    }

    fetchProductos();
  }, []);

  const addToCart = async (productoId, cantidad) => {
  try {
    const res = await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId: Number(productoId), cantidad }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'Stock insuficiente') {
        alert(`No hay suficiente stock.`);
      } else {
        alert(data.error || 'Error al agregar al carrito');
      }
      return;
    }

    alert('Producto añadido al carrito.');

    setProductos(prevProductos => {
      return prevProductos.map(p => {
        if (p.ProductoID === productoId) {
          return { ...p, Stock: p.Stock - cantidad };
        }
        return p;
      });
  });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
};

  return (
    <div className={styles.container}>
      <h1 className={styles.tituloPrincipal}>Nuestra Colección de Moda</h1>
      
      <div className={styles.productGrid}>
        {productos.map((producto) => (
          <div key={producto.ProductoID} className={styles.productCard}>
            <div className={styles.badgeCategoria}>{producto.categoria}</div>
            <Image 
              src={producto.Imagen || '/img/bufanda.jpg'} 
              alt={producto.Nombre} 
              width={250}
              height={300}
              className={styles.productImage} 
            />

            <div className={styles.productInfo}>
              <h2 className={styles.productName}>{producto.Nombre}</h2>
              <p className={styles.productDescription}>{producto.Descripcion}</p>
              <span className={styles.productPrice}>${producto.Precio}</span>
              <button
                className={styles.buyButton}
                onClick={() => addToCart(producto.ProductoID, 1)}
                disabled={producto.Stock <= 0}
              >
                {producto.Stock <= 0 ? 'Producto Agotado' : 'Agregar al carrito'}
              </button>
              <p className={styles.productStock}>Stock disponible: {producto.Stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
