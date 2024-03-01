-- Active: 1706133070546@@127.0.0.1@3306@clonteams
CREATE DATABASE clonteams;

USE clonteams;

CREATE TABLE
    USUARIOS (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50),
        apellido VARCHAR(50),
        email VARCHAR(100),
        fecha_registro DATE,
        perfil_Github VARCHAR(100),
        PASSWORD VARCHAR(100)
    );

ALTER TABLE USUARIOS
ADD COLUMN password VARCHAR(100);

SELECT
    *
FROM
    usuarios;

CREATE TABLE
    CATEGORIAS (
        id_categoria INT AUTO_INCREMENT PRIMARY KEY,
        nombre_categoria VARCHAR(50),
        descripcion VARCHAR(255)
    );

INSERT INTO
    CATEGORIAS (nombre_categoria, descripcion)
VALUES
    ('Categoria 4', 'Descripción de la categoría 1'),
    ('Categoria 5', 'Descripción de la categoría 2'),
    ('Categoria 6', 'Descripción de la categoría 3');

SELECT
    *
FROM
    CATEGORIAS;

DROP TABLE PROYECTOS;

CREATE TABLE
    PROYECTOS (
        id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
        nombre_proyecto VARCHAR(100),
        descripcion VARCHAR(255),
        fecha_inicio DATE,
        calificacion INT,
        enlaces VARCHAR(80),
        comentarios VARCHAR(100),
        id_usuario INT,
        id_categoria INT,
        FOREIGN KEY (id_categoria) REFERENCES CATEGORIAS (id_categoria),
        FOREIGN KEY (id_usuario) REFERENCES USUARIOS (id_usuario)
    );

CREATE TABLE
    ADMINS (
        id_admin INT AUTO_INCREMENT PRIMARY KEY,
        nombre_admin VARCHAR(50),
        apellido_admin VARCHAR(50),
        email_admin VARCHAR(100),
        password_admin VARCHAR(100),
        fecha_admin DATE
    );

SELECT
    *
FROM
    usuarios;

drop Table admins;

CREATE TABLE
    CONTACTO (
        id_contacto INT PRIMARY KEY AUTO_INCREMENT,
        id_usuarios INT
    );

INSERT INTO
    PROYECTOS (
        nombre_proyecto,
        descripcion,
        fecha_inicio,
        calificacion,
        enlaces,
        comentarios,
        id_usuario,
        id_categoria
    )
VALUES
    (
        'Proyecto 1',
        'Descripción del Proyecto 1',
        '2024-01-01',
        4,
        'https://enlace1.com',
        'Comentario sobre Proyecto 1',
        1,
        4
    ),
    (
        'Proyecto 2',
        'Descripción del Proyecto 2',
        '2024-02-15',
        3,
        'https://enlace2.com',
        'Comentario sobre Proyecto 2',
        2,
        3
    ),
    (
        'Proyecto 3',
        'Descripción del Proyecto 3',
        '2024-03-10',
        5,
        'https://enlace3.com',
        'Comentario sobre Proyecto 3',
        1,
        5
    );

INSERT INTO
    USUARIOS (nombre, apellido, email, fecha_registro)
VALUES
    ('Juan', 'Pérez', 'juan@example.com', NOW ()),
    ('María', 'González', 'maria@example.com', NOW ()),
    ('Pedro', 'Sánchez', 'pedro@example.com', NOW ());

show tables;

select
    *
from
    proyectos;

UPDATE PROYECTOS
SET
    enlaces = "https://github.com/IsaelFatamaDev/Proyecto_ClonTeams"
WHERE
    id_categoria = 1;

UPDATE CATEGORIAS
SET
    nombre_categoria = "JavaScript"
WHERE
    id_categoria = 1;

SELECT
    proyectos.*,
    categorias.nombre_categoria AS nombre_categoria
FROM
    proyectos
    JOIN categorias ON proyectos.id_categoria = categorias.id_categoria
WHERE
    proyectos.id_categoria = 1;

SELECT
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.email,
    u.fecha_registro,
    COUNT(p.id_proyecto) AS cantidad_proyectos
FROM
    usuarios u
    LEFT JOIN proyectos p ON u.id_usuario = p.id_usuario
GROUP BY
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.email,
    u.fecha_registro;

ALTER TABLE usuarios
ADD COLUMN perfil_Github VARCHAR(100);

SELECT
    categorias.nombre_categoria AS nombre_categoria,
    COUNT(proyectos.id_proyecto) AS cantidad_proyectos
FROM
    proyectos
    JOIN categorias ON proyectos.id_categoria = categorias.id_categoria
GROUP BY
    categorias.id_categoria
ORDER BY
    cantidad_proyectos DESC
LIMIT
    1;

UPDATE PROYECTOS
SET
    nombre_proyecto = "Creación de un chatBot",
    descripcion = "Voy a crear un ChatBot con ayuda de NodeJs"
WHERE
    id_proyecto = 6;

SELECT
    *
FROM
    proyectos;

select
    *
from
    categorias;

SELECT
    *
FROM
    usuarios;

DELETE FROM PROYECTOS
WHERE
    id_proyecto = 4;

SELECT
    *
FROM
    PROYECTOS;

SELECT
    nombre_categoria
FROM
    categorias
WHERE
    id_categoria = 2
SELECT
    *
FROM
    USUARIOS;

SELECT
    proyectos.*,
    usuarios.nombre AS nombre_usuario,
    usuarios.email AS email_usuario
FROM
    proyectos
    JOIN usuarios ON proyectos.id_usuario = usuarios.id_usuario
WHERE
    proyectos.id_proyecto = 5
SELECT
    *
FROM
    proyectos;

SELECT
    *
FROM
    categorias;

SELECT
    *
FROM
    usuarios;

    SELECT * FROM proyectos WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE nombre = 'Isael Javier')

    SELECT * FROM proyectos WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE nombre = 'Javi')