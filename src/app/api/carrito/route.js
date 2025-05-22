import db from '../../../lib/db';

export async function POST(request) {
  const { productoId, cantidad } = await request.json();
  
  try {
    //  Aquí todavía estamos suponiendo UsuarioID 1 fijo
    const usuarioId = 1;

    // 1. Buscar si ya existe un carrito para este usuario
    const [carritos] = await db.query(
      'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
      [usuarioId]
    );

    let carritoId;

    if (carritos.length === 0) {
      // 2. Si no hay carrito, crear uno
      const [result] = await db.query(
        'INSERT INTO Carritos (UsuarioID) VALUES (?)',
        [usuarioId]
      );
      carritoId = result.insertId;
    } else {
      carritoId = carritos[0].CarritoID;
    }

    // 3. Insertar el producto en CarritoDetalles
    await db.query(
      'INSERT INTO CarritoDetalles (CarritoID, ProductoID, Cantidad) VALUES (?, ?, ?)',
      [carritoId, productoId, cantidad]
    );

    return new Response(JSON.stringify({ message: 'Producto agregado al carrito.' }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al agregar al carrito.' }), { status: 500 });
  }
}


export async function GET() {
    try {
      const usuarioId = 1; // Usuario simulado
  
      // 1. Buscar el carrito más reciente
      const [carritos] = await db.query(
        'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
        [usuarioId]
      );
  
      if (carritos.length == 0) {
        return new Response(JSON.stringify({ carrito: [], message: 'No hay productos en el carrito.' }), { status: 200 });
      }
  
      const carritoId = carritos[0].CarritoID;
  
      // 2. Obtener los productos dentro de ese carrito
      const [productosCarrito] = await db.query(`
        SELECT 
          p.ProductoID,
          p.Nombre,
          p.Descripcion,
          p.Precio,
          cd.Cantidad
        FROM CarritoDetalles cd
        INNER JOIN Productos p ON cd.ProductoID = p.ProductoID
        WHERE cd.CarritoID = ?
      `, [carritoId]);
  
      return new Response(JSON.stringify({ carrito: productosCarrito }), { status: 200 });
  
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error al traer el carrito.' }), { status: 500 });
    }
  }
