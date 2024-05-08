import { validarPelicula, validarPartialPelicula } from "../schemes/peliculas.js";
import { PeliModel } from "../models/peliculas.models.js";

export class PeliController {

    static async getAll(req, res) {
        const { genre } = req.query;
        const peliculas = await PeliModel.getAll({genre})
        if (peliculas == false) {
            return res.status(404).json({ message: "No se encontraron películas para el género especificado." })
        }
        res.json(peliculas);
    }

    static async postAdd(req, res) {
        const resultado = validarPelicula(req.body)
        
        const nuevaPeli = await

        res.status(201).json(nuevaPeli)
    }

    static async getId(req, res) {
        const { id } = req.params;
        const pelicula = peliculas.find(pelicula => pelicula.id === id)
        if (pelicula) return res.json(pelicula)

        return res.status(404).json({ message: "Pelicula no encontrada" })
    }

    static async deleteId(req, res) {

        const { id } = req.params;
        const peliIndex = peliculas.findIndex(peli => peli.id === id)
        if (peliIndex === -1) {
            return res.status(404).json({ message: "Pelicula no encontrada" })
        }
    
        peliculas.splice(peliIndex, 1)
        return res.status(200).json({ message: "Pelicula eliminada" })
    }

    static async patchId(req, res) {

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
    }

}