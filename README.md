# Taller Práctico: API REST con Express.js y TypeScript

## 🎯 Objetivo

Crear un servidor web que gestione una lista de "usuarios" (en memoria) y responda a las principales solicitudes HTTP (GET, POST, PUT, DELETE).

## 📋 Contenido del Taller

### Paso 1: Configuración del Proyecto ✅

El proyecto ya está configurado con:

- ✅ `package.json` con todas las dependencias necesarias
- ✅ `tsconfig.json` para configuración de TypeScript
- ✅ `server.ts` con la implementación completa de la API

### Paso 2: Instalar Dependencias

Ejecuta el siguiente comando para instalar todas las dependencias:

```bash
npm install
```

### Paso 3: Iniciar el Servidor

El proyecto incluye varias versiones del servidor. Usa uno de estos comandos según lo que quieras ejecutar:

- Servidor con Express.js y TypeScript (Puerto 3000):

```bash
npm start
```

- Servidor Node.js nativo (TypeScript - CommonJS) (Puerto 3003):

```bash
npm run start:node:cjs
```

- Servidor Node.js nativo (JavaScript - CommonJS) (Puerto 3001):

```bash
npm run start:node:js
```

- Servidor Node.js nativo (JavaScript - ES Modules) (Puerto 3002):

```bash
npm run start:node:mjs
```

Deberías ver en la consola el mensaje correspondiente a cada servidor.

## 🧪 Pruebas de la API

Puedes usar **Thunder Client**, **Postman** o **Insomnia** para probar los endpoints.

### 1. GET `/` - Hello World

```
GET http://localhost:3000/
```

**Respuesta esperada:** `Hello World with Express`

### 2. GET `/usuarios` - Obtener todos los usuarios

```
GET http://localhost:3000/usuarios
```

**Respuesta esperada:** JSON con lista de 3 usuarios

### 3. GET `/usuarios/:id` - Obtener usuario por ID (req.params)

```
GET http://localhost:3000/usuarios/2
```

**Respuesta esperada:** JSON del usuario con ID 2 (Bob Johnson)

### 4. GET `/user?nombre=John` - Buscar por nombre (req.query)

```
GET http://localhost:3000/user?nombre=John
```

**Respuesta esperada:** JSON con usuario(s) llamado(s) "John"

### 5. POST `/new-user` - Crear nuevo usuario (req.body)

```
POST http://localhost:3000/new-user
Content-Type: application/json

{
  "nombre": "Sarah",
  "apellido": "Connor",
  "email": "sarah@skynet.com"
}
```

**Respuesta esperada:** JSON con el nuevo usuario (ID 4) y estado `201 Created`

### 6. PUT `/usuarios/:id` - Actualizar usuario

```
PUT http://localhost:3000/usuarios/1
Content-Type: application/json

{
  "email": "new_alice@example.com"
}
```

**Respuesta esperada:** JSON del usuario 1 con email actualizado

### 7. DELETE `/usuarios/:id` - Eliminar usuario

```
DELETE http://localhost:3000/usuarios/3
```

**Respuesta esperada:** JSON del usuario eliminado (John Connor)

## 📚 Conceptos Aprendidos

### API REST

- ✅ **Métodos HTTP**: GET, POST, PUT, DELETE
- ✅ **req.params**: Parámetros de ruta (`:id`)
- ✅ **req.query**: Parámetros de consulta (`?nombre=valor`)
- ✅ **req.body**: Cuerpo de la solicitud (datos JSON)
- ✅ **Códigos de estado HTTP**: 200, 201, 400, 404
- ✅ **Middleware**: `express.json()`
- ✅ **CRUD completo**: Create, Read, Update, Delete

### Sistemas de Módulos en Node.js

- ✅ **CommonJS**: `require()` / `module.exports` (archivo `.js`)
- ✅ **ES Modules**: `import` / `export` (archivo `.mjs` o `"type": "module"`)
- ✅ **Node.js HTTP nativo**: Sin framework, usando solo `http` module

### Diferencias Clave

| Característica  | CommonJS         | ES Modules                            |
| --------------- | ---------------- | ------------------------------------- |
| Sintaxis Import | `require()`      | `import`                              |
| Sintaxis Export | `module.exports` | `export`                              |
| Extensión       | `.js`            | `.mjs` o `.js` con `"type": "module"` |
| Carga           | Síncrona         | Asíncrona                             |
| Top-level await | ❌ No            | ✅ Sí                                 |

## 🚀 Próximos Pasos

1. Prueba todos los endpoints con Thunder Client
2. Intenta agregar validaciones adicionales
3. Experimenta con diferentes códigos de estado HTTP
4. Agrega más campos a los usuarios

## 📦 Estructura del Proyecto

```
taller-express/
├── .github/
│   └── copilot-instructions.md
├── node_modules/
├── package.json
├── tsconfig.json
├── server.ts           (Express + TypeScript - Puerto 3000)
├── servernode.js       (Node.js HTTP + CommonJS - Puerto 3001)
├── servernode.mjs      (Node.js HTTP + ES Modules - Puerto 3002)
└── README.md
```

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web
- **TypeScript**: Lenguaje tipado
- **ts-node**: Ejecutor de TypeScript

---

¡Felicidades! Has completado el taller práctico de API REST con Express.js 🎉
