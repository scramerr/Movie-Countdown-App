// 'use client';

// import React, { useState } from 'react';
// import { SearchMovies } from '@/utils/searchMovie';
// import { ExpandableCardDemo } from './ExpandableCard';

// interface Movie {
//   id: number;
//   title: string;
//   description: string;
//   releaseDate: string;
//   posterPath: string;
// }

// export const MovieSearchPage = () => {
//   const [query, setQuery] = useState('');
//   const [movies, setMovies] = useState<Movie[]>([]);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     try {
//       const results = await SearchMovies(query);

//       const formattedResults: Movie[] = results.map((movie: any) => ({
//         id: movie.id,
//         title: movie.title,
//         posterPath: movie.poster_path
//           ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//           : '',
//         releaseDate: movie.release_date || 'Unknown',
//         description: `Release Date: ${movie.release_date || 'Unknown'}`,
//       }));

//       setMovies(formattedResults);
//     } catch (error) {
//       console.log('Error searching for movies:', error);
//     }
//   };

//   return (
//     <>
//       <div className="bg-red">

//         <div className="flex justify-center mt-20 mb-20">
//           <h1 className="text-5xl">Search For Upcoming Movies</h1>
//         </div>

//         <form onSubmit={handleSearch} className="flex gap-4 justify-center mb-6">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Enter movie name..."
//             className="flex-1 px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Search
//           </button>
//         </form>

//         <div className="mt-10">
//           <ExpandableCardDemo movies={movies} />
//         </div>
//       </div>
//     </>
//   );
// };
