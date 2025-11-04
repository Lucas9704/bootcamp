import { Request, Response } from "express";

/**
 * Middleware de Logging (Global)
 * Registra en consola cada solicitud que llega al servidor
 * Imprime el método HTTP y la ruta
 */
export const logger = (req: Request, res: Response, next: Function) => {
	console.log(`${req.method} ${req.path}`);
	// Llama a next() para pasar el control al siguiente middleware o ruta
	next();
};

/**
 * Middleware de Autorización (Específico de Ruta)
 * Verifica si el usuario tiene permisos de administrador
 * Espera recibir { isAdmin: true } en el body de la petición
 */
export function isAdmin(req: Request, res: Response, next: Function) {
	const { isAdmin } = req.body;

	if (isAdmin) {
		// Si es admin, pasa al siguiente handler
		next();
	} else {
		// Si no es admin, corta la solicitud y envía un error 401
		res.status(401).send("No tienes permisos para acceder a esta ruta");
	}
}
