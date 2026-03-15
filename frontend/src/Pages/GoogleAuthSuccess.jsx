import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (token) {
      // Save to localStorage just like normal login
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ _id: id, name, email }));
      navigate('/products');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 animate-pulse">
        Signing you in...
      </p>
    </div>
  );
};

export default GoogleAuthSuccess;