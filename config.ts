import mongoose from "mongoose";

// Reemplaza esto con TU cadena de conexión real de MongoDB Atlas
const MONGO_URI =
	"mongodb+srv://lucas:nodepass@cluster0.04dfwqy.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
	try {
		// Conectamos a MongoDB sin opciones obsoletas
		await mongoose.connect(MONGO_URI);
		console.log("✅ MongoDB Conectado Exitosamente");
	} catch (error) {
		console.error("❌ Error al conectar a MongoDB:", error);
		// Salir del proceso si falla la conexión a la DB es una práctica común
		process.exit(1);
	}
};
