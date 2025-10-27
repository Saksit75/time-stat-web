'use client'
import { useEffect, useState } from 'react';

interface SelecterProps {
    id: string; // id แบบ string ใช้กับ label
    options: { value: string; label: string }[];
    defaultValue?: { value: string; label: string }[];
    value?: string;
    onChange?: (value: string) => void;
}

export default function Selecter({
    id = 'selecter',
    options,
    defaultValue,
    value,
    onChange,
}: SelecterProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <select 
            value={value || "เลือก"} 
            onChange={(e) => onChange && onChange(e.target.value)}
            className="select w-full md:w-1/2 px-4 !rounded-box" 
            id={id}
            required
        >
            <option value="">เลือก</option>
            {
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    );
}
