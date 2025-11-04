/**
 * Servicio de Base de Datos (Simulado)
 * Este archivo contiene funciones para interactuar con la "base de datos"
 * En este caso, simula operaciones asíncronas con delays
 */

// Base de datos en memoria
let usuarios = [
	{ id: 1, nombre: "Alice", apellido: "Smith", email: "alice@example.com" },
	{ id: 2, nombre: "Bob", apellido: "Johnson", email: "bob@example.com" },
	{ id: 3, nombre: "John", apellido: "Connor", email: "john@example.com" },
];
let nextId = 4;

/**
 * Obtiene todos los usuarios de la base de datos
 * Simula una operación asíncrona con un delay de 500ms
 * @returns Promise con el array de usuarios
 */
export const getUsuariosDB = (): Promise<typeof usuarios> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(usuarios), 5000);
	});
};

/**
 * Exporta el array de usuarios para manipulación directa
 * (usado en operaciones CRUD)
 */
export { usuarios, nextId };

/**
 * Incrementa el ID para el siguiente usuario
 */
export const incrementNextId = () => {
	return nextId++;
};
