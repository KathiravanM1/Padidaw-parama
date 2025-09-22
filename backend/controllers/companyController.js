import Company from '../models/Company.js';

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

export const addCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    const existingCompany = await Company.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existingCompany) {
      return res.status(200).json({
        success: true,
        data: existingCompany,
        message: 'Company already exists'
      });
    }

    const company = new Company({
      name: name.trim()
    });

    await company.save();

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company added successfully'
    });
  } catch (error) {
    // console.error('Error adding company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add company',
      error: error.message
    });
  }
};