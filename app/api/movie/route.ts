import { NextResponse } from 'next/server';
import supabase from '@/app/(config)/supabase';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY as string;
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`;
const TMDB_GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

interface Movie {
    title: string;
    release_date: string | null;
    overview: string;
    poster_path: string;
    id: number;
    genre_ids: number[];
    vote_average?: number;
}

interface Genre {
    id: number;
    name: string;
}

// Existing TF-IDF and similarity functions remain the same
function calculateTFIDF(documents: string[]): number[][] {
    const tokenize = (text: string): string[] => {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/);
    };

    const docTokens = documents.map(tokenize);
    const vocabulary = new Set(docTokens.flat());

    const idf = new Map();
    vocabulary.forEach(term => {
        const docsWithTerm = docTokens.filter(tokens => tokens.includes(term)).length;
        idf.set(term, Math.log(documents.length / (1 + docsWithTerm)));
    });

    return docTokens.map(tokens => {
        const vector = Array.from(vocabulary).map(term => {
            const tf = tokens.filter(t => t === term).length / tokens.length;
            return tf * (idf.get(term) || 0);
        });
        return vector;
    });
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB) || 0;
}

async function getRecommendations(movieId: number, movies: Movie[], limit: number = 5): Promise<Movie[]> {
    const targetMovie = movies.find(m => m.id === movieId);
    if (!targetMovie) return [];

    const documents = movies.map(m => m.overview);
    const tfidfVectors = calculateTFIDF(documents);

    const targetIndex = movies.findIndex(m => m.id === movieId);
    const similarities = tfidfVectors.map((vector, index) => ({
        movie: movies[index],
        similarity: cosineSimilarity(tfidfVectors[targetIndex], vector)
    }));

    return similarities
        .filter(item => item.movie.id !== movieId)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => item.movie);
}

// New function to fetch and sync genres
async function syncGenres(): Promise<Genre[]> {
    try {
        // Fetch genres from TMDB
        const response = await fetch(TMDB_GENRE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch genres from TMDB');
        }
        const { genres } = await response.json();

        // Upsert genres into Supabase
        const { data: insertedGenres, error: insertError } = await supabase
            .from('genres')
            .upsert(genres, { onConflict: 'id' })
            .select();

        if (insertError) {
            throw insertError;
        }

        return insertedGenres || [];
    } catch (error) {
        console.error('Error syncing genres:', error);
        throw error;
    }
}

// New function to fetch movie details including genres
async function fetchMovieDetails(movieId: number): Promise<Movie | null> {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch movie details from TMDB');
        }
        const movieData = await response.json();
        return {
            id: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            poster_path: movieData.poster_path,
            release_date: movieData.release_date || '',
            genre_ids: movieData.genres.map((g: Genre) => g.id),
            vote_average: movieData.vote_average
        };
    } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const movieId = searchParams.get('movieId');

    try {
        // Sync genres first
        await syncGenres();

        // Check for movies in Supabase
        let supabaseQuery = supabase.from('movies').select('*').range((page - 1) * limit, page * limit - 1);
        if (query != undefined) {
            supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
        }

        const { data: movies, error } = await supabaseQuery;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Handle recommendations
        if (movieId && movies && movies.length > 0) {
            const recommendations = await getRecommendations(parseInt(movieId), movies);
            return NextResponse.json({ recommendations });
        }

        // Fetch new movies if none exist or if searching
        if (!movies || movies.length === 0) {
            let tmdbUrl = query
                ? `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&api_key=${TMDB_API_KEY}`
                : `${TMDB_API_URL}&page=${page}`;

            const response = await fetch(tmdbUrl, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error('Failed to fetch movies from TMDB');
            }

            const { results } = await response.json();

            // Fetch detailed information for each movie to get genres
            const movieDetailsPromises = results
                .filter((movie: Movie) => movie.poster_path !== null)
                .map((movie: Movie) => fetchMovieDetails(movie.id));

            const movieDetails = await Promise.all(movieDetailsPromises);
            const validMovies = movieDetails.filter((movie): movie is Movie => movie !== null);

            // Insert movies with genre information
            const { data: insertedMovies, error: insertError } = await supabase
                .from('movies')
                .upsert(validMovies, { onConflict: 'id' })
                .select();

            if (insertError) {
                throw insertError;
            }
            return NextResponse.json({ movies: validMovies });
        }

        return NextResponse.json({ movies });
    } catch (error: any) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
