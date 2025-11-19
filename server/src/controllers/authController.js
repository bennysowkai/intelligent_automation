import dataStore from '../models/dataStore.js';

export const login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const user = dataStore.findUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
};

export const getCurrentUser = (req, res) => {
  // Mock - in real app would use JWT/session
  res.json({
    user: {
      id: 1,
      username: 'demo',
      name: 'Demo User',
      role: 'Intern'
    }
  });
};
