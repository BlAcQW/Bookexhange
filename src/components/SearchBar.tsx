import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-xl mx-auto relative">
      <input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
    </div>
  );
}