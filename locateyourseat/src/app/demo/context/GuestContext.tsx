'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Guest {
    id: string;
    name: string;
    tableNumber: string;
}

interface GuestContextType {
    guests: Guest[];
    addGuest: (name: string, tableNumber: string) => void;
    removeGuest: (id: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
    const [guests, setGuests] = useState<Guest[]>([]);

    // Load guests from localStorage on component mount
    useEffect(() => {
        const savedGuests = localStorage.getItem('guests');
        if (savedGuests) {
            setGuests(JSON.parse(savedGuests));
        }
    }, []);

    // Save guests to localStorage whenever guests state changes
    useEffect(() => {
        localStorage.setItem('guests', JSON.stringify(guests));
    }, [guests]);

    const addGuest = (name: string, tableNumber: string) => {
        if (name.trim() && tableNumber.trim()) {
            const newGuest: Guest = {
                id: Date.now().toString(),
                name: name.trim(),
                tableNumber: tableNumber.trim(),
            };
            setGuests(prevGuests => [...prevGuests, newGuest]);
        }
    };

    const removeGuest = (id: string) => {
        setGuests(prevGuests => prevGuests.filter(guest => guest.id !== id));
    };

    return (
        <GuestContext.Provider value={{ guests, addGuest, removeGuest }}>
            {children}
        </GuestContext.Provider>
    );
}

export function useGuests() {
    const context = useContext(GuestContext);
    if (context === undefined) {
        throw new Error('useGuests must be used within a GuestProvider');
    }
    return context;
}
