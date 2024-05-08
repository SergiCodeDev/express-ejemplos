import peliculas from "../peliculas.json" with { type: 'json' };

export class PeliModel {

    static async getAll({ genre }) {
        if (genre) {
            const filtoPeliculasPorGenero = peliculas.filter(pelicula => {
                return pelicula.genre.some(genero => genero.toLocaleLowerCase() === genre.toLocaleLowerCase())
            })
            if (filtoPeliculasPorGenero.length > 0) {
                return filtoPeliculasPorGenero;
            } else {
                return false
            }
        }
        return peliculas;
    }

    static async postAdd(req, res) {
        const resultado = validarPelicula(req.body)

        if (resultado.error) {
            //422
            return res.status(400).json({ error: JSON.parse(resultado.error.message) })
        }
        const nuevaPeli = {
            id: crypto.randomUUID(),
            ...resultado.data
        }

        peliculas.push(nuevaPeli)

        return nuevaPeli;
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