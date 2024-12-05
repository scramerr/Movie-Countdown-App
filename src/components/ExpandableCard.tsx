"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface MovieData {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    posterPath: string;
}

export function ExpandableCardDemo({ movies }: { movies: MovieData[] }) {
    const [active, setActive] = useState<MovieData | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.div
                            layoutId={`card-${active.id}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.id}-${id}`}>
                                <Image
                                    priority
                                    width={200}
                                    height={300}
                                    src={active.posterPath}
                                    alt={active.title}
                                    className="w-full h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-fill object-top"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.id}-${id}`}
                                            className="font-bold text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.id}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-center">
                                        <span className="days">
                                            90
                                        </span>

                                        <span>
                                            :
                                        </span>

                                        <span className="hours">
                                            24
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="max-w-2xl mx-auto w-full gap-4">
                {movies.map((movie) => (
                    <motion.div
                        layoutId={`card-${movie.id}-${id}`}
                        key={movie.id}
                        onClick={() => setActive(movie)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col md:flex-row">
                            <motion.div layoutId={`image-${movie.id}-${id}`}>
                                <Image
                                    width={100}
                                    height={150}
                                    src={movie.posterPath}
                                    alt={movie.title}
                                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-fill object-top"
                                />
                            </motion.div>
                            <div className="flex flex-col justify-center">
                                <motion.h3
                                    layoutId={`title-${movie.id}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                >
                                    {movie.title}
                                </motion.h3>
                                <div className=" desc-container overflow-hidden">
                                    <motion.p
                                        layoutId={`description-${movie.id}-${id}`}
                                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                                    >
                                        {movie.description}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}
