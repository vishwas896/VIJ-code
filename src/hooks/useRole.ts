import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Default to guest if no user is found
  const role = user?.role || 'guest';
  
  return {
    role,
    isSeeker: role === 'seeker',
    isRecruiter: role === 'recruiter',
    isAuthenticated
  };
};
