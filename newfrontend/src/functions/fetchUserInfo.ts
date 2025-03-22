export async function fetchUserInfo() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.message || 'Failed to authenticate user');
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to authenticate user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}
