export const {
    PORT = 3000,
    SALT_ROUNDS = 10,
    SECRET_JWT_KEY = "hash-muy-largo-y-seguro",
    SECRET_REFRESH_KEY = "otro-hash-muy-largo-y-seguro"
} = process.env;
