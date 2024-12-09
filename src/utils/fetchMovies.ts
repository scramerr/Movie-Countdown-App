import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path?: string;
  description?: string;
}


export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const currentDate = new Date();

    let currentPage = 1
    let totalPages = 1

    let movies:Movie[] = []

    while (currentPage <= totalPages) {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: '85955791d4e96bd6122126c47f758e57',
          page: currentPage,
          query: query,
        },
      });

      totalPages = Math.min(30, response.data.total_pages)
      currentPage++



      movies =  [...movies, ...response.data.results.filter((movie: Movie) => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate > currentDate;
      })];

    }

    return movies

    

  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
