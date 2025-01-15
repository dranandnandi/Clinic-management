import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Building } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [formData, setFormData] = useState({
    clinicCode: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First verify clinic code
      const { data: clinic, error: clinicError } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('clinic_code', formData.clinicCode.toUpperCase())
        .single();

      if (clinicError) {
        throw new Error('Invalid clinic code');
      }

      // Then verify username and password
      const { data: isValid, error: authError } = await supabase.rpc(
        'verify_user_password',
        {
          username: formData.username,
          password: formData.password
        }
      );

      if (authError || !isValid) {
        throw new Error('Invalid credentials');
      }

      // Get user details
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', formData.username)
        .eq('clinic_id', clinic.id)
        .single();

      if (userError || !user) {
        throw new Error('User not found');
      }

      setUser({
        id: user.id,
        name: user.name,
        role: user.role,
        clinicId: clinic.id
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError(error.message === 'Invalid clinic code' ? 
        'Invalid clinic code. Please try again.' : 
        'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <Building className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="clinicCode" className="sr-only">Clinic Code</label>
              <input
                id="clinicCode"
                name="clinicCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Clinic Code (e.g., CLINIC001)"
                value={formData.clinicCode}
                onChange={(e) => setFormData({ ...formData, clinicCode: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}