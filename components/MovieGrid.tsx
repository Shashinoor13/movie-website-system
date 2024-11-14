import { Genre, Movie } from '@/types';
import MovieCard from './MovieCard';


interface MovieGridProps {
    movies: Movie[];
    genres: Genre[];
    onMovieClick: (movie: Movie) => void;
}

const MovieGrid = ({ movies, genres, onMovieClick }: MovieGridProps) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} genres={genres} onClick={() => onMovieClick(movie)} />
        ))}
    </div>
);

export default MovieGrid;
