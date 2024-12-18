# Documentación de la API REST

Este archivo describe todas las funcionalidades implementadas con API REST en la entrega y qué métodos se han utilizado

## Endpoints

### 1. **GET /api/chat**
   - **Descripción**: Obtiene los mensajes del chat desde un timestamp determinado.
   - **Método HTTP**: GET
   - **Parámetros**:
     - `since` (opcional): Timestamp desde el cual se desean obtener los mensajes. Valor por defecto: 0.
   - **Respuesta**:
     - Código 200: Lista de mensajes nuevos junto con el último timestamp disponible.
     - Ejemplo de respuesta:
       ```json
       {
         "messages": ["Mensaje 1", "Mensaje 2"],
         "timestamp": 1679078234000
       }
       ```

### 2. **POST /api/chat**
   - **Descripción**: Envía un mensaje al chat.
   - **Método HTTP**: POST
   - **Parámetros**:
     - `message` (requerido): El mensaje que se desea enviar.
   - **Respuesta**:
     - Código 201: Mensaje creado exitosamente.
     - Código 400: Solicitud inválida si el mensaje está vacío o nulo.

### 3. **GET /api/status**
   - **Descripción**: Obtiene el estado actual del sistema, incluyendo el número de usuarios conectados.
   - **Método HTTP**: GET
   - **Respuesta**:
     - Código 200: Información sobre el estado del sistema.
     - Ejemplo de respuesta:
       ```json
       {
         "status": "Conectado",
         "connectedUsers": 5
       }
       ```

### 4. **POST /api/status/increment**
   - **Descripción**: Incrementa el contador de usuarios conectados.
   - **Método HTTP**: POST
   - **Respuesta**:
     - Código 200: El contador de usuarios conectados se ha incrementado.

### 5. **POST /api/status/decrement**
   - **Descripción**: Decrementa el contador de usuarios conectados.
   - **Método HTTP**: POST
   - **Respuesta**:
     - Código 200: El contador de usuarios conectados se ha decrementado.

### 6. **GET /api/users/getUser**
   - **Descripción**: Obtiene los detalles de un usuario basado en su nombre de usuario.
   - **Método HTTP**: GET
   - **Parámetros**:
     - `username` (requerido): Nombre de usuario para buscar.
   - **Respuesta**:
     - Código 200: Detalles del usuario.
     - Código 404: Usuario no encontrado.
     - Ejemplo de respuesta:
       ```json
       {
         "username": "juan",
         "gamesPlayed": 10
       }
       ```

### 7. **POST /api/users/login**
   - **Descripción**: Realiza el inicio de sesión de un usuario con nombre de usuario y contraseña.
   - **Método HTTP**: POST
   - **Parámetros**:
     - `username` (requerido): Nombre de usuario para el inicio de sesión.
     - `password` (requerido): Contraseña del usuario.
   - **Respuesta**:
     - Código 200: `true` si las credenciales son válidas, `false` en caso contrario.

### 8. **POST /api/users/register**
   - **Descripción**: Registra un nuevo usuario en el sistema.
   - **Método HTTP**: POST
   - **Cuerpo de la solicitud**:
     ```json
     {
       "username": "newuser",
       "password": "password123"
     }
     ```
   - **Respuesta**:
     - Código 200: `true` si el registro es exitoso, `false` si el usuario ya existe.

### 9. **PUT /api/users/updateGamesPlayed**
   - **Descripción**: Actualiza la cantidad de juegos jugados de un usuario.
   - **Método HTTP**: PUT
   - **Parámetros**:
     - `username` (requerido): Nombre de usuario cuyo contador de juegos jugados se actualizará.
     - `gamesPlayed` (requerido): Nuevo valor para la cantidad de juegos jugados.
   - **Respuesta**:
     - Código 200: `true` si la actualización es exitosa, `false` si no se pudo actualizar.

### 10. **DELETE /api/users/delete**
   - **Descripción**: Elimina un usuario del sistema.
   - **Método HTTP**: DELETE
   - **Parámetros**:
     - `username` (requerido): Nombre de usuario que se desea eliminar.
   - **Respuesta**:
     - Código 200: `true` si el usuario fue eliminado exitosamente, `false` en caso contrario.

## Métodos HTTP utilizados

- **GET**: Para obtener recursos.
- **POST**: Para crear o modificar recursos (envío de mensajes, inicio de sesión, registro).
- **PUT**: Para actualizar recursos existentes (actualizar juegos jugados).
- **DELETE**: Para eliminar recursos (eliminar usuario).

