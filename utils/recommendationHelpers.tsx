import { Genre } from "@/types";

export function generateGenreVector(movieGenres: number[], allGenres: Genre[]): number[] {
    return allGenres.map(genre => (movieGenres.includes(genre.id) ? 1 : 0));
}

export function calculateTFIDF(documents: string[]): number[][] {
    const tokenize = (text: string): string[] => {
        return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
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

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) || 0;
}
