# Client Gateway (API Gateway)

Esta es la puerta de entrada principal para todos los clientes consumidores (Aplicaciones Web, Móviles, Servicios de terceros). Actúa como un API Gateway RESTful que recibe, valida, enruta y transforma peticiones HTTP antes de comunicarse (vía TCP) con la zona segura de los microservicios.

## Características Implementadas
- **Filtro General de Excepciones RPC (RPC Exception Filter)**: Uno de los comportamientos más importantes. Captura las excepciones lanzadas nativamente en los microservicios `TCP` (`RpcException`) y las transforma automáticamente a respuestas `HTTP` legibles y estandarizadas (ej: 400 Bad Request, 404 Not Found), garantizando uniformidad en los mensajes de error para el cliente final sin importar en qué microservicio falló.
- **Validación de Variables de Entorno (Environment Validator)**: Se ha integrado validación de esquemas (como Joi, class-validator u otros) para asegurar que la aplicación nunca inicie si faltan variables de entorno críticas y que los puertos o hosts sean del tipo correcto.
- **Enrutamiento por TCP (Microservices Client)**: Inyección de clientes de Nest (`@nestjs/microservices`) con los tokens de `envs` (`ordersClient`, `productsClient`) permitiendo el paso de Observables (RxJS) hacia la zona privada.

## Arquitectura del Sistema
El ecosistema completo se divide primordialmente en dos grandes áreas:
- **Red Pública**: Donde reside este Gateway exponiendo endpoints REST sobre HTTP/HTTPS al exterior.
- **Zona Segura (Secure Zone)**: Red interna (Docker Network) donde los microservicios (`products-ms` y `orders-ms`) se comunican exclusivamente mediante transportistas TCP; al igual que sus bases de datos Postgres respectivas, que no revelan sus puertos hacia el mundo exterior.
---

## Instalación
1. Clonar repositorio
2. Instalar dependencias: `npm install`
3. Crear archivo `.env` basado en `env.template`
4. Ejecutar el proyecto: `npm run start:dev`