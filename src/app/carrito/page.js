'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/carrito.module.css';

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mover fetchCart fuera del useEffect
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/carrito');
      const data = await res.json();
      console.log('Datos recibidos del carrito:', data);
      setCartItems(data.carrito || []);
    } catch (error) {
      console.error('Error al cargar el carrito', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productoId, removeAll = true) => {
  console.log('Intentando eliminar producto con ID:', productoId);
  try {
    const res = await fetch(`/api/carrito`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, removeAll }), // Añadir removeAll
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Error del servidor:', error);
      alert(error.error || 'Error al eliminar el producto');
      return;
    }

    await fetchCart();
  } catch (error) {
    console.error('Error en la solicitud de eliminación:', error);
    alert('Error al eliminar el producto: ' + error.message);
  }
};

  const updateQuantity = async (productoId, delta) => {
  try {
    const res = await fetch('/api/carrito', {
      method: delta === 1 ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, cantidad: 1 }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Error actualizando el carrito');
      return;
    }

    await fetchCart(); // actualizar vista
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    alert('Error actualizando la cantidad');
  }
};




  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        alert('¡Pedido confirmado exitosamente!');
        setCartItems([]); // Limpiar el carrito visualmente
      } else {
        alert(data.error || 'Error al confirmar el pedido.');
      }
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
      alert('Error al confirmar el pedido.');
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.Precio) * item.Cantidad), 0).toFixed(2);

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className={styles.cartItem} key={item.ProductoID}>
              <Image 
                src="/img/vestido.jpg"
                alt={item.Nombre}
                width={80}
                height={80}
              />

              <div className={styles.cartItemDetails}>
                <div className={styles.cartItemTitle}>{item.Nombre}</div>
                <div className={styles.cartItemPrice}>
                  ${parseFloat(item.Precio).toFixed(2)} x {item.Cantidad}
                </div>
                

                <div className={styles.cartItemControls}>
                  <button onClick={() => updateQuantity(item.ProductoID, -1)}>-</button>
                  <span>{item.Cantidad}</span>
                  <button onClick={() => updateQuantity(item.ProductoID, 1)} disabled={item.Stock <= 0}>+</button>
                </div>
              </div>

              <button
                className={styles.removeButton}
                onClick={() => removeItem(item.ProductoID, true)}
              >       
                Eliminar todo
              </button>
            </div>
          ))}

          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>${total}</span>
          </div>

          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Continuar con el pago
          </button>
        </>
      )}
    </div>
  );
}