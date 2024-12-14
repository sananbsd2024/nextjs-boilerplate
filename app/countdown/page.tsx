'use client'

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const generateTimeSlots = (startHour: number, startMinute: number, endHour: number, endMinute: number, intervalMinutes: number) => {
  const slots = [];
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);

  while (currentTime <= endTime) {
    slots.push(new Date(currentTime));
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }
  return slots;
};

const CountdownTimerCard = ({
  title,
  link,
  endTime,
}: {
  title: string;
  link: string;
  endTime: Date;
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime !== null && prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return calculateTimeLeft();
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <a
      href={timeLeft > 0 ? link : undefined} // หากเวลาหมด link จะเป็น undefined
      className={`block ${timeLeft === 0 ? 'pointer-events-none' : ''}`} // ปิดการคลิกเมื่อเวลาหมด
    >
      <div
        className={`p-6 bg-white border border-gray-200 rounded-lg shadow ${
          timeLeft === 0 ? 'opacity-50' : 'hover:bg-gray-100'
        } dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div className="flex items-center justify-center text-4xl font-mono text-gray-800 mb-4">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
            {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}
          </div>
          {timeLeft === 0 && <p className="text-red-500 font-bold">หมดเวลา!</p>}
        </div>
      </div>
    </a>
  );
};

const GridCountdown = () => {
  const slots = generateTimeSlots(6, 0, 23, 45, 15); // เริ่ม 06:00, จบ 23:45, เว้น 15 นาที
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {slots.map((time, index) => (
          <CountdownTimerCard
            key={index}
            title={`Card ${index + 1}`}
            link={`/page${index + 1}`} // ลิงก์เฉพาะของแต่ละ Card
            endTime={time}
          />
        ))}
      </div>
    </div>
  );
};

export default GridCountdown;
