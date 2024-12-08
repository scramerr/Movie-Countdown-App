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
        <div>
            <h1>
                MURTAZA PAGAL AHHAHAHAHAHAHAHHAAHHAHAAHHAHAHAHAHAHAHAHAHAH OYE CHAAL CHAL JA FURTHER MATHS KERRRRRRRRRRRR
            </h1>
        </div>
    )
}
