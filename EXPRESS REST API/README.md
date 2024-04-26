# NODE/EXPRESS REST API

### Montando una REST API básica en Express con una base de datos SQL en PostgreSQL, utilizando async/await, try/catch y consultas parametrizadas.

## Como montar el backend

### Node.js v21.7.3.

### Iniciar proyecto (package.json)

```bash
npm init -y
```

### Ejecutar codigo index.js

```bash
node src/index.js
```

### Editar package.json: 

```json
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
```
### Instalar dependecias:

```bash
npm i express morgan pg
```

### Limpiar cache por si quieres:

```bash
npm cache clean --force
```

### package.json

```json
  "type": "module",
```
### package.json

```json
  "dev": "node --env-file .env --watch src/index.js"
```

### Crear un archivo llamado .env en el directorio raíz de tu proyecto. Dentro debes incluir la siguiente información. Reemplazar los valores de ejemplo con los datos reales de tu base de datos:

```python
  # Base de Datos
  DB_USER=UsarioBaseDatos
  DB_HOST=localhost
  DB_PASSWORD=TuContraseña
  DB_DATABASE=TuBaseDeDatos
  DB_PORT=5432

  # Puerto server salida
  PORT=3000
```

### Puedes crear la misma base dedatos usando la plantilla de /database/db.sql
