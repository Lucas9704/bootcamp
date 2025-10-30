"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importar express y los tipos Request/Response
const express_1 = __importDefault(require("express"));
const PORT = 3000;
const hostname = "localhost";
const app = (0, express_1.default)();
// Middleware para que Express entienda JSON en el body
app.use(express_1.default.json());
// Base de datos en memoria
let usuarios = [
    { id: 1, nombre: "Alice", apellido: "Smith", email: "alice@example.com" },
    { id: 2, nombre: "Bob", apellido: "Johnson", email: "bob@example.com" },
    { id: 3, nombre: "John", apellido: "Connor", email: "john@example.com" },
];
let nextId = 4;
// --- RUTAS (ENDPOINTS) ---
// Ruta raíz
app.get("/", (req, res) => {
    res.send("Hello World with Express");
});
// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    res.json(usuarios);
});
// Obtener un usuario por ID usando req.params
app.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const usuario = usuarios.find((u) => u.id === parseInt(id));
    if (!usuario) {
        // Si no se encuentra, enviar un código 404
        return res.status(404).send("Usuario no encontrado");
    }
    res.json(usuario);
});
// Buscar usuarios por nombre usando req.query
// Ejemplo de consulta: /user?nombre=John
app.get("/user", (req, res) => {
    // Extraer 'nombre' de req.query
    const { nombre } = req.query;
    if (nombre) {
        const filtrados = usuarios.filter((u) => u.nombre.toLowerCase() === nombre.toLowerCase());
        return res.json(filtrados);
    }
    // Si no hay query 'nombre', podemos enviar un error o la lista completa
    res.status(400).send('Parámetro "nombre" requerido');
});
// Crear un nuevo usuario usando req.body
app.post("/new-user", (req, res) => {
    // Desestructuramos los datos del body
    const { nombre, apellido, email } = req.body;
    if (!nombre || !apellido || !email) {
        return res.status(400).send("Faltan datos (nombre, apellido, email)");
    }
    const nuevoUsuario = {
        id: nextId++,
        nombre: nombre,
        apellido: apellido,
        email: email,
    };
    // Lógica para guardar (en nuestro array)
    usuarios.push(nuevoUsuario);
    // Enviamos una respuesta exitosa, código 201 (Created)
    res.status(201).json(nuevoUsuario);
});
// Actualizar un usuario por ID
app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email } = req.body;
    const index = usuarios.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send("Usuario no encontrado");
    }
    // Actualiza los datos
    usuarios[index] = { ...usuarios[index], ...req.body };
    res.json(usuarios[index]);
});
// Eliminar un usuario por ID
app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const index = usuarios.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send("Usuario no encontrado");
    }
    // Elimina el usuario del array
    const eliminado = usuarios.splice(index, 1);
    res.json(eliminado[0]);
});
// Iniciar el servidor
app.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});
