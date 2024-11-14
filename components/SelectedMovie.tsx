import { Card, CardContent } from '@/components/ui/card';
import { Genre, Movie } from '@/types';

interface SelectedMovieProps {
    movie: Movie;
    genres: Genre[];
}

const SelectedMovie: React.FC<SelectedMovieProps> = ({ movie, genres }) => {
    const getGenreNames = (genreIds?: number[]) => {
        if (!genreIds) return '';
        return genreIds
            .map(id => genres.find(g => g.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <Card className="mb-12">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Selected Movie</h2>
                <div className="flex gap-6">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-48 h-72 object-cover rounded-lg shadow-lg"
                    />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                        <p className="text-gray-600 mb-2">
                            {new Date(movie.release_date).getFullYear()}
                        </p>
                        <p className="text-gray-600 mb-4">
                            Genres: {getGenreNames(movie.genre_ids)}
                        </p>
                        <p className="text-gray-700">{movie.overview}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SelectedMovie;
