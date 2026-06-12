# React + Vite Frontend (Decoupled)

Este es el proyecto de Frontend independiente desarrollado en React + Vite.

## Instrucciones para levantar el Frontend

1. Abre una terminal dentro de esta carpeta (`C:\Users\ezequ\Desktop\react-frontend`).
2. Levanta el servidor con:
   ```bash
   docker compose up --build
   ```
   *NOTA: al actualizar alguna dependencia se debe ejecutar el comando docker compose down -v para eliminar los volúmenes con las dependencias antiguas y despues ejecutar docker compose up --build
3. El frontend estará disponible en [http://localhost:5173](http://localhost:5173).
4. Se comunicará directamente por HTTP con el backend (por defecto en `http://localhost:5000`). Asegúrate de tener el backend corriendo en paralelo.
