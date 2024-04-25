import { Router } from "express";
import { getUsers, getUserId, postCreateUser, deleteUser, putUser } from "../controllers/users.controllers.js";

const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserId);
router.post("/users", postCreateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", putUser);

export default router;