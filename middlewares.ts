import { Request, Response } from "express";
import { NextFunction } from "express";
import Usuario from "./models/Usuario";

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

// Middleware para validar que el solicitante existe en la DB
export const validateRequesterExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// 1. Obtener el ID del usuario desde los encabezados personalizados
		const requesterId = req.headers["x-requester-id"];

		// 2. Validar que el encabezado exista
		if (!requesterId) {
			return res
				.status(400)
				.json({ mensaje: "Falta el encabezado x-requester-id" });
		}

		// 3. Buscar al usuario en la base de datos real de MongoDB
		const userExists = await Usuario.findById(requesterId);

		// 4. Si no existe, denegar acceso
		if (!userExists) {
			return res.status(401).json({
				mensaje: "Acceso denegado: El usuario solicitante no existe en la BD",
			});
		}

		// 5. Si existe, permitir continuar
		console.log(`✅ Solicitud autorizada para el usuario: ${userExists.email}`);
		next();
	} catch (error) {
		// Manejo de errores (por ejemplo, si el ID enviado no tiene formato válido de MongoDB)
		return res.status(500).json({ mensaje: "Error al validar usuario", error });
	}
};
