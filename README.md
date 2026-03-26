# LUCHRIS TRAVELS - Backend Server

Backend API para la plataforma de agencia de viajes LUCHRIS TRAVELS.

## Instalación

1. Navega a la carpeta `server`:
```bash
cd server
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Configura tus variables de entorno:
   - `MONGODB_URI`: Tu URI de conexión a MongoDB Atlas
   - `JWT_SECRET`: Una clave secreta para JWT
   - `STRIPE_SECRET_KEY`: Tu clave secreta de Stripe (para pagos)

## Ejecución

Para desarrollo (con auto-reload):
```bash
npm run dev
```

Para producción:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## Estructura

```
server/
├── models/          # Modelos de datos (Crucero, Usuario, Reserva)
├── routes/          # Rutas de API (cruceros, usuarios, reservas, pagos)
├── controllers/     # Lógica de negocio
├── middleware/      # Autenticación, validación
├── config/          # Configuraciones (BD, JWT, etc)
├── index.js         # Archivo principal del servidor
├── package.json     # Dependencias
└── .env.example     # Variables de entorno de ejemplo
```

## Modelos Creados

### Crucero
- Información del crucero (nombre, naviera, descripción)
- Destinos e itinerarios
- Tipos de camarotes y precios
- Servicios a bordo
- Fechas de salida disponibles
- Políticas (cancelación, documentos, pago)

### Usuario
- Datos personales
- Email y teléfono
- Cédula y pasaporte
- Contraseña encriptada
- Rol (cliente o admin)

### Reserva
- Referencia a usuario y crucero
- Fecha de salida y tipo de camarote
- Datos de pasajeros
- Precio total
- Estado de la reserva (pendiente, confirmada, pagada, cancelada)
- Información de pago

## Próximas Etapas

- [ ] Rutas de cruceros
- [ ] Rutas de usuarios (registro, login)
- [ ] Rutas de reservas
- [ ] Integración de pagos (Stripe)
- [ ] Panel CMS
- [ ] Reportes y estadísticas
