'use client'

import React, { useState, useEffect } from 'react';
import { SearchMovies } from '@/utils/searchMovie';
import { ExpandableCardDemo } from './ExpandableCard';

interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    posterPath: string;
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
        if (!query.trim()) return

        try {
            const results = await SearchMovies(query)
            console.log(results)

            const formattedResults: Movie[] = results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
                releaseDate: movie.release_date || 'unknown for now',
                description: movie.overview || "ne description found",
            }));

            setMovies(formattedResults)
        }

        catch (error) {
            console.log("error searching for movies: ", error)
        }
    }


    return (
        <>
            <h1 className="title">Upcoming Movies Countdown</h1>
            <div className="movie-list">
                {movies.map((movie: any) => {
                    const { seconds, minutes, hours, days } = movie.remainingTime || calculateRemainingTime(movie.releaseDate);
                    return (
                        <div key={movie.id} className="movie">
                            <div className="poster">
                                <img src={movie.posterPath} alt={movie.title} />
                            </div>
                            <div className="details">
                                <h2>{movie.title}</h2>
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
        </>
    )
}