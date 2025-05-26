-- Crear la base de datos
CREATE DATABASE Cheeyn;
USE Cheeyn;


CREATE TABLE Usuarios (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Correo VARCHAR(100) UNIQUE,
    Contrasena VARCHAR(255)
);


CREATE TABLE Productos (
    ProductoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Descripcion VARCHAR(255),
    Precio DECIMAL(10, 2),
    Stock INT
);


CREATE TABLE Carritos (
    CarritoID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);


CREATE TABLE CarritoDetalles (
    DetalleID INT AUTO_INCREMENT PRIMARY KEY,
    CarritoID INT,
    ProductoID INT,
    Cantidad INT,
    FOREIGN KEY (CarritoID) REFERENCES Carritos(CarritoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);


CREATE TABLE Pedidos (
    PedidoID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT,
    FechaPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    Total DECIMAL(10, 2),
    Estado VARCHAR(50),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);


CREATE TABLE PedidoDetalles (
    PedidoDetalleID INT AUTO_INCREMENT PRIMARY KEY,
    PedidoID INT,
    ProductoID INT,
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);


INSERT INTO Productos (nombre, precio, descripcion, stock) VALUES
('Camisa Blanca', '250', 'Camisa formal de algodón, manga larga.', 15),
('Pantalón Negro', '450', 'Pantalón casual para uso diario.', 10),
('Blusa Floral', '300', 'Blusa ligera con estampado floral.', 8),
('Chamarra de Mezclilla', '600', 'Chamarra unisex de mezclilla azul.', 5),
('Vestido Rojo', '550', 'Vestido de fiesta corto, elegante.', 3);
