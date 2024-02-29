-- Active: 1706133070546@@127.0.0.1@3306@demo
CREATE DATABASE clonteams;

USE clonteams;

CREATE TABLE USUARIOS (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    email VARCHAR(100),
    fecha_registro DATE
);

CREATE TABLE CATEGORIAS (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50),
    descripcion VARCHAR(255)
);
INSERT INTO CATEGORIAS (nombre_categoria, descripcion) VALUES 
('Categoria 1', 'Descripción de la categoría 1'),
('Categoria 2', 'Descripción de la categoría 2'),
('Categoria 3', 'Descripción de la categoría 3');

SELECT * FROM CATEGORIAS;
DROP TABLE PROYECTOS;
CREATE TABLE PROYECTOS (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proyecto VARCHAR(100),
    descripcion VARCHAR(255),
    fecha_inicio DATE,
    calificacion INT,
    enlaces VARCHAR(80),
    comentarios VARCHAR(100),
    id_usuario INT,
    id_categoria INT,
    FOREIGN KEY (id_categoria)
        REFERENCES CATEGORIAS(id_categoria),
    FOREIGN KEY (id_usuario)
        REFERENCES USUARIOS(id_usuario)
);

CREATE TABLE ADMINS (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre_admin VARCHAR(50),
    apellido_admin VARCHAR(50),
    email_admin VARCHAR(100)
);

CREATE TABLE CONTACTO (
    id_contacto INT PRIMARY KEY AUTO_INCREMENT,
    id_usuarios INT
);

INSERT INTO PROYECTOS (nombre_proyecto, descripcion, fecha_inicio, calificacion, enlaces, comentarios, id_usuario, id_categoria)
VALUES 
('Proyecto 1', 'Descripción del Proyecto 1', '2024-01-01', 4, 'https://enlace1.com', 'Comentario sobre Proyecto 1', 1, 1),
('Proyecto 2', 'Descripción del Proyecto 2', '2024-02-15', 3, 'https://enlace2.com', 'Comentario sobre Proyecto 2', 2, 2),
('Proyecto 3', 'Descripción del Proyecto 3', '2024-03-10', 5, 'https://enlace3.com', 'Comentario sobre Proyecto 3', 1, 2);
INSERT INTO USUARIOS (nombre, apellido, email, fecha_registro)
VALUES 
('Juan', 'Pérez', 'juan@example.com', NOW()),
('María', 'González', 'maria@example.com', NOW()),
('Pedro', 'Sánchez', 'pedro@example.com', NOW());
select * from proyectos;

SELECT proyectos.*, categorias.nombre_categoria AS nombre_categoria FROM proyectos JOIN categorias ON proyectos.id_categoria = categorias.id_categoria WHERE proyectos.id_categoria = 1;