import z from "zod";

const peliEsquema = z.object({
    title: z.string({
        invalid_type_error: "El titulo debe ser un string",
        required_error: "El titulo es requerido"
    }),
    year: z.number({
        invalid_type_error: "El year debe ser de tipo int del 1800 al 2024"
    }).int().min(1800).max(2024),
    director: z.string({
        invalid_type_error: "El director debe ser de tipo string"
    }),
    duration: z.number({
        invalid_type_error: "La duration debe ser de tipo int"
    }).int().positive(),
    rate: z.number({
        invalid_type_error: "Rate debe ser un numero del 0 al 10"
    }).min(0).max(10).default(0),
    poster: z.string().url({
        message: "Esto debe ser una url"
    }),
    genre: z.array(
        z.enum(["Action", "Adventure", "Fantasy", "Biography", "Drama", "Romance", "Sci-Fi", "Animation", "Crime"]),
        {
            required_error: "Genre es requerido",
            invalid_type_error: "Array de enums genre"
        }
    )
    // .optional() .nullable()
})

export function validarPelicula(object) {
    return peliEsquema.safeParse(object)
}

export function validarPartialPelicula(object){
    // partial pone todo como opcional excepto lo que si debe validar
    return peliEsquema.partial().safeParse(object)
}