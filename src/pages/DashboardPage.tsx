import React from 'react';
import { useStore } from '../store/useStore';
import { Users, Calendar, MessageSquare } from 'lucide-react';

export function DashboardPage() {
  const { appointments, reviews } = useStore();

  const stats = [
    {
      name: 'Total Appointments',
      value: appointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Reviews',
      value: reviews.filter(r => r.status === 'sent').length,
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      name: 'Total Reviews',
      value: reviews.length,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}