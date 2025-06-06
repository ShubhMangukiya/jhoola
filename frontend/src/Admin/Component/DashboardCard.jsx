import React from 'react';

const DashboardCard = ({ title, value, subtitle, progress, color = 'pink' }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div className={`h-2 rounded-full bg-${color}-500`} style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
