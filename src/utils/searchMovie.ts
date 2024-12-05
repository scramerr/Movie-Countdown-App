import { fetchMovies } from '@/utils/fetchMovies';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path?: string;
  description?: string;
}


export const SearchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const movies = await fetchMovies(query);
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};