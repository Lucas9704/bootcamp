/**
 * EJEMPLOS PRÁCTICOS DE ASINCRONÍA EN EXPRESS
 * Aplicando Promesas y Async/Await a operaciones reales
 */

import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// ============================================
// SIMULACIÓN DE SERVICIOS DE BASE DE DATOS
// ============================================

interface Usuario {
	id: number;
	nombre: string;
	email: string;
}

interface Post {
	id: number;
	titulo: string;
	usuarioId: number;
}

// Base de datos simulada
const usuariosDB: Usuario[] = [
	{ id: 1, nombre: "Alice", email: "alice@example.com" },
	{ id: 2, nombre: "Bob", email: "bob@example.com" },
	{ id: 3, nombre: "Charlie", email: "charlie@example.com" },
];

const postsDB: Post[] = [
	{ id: 1, titulo: "Aprendiendo TypeScript", usuarioId: 1 },
	{ id: 2, titulo: "Async/Await explicado", usuarioId: 1 },
	{ id: 3, titulo: "Introducción a Express", usuarioId: 2 },
];

// ============================================
// EJEMPLO 1: PROMESAS EN SERVICIOS
// ============================================

/**
 * Servicio que usa PROMESAS para obtener un usuario
 */
function obtenerUsuarioPorIdPromise(id: number): Promise<Usuario> {
	console.log(`[Promise Service] Buscando usuario ${id}...`);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const usuario = usuariosDB.find((u) => u.id === id);

			if (usuario) {
				console.log(`[Promise Service] Usuario ${id} encontrado`);
				resolve(usuario);
			} else {
				console.log(`[Promise Service] Usuario ${id} no existe`);
				reject(new Error(`Usuario con ID ${id} no encontrado`));
			}
		}, 1000); // Simula 1 segundo de latencia de BD
	});
}

/**
 * RUTA CON PROMESAS: .then() y .catch()
 */
app.get("/api/v1/usuarios/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id);

	console.log(`[Ruta Promise] Recibida petición para usuario ${id}`);

	obtenerUsuarioPorIdPromise(id)
		.then((usuario) => {
			res.json({
				success: true,
				data: usuario,
			});
		})
		.catch((error) => {
			res.status(404).json({
				success: false,
				error: error.message,
			});
		});
});

// ============================================
// EJEMPLO 2: ASYNC/AWAIT EN SERVICIOS
// ============================================

/**
 * Servicio que usa PROMESAS (pero lo consumiremos con async/await)
 */
function obtenerUsuarioPorIdAsync(id: number): Promise<Usuario> {
	console.log(`[Async Service] Buscando usuario ${id}...`);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const usuario = usuariosDB.find((u) => u.id === id);

			if (usuario) {
				console.log(`[Async Service] Usuario ${id} encontrado`);
				resolve(usuario);
			} else {
				console.log(`[Async Service] Usuario ${id} no existe`);
				reject(new Error(`Usuario con ID ${id} no encontrado`));
			}
		}, 800);
	});
}

function obtenerPostsPorUsuarioAsync(usuarioId: number): Promise<Post[]> {
	console.log(`[Async Service] Buscando posts del usuario ${usuarioId}...`);

	return new Promise((resolve) => {
		setTimeout(() => {
			const posts = postsDB.filter((p) => p.usuarioId === usuarioId);
			console.log(`[Async Service] ${posts.length} posts encontrados`);
			resolve(posts);
		}, 600);
	});
}

/**
 * RUTA CON ASYNC/AWAIT: Código más limpio y legible
 */
app.get("/api/v2/usuarios/:id", async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		console.log(`[Ruta Async] Recibida petición para usuario ${id}`);

		// Await pausa la ejecución hasta obtener el resultado
		const usuario = await obtenerUsuarioPorIdAsync(id);

		res.json({
			success: true,
			data: usuario,
		});
	} catch (error: any) {
		// Manejo de errores con try/catch
		res.status(404).json({
			success: false,
			error: error.message,
		});
	}
});

// ============================================
// EJEMPLO 3: OPERACIONES SECUENCIALES
// ============================================

/**
 * Obtener usuario Y sus posts (operaciones dependientes)
 */
app.get("/api/v2/usuarios/:id/posts", async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		console.log(`[Ruta Async] Obteniendo usuario ${id} y sus posts...`);

		// SECUENCIAL: Primero el usuario, luego sus posts
		const usuario = await obtenerUsuarioPorIdAsync(id);
		console.log(`[Ruta Async] Usuario obtenido, ahora buscando posts...`);

		const posts = await obtenerPostsPorUsuarioAsync(usuario.id);

		res.json({
			success: true,
			data: {
				usuario,
				posts,
				totalPosts: posts.length,
			},
		});
	} catch (error: any) {
		res.status(404).json({
			success: false,
			error: error.message,
		});
	}
});

// ============================================
// EJEMPLO 4: OPERACIONES EN PARALELO
// ============================================

/**
 * Obtener múltiples usuarios AL MISMO TIEMPO
 * Usa Promise.all() para ejecutar en paralelo
 */
app.get("/api/v2/usuarios-multiples", async (req: Request, res: Response) => {
	try {
		const ids = [1, 2, 3]; // IDs a buscar
		console.log(`[Ruta Async] Buscando múltiples usuarios en PARALELO...`);

		const inicio = Date.now();

		// Promise.all ejecuta todas las promesas en paralelo
		const usuarios = await Promise.all(
			ids.map((id) => obtenerUsuarioPorIdAsync(id))
		);

		const tiempoTotal = Date.now() - inicio;
		console.log(`[Ruta Async] Búsqueda completada en ${tiempoTotal}ms`);

		res.json({
			success: true,
			data: usuarios,
			tiempoMs: tiempoTotal,
			nota: "Búsquedas ejecutadas en paralelo con Promise.all()",
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// ============================================
// EJEMPLO 5: COMPARACIÓN SECUENCIAL VS PARALELO
// ============================================

app.get("/api/v2/comparacion", async (req: Request, res: Response) => {
	try {
		const ids = [1, 2, 3];

		// SECUENCIAL: Uno después del otro
		console.log("\n--- BÚSQUEDA SECUENCIAL ---");
		const inicioSecuencial = Date.now();

		const usuariosSecuencial: Usuario[] = [];
		for (const id of ids) {
			const usuario = await obtenerUsuarioPorIdAsync(id);
			usuariosSecuencial.push(usuario);
		}

		const tiempoSecuencial = Date.now() - inicioSecuencial;
		console.log(`Tiempo secuencial: ${tiempoSecuencial}ms`);

		// PARALELO: Todos al mismo tiempo
		console.log("\n--- BÚSQUEDA PARALELA ---");
		const inicioParalelo = Date.now();

		const usuariosParalelo = await Promise.all(
			ids.map((id) => obtenerUsuarioPorIdAsync(id))
		);

		const tiempoParalelo = Date.now() - inicioParalelo;
		console.log(`Tiempo paralelo: ${tiempoParalelo}ms`);

		res.json({
			success: true,
			comparacion: {
				secuencial: {
					tiempoMs: tiempoSecuencial,
					usuarios: usuariosSecuencial.length,
				},
				paralelo: {
					tiempoMs: tiempoParalelo,
					usuarios: usuariosParalelo.length,
				},
				mejora: `${Math.round(
					(tiempoSecuencial / tiempoParalelo) * 100
				)}% más rápido`,
			},
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// ============================================
// EJEMPLO 6: MANEJO DE ERRORES AVANZADO
// ============================================

app.get(
	"/api/v2/usuario-con-validacion/:id",
	async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);

			// Validación previa
			if (isNaN(id) || id < 1) {
				throw new Error("ID inválido: debe ser un número mayor que 0");
			}

			const usuario = await obtenerUsuarioPorIdAsync(id);
			const posts = await obtenerPostsPorUsuarioAsync(usuario.id);

			res.json({
				success: true,
				data: { usuario, posts },
			});
		} catch (error: any) {
			console.error("[Error]:", error.message);

			// Diferentes códigos de estado según el error
			if (error.message.includes("no encontrado")) {
				res.status(404).json({
					success: false,
					error: error.message,
				});
			} else if (error.message.includes("inválido")) {
				res.status(400).json({
					success: false,
					error: error.message,
				});
			} else {
				res.status(500).json({
					success: false,
					error: "Error interno del servidor",
				});
			}
		}
	}
);

// ============================================
// RUTA DE DOCUMENTACIÓN
// ============================================

app.get("/api/v2", (req: Request, res: Response) => {
	res.json({
		mensaje: "API de Ejemplos de Asincronía",
		endpoints: {
			"GET /api/v1/usuarios/:id": "Usuario con Promesas (.then/.catch)",
			"GET /api/v2/usuarios/:id": "Usuario con Async/Await",
			"GET /api/v2/usuarios/:id/posts": "Usuario y posts (secuencial)",
			"GET /api/v2/usuarios-multiples": "Múltiples usuarios (paralelo)",
			"GET /api/v2/comparacion": "Comparación secuencial vs paralelo",
			"GET /api/v2/usuario-con-validacion/:id":
				"Con validaciones y manejo de errores",
		},
		conceptos: {
			promesas: "new Promise, .then(), .catch(), .finally()",
			asyncAwait: "async function, await, try/catch",
			paralelo: "Promise.all() para operaciones simultáneas",
			secuencial: "await consecutivos para operaciones dependientes",
		},
	});
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = 3005;
const hostname = "localhost";

app.listen(PORT, hostname, () => {
	console.log(`
╔════════════════════════════════════════════════════════════════╗
║       SERVIDOR DE EJEMPLOS ASYNC CORRIENDO                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  URL: http://${hostname}:${PORT}                                    ║
║                                                                ║
║  Prueba estos endpoints:                                       ║
║  - GET http://localhost:${PORT}/api/v2                              ║
║  - GET http://localhost:${PORT}/api/v1/usuarios/1                   ║
║  - GET http://localhost:${PORT}/api/v2/usuarios/1                   ║
║  - GET http://localhost:${PORT}/api/v2/usuarios/1/posts             ║
║  - GET http://localhost:${PORT}/api/v2/usuarios-multiples           ║
║  - GET http://localhost:${PORT}/api/v2/comparacion                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
	`);
});

/**
 * PARA EJECUTAR:
 * npx ts-node ejemplos-async-express.ts
 *
 * Luego usa Thunder Client, Postman o curl para probar las rutas
 */
