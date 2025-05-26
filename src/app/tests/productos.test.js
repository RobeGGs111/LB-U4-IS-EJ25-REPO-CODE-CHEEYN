import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../components/Products';

global.fetch = jest.fn();

describe('Componentes de productos', () => {
  beforeEach(() => {
    fetch.mockClear();
    global.alert = jest.fn(); 
  });



  //test 1
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
  });

  //test 2
  test('Actualiza el stock localmente al agregar al carrito', async () => {
    const mockProducts = [
      { ProductoID: 1, Nombre: 'Producto Test', Stock: 5 }
    ];
    
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );

    const { getByText } = render(<Products />);
    
    await waitFor(() => getByText('Producto Test'));
    
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );
    
    fireEvent.click(getByText('Agregar al carrito'));
    
    await waitFor(() => {
      expect(getByText('Stock disponible: 4')).toBeInTheDocument();
    });
  });


  // Test 3
  test('Muestra el precio correctamente formateado', async () => {
    const mockProducts = [
      { ProductoID: 1, Nombre: 'Producto Test', Precio: 250.50 }
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('$250.5')).toBeInTheDocument();
    });
  });

 


});