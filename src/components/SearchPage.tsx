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
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen flex flex-col items-center justify-start">

            <div className="w-full h-[60vh] relative top-0 flex flex-col">
                <h1 className="pt-8 z-40 opacity-85 title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white text-center py-6 px-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg">Countdown For Your Upcoming Movies</h1>

                <div className="absolute inset-0 top-0 w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>
                <img
                    src={'/landing.jpg'}
                    alt="Background Image"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                <div className="mt-96 search-section z-20 flex flex-col items-center justify-center mb-6">
                    <form
                        onSubmit={handleSearch}
                        className="relative flex items-center w-full max-w-lg gap-4"
                    >
                        <div className=''>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for a movie..."
                                className="px-6 pr-10 py-3 text-2xl font-bold bg-black rounded-[6px] relative group transition duration-200 text-white"
                            />
                        </div>

                        <button className="p-[3px] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-gray-500 rounded-lg" />
                            <div className="px-6 py-2 text-2xl font-bold bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                Search
                            </div>
                        </button>

                        {/* <style jsx>{`
                            @keyframes shimmer {
                                0% {
                                    background-position: -200% 0;
                                }
                                100% {
                                    background-position: 200% 0;
                                }
                            }

                            .animate-shimmer {
                                animation: shimmer 2.0s infinite linear;
                            }
                        `}</style> */}

                        {/* <button
                            type="submit"
                            className="px-8 py-4 text-lg rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Search
                        </button> */}
                    </form>
                </div>
            </div>

            {movies.length > 0 && (
                <h2 className="mt-12 mb-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-500">
                    Upcoming Movies:
                </h2>
            )}

            <div className="movie-list flex flex-wrap justify-center gap-10 px-4">
                {
                    !movies.length && searched ?

                        <div>
                            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold text-white text-center py-6 px-4 from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg">No Movies Found...</h1>
                        </div>
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
