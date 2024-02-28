-- Active: 1706133070546@@127.0.0.1@3306@demo
CREATE DATABASE clonteams;

USE clonteams;

CREATE TABLE
     USUARIOS (
          id_usuario INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(50),
          apellido VARCHAR(50),
          email VARCHAR(100),
          fecha_registro DATE
     );

CREATE TABLE
     CATEGORIAS (
          id_categoria INT AUTO_INCREMENT PRIMARY KEY,
          nombre_categoria VARCHAR(50),
          descripcion VARCHAR(255)
     );

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
          id_categoria INT
     );

CREATE TABLE
     ADMINS (
          id_admin INT AUTO_INCREMENT PRIMARY KEY,
          nombre_admin VARCHAR(50),
          apellido_admin VARCHAR(50),
          email_admin VARCHAR(100)
     );

CREATE TABLE
     CONTACTO (
          id_contacto INT PRIMARY KEY AUTO_INCREMENT,
          id_usuarios INT,
     );