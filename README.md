# Tilinflex — Frontend
 
<div align="center">

<img src="https://img.shields.io/badge/Angular-20.3.5-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
<img src="https://img.shields.io/badge/Jikan_API-v4-2E51A2?style=for-the-badge&logo=myanimelist&logoColor=white" />

<br/>
<br/>

**Plataforma de streaming de anime — construida con Angular**

</div>

 
## Descripción
 
Tilinflex es una plataforma web de streaming de anime con panel de administración, autenticación por roles y catálogo dinámico. El frontend consume datos en tiempo real a través de la **[Jikan API](https://jikan.moe/#features)**, la API REST no oficial de MyAnimeList, y se conecta con un backend propio en FastAPI.
 
---
 
## Requisitos previos
 
- Node.js 18+
- Angular CLI 20+
- Backend de Tilinflex corriendo localmente
---
 
## Puesta en marcha
 
### 1. Encender el Backend
 
> **El backend debe estar corriendo antes de iniciar el frontend**, de lo contrario la aplicación no podrá conectarse a la API.
 
Desde el repositorio del backend, ejecuta:
 
```bash
uvicorn API.app:app --reload --port 8000
```
 
El backend quedará disponible en `http://localhost:8000`.
 
### 2. Instalar dependencias
 
```bash
npm install
```
 
### 3. Iniciar el servidor de desarrollo
 
```bash
ng serve
```
 
Abre el navegador en `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar cualquier archivo fuente.
 
---
 
## API utilizada
 
Este proyecto consume la **[Jikan API v4](https://jikan.moe/#features)**, una API REST gratuita y de código abierto que provee datos de MyAnimeList sin necesidad de autenticación.
 
Puedes revisar todas sus funcionalidades aquí: [https://jikan.moe/#features](https://jikan.moe/#features)
 
---
 
## Estructura del proyecto
 
```
src/
├── app/
│   ├── core/               # Servicios, guards e interceptores
│   │   ├── guards/         # adminGuard, authGuard
│   │   └── services/       # AuthService, AnimeService, ObrasService...
│   ├── features/           # Módulos de funcionalidades
│   │   ├── anime/          # Home, Browse, Detalle
│   │   ├── auth/           # Login, Registro
│   │   ├── dashboard/      # Panel admin
│   │   ├── obras/          # Gestión de catálogo
│   │   └── usuarios/       # Gestión de usuarios
│   └── shared/             # Layouts y componentes compartidos
│       └── components/
│           ├── public-layout/   # Navbar + footer público
│           └── layout/          # Sidebar + layout admin
└── environments/           # Configuración de entornos
```
 
---
 
## Roles y acceso
 
| Rol | Acceso |
|-----|--------|
| Visitante | Explorar catálogo público |
| Usuario | Login, perfil |
| Admin | Panel `/admin/dashboard` y todas las rutas admin |
 
## Video demostrando funcionalidad

[![Ver video](Meme.jpg)](https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F7EB256FF20C19C1C%21s6b9c649e1c954d74a8a0ff894cfbf3cc%3Fithint%3Dvideo%26e%3DHM2rCj%26migratedtospo%3Dtrue&cid=7EB256FF20C19C1C&id=7EB256FF20C19C1C%21s6b9c649e1c954d74a8a0ff894cfbf3cc&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy83ZWIyNTZmZjIwYzE5YzFjL0lRQ2VaSnhybFJ4MFRhaWdfNGxNLV9QTUFSSFVMa1VMTTZCaEI5di1Hc09OOUFzP2U9SE0yckNq&v=photos)

Denle click a la imagen para reproducir el video.

## Recursos adicionales
 
- [Documentación Angular CLI](https://angular.dev/tools/cli)
- [Jikan API — Documentación oficial](https://docs.api.jikan.moe/)
- [MyAnimeList](https://myanimelist.net/)
---
 
<div align="center">
  <sub>Proyecto educativo — 2026 · Tilinflex</sub>
</div>
 