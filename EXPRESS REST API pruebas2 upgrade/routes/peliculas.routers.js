import { Router } from "express";
import { PeliController } from "../controllers/peliculas.controllers.js";

export const peliculasRouter = Router()

peliculasRouter.get("/", PeliController.getAll)
peliculasRouter.post("/", PeliController.postAdd)
peliculasRouter.get("/:id", PeliController.getId)
peliculasRouter.delete("/:id", PeliController.deleteId)
peliculasRouter.patch("/:id", PeliController.patchId)