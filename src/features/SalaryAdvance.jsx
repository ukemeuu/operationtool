import React, { useState } from 'react';
import { TypeformContainer } from '../components/TypeformContainer';
import { PersonalDetailsStep } from '../components/PersonalDetailsStep';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function SalaryAdvance({ onBack }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        amount: '',
        reason: '',
        repayment: '',
    });

    const handleNext = () => {
        if (step === 0 && (!formData.name || !formData.email)) return;
        if (step === 1 && !formData.amount) return;
        if (step === 2 && !formData.reason) return;
        setStep(s => s + 1);
    };

    const handlePrev = () => {
        if (step === 0) onBack();
        else setStep(s => s - 1);
    };

    return (
        <TypeformContainer
            currentStep={step}
            totalSteps={5}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={false}
            isLast={step === 4}
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
                    <h1 className="text-3xl font-bold text-secondary mb-2">How much do you need?</h1>
                    <p className="text-gray-500 mb-8">Enter the amount you wish to request as an advance.</p>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">KES</span>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full text-4xl font-bold p-4 pl-16 border-b-2 border-gray-200 focus:border-primary outline-none transition-colors bg-transparent placeholder-gray-200"
                            placeholder="0.00"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-secondary mb-2">What is this for?</h1>
                    <p className="text-gray-500 mb-8">Briefly explain the reason for this request.</p>
                    <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full text-xl p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors min-h-[150px] resize-none"
                        placeholder="Type your reason here..."
                        autoFocus
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
                            <span className="text-gray-500">Amount</span>
                            <span className="font-bold text-xl">KES {formData.amount}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500 block">Reason</span>
                            <p className="font-medium">{formData.reason}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            // alert("Salary Advance Request Submitted!");
                            setStep(4);
                        }}
                        className="w-full py-4 bg-primary text-secondary font-bold text-lg rounded-xl hover:bg-yellow-400 transition-colors shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Submit Request
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">Request Received</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Management will get back to you shortly.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </TypeformContainer>
    );
}
