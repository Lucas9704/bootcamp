import http from "http";
import { parse } from "url";
import { IncomingMessage, ServerResponse } from "http";

const PORT = 3004;
const hostname = "localhost";

// Base de datos en memoria
let usuarios: Array<{
	id: number;
	nombre: string;
	apellido: string;
	email: string;
}> = [
	{ id: 1, nombre: "Alice", apellido: "Smith", email: "alice@example.com" },
	{ id: 2, nombre: "Bob", apellido: "Johnson", email: "bob@example.com" },
	{ id: 3, nombre: "John", apellido: "Connor", email: "john@example.com" },
];
let nextId = 4;

// Helper para leer body
function getRequestBody(req: IncomingMessage): Promise<any> {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				resolve(body ? JSON.parse(body) : {});
			} catch (err) {
				reject(err);
			}
		});
		req.on("error", reject);
	});
}

const server = http.createServer(
	async (req: IncomingMessage, res: ServerResponse) => {
		const parsedUrl = parse(req.url || "", true);
		const pathname = parsedUrl.pathname || "/";
		const query = parsedUrl.query;
		const method = req.method || "GET";

		res.setHeader("Content-Type", "application/json");

		try {
			if (pathname === "/" && method === "GET") {
				res.writeHead(200);
				res.end(
					JSON.stringify({
						message: "Hello World with Node.js HTTP (TypeScript - ES Modules)",
					})
				);
				return;
			}

			if (pathname === "/usuarios" && method === "GET") {
				res.writeHead(200);
				res.end(JSON.stringify(usuarios));
				return;
			}

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

			if (pathname === "/user" && method === "GET") {
				const nombre = query.nombre as string | undefined;
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
				const nuevoUsuario = { id: nextId++, nombre, apellido, email };
				usuarios.push(nuevoUsuario);
				res.writeHead(201);
				res.end(JSON.stringify(nuevoUsuario));
				return;
			}

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

			res.writeHead(404);
			res.end(JSON.stringify({ error: "Ruta no encontrada" }));
		} catch (error: any) {
			res.writeHead(500);
			res.end(
				JSON.stringify({
					error: "Error interno del servidor",
					message: error?.message,
				})
			);
		}
	}
);

server.listen(PORT, hostname, () => {
	console.log(`Server running at http://${hostname}:${PORT}/`);
	console.log("Usando TypeScript + ES Modules (import)");
});
