// 'use client';

// import Image from 'next/image';
// import styles from '../styles/Products.module.css';

// const productos = [
//   // Ropa para Mujer
//   {
//     id: 1,
//     nombre: "Vestido Floral Verano",
//     precio: "$45.99",
//     descripcion: "Vestido ligero con estampado floral, ideal para días cálidos.",
//     categoria: "mujer",
//     imagen: "/img/vestido.jpg" ,
//   },
//   {
//     id: 2,
//     nombre: "Blazer Elegante",
//     precio: "$89.99",
//     descripcion: "Blazer slim fit para looks formales o casuales.",
//     categoria: "mujer",
//     imagen: "/img/blazer.jpeg",
//   },

//   // Ropa para Hombre
//   {
//     id: 3,
//     nombre: "Camisa Oxford",
//     precio: "$49.99",
//     descripcion: "Camisa de algodón 100%, disponible en varios colores.",
//     categoria: "hombre",
//     imagen: "/img/camisa ox.jpg",
//   },
//   {
//     id: 4,
//     nombre: "Jeans Slim Fit",
//     precio: "$59.99",
//     descripcion: "Jeans ajustados con elastano para mayor comodidad.",
//     categoria: "hombre",
//     imagen: "/img/jeans.jpg",
//   },

//   // Accesorios
//   {
//     id: 5,
//     nombre: "Bufanda de Lana",
//     precio: "$29.99",
//     descripcion: "Bufanda tejida a mano, suave y abrigada.",
//     categoria: "accesorios",
//     imagen: "/img/bufanda.jpg",
//   },
//   {
//     id: 6,
//     nombre: "Cinturón de Cuero",
//     precio: "$39.99",
//     descripcion: "Cinturón genuino de cuero con hebilla metálica.",
//     categoria: "accesorios",
//     imagen: "/img/cinturon.jpeg",
//   },

//   // Nuevos productos añadidos
//   // {
//   //   id: 7,
//   //   nombre: "Sudadera Oversize",
//   //   precio: "$55.99",
//   //   descripcion: "Sudadera cómoda con capucha y bolsillo canguro.",
//   //   categoria: "unisex",
//   //   //imagen: "/images/sudadera_oversize.jpg",
//   // },
//   // {
//   //   id: 8,
//   //   nombre: "Zapatos Deportivos",
//   //   precio: "$79.99",
//   //   descripcion: "Zapatillas ligeras con amortiguación para running.",
//   //   categoria: "unisex",
//   //   //imagen: "/images/zapatos_deportivos.jpg",
//   // }
// ];


// // const addToCart = async (productoId) => {
// //   await fetch('/api/carrito', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ productoId }),
// //   });
// //   alert('Producto añadido al carrito');
// // };
// async function addToCart(productoId, cantidad) {
//   try {
//     const res = await fetch('/api/carrito', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', // ✅ Obligatorio para que funcione `req.json()`
//       },
//       body: JSON.stringify({ productoId, cantidad }), // ✅ Debes convertirlo a JSON
//     });

//     // if (!res.ok) {
//     //   throw new Error('Error en la respuesta del servidor');
//     // }
//     if (!res.ok) {
//       const errorText = await res.text(); // o res.json() si sabes que devuelve JSON
//       console.error('Detalles del error:', errorText);
//       throw new Error('Error en la respuesta del servidor');
//     }
    

//     const data = await res.json();
//     console.log('Producto agregado al carrito:', data);
//   } catch (error) {
//     console.error('Error al agregar producto al carrito:', error);
//   }
// }




// const Products = () => {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.tituloPrincipal}>Nuestra Colección de Moda</h1>
      
//       <div className={styles.productGrid}>
//         {productos.map((producto) => (
//           <div key={producto.id} className={styles.productCard}>
//             <div className={styles.badgeCategoria}>{producto.categoria}</div>
//             <Image 
//               src={producto.imagen} 
//               alt={producto.nombre} 
//               width={250}
//               height={300}
//               className={styles.productImage} 
//             />
//             <div className={styles.productInfo}>
//               <h2 className={styles.productName}>{producto.nombre}</h2>
//               <p className={styles.productDescription}>{producto.descripcion}</p>
//               <span className={styles.productPrice}>{producto.precio}</span>
//               {/* <button className={styles.buyButton}>Añadir al carrito</button> */}
//               {/* <button className={styles.buyButton} onClick={() => addToCart(producto.id)}>Añadir al carrito</button> */}
//               <button className={styles.buyButton} onClick={() => addToCart(producto.id, 1)}>Agregar al carrito</button>


//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Products.module.css';


const addToCart = async (productoId, Stock) => {
  try {
    const res = await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, Stock }),
    });

    //if (!res.ok) {
      //const errorText = await res.text();
      //console.error('Detalles del error:', errorText);
      //throw new Error('Error en la respuesta del servidor');
    //}

    const data = await res.json();
    console.log('Producto agregado al carrito:', data);
    alert('Producto añadido al carrito.');
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
};

// async function addToCart(productoId, cantidad) {
//   try {
//     const res = await fetch('/api/productos', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ productoId, cantidad }),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('Detalles del error:', errorText);
//       throw new Error('Error en la respuesta del servidor');
//     }

//     const data = await res.json();
//     console.log('Producto agregado al carrito:', data);
//   } catch (error) {
//     console.error('Error al agregar producto al carrito:', error);
//   }
// }

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

  return (
    <div className={styles.container}>
      <h1 className={styles.tituloPrincipal}>Nuestra Colección de Moda</h1>
      
      <div className={styles.productGrid}>
        {productos.map((producto) => (
          <div key={producto.id} className={styles.productCard}>
            <div className={styles.badgeCategoria}>{producto.categoria}</div>
            <Image 
              src={producto.Imagen || '/img/bufanda.jpg'} 
              alt={producto.nombre} 
              width={250}
              height={300}
              className={styles.productImage} 
            />

            <div className={styles.productInfo}>
              <h2 className={styles.productName}>{producto.Nombre}</h2>
              <p className={styles.productDescription}>{producto.Descripcion}</p>
              <span className={styles.productPrice}>${producto.Precio}</span>
              <button className={styles.buyButton} onClick={() => addToCart(producto.ProductoID, 1)}>Agregar al carrito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
