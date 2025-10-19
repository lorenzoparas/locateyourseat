'use client';

import { useState } from 'react';
import { useGuests } from '../context/GuestContext';

export default function GuestListPage() {
    const { guests, addGuest: addGuestToContext, removeGuest } = useGuests();
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestTable, setNewGuestTable] = useState('');

    const addGuest = () => {
        if (newGuestName.trim() && newGuestTable.trim()) {
            addGuestToContext(newGuestName.trim(), newGuestTable.trim());
            setNewGuestName('');
            setNewGuestTable('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addGuest();
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest List</h2>

            {/* Add Guest Form */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Guest</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="guest-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Guest Name
                        </label>
                        <input
                            id="guest-name"
                            type="text"
                            value={newGuestName}
                            onChange={(e) => setNewGuestName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter guest name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="table-number" className="block text-sm font-medium text-gray-700 mb-1">
                            Table Number
                        </label>
                        <input
                            id="table-number"
                            type="text"
                            value={newGuestTable}
                            onChange={(e) => setNewGuestTable(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter table number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 text-gray-900"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={addGuest}
                            disabled={!newGuestName.trim() || !newGuestTable.trim()}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Guest
                        </button>
                    </div>
                </div>
            </div>

            {/* Guest List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Guest List ({guests.length} guests)
                    </h3>
                </div>
                {guests.length === 0 ? (
                    <div className="p-4 sm:p-6 text-center text-gray-500">
                        No guests added yet. Add your first guest above!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {guests.map((guest) => (
                            <div key={guest.id} className="px-4 sm:px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="text-lg font-medium text-gray-900">{guest.name}</div>
                                    <div className="text-sm text-gray-500">Table {guest.tableNumber}</div>
                                </div>
                                <button
                                    onClick={() => removeGuest(guest.id)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1 cursor-pointer"
                                    title="Remove guest"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
