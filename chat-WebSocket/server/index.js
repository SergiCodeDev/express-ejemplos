import express from "express"
import logger from "morgan"
import dotenv from "dotenv"
import mysql from 'mysql2/promise';

import { Server } from "socket.io"
import { createServer } from "node:http"

dotenv.config();

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
//io entrada salida
const io = new Server(server, {
    // para que salgan los mensajes si se le va la conexion algunos segundos
    connectionStateRecovery: {}
})
app.use(logger("dev"))

//conexion base de datos
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      content TEXT,
      user TEXT
    )
  `);

//si tiene una conexion
io.on('connection', async (socket) => {
    console.log("Un usuario se ha conectado")

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado')
    })

    // mensaje del front
    socket.on('chat message', async (msg) => {
        let result;
        const username = socket.handshake.auth.username ?? 'anonymous';
        console.log({ username });
        try {
            //guardar mensaje en base de datos de manera segura usando el execute
            [result] = await db.execute(
                'INSERT INTO messages (content, user) VALUES (?, ?)',
                [msg, username]
            );
        } catch (e) {
            console.error(e);
            return;
        }

        // enviar mensaje a todo el mundo mas su id ws y user
        io.emit('chat message', msg, result.insertId.toString(), username);
    });

    if (!socket.recovered) { // <- recupera los mensajes sin conexión
        try {
            const [results] = await db.execute(
                'SELECT id, content, user FROM messages WHERE id > ?',
                [socket.handshake.auth.serverOffset ?? 0]
            );

            results.forEach(row => {
                socket.emit('chat message', row.content, row.id.toString(), row.user);
            });
        } catch (e) {
            console.error(e);
        }
    }
});


app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/client/index.html")
})

server.listen(port, () => {
    console.log(`Server encendido en el puerto ${port}`)
})