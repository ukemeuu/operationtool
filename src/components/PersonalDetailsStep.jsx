import React from 'react';

export function PersonalDetailsStep({ name, email, onUpdate, onNext }) {
    const isValid = name?.trim().length > 0 && email?.trim().length > 0 && email.includes('@');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-secondary mb-2">Who are you?</h1>
            <p className="text-gray-500 mb-8">Please provide your details so we know who is making this request.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
                        placeholder="John Doe"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => onUpdate('email', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
                        placeholder="john@example.com"
                        onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
                    />
                </div>
            </div>
        </div>
    );
}
