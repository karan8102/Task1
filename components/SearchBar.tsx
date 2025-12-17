import { Search, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-full shadow-xl overflow-hidden border border-gray-100 p-1">
                    <input
                        type="text"
                        className="flex-1 px-6 py-3 outline-none text-gray-700 text-lg placeholder-gray-400"
                        placeholder="Describe what you're looking for... (e.g., cheap gaming laptop)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Search className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
                Powered by <span className="font-semibold text-blue-600">Gemini AI</span>
            </p>
        </form>
    );
}
