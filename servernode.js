// Servidor HTTP nativo con Node.js usando CommonJS
const http = require("http");
const url = require("url");

const PORT = 3001;
const hostname = "localhost";

// Base de datos en memoria
let usuarios = [
	{ id: 1, nombre: "Alice", apellido: "Smith", email: "alice@example.com" },
	{ id: 2, nombre: "Bob", apellido: "Johnson", email: "bob@example.com" },
	{ id: 3, nombre: "John", apellido: "Connor", email: "john@example.com" },
];
let nextId = 4;

// Función helper para leer el body de la petición
function getRequestBody(req) {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				resolve(body ? JSON.parse(body) : {});
			} catch (error) {
				reject(error);
			}
		});
		req.on("error", reject);
	});
}

// Crear el servidor
const server = http.createServer(async (req, res) => {
	// Parsear la URL
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;
	const query = parsedUrl.query;
	const method = req.method;

	// Headers para JSON
	res.setHeader("Content-Type", "application/json");

	try {
		// Ruta raíz - GET /
		if (pathname === "/" && method === "GET") {
			res.writeHead(200);
			res.end(JSON.stringify({ message: "Hello World with Node.js HTTP" }));
			return;
		}

		// GET /usuarios - Obtener todos los usuarios
		if (pathname === "/usuarios" && method === "GET") {
			res.writeHead(200);
			res.end(JSON.stringify(usuarios));
			return;
		}

		// GET /usuarios/:id - Obtener usuario por ID (req.params)
		const usuarioMatch = pathname.match(/^\/usuarios\/(\d+)$/);
		if (usuarioMatch && method === "GET") {
			const id = parseInt(usuarioMatch[1]);
			const usuario = usuarios.find((u) => u.id === id);

			if (!usuario) {
				res.writeHead(404);
				res.end(JSON.stringify({ error: "Usuario no encontrado" }));
				return;
			}

			res.writeHead(200);
			res.end(JSON.stringify(usuario));
			return;
		}

		// GET /user?nombre=X - Buscar por nombre (req.query)
		if (pathname === "/user" && method === "GET") {
			const { nombre } = query;

			if (!nombre) {
				res.writeHead(400);
				res.end(JSON.stringify({ error: 'Parámetro "nombre" requerido' }));
				return;
			}

			const filtrados = usuarios.filter(
				(u) => u.nombre.toLowerCase() === nombre.toLowerCase()
			);

			res.writeHead(200);
			res.end(JSON.stringify(filtrados));
			return;
		}

		// POST /new-user - Crear nuevo usuario (req.body)
		if (pathname === "/new-user" && method === "POST") {
			const body = await getRequestBody(req);
			const { nombre, apellido, email } = body;

			if (!nombre || !apellido || !email) {
				res.writeHead(400);
				res.end(
					JSON.stringify({ error: "Faltan datos (nombre, apellido, email)" })
				);
				return;
			}

			const nuevoUsuario = {
				id: nextId++,
				nombre,
				apellido,
				email,
			};

			usuarios.push(nuevoUsuario);

			res.writeHead(201);
			res.end(JSON.stringify(nuevoUsuario));
			return;
		}

		// PUT /usuarios/:id - Actualizar usuario
		if (usuarioMatch && method === "PUT") {
			const id = parseInt(usuarioMatch[1]);
			const index = usuarios.findIndex((u) => u.id === id);

			if (index === -1) {
				res.writeHead(404);
				res.end(JSON.stringify({ error: "Usuario no encontrado" }));
				return;
			}

			const body = await getRequestBody(req);
			usuarios[index] = { ...usuarios[index], ...body };

			res.writeHead(200);
			res.end(JSON.stringify(usuarios[index]));
			return;
		}

		// DELETE /usuarios/:id - Eliminar usuario
		if (usuarioMatch && method === "DELETE") {
			const id = parseInt(usuarioMatch[1]);
			const index = usuarios.findIndex((u) => u.id === id);

			if (index === -1) {
				res.writeHead(404);
				res.end(JSON.stringify({ error: "Usuario no encontrado" }));
				return;
			}

			const eliminado = usuarios.splice(index, 1);

			res.writeHead(200);
			res.end(JSON.stringify(eliminado[0]));
			return;
		}

		// Ruta no encontrada
		res.writeHead(404);
		res.end(JSON.stringify({ error: "Ruta no encontrada" }));
	} catch (error) {
		res.writeHead(500);
		res.end(
			JSON.stringify({
				error: "Error interno del servidor",
				message: error.message,
			})
		);
	}
});

// Iniciar el servidor
server.listen(PORT, hostname, () => {
	console.log(`Server running at http://${hostname}:${PORT}/`);
	console.log("Usando CommonJS (require/module.exports)");
});
