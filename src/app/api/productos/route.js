import db from '../../../lib/db'; // asegúrate que esto esté bien configurado

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    return Response.json(rows); // Devuelve los productos en JSON
  } catch (error) {
    console.error('Error cargando productos:', error);
    return new Response('Error cargando productos', { status: 500 });
  }
}
