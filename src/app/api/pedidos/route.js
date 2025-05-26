
import db from '../../../lib/db';

export async function POST() {
  const usuarioId = 1; 

  try {
    // Iniciar transacción para consistencia
    await db.query('START TRANSACTION');

    // Obtener el carrito más reciente
    const [carritos] = await db.query(
      'SELECT CarritoID FROM Carritos WHERE UsuarioID = ? ORDER BY FechaCreacion DESC LIMIT 1',
      [usuarioId]
    );

    if (carritos.length === 0) {
      await db.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'No hay carrito para procesar.' }), { status: 404 });
    }

    const carritoId = carritos[0].CarritoID;

    // Obtener productos del carrito
    const [productosCarrito] = await db.query(
      'SELECT ProductoID, Cantidad FROM CarritoDetalles WHERE CarritoID = ?',
      [carritoId]
    );

    if (productosCarrito.length === 0) {
      await db.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'El carrito está vacío.' }), { status: 400 });
    }

    // Crear nuevo pedido
    const [pedidoResult] = await db.query(
      'INSERT INTO Pedidos (UsuarioID) VALUES (?)',
      [usuarioId]
    );

    const pedidoId = pedidoResult.insertId;

    //  Mover productos a PedidoDetalles, descontar stock y actualizar stockOriginal
    for (const item of productosCarrito) {
      await db.query(
        'INSERT INTO PedidoDetalles (PedidoID, ProductoID, Cantidad) VALUES (?, ?, ?)',
        [pedidoId, item.ProductoID, item.Cantidad]
      );

      // Actualizar tanto el stock como el stockOriginal
      await db.query(
        'UPDATE Productos SET Stock = Stock - ?, StockOriginal = StockOriginal - ? WHERE ProductoID = ?',
        [item.Cantidad, item.Cantidad, item.ProductoID]
      );
    }

    // Vaciar el carrito
    await db.query(
      'DELETE FROM CarritoDetalles WHERE CarritoID = ?',
      [carritoId]
    );

    await db.query('COMMIT');
    return new Response(JSON.stringify({ 
      message: 'Pedido confirmado y stock actualizado.',
      stockActualizado: true
    }), { status: 200 });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al confirmar el pedido.' }), { status: 500 });
  }
}