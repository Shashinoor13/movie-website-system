"use client";
import { Genre, MovieWithSimilarity } from '@/types';
import MovieCard from './MovieCard';
import { useRouter } from "next/navigation";

interface RecommendationListProps {
    movies: MovieWithSimilarity[];
    genres: Genre[];
}



const RecommendationList: React.FC<RecommendationListProps> = ({ movies, genres }) => {
    const router = useRouter();
    const handleClick = (movie: MovieWithSimilarity) => {
        router.push(`/recommendation?movieId=${movie ? movie.id : ''}`);
    }
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Recommended Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {movies.map(movie => (
                    <MovieCard onClick={() => handleClick(movie)} key={movie.id} movie={movie} genres={genres} />
                ))}
            </div>
        </div>
    );
};

export default RecommendationList;
