

import React, { useState, useEffect } from 'react';

const DateTime: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(' ', '');
  };

  return (
    <div className="text-right text-gray-600 dark:text-gray-400">
      <div className="text-lg font-semibold">{formatTime(currentDateTime)}</div>
      <div className="text-sm">{formatDate(currentDateTime)}</div>
    </div>
  );
};

export default DateTime;
