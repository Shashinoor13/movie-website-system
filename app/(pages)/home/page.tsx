"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/(config)/supabase';
import MovieGrid from '@/components/MovieGrid';
import { Genre, Movie } from '@/types';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState<string | undefined>(" ");
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalMovies, setTotalMovies] = useState<number | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchMovies(searchQuery);
    }, [page, searchQuery]);

    const fetchGenres = async () => {
        const { data, error } = await supabase.from('genres').select('*');
        if (error) {
            console.error('Error fetching genres:', error);
            return;
        }
        setGenres(data);
    };

    const fetchMovies = async (query?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/movie${query ? `?query=${query}` : ''}&page=${page}`);
            const data = await response.json();
            if (data.movies) {
                if (page === 1) {
                    setMovies(data.movies);
                } else {
                    setMovies(prevMovies => [...prevMovies, ...data.movies]);
                }
                setTotalMovies(data.totalMovies || 0);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page on new search
    };

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <div className='w-full flex flex-col items-center px-8 py-4 gap-4'>
            <SearchBar searchQuery={searchQuery || ''} setSearchQuery={setSearchQuery} onSearch={(e) => {
                e.preventDefault();
                handleSearch(searchQuery || '');
            }
            } />
            {isLoading && <div>Loading...</div>}
            <MovieGrid movies={movies} genres={genres} onMovieClick={(movie) => router.push(`/recommendation?movieId=${movie.id}`)} />
            <div className='w-100vw  bg-red-100 items-center justify-center'>
                <Button className='align-middle' onClick={handleLoadMore}>Load More</Button>
            </div>
        </div>
    );
};

export default HomePage;
