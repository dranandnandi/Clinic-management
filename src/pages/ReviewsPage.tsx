import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ThumbsUp, MessageCircle, Star } from 'lucide-react';
import { generateAIReview } from '../services/aiService';

export function ReviewsPage() {
  const { clinic, doctors, reviews, addReview, updateReviewStatus } = useStore();
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentDate: '',
    doctorId: '',
    contactNumber: '',
    treatment: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const review = {
      id: crypto.randomUUID(),
      ...formData,
      clinicName: clinic.name,
      clinicAddress: clinic.address,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    addReview(review);
    setFormData({
      patientName: '',
      appointmentDate: '',
      doctorId: '',
      contactNumber: '',
      treatment: '',
      notes: '',
    });
  };

  const generateWhatsAppLink = (message: string, phoneNumber: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'whatsapp://' : 'https://web.whatsapp.com/';
    const formattedPhone = `91${phoneNumber}`;
    return `${baseUrl}send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
  };

  const handleSendThankYou = (review: typeof reviews[0]) => {
    const doctor = doctors.find(d => d.id === review.doctorId);
    const message = `Hello ${review.patientName},

We hope you had a satisfying experience with the services at ${clinic.name}. Your feedback is highly valuable to us, and we would greatly appreciate it if you could share your review.

Your visit details:
📅 Date: ${format(new Date(review.appointmentDate), 'PPP')}
👨‍⚕️ Doctor: Dr. ${doctor?.name}
🏥 Location: ${clinic.address}

You will receive 2 more messages:
1. A suggested review template
2. A link to submit your review

Best regards,
Team ${clinic.name}`;

    window.open(generateWhatsAppLink(message, review.contactNumber), '_blank');
  };

  const handleSendReview = async (review: typeof reviews[0]) => {
    const doctor = doctors.find(d => d.id === review.doctorId);
    try {
      const aiReview = await generateAIReview({
        clinicName: clinic.name,
        doctorName: doctor?.name || '',
        treatment: review.treatment || review.notes || 'consultation',
        date: format(new Date(review.appointmentDate), 'PP')
      });

      const message = aiReview;
      window.open(generateWhatsAppLink(message, review.contactNumber), '_blank');
    } catch (error) {
      console.error('Error generating review:', error);
      alert('Failed to generate review. Please try again.');
    }
  };

  const handleSendGMBLink = (review: typeof reviews[0]) => {
    const message = `You can submit your review here: ${clinic.gmbLink}`;
    window.open(generateWhatsAppLink(message, review.contactNumber), '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">New Review Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor</label>
              <select
                required
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10 digit number"
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, contactNumber: value });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Treatment/Disease/Symptoms (Optional)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., Dental Cleaning, Fever, Back Pain"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Review Request
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Review Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment/Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => {
                const doctor = doctors.find((d) => d.id === review.doctorId);
                return (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {review.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(review.appointmentDate), 'PP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {review.treatment && <span className="font-medium">{review.treatment}</span>}
                      {review.treatment && review.notes && <span className="mx-1">-</span>}
                      {review.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        review.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleSendThankYou(review)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Thank You
                      </button>
                      <button
                        onClick={() => handleSendReview(review)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Review
                      </button>
                      <button
                        onClick={() => handleSendGMBLink(review)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        GMB Link
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review.id, 'sent')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        disabled={review.status === 'sent'}
                      >
                        Mark as Sent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}