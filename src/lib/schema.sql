-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT 'user',
  profile_picture VARCHAR(255),
  provider VARCHAR(255),
  website_url VARCHAR(255),
  phone VARCHAR(20),
  street_address VARCHAR(255) ,
  city VARCHAR(100) ,
  postal_code VARCHAR(20) ,
  country VARCHAR(100) ,
  password_hash VARCHAR(255),
  plan VARCHAR(255) DEFAULT '0',
  status VARCHAR(255) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 