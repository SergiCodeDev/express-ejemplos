import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { peliculasRouter } from "./routes/peliculas.routers.js";

const app = express()
app.use(express.json())
/* app.use(corsMiddleware) */
app.disable("x-powered-by")
/* 
app.get("/", (req, res) => {
    res.json({ message: "prueba con otra url" })
}) */

app.use('/peliculas', peliculasRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto http://localhost:${PORT}`)
})