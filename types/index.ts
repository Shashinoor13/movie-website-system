export interface Movie {
    id: number;
    title: string;
    release_date: string;
    overview: string;
    poster_path: string;
    genre_ids: number[];
    vote_average?: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieWithSimilarity extends Movie {
    similarity: number;
    genreSimilarity: number;
    contentSimilarity: number;
}

export interface User {
    id: number;
    email: string;
    username: string;
}