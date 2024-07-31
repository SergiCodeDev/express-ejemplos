import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PORT, SECRET_JWT_KEY, SECRET_REFRESH_KEY } from "./config.js";
import { UserRepository } from "./class-db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        req.session.user = data;
    } catch {}
    next();
});

app.get("/", (req, res) => {
    res.send("hy");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserRepository.login({ username, password });
        const accessToken = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_REFRESH_KEY,
            { expiresIn: "7d" }
        );
        res
            .cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60
            })
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            .send({ user, accessToken });
    } catch (e) {
        res.status(401).send("Usuario o contraseña incorrectos");
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const id = await UserRepository.create({ username, password });
        res.send({ id });
    } catch (e) {
        res.status(400).send("Error al crear el usuario");
    }
});

app.post("/logout", (req, res) => {
    res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .json({ message: "Deslogueado con éxito" });
});

app.post("/protegido", (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send("Acceso no autorizado");
    res.send(user);
});

app.post("/refresh-token", (req, res) => {
    const { refresh_token } = req.cookies;
    if (!refresh_token) return res.status(401).send("Token no proporcionado");
    try {
        const userData = jwt.verify(refresh_token, SECRET_REFRESH_KEY);
        const newAccessToken = jwt.sign(
            { id: userData.id, username: userData.username },
            SECRET_JWT_KEY,
            { expiresIn: "1h" }
        );
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        }).send({ accessToken: newAccessToken });
    } catch (e) {
        res.status(401).send("Token no válido");
    }
});

app.listen(PORT, () => {
    console.log(`Server en http://localhost:${PORT}`);
});
