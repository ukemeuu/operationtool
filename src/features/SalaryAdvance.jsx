import React, { useState } from 'react';
import { TypeformContainer } from '../components/TypeformContainer';
import { PersonalDetailsStep } from '../components/PersonalDetailsStep';
import { Check, Loader2 } from 'lucide-react';

// Deployed Web App URL
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwb1KlRAv56fwRNeZyOPuEqnR5i6AQ4Oru7EwZFPDDOL-7cfyQu4f7y2ibmHOKQdOdq/exec';

export function SalaryAdvance({ onBack }) {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        staffId: '',
        amount: '',
    });

    const handleNext = () => {
        if (step === 0 && (!formData.name || !formData.email || !formData.staffId)) return;
        if (step === 1 && !formData.amount) return;
        setStep(s => s + 1);
    };

    const handlePrev = () => {
        if (step === 0) onBack();
        else setStep(s => s - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                action: 'salary_advance',
                ...formData,
            };

            // Using no-cors mode because Google Apps Script Web Apps often have CORS issues
            await fetch(APPSCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log("Submitted to AppScript:", payload);

            // Since we can't read the response in no-cors, we assume success if no network error thrown
            alert("Salary Advance Request Submitted!");
            setStep(3); // Move to success step
        } catch (error) {
            console.error("Submission error:", error);
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
                    staffId={formData.staffId}
                    showStaffId={true}
                    onUpdate={(field, value) => setFormData({ ...formData, [field]: value })}
                    onNext={handleNext}
                />
            )}

            {step === 1 && (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-secondary mb-2">How much do you need?</h1>
                    <p className="text-gray-500 mb-8">Please enter the amount you wish to request.</p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full p-4 pl-8 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors text-lg"
                                placeholder="0.00"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && formData.amount && handleNext()}
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-secondary mb-2">Review Request</h1>
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-gray-500">Requester</span>
                            <div className="text-right">
                                <span className="font-bold block">{formData.name}</span>
                                <span className="text-sm text-gray-500">{formData.email}</span>
                                <span className="text-xs text-gray-400">ID: {formData.staffId}</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount</span>
                            <span className="font-semibold text-xl">${formData.amount}</span>
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

            {step === 3 && (
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">Request Received</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Your salary advance request has been submitted for approval.
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
