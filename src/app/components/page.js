// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import styles from '@/app/styles/Carrito.module.css';

// export default function CarritoPage() {
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       title: 'Vestido Floral Verano',
//       price: 45.99,
//       image: '/productos/vestido1.jpg',
//     },
//     {
//       id: 2,
//       title: 'Blazer Elegante',
//       price: 89.99,
//       image: '/productos/blazer1.jpg',
//     },
//   ]);

//   const removeItem = (id) => {
//     setCartItems(cartItems.filter(item => item.id !== id));
//   };

//   const handleCheckout = () => {
//     alert('Redirigiendo al pago...');
//     // Aquí podrías usar router.push("/pago") si tuvieras esa ruta
//   };

//   const total = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Carrito de Compras</h1>

//       {cartItems.length === 0 ? (
//         <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
//       ) : (
//         <>
//           {cartItems.map((item) => (
//             <div className={styles.cartItem} key={item.id}>
//               <Image src={item.image} alt={item.title} width={80} height={80} />
//               <div className={styles.cartItemDetails}>
//                 <div className={styles.cartItemTitle}>{item.title}</div>
//                 <div className={styles.cartItemPrice}>${item.price.toFixed(2)}</div>
//               </div>
//               <button
//                 className={styles.removeButton}
//                 onClick={() => removeItem(item.id)}
//               >
//                 Eliminar
//               </button>
//             </div>
//           ))}

//           <div className={styles.totalSection}>
//             <span className={styles.totalLabel}>Total:</span>
//             <span className={styles.totalAmount}>${total}</span>
//           </div>

//           <button className={styles.checkoutButton} onClick={handleCheckout}>
//             Continuar con el pago
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './styles/Carrito.module.css';

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch('app/api/carrito');  // <-- Ojo aquí
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error al cargar el carrito', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const removeItem = async (id) => {
    try {
      await fetch(`/api/carrito`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error eliminando producto', error);
    }
  };

  const handleCheckout = () => {
    alert('Redirigiendo al pago...');
  };

  const total = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className={styles.cartItem} key={item.id}>
                            <Image src={item.image} alt={item.title} width={80} height={80} />

              <div className={styles.cartItemDetails}>
                <div className={styles.cartItemTitle}>{item.title}</div>
                <div className={styles.cartItemPrice}>${item.price.toFixed(2)}</div>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeItem(item.id)}
              >
                Eliminar
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
