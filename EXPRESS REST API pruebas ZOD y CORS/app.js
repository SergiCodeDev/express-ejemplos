import express from "express";
import peliculas from "./peliculas.json" with { type: 'json' };
import { validarPelicula, validarPartialPelicula } from "./schemes/peliculas.js";
import cors from "cors"

const app = express()
app.use(express.json())
// app.use(cors()) // *
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:5202',
            'https://pelisejemplo.com',
            "http://127.0.0.1:3001",
            "http://localhost:3000"
        ]
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }
        /*
        if (!origin) {
            return callback(null, true)
        }
        */
        return callback(new Error("Solicitud no permitida"))
    }
}))

app.disable("x-powered-by")

app.get("/", (req, res) => {
    res.json({ message: "prueba con otra url" })
})
/* 
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5202',
    'https://pelisejemplo.com',
    "http://127.0.0.1:3001",
    "http://localhost:3000"
  ]
 */
app.get("/peliculas", (req, res) => {
    /* 
    const origin = req.header("origin");
    if(ACCEPTED_ORIGINS.includes(origin)){
        res.header("Access-Control-Allow-Origin", origin)
    } 
    */
    // res.header("Access-Control-Allow-Origin", "*")
    // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3001")

    const { genre } = req.query;
    if (genre) {
        const filtoPeliculasPorGenero = peliculas.filter(pelicula => {
            return pelicula.genre.some(genero => genero.toLocaleLowerCase() === genre.toLocaleLowerCase())
        })
        if (filtoPeliculasPorGenero.length > 0) {
            return res.json(filtoPeliculasPorGenero);
        } else {
            return res.status(404).json({ message: "No se encontraron películas para el género especificado." });
        }
    }
    res.json(peliculas)
})

app.post("/peliculas", (req, res) => {
    const resultado = validarPelicula(req.body)

    // resultado.success true
    if (resultado.error) {
        //422
        return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }
    /* const { id, title, year, director, duration, poster, genre, rate } = req.body; */
    const nuevaPeli = {
        id: crypto.randomUUID(), // uuid v4
        /*         title,
                year,
                director,
                duration,
                poster,
                genre,
                rate: rate || 0 */
        ...resultado.data
    }

    peliculas.push(nuevaPeli)

    res.status(201).json(nuevaPeli)
})

app.get("/peliculas/:id", (req, res) => {
    const { id } = req.params;
    const pelicula = peliculas.find(pelicula => pelicula.id === id)
    if (pelicula) return res.json(pelicula)

    return res.status(404).json({ message: "Pelicula no encontrada" })
})

app.delete("/peliculas/:id", (req, res) => {
    /* 
    const origin = req.header("origin");
    if(ACCEPTED_ORIGINS.includes(origin)){
        res.header("Access-Control-Allow-Origin", origin)
    } 
    */
    const { id } = req.params;
    const peliIndex = peliculas.findIndex(peli => peli.id === id)
    if (peliIndex === -1) {
        return res.status(404).json({ message: "Pelicula no encontrada" })
    }

    peliculas.splice(peliIndex, 1)
    // 204 sin mensaje json
    return res.status(200).json({ message: "Pelicula eliminada" })
})

// para editar una parte concreta o varias
app.patch("/peliculas/:id", (req, res) => {

    const resultado = validarPartialPelicula(req.body)

    if (!resultado.success) {
        return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const { id } = req.params;
    const peliIndex = peliculas.findIndex(peli => peli.id === id)

    if (peliIndex === -1) {
        return res.status(404).json({ message: "Pelicula no encontrada" })
    }

    const actualizarPeli = {
        ...peliculas[peliIndex],
        ...resultado.data
    }
    peliculas[peliIndex] = actualizarPeli

    return res.json(actualizarPeli)
})

/*
// PARA SOLUCIONAR CORDS
app.options("/peliculas/:id", (req, res) => {
    const origin = req.header("origin");
    if(ACCEPTED_ORIGINS.includes(origin)){
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    }
    return res.sendStatus(200) // body = OK
    // return res.send(200) // body = OK 
})
*/

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto http://localhost:${PORT}`)
})