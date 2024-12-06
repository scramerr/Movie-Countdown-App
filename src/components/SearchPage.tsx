'use client'

import React, { useState, useEffect } from 'react';
import { SearchMovies } from '@/utils/searchMovie';
import Image from 'next/image';

interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    posterPath: string;
    remainingTime?: RemainingTime;
}

interface RemainingTime {
    seconds: number,
    minutes: number,
    hours: number,
    days: number
}

export const MovieSearchPage = () => {
    const [query, setQuery] = useState('')
    const [movies, setMovies] = useState<Movie[]>([]);

    const [searched, setSearched] = useState(false)

    const calculateRemainingTime = (releaseDate: string): RemainingTime => {

        const currentTime = new Date();
        const releaseTime = new Date(releaseDate);
        const difference = Math.max(releaseTime.getTime() - currentTime.getTime(), 0);

        const seconds = Math.floor(difference / 1000) % 60;
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const hours = Math.floor((difference / 1000 / 60 / 60) % 24);
        const days = Math.floor(difference / 1000 / 60 / 60 / 24);

        return { seconds, minutes, hours, days };
    };

    useEffect(() => {
        const intervalId = setInterval(() => {

            setMovies((prevMovies) => prevMovies.map((movie) => ({
                ...movie,
                remainingTime: calculateRemainingTime(movie.releaseDate)
            })));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setSearched(true)

        if (!query.trim()) {
            setSearched(false)
            setMovies([])
            return
        }

        try {
            const results = await SearchMovies(query)
            console.log(results)

            const formattedResults: Movie[] = results.map((movie) => ({
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://placehold.co/400x600?text=No+Image+Found+For+\\n+${movie.title.replaceAll(" ", "+")}`,
                releaseDate: movie.release_date || 'unknown for now',
                description: movie.description || "ne description found",
            }));

            setMovies(formattedResults)
        }

        catch (error) {
            console.log("error searching for movies: ", error)
        }
    }

    return (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="title absolute top-10 text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white text-center py-6 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 rounded-lg shadow-lg">Countdown For Your Upcoming Movies</h1>

            <div className="absolute top-20 w-full h-[60vh]">
                <img
                    src={'/landing.jpg'}
                    alt="Background Image"
                    className="inset-0 w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="search-section">
                <div className="flex justify-center mt-20 mb-20">
                    <h1 className="text-5xl">Search For Upcoming Movies</h1>
                </div>

                <form onSubmit={handleSearch} className="flex gap-4 justify-center mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter movie name..."
                        className="flex-1 px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="movie-list flex flex-wrap justify-center gap-10 px-4 mt-72">
                {
                    !movies.length && searched ?

                        <div>No Movies Found</div>
                        :
                        movies.map((movie: Movie) => {
                            const { seconds, minutes, hours, days } = movie.remainingTime || calculateRemainingTime(movie.releaseDate);
                            return (
                                <div key={movie.id} className="movie max-w-72">
                                    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                                        <div className="poster">
                                            <Image src={movie.posterPath} alt={movie.title} width={200} height={300}></Image>
                                        </div>
                                    </a>
                                    <div className="details">
                                        <div className='min-h-20 text-wrap'>
                                            <span className='text-2xl font-extrabold text-wrap'>{movie.title}</span>
                                        </div>
                                        <p>Release Date: {movie.releaseDate}</p>
                                    </div>

                                    <div className="countdown">
                                        <div>
                                            <span className="days">{String(days).padStart(2, '0')}</span> <div>Days</div>
                                        </div>
                                        <div>
                                            <span className="hours">{String(hours).padStart(2, '0')}</span> <div>Hours</div>
                                        </div>
                                        <div>
                                            <span className="minutes">{String(minutes).padStart(2, '0')}</span> <div>Minutes</div>
                                        </div>
                                        <div>
                                            <span className="seconds">{String(seconds).padStart(2, '0')}</span> <div>Seconds</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
            </div>

        </div>
    )
}