import { pool } from "../db.js"

// Obtener
export const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users");
        res.json(rows); 
    } catch (error) {
        return res.status(404).json({error: "error"})
    }

}

// Obtener por id 
export const getUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        res.json(rows[0]);  
    } catch (error) {
        return res.status(404).json({error: "error"})
    }

}

// Crear
export const postCreateUser = async (req, res) => {
    try {
        const datos = req.body;
        const { rows } = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [datos.name, datos.email]);

        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: "Error" });
    }
}

// Eliminar
export const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({error: "error"})
    }

}

// Actualizar
export const putUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;
        const { rows, rowCount } = await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, id]);
        if (rowCount === 0){
            return res.status(404).json({error: "error"})
        }
        return res.json(rows[0]);
    } catch (error) {
        return res.status(404).json({error: "error"})
    }
}

// Ejemplos de pruebas

// Obtener
/*
export const getUsers = async (req, res) => {
    console.log(rows)
    res.send("Obteniendo usuarios")
}
*/

// Obtener por id
/*
export const getUserId = async (req, res) => {

    const { id } = req.params;
    // res.send(`Obteniendo usuarios ${id}`)

    // const {rows} = await pool.query(`SELECT * FROM user WHERE id = ${req}`)
    const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (rows.length === 0){
        return res.status(404).json({message: "Usuario no encontrado"})
    }
    res.json(rows[0]);
}
*/

// Crear
/*
export const postCreateUser = async (req, res) => {
    const datos = req.body;
    // res.send("Creando usuario")
    const {rows} = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [datos.name, datos.email]);

    return res.json(rows[0]);
}
*/
// Crear errores especificos
/* 
export const postCreateUser = async (req, res) => {
    try {
        const datos = req.body;
        // const {name, email} = req.body;
        const {rows} = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [datos.name, datos.email]);
        // const {rows} = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
    
        return res.json(rows[0]); 
    } catch (error) {

        if (error?.code === "23505") {
            return res.status(509).json({ error: "El correo ya existe" })
        }
        // return res.status(500).json({ error: error.message }); // "error": "llave duplicada viola restricción de unicidad «users_email_key»"
        return res.status(500).json({ error: "Error" });
    }

}
*/

/* 
export const postCreateUser = async (req, res) => {
    const datos = req.body;
    // res.send("Creando usuario")
    const {rows} = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [datos.name, datos.email]);

    return res.json(rows[0]);
}
*/

/*
export const deleteUser = async (req, res) => {
    // res.send("Obteniendo usuarios")
    const { id } = req.params;
    // const {rows, rowCount} = await pool.query("DELETE * FROM users WHERE id = $1 RETURNING *", [id])
    const {rowCount} = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (rowCount === 0){
        return res.status(404).json({message: "Usuario no encontrado"})
    }
    // return res.json(rows)
    return res.sendStatus(204);
}
*/

/* 
export const putUser = async (req, res) => {
    const { id }= req.params;
    const datos = req.body;
    const {rows} = await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [datos.name, datos.email, id])
    
    return res.json(rows)
}
*/
