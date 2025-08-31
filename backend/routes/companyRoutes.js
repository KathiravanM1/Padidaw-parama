import express from 'express';
import { getAllCompanies, addCompany } from '../controllers/companyController.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.post('/', addCompany);

export default router;