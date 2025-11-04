/**
 * EJEMPLOS DE ASINCRONÍA EN JAVASCRIPT/TYPESCRIPT
 * Demostraciones de Promesas y Async/Await
 */

// ============================================
// 1. EJEMPLO CON PROMESAS (Promise Syntax)
// ============================================

console.log("\n========== EJEMPLO 1: PROMESAS ==========\n");

/**
 * Función que simula una operación asíncrona con Promesas
 * Ejemplo: Buscar un usuario por ID en una base de datos
 */
function buscarUsuarioPromise(
	id: number
): Promise<{ id: number; nombre: string }> {
	console.log(`[Promise] Iniciando búsqueda del usuario ${id}...`);

	return new Promise((resolve, reject) => {
		// Simula el tiempo de respuesta de una BD (2 segundos)
		setTimeout(() => {
			if (id > 0) {
				// La promesa se cumple (fulfilled) con los datos del usuario
				console.log(`[Promise] Usuario ${id} encontrado!`);
				resolve({ id, nombre: `Usuario ${id}` });
			} else {
				// La promesa es rechazada (rejected) con un error
				console.log(`[Promise] Error: ID inválido`);
				reject(new Error("ID debe ser mayor que 0"));
			}
		}, 2000);
	});
}

/**
 * USO DE PROMESAS: Sintaxis con .then() y .catch()
 */
console.log("Llamando a buscarUsuarioPromise(1)...");

buscarUsuarioPromise(1)
	.then((usuario) => {
		console.log("[Promise] Éxito:", usuario);
		// Encadenar otra operación asíncrona
		return buscarUsuarioPromise(2);
	})
	.then((segundoUsuario) => {
		console.log("[Promise] Segundo usuario:", segundoUsuario);
	})
	.catch((error) => {
		console.error("[Promise] Error capturado:", error.message);
	})
	.finally(() => {
		console.log("[Promise] Operación finalizada\n");
	});

// ============================================
// 2. EJEMPLO CON ASYNC/AWAIT
// ============================================

console.log("\n========== EJEMPLO 2: ASYNC/AWAIT ==========\n");

/**
 * Función que simula una operación asíncrona con Promesas
 * (Misma que antes, pero la usaremos con async/await)
 */
function buscarUsuarioAsync(
	id: number
): Promise<{ id: number; nombre: string; email: string }> {
	console.log(`[Async/Await] Iniciando búsqueda del usuario ${id}...`);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (id > 0) {
				console.log(`[Async/Await] Usuario ${id} encontrado!`);
				resolve({
					id,
					nombre: `Usuario ${id}`,
					email: `usuario${id}@example.com`,
				});
			} else {
				console.log(`[Async/Await] Error: ID inválido`);
				reject(new Error("ID debe ser mayor que 0"));
			}
		}, 1500);
	});
}

/**
 * USO DE ASYNC/AWAIT: Sintaxis más limpia y legible
 */
async function ejemploAsyncAwait() {
	try {
		console.log("Llamando a buscarUsuarioAsync(1)...");

		// 'await' pausa la ejecución hasta que la promesa se resuelva
		const usuario1 = await buscarUsuarioAsync(1);
		console.log("[Async/Await] Éxito:", usuario1);

		// Podemos encadenar operaciones de forma secuencial
		console.log("\nLlamando a buscarUsuarioAsync(2)...");
		const usuario2 = await buscarUsuarioAsync(2);
		console.log("[Async/Await] Segundo usuario:", usuario2);

		// También podemos hacer operaciones en paralelo
		console.log("\n--- Búsqueda en PARALELO ---");
		const [user3, user4] = await Promise.all([
			buscarUsuarioAsync(3),
			buscarUsuarioAsync(4),
		]);
		console.log("[Async/Await] Usuarios en paralelo:", { user3, user4 });
	} catch (error: any) {
		console.error("[Async/Await] Error capturado:", error.message);
	} finally {
		console.log("[Async/Await] Operación finalizada\n");
	}
}

// Ejecutar el ejemplo después de 3 segundos (para que no se mezcle con el ejemplo de Promesas)
setTimeout(() => {
	ejemploAsyncAwait();
}, 3000);

// ============================================
// 3. COMPARACIÓN: PROMESAS VS ASYNC/AWAIT
// ============================================

console.log("\n========== EJEMPLO 3: COMPARACIÓN ==========\n");

/**
 * Simula obtener datos de un usuario y sus posts
 */
function obtenerUsuario(id: number): Promise<{ id: number; nombre: string }> {
	return new Promise((resolve) => {
		setTimeout(() => resolve({ id, nombre: `Usuario ${id}` }), 500);
	});
}

function obtenerPosts(usuarioId: number): Promise<string[]> {
	return new Promise((resolve) => {
		setTimeout(
			() =>
				resolve([
					`Post 1 de usuario ${usuarioId}`,
					`Post 2 de usuario ${usuarioId}`,
				]),
			500
		);
	});
}

// VERSIÓN CON PROMESAS (más verbosa)
console.log("--- Con Promesas (.then) ---");
obtenerUsuario(1)
	.then((usuario) => {
		console.log("Usuario obtenido:", usuario);
		return obtenerPosts(usuario.id);
	})
	.then((posts) => {
		console.log("Posts obtenidos:", posts);
	});

// VERSIÓN CON ASYNC/AWAIT (más limpia)
setTimeout(async () => {
	console.log("\n--- Con Async/Await ---");
	const usuario = await obtenerUsuario(1);
	console.log("Usuario obtenido:", usuario);

	const posts = await obtenerPosts(usuario.id);
	console.log("Posts obtenidos:", posts);
}, 2000);

// ============================================
// 4. MANEJO DE ERRORES
// ============================================

setTimeout(() => {
	console.log("\n========== EJEMPLO 4: MANEJO DE ERRORES ==========\n");

	// Con Promesas
	console.log("--- Manejo de error con Promesas ---");
	buscarUsuarioPromise(-1)
		.then((user) => console.log(user))
		.catch((error) => console.error("Error capturado:", error.message));

	// Con Async/Await
	setTimeout(async () => {
		console.log("\n--- Manejo de error con Async/Await ---");
		try {
			const user = await buscarUsuarioAsync(-1);
			console.log(user);
		} catch (error: any) {
			console.error("Error capturado:", error.message);
		}
	}, 2500);
}, 5000);

// ============================================
// RESUMEN DE CONCEPTOS
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 CONCEPTOS CLAVE DE ASINCRONÍA                  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  PROMESAS:                                                     ║
║  - new Promise((resolve, reject) => {...})                    ║
║  - .then() para éxito                                         ║
║  - .catch() para errores                                      ║
║  - .finally() siempre se ejecuta                              ║
║                                                                ║
║  ASYNC/AWAIT:                                                  ║
║  - async function() { ... }                                   ║
║  - await pausa hasta que la promesa se resuelve               ║
║  - try/catch para manejar errores                             ║
║  - Código más limpio y legible                                ║
║                                                                ║
║  ESTADOS DE PROMESA:                                           ║
║  - Pending (pendiente)                                        ║
║  - Fulfilled (cumplida) → resolve()                           ║
║  - Rejected (rechazada) → reject()                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

/**
 * PARA EJECUTAR ESTE ARCHIVO:
 *
 * Con ts-node:
 *   npx ts-node ejemplos-async.ts
 *
 * Con node (compilando primero):
 *   npx tsc ejemplos-async.ts && node ejemplos-async.js
 */
