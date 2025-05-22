import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../components/Products';
import { addToCart } from '../components/Products';

global.fetch = jest.fn();

describe('Componentes de productos', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
//test 1
  test('Carga el menú principal', () => {
    render(<Products />);
    expect(screen.getByText('Nuestra Colección de Moda')).toBeInTheDocument();
  });
//test 2
  test('Recolecta y muestra los productos', async () => {
    const mockProducts = [
      { ProductoID: 1, Nombre: 'Camisa Blanca', Descripcion: 'Camisa formal de algodón, manga larga.', Precio: 250.00, stock:10 },
      { ProductoID: 2, Nombre: 'Sombrero', Descripcion: 'Sombrero elegante', Precio: 49.99, stock:10 },
    ];

     fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Camisa Blanca')).toBeInTheDocument();
      expect(screen.getByText('Sombrero')).toBeInTheDocument();
    });
  })
});