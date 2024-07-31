import bcrypt from "bcrypt"

import { SALT_ROUNDS } from "./config.js"

export class UserRepository {
    static async create ({ username, password }) {
        // usar zod para validaciones 

        // hacer que seareutilizable la validacion para create y login

        // mirar primero si el usario no existe?
        const id = crypto.randomUUID()
        // const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS) // hashSync -> bloquea el thread principal
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        // guardar en base de datos
        return id
    }

    static async login ({username, password}) {
        //validaciones

        // const user = comprobar si existe el usuario

        // const isValid = bcrypt.compareSync(password, user.password) bloquea el thread principal
        // const isValid = await bcrypt.compare(password, user.password)
        // !isValid error

        const {password: _, ...publicUser} = user

        // crear un nuevo objeto con los campos para devolver no usar el de publicUser
        return publicUser
    }
}