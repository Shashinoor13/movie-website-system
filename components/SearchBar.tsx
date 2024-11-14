import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: (event: React.FormEvent) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) => (
    <form onSubmit={onSearch} className="flex gap-4 w-[80%]">
        <Input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md w-full"
        />
        <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2 hover:bg-primary/90"
        >
            <Search size={20} />
            Search
        </button>
    </form>
);

export default SearchBar;
