import { Card, CardContent } from '@/components/ui/card';
import { Genre, MovieWithSimilarity, Movie } from '@/types';
import { ThumbsUp, Star } from 'lucide-react';

interface MovieCardProps {
    movie: MovieWithSimilarity | Movie;
    genres: Genre[];
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, genres, onClick }) => {
    const getGenreNames = (genreIds?: number[]) => {
        if (!genreIds) return '';
        return genreIds
            .map(id => genres.find(g => g.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <Card onClick={onClick} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
            />
            <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{getGenreNames(movie.genre_ids)}</p>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{new Date(movie.release_date).getFullYear()}</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <ThumbsUp size={16} className="text-primary" />
                            {'similarity' in movie && (
                                <span className="text-sm text-gray-600">{(movie.similarity * 100).toFixed(0)}% match</span>
                            )}
                        </div>
                        {movie.vote_average && (
                            <div className="flex items-center gap-1">
                                <Star size={16} className="text-yellow-400" />
                                <span className="text-sm text-gray-600">{movie.vote_average.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MovieCard;
