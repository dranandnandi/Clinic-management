import { create } from 'zustand';
import type { User, Appointment, Review, Doctor, Clinic } from '../types';
import { supabase } from '../services/supabaseClient';

interface Store {
  user: User | null;
  clinic: Clinic;
  appointments: Appointment[];
  reviews: Review[];
  doctors: Doctor[];
  setUser: (user: User | null) => void;
  updateClinic: (clinic: Partial<Clinic>) => Promise<void>;
  updateDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  addReview: (review: Review) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  fetchClinicSettings: (clinicId: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  clinic: {
    id: '',
    name: '',
    address: '',
    gmbLink: '',
  },
  appointments: [],
  reviews: [],
  doctors: [],
  setUser: async (user) => {
    set({ user });
    if (user?.clinicId) {
      await get().fetchClinicSettings(user.clinicId);
    }
  },
  fetchClinicSettings: async (clinicId: string) => {
    try {
      const { data: clinicData, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('id', clinicId)
        .single();

      if (error) throw error;

      set({
        clinic: {
          id: clinicData.id,
          name: clinicData.name,
          address: clinicData.address,
          gmbLink: clinicData.gmb_link,
          primaryColor: clinicData.primary_color,
          secondaryColor: clinicData.secondary_color,
          logo: clinicData.logo
        }
      });
    } catch (error) {
      console.error('Error fetching clinic settings:', error);
    }
  },
  updateClinic: async (updates) => {
    const { user, clinic } = get();
    if (!user?.clinicId) return;

    try {
      const { error } = await supabase
        .from('clinic_settings')
        .update({
          name: updates.name,
          address: updates.address,
          gmb_link: updates.gmbLink,
          primary_color: updates.primaryColor,
          secondary_color: updates.secondaryColor
        })
        .eq('id', clinic.id);

      if (error) throw error;

      set({ clinic: { ...clinic, ...updates } });
    } catch (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
  },
  updateDoctors: (doctors) => set({ doctors }),
  addDoctor: async (doctor) => {
    const { user } = get();
    if (!user?.clinicId) {
      throw new Error('No clinic ID found');
    }

    try {
      const { data: newDoctor, error } = await supabase
        .from('doctors')
        .insert([{
          name: doctor.name,
          specialization: doctor.specialization,
          clinic_id: user.clinicId
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        doctors: [...state.doctors, newDoctor]
      }));
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw error;
    }
  },
  deleteDoctor: async (id: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        doctors: state.doctors.filter(doctor => doctor.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  },
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  addReview: (review) =>
    set((state) => ({ reviews: [...state.reviews, review] })),
  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      ),
    })),
  updateReviewStatus: (id, status) =>
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review.id === id ? { ...review, status } : review
      ),
    })),
}));