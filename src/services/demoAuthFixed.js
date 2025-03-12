// Simple demo authentication service that always works
const demoUsers = [
  {
    id: 'demo-tourist-id',
    email: 'tourist@example.com',
    password: 'password123',
    user_type: 'tourist',
    name: 'Demo Tourist'
  },
  {
    id: 'demo-guide-id',
    email: 'guide@example.com',
    password: 'password123',
    user_type: 'guide',
    name: 'Demo Guide'
  },
  {
    id: 'demo-user-id',
    email: 'demo@example.com',
    password: 'password123',
    user_type: 'tourist',
    name: 'Demo User'
  }
];

// Store session in localStorage
const setSession = (user) => {
  localStorage.setItem('nammaTourDemoUser', JSON.stringify(user));
};

const getSession = () => {
  const userStr = localStorage.getItem('nammaTourDemoUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const clearSession = () => {
  localStorage.removeItem('nammaTourDemoUser');
};

// Always successful login - for demo purposes
export const signIn = async (email, password) => {
  // For simplicity, any email/password combination works
  // This is just for demo purposes
  console.log('Login attempt with:', email);
  
  // Create a demo user based on the email
  const demoUser = {
    id: 'demo-id-' + Date.now(),
    email: email,
    user_metadata: { 
      user_type: email.includes('guide') ? 'guide' : 'tourist',
      name: email.split('@')[0]
    }
  };
  
  // Save to session
  setSession(demoUser);
  
  return { 
    data: { 
      user: demoUser,
      session: { access_token: 'demo-token-' + Date.now() }
    }, 
    error: null 
  };
};

export const signUp = async (email, password, userType) => {
  // Always successful signup
  const newUser = {
    id: 'demo-id-' + Date.now(),
    email: email,
    user_metadata: { 
      user_type: userType || 'tourist',
      name: email.split('@')[0]
    }
  };
  
  setSession(newUser);
  
  return { 
    data: { 
      user: newUser,
      session: { access_token: 'demo-token-' + Date.now() }
    }, 
    error: null 
  };
};

export const signOut = async () => {
  clearSession();
  return { error: null };
};

export const getCurrentUser = async () => {
  const session = getSession();
  
  if (session) {
    return { 
      data: { user: session }, 
      error: null 
    };
  } else {
    return { 
      data: { user: null }, 
      error: null 
    };
  }
};

export const isAuthenticated = () => {
  return getSession() !== null;
};
