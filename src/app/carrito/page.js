'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/carrito.module.css';

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch('/api/carrito'); 
        const data = await res.json();
        console.log('Datos recibidos del carrito:', data);
        setCartItems(data.carrito || []); //  adaptamos a la respuesta
      } catch (error) {
        console.error('Error al cargar el carrito', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const removeItem = async (productoId) => {
    try {
      await fetch(`/api/carrito`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId }),
      });
      setCartItems(cartItems.filter(item => item.ProductoID !== productoId));
    } catch (error) {
      console.error('Error eliminando producto', error);
    }
  };

  const handleCheckout = () => {
    alert('Redirigiendo al pago...');
  };

  // const total = cartItems.reduce((acc, item) => acc + (item.Precio * item.Cantidad), 0).toFixed(2);
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
                src="/img/vestido.jpg" // porque no tienes imagen en la bd
                alt={item.Nombre}
                width={80}
                height={80}
              />

              <div className={styles.cartItemDetails}>
                <div className={styles.cartItemTitle}>{item.Nombre}</div>
                <div className={styles.cartItemPrice}>
                  ${parseFloat(item.Precio).toFixed(2)} x {item.Cantidad}
                </div>

              </div>

              <button
                className={styles.removeButton}
                onClick={() => removeItem(item.ProductoID)}
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

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import styles from '../styles/carrito.module.css';

// export default function CarritoPage() {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCart() {
//       try {
//         const res = await fetch('app/api/carrito');  // <-- Ojo aquí
//         const data = await res.json();
//         setCartItems(data);
//       } catch (error) {
//         console.error('Error al cargar el carrito', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCart();
//   }, []);

//   const removeItem = async (id) => {
//     try {
//       await fetch(`/api/carrito`, {
//         method: 'DELETE',
//         body: JSON.stringify({ id }),
//       });
//       setCartItems(cartItems.filter(item => item.id !== id));
//     } catch (error) {
//       console.error('Error eliminando producto', error);
//     }
//   };

//   const handleCheckout = () => {
//     alert('Redirigiendo al pago...');
//   };

//   const total = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

//   if (loading) return <p>Cargando carrito...</p>;

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Carrito de Compras</h1>

//       {cartItems.length === 0 ? (
//         <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
//       ) : (
//         <>
//           {cartItems.map((item) => (
//             <div className={styles.cartItem} key={item.id}>
//                             <Image src={item.image} alt={item.title} width={80} height={80} />

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

