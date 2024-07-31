import express from "express"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { PORT, SECRET_JWT_KEY } from "./config.js"
import { UserRepository } from "./class-db.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null}

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        res.session.user = data
    } catch {}
    next()
})

app.get("/", (req, res) => {
    res.send("hy")
})

app.post("/login",async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await UserRepository.login({username, password})
        const token = jwt.sign(
            {id: user._id, username: user.username},
             SECRET_JWT_KEY,
             {
                expiresIn: "1h"
             }
            )
        res
        .cookie("access_token", token,{
            httpOnly: true, // la cookie solo se puede acceder en el servidor
            secure: process.env.NODE_ENV === "production", // la cookie solo se puede acceder en https
            sameSite: "strict", //solo en el mismo dominio // "lax" desde otros
            maxAge: 1000 * 60 * 60 // la cookie solo tiene un tiempo de validez de 1h
        })
        .send({user, token})
    } catch (e) {
        res.status(401).send("Usuario o contraseña incorrectos")

    }
})
app.post("/register", async (req, res) => {
    const { username, password } = req.body
    try {
        const id = await UserRepository.create({username, password})
        res.send({id})
    } catch (e) {
        res.status(400).send("Error al crear el usuario")

    }
})
app.post("/logout",(req, res) => {
    res
    .clearCookie("access_token")
    .json({message: "Deslogueado con exito"})
})

app.post("/protegido",(req, res) => {
    // express-session
    // usar redis

    const { user } = req.session
    if (!user) return res.status(403).send("Acceso no autorizado")

    res.send(user)
})

app.listen(PORT, () => {
    console.log(`Server en http://localhost:${PORT}`)
})

// falta refrest tokend 
// pass port
// auth2 con google