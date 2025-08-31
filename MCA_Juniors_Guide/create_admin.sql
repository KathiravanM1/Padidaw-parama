-- Create admin user directly in database
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@vidivu.com', '$2b$10$hashedPasswordHere', 'admin');

-- Or if you have a separate admins table:
INSERT INTO admins (name, email, password, role) 
VALUES ('Admin User', 'admin@vidivu.com', '$2b$10$hashedPasswordHere', 'admin');