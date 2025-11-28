import React from 'react';

export function PersonalDetailsStep({ name, email, staffId, showStaffId = false, onUpdate, onNext }) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-secondary mb-2">Let's start with your details</h1>
            <p className="text-gray-500 mb-8">Please provide your information.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors text-lg"
                        placeholder="Your full name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && name && email && (!showStaffId || staffId) && onNext()}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => onUpdate('email', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors text-lg"
                        placeholder="your.email@example.com"
                        onKeyDown={(e) => e.key === 'Enter' && name && email && (!showStaffId || staffId) && onNext()}
                    />
                </div>

                {showStaffId && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                        <input
                            type="text"
                            value={staffId}
                            onChange={(e) => onUpdate('staffId', e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors text-lg"
                            placeholder="Your staff ID"
                            onKeyDown={(e) => e.key === 'Enter' && name && email && staffId && onNext()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
