import React, { useState } from 'react';
import { LeaveRequest } from './features/LeaveRequest';
import { SalaryAdvance } from './features/SalaryAdvance';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // 'home', 'leave', 'salary'

  return (
    <div className="min-h-screen bg-white text-secondary font-sans selection:bg-primary selection:text-secondary">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col items-center justify-center p-4"
          >
            <div className="max-w-4xl w-full text-center space-y-12">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Staff Operations</h1>
                <p className="text-xl text-gray-500">What would you like to do today?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setView('leave')}
                  className="group relative overflow-hidden p-8 rounded-2xl border-2 border-gray-100 hover:border-primary bg-white hover:bg-gray-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar size={100} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-secondary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Request Leave</h3>
                      <p className="text-gray-500 mt-1">Annual or Sick leave requests linked to your calendar.</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setView('salary')}
                  className="group relative overflow-hidden p-8 rounded-2xl border-2 border-gray-100 hover:border-primary bg-white hover:bg-gray-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign size={100} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Salary Advance</h3>
                      <p className="text-gray-500 mt-1">Request an advance on your upcoming salary.</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'leave' && (
          <motion.div key="leave" className="absolute inset-0">
            <LeaveRequest onBack={() => setView('home')} />
          </motion.div>
        )}

        {view === 'salary' && (
          <motion.div key="salary" className="absolute inset-0">
            <SalaryAdvance onBack={() => setView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
