import express from "express";
import * as adminController from "../controllers/adminControllers.js"
import { adminAuthentication } from "../middlewares/authMiddlewares.js";

const router = express.Router();


router.post('/login',adminController.verifyLogin)

router.get('/get-users',adminAuthentication,adminController.getAllUsers)

router.post('/add-user',adminAuthentication,adminController.addNewUser)

router.patch('/edit-user/:id',adminAuthentication,adminController.editUser)

router.delete('/delete-user/:id',adminAuthentication,adminController.deleteUser)

export default router;
