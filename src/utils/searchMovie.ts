import { fetchMovies } from '@/utils/fetchMovies';

export const SearchMovies = async (query: string): Promise<any[]> => {
  try {
    const movies = await fetchMovies(query);
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};