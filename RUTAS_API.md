# LUCHRIS TRAVELS - Documentación de Rutas API

## Base URL
```
http://localhost:5000/api
```

---

## 🚢 CRUCEROS

### GET - Listar Cruceros (con filtros)
```
GET /api/cruceros
```

**Parámetros de consulta (query):**
- `salida`: "Republica Dominicana" o "Miami"
- `duracion`: número de días (ej: 7)
- `naviera`: nombre de la naviera (ej: "Royal Caribbean")
- `destino`: nombre del puerto/destino (ej: "San Juan")

**Ejemplo:**
```
GET /api/cruceros?salida=Republica Dominicana&duracion=7
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "cantidad": 5,
  "datos": [
    {
      "_id": "...",
      "nombre": "Crucero Caribeño",
      "naviera": "Royal Caribbean",
      "duracion": 7,
      "salida": "Republica Dominicana",
      "destinos": [...],
      "camarotes": [...],
      "servicios": [...]
    }
  ]
}
```

---

### GET - Obtener Crucero por ID
```
GET /api/cruceros/:id
```

---

### POST - Crear Crucero (Admin)
```
POST /api/cruceros
```

**Body (JSON):**
```json
{
  "nombre": "Crucero Caribeño",
  "naviera": "Royal Caribbean",
  "descripcion": "Descripción del crucero",
  "duracion": 7,
  "salida": "Republica Dominicana",
  "destinos": [
    {
      "puerto": "San Juan",
      "dias": 2
    }
  ],
  "camarotes": [
    {
      "tipo": "interior",
      "precio": 800,
      "disponibles": 50,
      "descripcion": "Camarote interior"
    }
  ],
  "servicios": ["Piscina", "Restaurantes", "Shows"]
}
```

---

### PUT - Actualizar Crucero (Admin)
```
PUT /api/cruceros/:id
```

---

### DELETE - Eliminar Crucero (Admin)
```
DELETE /api/cruceros/:id
```

---

## 👤 USUARIOS

### POST - Registro de Usuario
```
POST /api/usuarios/registro
```

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "8295502847",
  "cedula": "00123456789",
  "contrasena": "micontraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com"
  }
}
```

---

### POST - Login de Usuario
```
POST /api/usuarios/login
```

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "contrasena": "micontraseña123"
}
```

---

### GET - Obtener Perfil de Usuario
```
GET /api/usuarios/perfil/:usuarioId
```

---

### PUT - Actualizar Perfil de Usuario
```
PUT /api/usuarios/perfil/:usuarioId
```

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "8295502847",
  "direccion": "Calle Principal 123",
  "ciudad": "Baní",
  "pais": "República Dominicana"
}
```

---

## 🎫 RESERVAS

### GET - Obtener Reservas del Usuario
```
GET /api/reservas/usuario/:usuarioId
```

---

### GET - Obtener Reserva por ID
```
GET /api/reservas/:id
```

---

### POST - Crear Reserva
```
POST /api/reservas
```

**Body (JSON):**
```json
{
  "usuarioId": "...",
  "cruceroId": "...",
  "fechaSalida": "2026-05-15T00:00:00Z",
  "camarote": {
    "tipo": "interior"
  },
  "pasajeros": [
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "cedula": "00123456789",
      "pasaporte": "ABC123456"
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "mensaje": "Reserva creada exitosamente",
  "dato": {
    "_id": "...",
    "usuario": "...",
    "crucero": "...",
    "fechaSalida": "2026-05-15T00:00:00Z",
    "camarote": {
      "tipo": "interior",
      "precio": 800
    },
    "pasajeros": [...],
    "precioTotal": 800,
    "estado": "pendiente"
  }
}
```

---

### PUT - Actualizar Estado de Reserva
```
PUT /api/reservas/:id/estado
```

**Body (JSON):**
```json
{
  "estado": "pagada"
}
```

**Estados válidos:**
- `pendiente` - Reserva pendiente de confirmación
- `confirmada` - Reserva confirmada
- `pagada` - Reserva pagada
- `cancelada` - Reserva cancelada

---

### DELETE - Cancelar Reserva
```
DELETE /api/reservas/:id
```

---

## 🔒 Seguridad

**Token JWT:**
- Cada usuario recibe un token al registrarse o hacer login
- El token tiene una vigencia de 30 días
- Los tokens deben enviarse en el header `Authorization: Bearer <token>`

**Validación:**
- Todos los endpoints validan campos requeridos
- Las contraseñas se encriptan con bcrypt
- Los emails y cédulas deben ser únicos

---

## 📝 Códigos de Estado HTTP

- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Solicitud inválida)
- `401` - Unauthorized (No autorizado)
- `404` - Not Found (No encontrado)
- `500` - Server Error (Error del servidor)

---

## 🧪 Ejemplo de Flujo Completo

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "8295502847",
    "cedula": "00123456789",
    "contrasena": "micontraseña123"
  }'
```

### 2. Buscar Cruceros
```bash
curl -X GET "http://localhost:5000/api/cruceros?salida=Republica%20Dominicana&duracion=7"
```

### 3. Crear Reserva
```bash
curl -X POST http://localhost:5000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "ID_DEL_USUARIO",
    "cruceroId": "ID_DEL_CRUCERO",
    "fechaSalida": "2026-05-15T00:00:00Z",
    "camarote": {"tipo": "interior"},
    "pasajeros": [...]
  }'
```

---

## 📞 Soporte

Para más información contacta a:
- Email: luchristravels@gmail.com
- Teléfono: (829) 550-2847
