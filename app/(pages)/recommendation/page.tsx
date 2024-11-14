"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/app/(config)/supabase';
import { Genre, Movie, MovieWithSimilarity } from '@/types';
import { calculateTFIDF, cosineSimilarity, generateGenreVector } from '@/utils/recommendationHelpers';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import SelectedMovie from '@/components/SelectedMovie';
import RecommendationList from '@/components/RecommendationList';

export default function RecommendationPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [recommendedMovies, setRecommendedMovies] = useState<MovieWithSimilarity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const movieId = searchParams.get('movieId');

    // Fetch genres and movies from the database
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const { data: genreData, error: genreError } = await supabase.from('genres').select('*');
                if (genreError) throw genreError;
                setGenres(genreData);

                const { data: movieData, error: movieError } = await supabase.from('movies').select('*');
                if (movieError) throw movieError;

                setMovies(movieData);

                if (movieId) {
                    const movie = movieData.find(m => m.id === parseInt(movieId));
                    if (movie) setSelectedMovie(movie);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [movieId]);

    // Generate recommendations based on selected movie
    useEffect(() => {
        if (!selectedMovie || genres.length === 0 || movies.length === 0) return;

        const movieGenreVector = generateGenreVector(selectedMovie.genre_ids, genres);
        const documents = movies.map(m => m.overview);
        const tfidfVectors = calculateTFIDF(documents);
        const targetIndex = movies.findIndex(m => m.id === selectedMovie.id);

        const similarities = movies
            .filter(m => m.id !== selectedMovie.id)
            .map(m => {
                const genreSimilarity = cosineSimilarity(
                    movieGenreVector,
                    generateGenreVector(m.genre_ids, genres)
                );

                const contentIndex = movies.findIndex(movie => movie.id === m.id);
                const contentSimilarity = contentIndex !== -1
                    ? cosineSimilarity(tfidfVectors[targetIndex], tfidfVectors[contentIndex])
                    : 0;

                const combinedSimilarity = (genreSimilarity * 0.7) + (contentSimilarity * 0.3);

                return {
                    ...m,
                    similarity: combinedSimilarity,
                    genreSimilarity,
                    contentSimilarity
                };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 6);

        setRecommendedMovies(similarities);
    }, [selectedMovie, genres, movies]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => router.push('/home')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
                <ArrowLeft size={20} />
                Back to Movies
            </button>

            {selectedMovie ? (
                <>
                    <SelectedMovie movie={selectedMovie} genres={genres} />
                    <RecommendationList movies={recommendedMovies} genres={genres} />
                </>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-xl text-gray-600">Select a movie from the home page to see recommendations</h2>
                </div>
            )}
        </div>
    );
}
