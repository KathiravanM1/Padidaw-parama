// Add this route to your backend auth routes
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@vidivu.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({ 
      message: 'Admin created successfully',
      email: 'admin@vidivu.com',
      password: 'admin123'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});