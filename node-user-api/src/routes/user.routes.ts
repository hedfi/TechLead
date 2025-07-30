import { Router } from 'express';
import { UserController } from '../controllers/user/user.controller';
import { UserService } from '../services/user/user.service';
import { UserRepository } from '../repositories/user/user.repository';
import { createConnectionPool } from '../config/database.config';

// Create router
const router = Router();

// Initialize dependencies
const connectionPool = createConnectionPool();
const userRepository = new UserRepository(connectionPool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Define routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/change-password', userController.changePassword);

export default router;