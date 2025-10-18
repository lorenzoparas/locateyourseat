'use client';

import { useState } from 'react';
import { useGuests } from '../context/GuestContext';

interface Guest {
    id: string;
    name: string;
    tableNumber: string;
}

export default function SeatLocatorPage() {
    const { guests } = useGuests();
    const [searchQuery, setSearchQuery] = useState('');
    const [revealingTable, setRevealingTable] = useState(false);
    const [revealedGuest, setRevealedGuest] = useState<Guest | null>(null);
    const [currentNumber, setCurrentNumber] = useState(0);
    const [showFinalNumber, setShowFinalNumber] = useState(false);

    // Filter guests based on search query
    const filteredGuests = guests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Table reveal animation
    const revealTableNumber = (guest: Guest) => {
        if (revealingTable) return;

        setRevealingTable(true);
        setRevealedGuest(guest);
        setCurrentNumber(0);
        setShowFinalNumber(false);

        // Play drumroll sound (using Web Audio API)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2.5);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2.5);

        // Random number scrolling
        const targetNumber = parseInt(guest.tableNumber);
        const interval = setInterval(() => {
            setCurrentNumber(Math.floor(Math.random() * 50) + 1);
        }, 50);

        // Stop scrolling and show final number after 2.5 seconds
        setTimeout(() => {
            clearInterval(interval);
            setCurrentNumber(targetNumber);
            setShowFinalNumber(true);

            // Play tada sound
            const tadaOscillator = audioContext.createOscillator();
            const tadaGain = audioContext.createGain();

            tadaOscillator.connect(tadaGain);
            tadaGain.connect(audioContext.destination);

            tadaOscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            tadaOscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            tadaOscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

            tadaGain.gain.setValueAtTime(0.3, audioContext.currentTime);
            tadaGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            tadaOscillator.start();
            tadaOscillator.stop(audioContext.currentTime + 0.5);
        }, 2500);
    };

    // Handle back button click
    const handleBack = () => {
        setRevealingTable(false);
        setRevealedGuest(null);
        setShowFinalNumber(false);
        setCurrentNumber(0);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seat Locator</h2>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Search for a Guest</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type guest name to search..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 text-gray-900"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search Results - Only show when searching */}
            {searchQuery && (
                <div className="bg-white rounded-lg shadow">
                    {guests.length === 0 ? (
                        <div className="p-4 sm:p-6 text-center text-gray-500">
                            No guests added yet. Add guests in the Guest List tab first!
                        </div>
                    ) : filteredGuests.length === 0 ? (
                        <div className="p-4 sm:p-6 text-center text-gray-500">
                            No guests found matching "{searchQuery}"
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredGuests.map((guest) => (
                                <div
                                    key={guest.id}
                                    onClick={() => revealTableNumber(guest)}
                                    className="px-4 sm:px-6 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                >
                                    <div className="text-lg text-gray-900">
                                        {guest.name}
                                    </div>
                                    <div className="text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Empty state when not searching */}
            {!searchQuery && (
                <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Search for a guest</h3>
                    <p className="text-gray-500">Type a name above to find guests and their table numbers</p>
                </div>
            )}

            {/* Table reveal modal */}
            {revealingTable && revealedGuest && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Your table number is:
                        </h2>
                        <div className="text-6xl font-bold text-blue-400 mb-4">
                            {currentNumber}
                        </div>
                        <p className="text-gray-300 mb-6">
                            {revealedGuest.name}
                        </p>
                        <button
                            onClick={handleBack}
                            disabled={!showFinalNumber}
                            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${showFinalNumber
                                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
