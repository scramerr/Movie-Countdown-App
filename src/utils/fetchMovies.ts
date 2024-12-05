import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path?: string;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const currentDate = new Date(); 

    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '85955791d4e96bd6122126c47f758e57', 
        query: query,
      },
    });

    const upcomingMovies = response.data.results.filter((movie: Movie) => {
      const releaseDate = new Date(movie.release_date);
      return releaseDate > currentDate; 
    });

    return upcomingMovies;

  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
