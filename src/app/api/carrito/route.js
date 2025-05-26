import db from '../../../lib/db';

export async function POST(request) {
  const { productoId, cantidad } = await request.json();
  
  try {
    const usuarioId = 1; 

    
    const [carritos] = await db.query(
      'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
      [usuarioId]
    );

    let carritoId;

    if (carritos.length === 0) {
      // Si no hay carrito, crear uno
      const [result] = await db.query(
        'INSERT INTO Carritos (UsuarioID) VALUES (?)',
        [usuarioId]
      );
      carritoId = result.insertId;
    } else {
      carritoId = carritos[0].CarritoID;
    }

    // Obtener información del producto 
    const [producto] = await db.query(
      'SELECT Stock, StockOriginal FROM Productos WHERE ProductoID = ?', 
      [productoId]
    );
    
    if (!producto.length) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), { status: 404 });
    }

    const stockDisponible = producto[0].StockOriginal; 

    // Verificar si el producto ya está en el carrito
    const [existingItem] = await db.query(
      'SELECT Cantidad FROM CarritoDetalles WHERE CarritoID = ? AND ProductoID = ?',
      [carritoId, productoId]
    );

    let cantidadTotal = cantidad;
    if (existingItem.length > 0) {
      cantidadTotal += existingItem[0].Cantidad;
    }

    // Validar que la cantidad total no exceda el stock
    if (cantidadTotal > stockDisponible) {
      return new Response(JSON.stringify({ 
        error: 'Stock insuficiente',
        stockDisponible,
        cantidadEnCarrito: existingItem.length > 0 ? existingItem[0].Cantidad : 0,
        cantidadSolicitada: cantidad
      }), { status: 400 });
    }

    // Actualizar o insertar el producto en el carrito
    if (existingItem.length > 0) {
      // Actualizar cantidad si ya existe
      await db.query(
        'UPDATE CarritoDetalles SET Cantidad = Cantidad + ? WHERE CarritoID = ? AND ProductoID = ?',
        [cantidad, carritoId, productoId]
      );
    } else {
      // Insertar nuevo registro si no existe
      await db.query(
        'INSERT INTO CarritoDetalles (CarritoID, ProductoID, Cantidad) VALUES (?, ?, ?)',
        [carritoId, productoId, cantidad]
      );
    }

    return new Response(JSON.stringify({ 
      message: 'Producto agregado al carrito.',
      stockDisponible: stockDisponible - cantidadTotal
    }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al agregar al carrito.' }), { status: 500 });
  }
}


export async function GET() {
    try {
      const usuarioId = 1; 
  
      // Buscar el carrito más reciente
      const [carritos] = await db.query(
        'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
        [usuarioId]
      );
  
      if (carritos.length == 0) {
        return new Response(JSON.stringify({ carrito: [], message: 'No hay productos en el carrito.' }), { status: 200 });
      }
  
      const carritoId = carritos[0].CarritoID;
  
      // Obtener los productos dentro de ese carrito
      const [productosCarrito] = await db.query(`
        SELECT 
          p.ProductoID,
          p.Nombre,
          p.Descripcion,
          p.Precio,
          p.Stock,
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

export async function DELETE(req) {
  const { productoId, removeAll } = await req.json();
  const usuarioId = 1; 

  try {
    await db.query('START TRANSACTION');

    // Obtener el stock original del producto
    const [producto] = await db.query(
      'SELECT Stock, StockOriginal FROM Productos WHERE ProductoID = ?',
      [productoId]
    );

    if (producto.length === 0) {
      await db.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'Producto no encontrado.' }), { status: 404 });
    }

    const stockActual = producto[0].Stock;
    const stockOriginal = producto[0].StockOriginal || producto[0].Stock;

    // Obtener el carrito actual del usuario
    const [carritos] = await db.query(
      'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
      [usuarioId]
    );

    if (carritos.length === 0) {
      await db.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'No hay carrito activo.' }), { status: 404 });
    }

    const carritoId = carritos[0].CarritoID;

    // Obtener cantidad actual del producto en el carrito
    const [detalles] = await db.query(
      'SELECT Cantidad FROM CarritoDetalles WHERE CarritoID = ? AND ProductoID = ?',
      [carritoId, productoId]
    );

    if (detalles.length === 0) {
      await db.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'Producto no encontrado en el carrito.' }), { status: 404 });
    }

    const cantidadActual = detalles[0].Cantidad;

    if (removeAll) {
      // Eliminar todo el producto del carrito
      await db.query(
        'DELETE FROM CarritoDetalles WHERE CarritoID = ? AND ProductoID = ?',
        [carritoId, productoId]
      );

      
      const cantidadARestaurar = Math.min(cantidadActual, stockOriginal - stockActual);
      if (cantidadARestaurar > 0) {
        await db.query(
          'UPDATE Productos SET Stock = Stock + ? WHERE ProductoID = ?',
          [cantidadARestaurar, productoId]
        );
      }
    } else {
    
      if (cantidadActual > 1) {
        await db.query(
          'UPDATE CarritoDetalles SET Cantidad = Cantidad - 1 WHERE CarritoID = ? AND ProductoID = ?',
          [carritoId, productoId]
        );
      } else {
        await db.query(
          'DELETE FROM CarritoDetalles WHERE CarritoID = ? AND ProductoID = ?',
          [carritoId, productoId]
        );
      }

      
      if (stockActual < stockOriginal) {
        await db.query(
          'UPDATE Productos SET Stock = Stock + 1 WHERE ProductoID = ? AND Stock < ?',
          [productoId, stockOriginal]
        );
      }
    }

    await db.query('COMMIT');
    return new Response(JSON.stringify({ 
      message: removeAll ? 'Producto eliminado completamente del carrito.' : 'Producto eliminado del carrito.',
      stockRestaurado: true
    }), { status: 200 });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error al eliminar del carrito:', error);
    return new Response(JSON.stringify({ error: 'Error al eliminar el producto del carrito.' }), { status: 500 });
  }
}