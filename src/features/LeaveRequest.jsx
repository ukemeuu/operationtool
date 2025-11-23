import React, { useState } from 'react';
import { TypeformContainer } from '../components/TypeformContainer';
import { PersonalDetailsStep } from '../components/PersonalDetailsStep';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const LEAVE_TYPES = [
  { id: 'annual', label: 'Annual Leave', limit: 21 },
  { id: 'sick', label: 'Sick Leave', limit: 15 },
];

const MAX_DAYS_PER_REQUEST = 4;
// Placeholder URL - User needs to replace this with their deployed Web App URL
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzN6SI9EjggqxCU1PFRRxoT_FxvrkaPrfFqJrqMXeCveH9qLuGXL5JoCYgueVqmDE6HOQ/exec';

export function LeaveRequest({ onBack }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leaveType: null,
    dates: [],
  });

  const handleNext = () => {
    if (step === 0 && (!formData.name || !formData.email)) return;
    if (step === 1 && !formData.leaveType) return;
    if (step === 2 && formData.dates.length === 0) return;
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  const toggleDate = (date) => {
    const isSelected = formData.dates.some(d => isSameDay(d, date));
    let newDates;
    if (isSelected) {
      newDates = formData.dates.filter(d => !isSameDay(d, date));
    } else {
      if (formData.dates.length >= MAX_DAYS_PER_REQUEST) {
        alert(`You can only select up to ${MAX_DAYS_PER_REQUEST} days at a time.`);
        return;
      }
      newDates = [...formData.dates, date];
    }
    setFormData({ ...formData, dates: newDates });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real scenario, we would fetch(APPSCRIPT_URL, ...)
      // For now, we simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mocking the payload that would be sent
      console.log("Submitting to AppScript:", {
        action: 'leave_request',
        ...formData,
        dates: formData.dates.map(d => format(d, 'yyyy-MM-dd'))
      });

      alert("Leave Request Submitted! (Data would be sent to Google Sheets)");
      onBack();
    } catch (error) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TypeformContainer
      currentStep={step}
      totalSteps={4}
      onNext={handleNext}
      onPrev={handlePrev}
      isFirst={false}
      isLast={step === 3}
    >
      {step === 0 && (
        <PersonalDetailsStep
          name={formData.name}
          email={formData.email}
          onUpdate={(field, value) => setFormData({ ...formData, [field]: value })}
          onNext={handleNext}
        />
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">What type of leave is this?</h1>
          <p className="text-gray-500 mb-8">Select the category that applies.</p>
          <div className="grid gap-4">
            {LEAVE_TYPES.map((type, index) => (
              <button
                key={type.id}
                onClick={() => {
                  setFormData({ ...formData, leaveType: type.id, dates: [] }); // Reset dates on type change
                  setTimeout(() => setStep(2), 200);
                }}
                className={clsx(
                  "p-6 text-left border-2 rounded-xl transition-all duration-200 flex items-center justify-between group",
                  formData.leaveType === type.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-primary hover:bg-gray-50"
                )}
              >
                <div>
                  <span className="text-xl font-semibold block text-secondary">{type.label}</span>
                  <span className="text-sm text-gray-500">Max {type.limit} days/year</span>
                </div>
                <div className={clsx(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  formData.leaveType === type.id ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary"
                )}>
                  {formData.leaveType === type.id && <Check size={14} className="text-secondary" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">When do you want to take leave?</h1>
          <p className="text-gray-500 mb-8">
            Selected: <span className="font-bold text-secondary">{formData.dates.length}</span> / {MAX_DAYS_PER_REQUEST} days (Max per request)
          </p>
          <CalendarSelector
            selectedDates={formData.dates}
            onSelect={toggleDate}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">Review Request</h1>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Requester</span>
              <div className="text-right">
                <span className="font-bold block">{formData.name}</span>
                <span className="text-sm text-gray-500">{formData.email}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold">{LEAVE_TYPES.find(t => t.id === formData.leaveType)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Days</span>
              <span className="font-semibold">{formData.dates.length} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dates</span>
              <div className="text-right">
                {formData.dates.sort((a, b) => a - b).map(d => (
                  <div key={d.toString()} className="font-medium">{format(d, 'MMM d, yyyy')}</div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-secondary font-bold text-lg rounded-xl hover:bg-yellow-400 transition-colors shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      )}
    </TypeformContainer>
  );
}

function CalendarSelector({ selectedDates, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = getDay(startOfMonth(currentMonth)); // 0 = Sun, 1 = Mon...

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
        <span className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const isSelected = selectedDates.some(d => isSameDay(d, day));
          return (
            <button
              key={day.toString()}
              onClick={() => onSelect(day)}
              className={clsx(
                "h-10 w-10 rounded-full flex items-center justify-center transition-all text-sm font-medium",
                isSelected ? "bg-primary text-secondary font-bold shadow-md transform scale-110" : "hover:bg-gray-100 text-gray-700",
                isToday(day) && !isSelected && "ring-2 ring-primary ring-inset"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
