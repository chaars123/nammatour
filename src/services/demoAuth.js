// Extremely simple demo authentication that ALWAYS succeeds
// For development purposes only

// Store session in localStorage
const setSession = (user) => {
  localStorage.setItem('nammaTourUser', JSON.stringify(user));
};

const getSession = () => {
  const userStr = localStorage.getItem('nammaTourUser');
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
  localStorage.removeItem('nammaTourUser');
};

// GUARANTEED successful login - no validation
export const signIn = async (email, password) => {
  console.log('Login attempt with:', email);
  
  // Create a user object
  const user = {
    id: 'user-' + Date.now(),
    email: email || 'guest@example.com',
    user_metadata: { 
      user_type: email?.includes('guide') ? 'guide' : 'tourist',
      name: email ? email.split('@')[0] : 'Guest User'
    }
  };
  
  // Save to session
  setSession(user);
  
  return { 
    data: { 
      user: user,
      session: { access_token: 'token-' + Date.now() }
    }, 
    error: null 
  };
};

// Skip login - create a guest account
export const skipLogin = async () => {
  const guestUser = {
    id: 'guest-' + Date.now(),
    email: 'guest@example.com',
    user_metadata: { 
      user_type: 'tourist',
      name: 'Guest User'
    }
  };
  
  setSession(guestUser);
  
  return { 
    data: { 
      user: guestUser,
      session: { access_token: 'guest-token-' + Date.now() }
    }, 
    error: null 
  };
};

export const signUp = async (email, password, userType) => {
  // Always successful signup
  const newUser = {
    id: 'user-' + Date.now(),
    email: email || 'new@example.com',
    user_metadata: { 
      user_type: userType || 'tourist',
      name: email ? email.split('@')[0] : 'New User'
    }
  };
  
  setSession(newUser);
  
  return { 
    data: { 
      user: newUser,
      session: { access_token: 'token-' + Date.now() }
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
