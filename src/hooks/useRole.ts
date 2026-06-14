import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { user, isAuthenticated } = useAuth();
  
  const role = user?.role || 'guest';
  
  return {
    role,
    isStudent: role === 'student',
    isJobSeeker: role === 'job_seeker',
    isSeeker: role === 'job_seeker' || role === 'student', // backward compat
    isRecruiter: role === 'recruiter',
    isAuthenticated
  };
};
