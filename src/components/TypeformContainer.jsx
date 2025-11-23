import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TypeformContainer({ children, currentStep, totalSteps, onNext, onPrev, isFirst, isLast }) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Content */}
            <div className="w-full max-w-2xl z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls (Optional, usually handled by Enter key or specific buttons in form) */}
            <div className="fixed bottom-8 right-8 flex gap-2">
                {!isFirst && (
                    <button
                        onClick={onPrev}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Previous"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                )}
                {!isLast && (
                    <button
                        onClick={onNext}
                        className="px-4 py-2 bg-secondary text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        Next <span className="text-xs opacity-70">Press Enter ↵</span>
                    </button>
                )}
            </div>
        </div>
    );
}
