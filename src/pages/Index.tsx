
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-4">Loading VibeFlow...</h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
