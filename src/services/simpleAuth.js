// Simple authentication service with predefined credentials
// For demonstration purposes only

// Predefined users for demo
const predefinedUsers = [
  {
    id: 'user-1',
    email: 'tourist@example.com',
    password: 'password123',
    name: 'Demo Tourist',
    userType: 'tourist'
  },
  {
    id: 'user-2',
    email: 'guide@example.com',
    password: 'password123',
    name: 'Demo Guide',
    userType: 'guide'
  },
  {
    id: 'user-3',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    userType: 'admin'
  },
  {
    id: 'user-4',
    email: 'student@cmrit.ac.in',
    password: 'student123',
    name: 'CMRIT Student',
    userType: 'tourist'
  }
];

// Use localStorage to persist login state
const AUTH_KEY = 'nammaTourAuthUser';

// Save user to localStorage
const saveUserToStorage = (user) => {
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
};

// Remove user from localStorage
const removeUserFromStorage = () => {
  localStorage.removeItem(AUTH_KEY);
};

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing auth user:', error);
    return null;
  }
};

// Login function
export const login = async (email, password) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const user = predefinedUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        // Create a user object without the password
        const authenticatedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType
        };

        // Save to localStorage
        saveUserToStorage(authenticatedUser);

        resolve({
          success: true,
          user: authenticatedUser
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid email or password'
        });
      }
    }, 500); // 500ms delay to simulate network
  });
};

// Signup function (just for demonstration, actually just logs in with predefined credentials)
export const signup = async (email, password, userType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = predefinedUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        resolve({
          success: false,
          error: 'Email already in use'
        });
        return;
      }

      // In a real app, you would create a new user in the database
      // For this demo, we'll just pretend the signup worked and log the user in
      const newUser = {
        id: 'user-' + Date.now(),
        email: email,
        name: email.split('@')[0],
        userType: userType || 'tourist'
      };

      saveUserToStorage(newUser);

      resolve({
        success: true,
        user: newUser
      });
    }, 500);
  });
};

// Logout function
export const logout = () => {
  removeUserFromStorage();
  return { success: true };
};

// Get current user
export const getCurrentUser = () => {
  return getUserFromStorage();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getUserFromStorage() !== null;
};
