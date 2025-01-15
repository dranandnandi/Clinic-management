import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Building, UserPlus, Trash2, Save } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export function SettingsPage() {
  const { clinic, doctors, addDoctor, deleteDoctor, updateClinic } = useStore();
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editableClinic, setEditableClinic] = useState(clinic);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);

  // Update editable clinic when clinic changes
  useEffect(() => {
    setEditableClinic(clinic);
  }, [clinic]);

  const handleSaveClinicSettings = async () => {
    setIsSaving(true);
    try {
      await updateClinic(editableClinic);
      setError('');
    } catch (error) {
      console.error('Error updating clinic settings:', error);
      setError('Failed to update clinic settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addDoctor({
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        clinicId: clinic.id
      });

      setNewDoctor({ name: '', specialization: '' });
    } catch (error: any) {
      console.error('Error adding doctor:', error);
      setError('Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      setDeletingDoctorId(doctorId);
      await deleteDoctor(doctorId);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor. Please try again.');
    } finally {
      setDeletingDoctorId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Clinic Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Clinic Settings</h2>
          </div>
          <button
            onClick={handleSaveClinicSettings}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={editableClinic.name}
              onChange={(e) => setEditableClinic({ ...editableClinic, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={editableClinic.address}
              onChange={(e) => setEditableClinic({ ...editableClinic, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google My Business Link</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={editableClinic.gmbLink}
              onChange={(e) => setEditableClinic({ ...editableClinic, gmbLink: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Color</label>
              <input
                type="color"
                className="mt-1 block w-full h-10 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={editableClinic.primaryColor || '#4F46E5'}
                onChange={(e) => setEditableClinic({ ...editableClinic, primaryColor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
              <input
                type="color"
                className="mt-1 block w-full h-10 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={editableClinic.secondaryColor || '#E5E7EB'}
                onChange={(e) => setEditableClinic({ ...editableClinic, secondaryColor: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Doctors</h2>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleAddDoctor} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      disabled={deletingDoctorId === doctor.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}