import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { loginUser, changeUserPassword } from '../services/authService'; 

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null); // New state for ADMIN ID
  const router = useRouter();

  // Fetch userId, managerId, and adminId from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
      const storedManagerId = localStorage.getItem('managerId'); //fetch MANAGER ID
      setManagerId(storedManagerId);
      const storedAdminId = localStorage.getItem('adminId'); // Fetch ADMIN ID
      setAdminId(storedAdminId);
    }
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { access_token, id, usertype } = await loginUser(username, password);
      setCurrentUserType(usertype);
      setUserId(id);
      
      if (usertype === 'MANAGER' || usertype === 'ADMIN') { 
        const idToStore = usertype === 'MANAGER' ? id : id; 
        setManagerId(usertype === 'MANAGER' ? idToStore : null);
        setAdminId(usertype === 'ADMIN' ? idToStore : null); 
        alert(`Logged in as ${usertype}. Your ID is: ${id}`);
      }

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('userId', id);
      localStorage.setItem('managerId', usertype === 'MANAGER' ? id : null);
      localStorage.setItem('adminId', usertype === 'ADMIN' ? id : null); 

      // Redirect based on user type
      switch (usertype) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'EXECUTIVE':
          router.push('/executive');
          break;
        case 'MANAGER':
          router.push('/manager');
          break;
        case 'SUPERADMIN':
          router.push('/super');
          break;
        default:
          throw new Error('Invalid usertype');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUserType(null);
    setUserId(null);
    setManagerId(null);
    setAdminId(null); 
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('managerId');
    localStorage.removeItem('adminId'); 
    router.push('/login');
  };

  // Change Password function
  const changePassword = async (newPassword: string, confirmPassword: string) => {
    try {
      setLoading(true);
      setError(null);
  
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not authenticated.");
  
      await changeUserPassword(userId, newPassword, confirmPassword);
      alert("Password changed successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to change password.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return { login, loading, error, currentUserType, logout, userId, managerId, adminId, changePassword }; // Include adminId
};
