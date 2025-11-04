// Importar express y los tipos Request/Response
import express, { NextFunction, Request, Response } from "express";
// Importar middlewares personalizados
import { logger, isAdmin } from "./middlewares";
// Importar servicios de base de datos
import { getUsuariosDB, usuarios, incrementNextId } from "./database";

const PORT = 3000;
const hostname = "localhost";
const app = express();

// Middleware para que Express entienda JSON en el body
app.use(express.json());

// Aplicar middleware de logging a todas las rutas
app.use(logger);

// --- RUTAS (ENDPOINTS) ---

// Ruta raíz
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World with Express");
});

// Obtener todos los usuarios (Refactorizado a async/await)
app.get("/usuarios", async (req: Request, res: Response) => {
	try {
		console.log("Buscando usuarios en la 'Base de Datos'...");
		const listaUsuarios = await getUsuariosDB();
		console.log("Usuarios encontrados.");
		res.json(listaUsuarios);
	} catch (error) {
		console.error("Error al buscar usuarios", error);
		res.status(500).send("Error en el servidor");
	}
});

// Ruta protegida por el middleware 'isAdmin'
app.get("/admin", isAdmin, (req: Request, res: Response) => {
	res.send("Hola Admin");
});

// Obtener un usuario por ID usando req.params
app.get("/usuarios/:id", (req: Request, res: Response) => {
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
app.get("/user", (req: Request, res: Response) => {
	// Extraer 'nombre' de req.query
	const { nombre } = req.query;

	if (nombre) {
		const filtrados = usuarios.filter(
			(u) => u.nombre.toLowerCase() === (nombre as string).toLowerCase()
		);
		return res.json(filtrados);
	}

	// Si no hay query 'nombre', podemos enviar un error o la lista completa
	res.status(400).send('Parámetro "nombre" requerido');
});

// Crear un nuevo usuario usando req.body
app.post("/new-user", (req: Request, res: Response) => {
	// Desestructuramos los datos del body
	const { nombre, apellido, email } = req.body;

	if (!nombre || !apellido || !email) {
		return res.status(400).send("Faltan datos (nombre, apellido, email)");
	}

	const nuevoUsuario = {
		id: incrementNextId(),
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
app.patch("/usuarios/:id", (req: Request, res: Response) => {
	const { id } = req.params;

	const index = usuarios.findIndex((u) => u.id === parseInt(id));

	if (index === -1) {
		return res.status(404).send("Usuario no encontrado");
	}

	// Actualiza los datos
	usuarios[index] = { ...usuarios[index], ...req.body };

	res.json(usuarios[index]);
});

// Eliminar un usuario por ID
app.delete("/usuarios/:id", (req: Request, res: Response) => {
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
