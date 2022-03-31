/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import userbase from "userbase-js";
import Link from "next/link";
// import styles from "../styles/Home.module.css";

interface Movie {
    crew: string;
    fullTitle: string;
    id: string;
    imDbRating: string;
    imDbRatingCount: string;
    image: string;
    rank: string;
    rankUpDown: string;
    title: string;
    year: string;
}

interface SearchMovie {
    description: string;
    id: string;
    image: string;
    resultType: string;
    title: string;
}

let user = {
    authToken: "be91cadeaa466ba1bd30961f85b8d4a3",
    creationDate: "2022-03-29T15:44:34.245Z",
    paymentsMode: "disabled",
    userId: "f658e507-bef5-47a1-8435-1a5d6117cf61",
    username: "testuser1",
};

export default function Home(props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>();
    const [loginView, setLoginView] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [movies, setMovies] = useState<Movie[] | SearchMovie[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        //change user to props.user after
        if (user && search.length == 0) {
            (async () => {
                try {
                    const res = await fetch(
                        "https://imdb-api.com/en/API/MostPopularMovies/k_dh913x3w"
                    );
                    const data = await res.json();
                    console.log("popular movies data", data);
                    setMovies(data.items);
                } catch (err) {
                    console.log("error in gettin popular movies", err);
                }
            })();
        } else if (user && search.length > 0) {
            let timer;
            setLoading(true);

            const movieFetch = async (): Promise<void> => {
                try {
                    const res = await fetch(
                        `https://imdb-api.com/en/API/SearchMovie/k_dh913x3w/${search}`
                    );
                    const data = await res.json();
                    console.log("data object from search query", data);
                    setMovies(data.results);
                    if (data) {
                        setLoading(false);
                    }
                } catch (err) {
                    console.log("error in gettin popular movies", err);
                }
            };
            timer = setTimeout(movieFetch, 500);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [search, user]);

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const loginSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
        e.preventDefault();
        try {
            const userPull = await userbase.signIn({
                username,
                password,
                rememberMe: "local",
            });
            console.log("response from a logged user", userPull);
            props.setUser(userPull);
        } catch (err) {
            console.log("error in login", err);
        }
    };

    const loginRegister = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
        e.preventDefault();
        try {
            const userPull = await userbase.signUp({
                username,
                password,
                rememberMe: "none",
            });
            props.setUser(userPull);
        } catch (err) {
            console.log("error in login in", err);
        }
    };

    const resRenderer = (
        movies: Movie[] | SearchMovie[],
        search: string
    ): JSX.Element[] => {
        let render: JSX.Element[];
        if (movies && search.length == 0) {
            render = movies.slice(0, 20).map((movie) => (
                <Link key={movie.id} passHref href={`/movie/${movie.id}`}>
                    <div className="flex justify-between p-2 items-start hover:bg-galliano/30 cursor-pointer">
                        <div className="flex">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-[125px] mr-4"
                            />
                            <div className="justify-self-start">
                                <h3 className="font-semibold">
                                    {movie.title} ({movie.year})
                                </h3>
                                <p>Cast: {movie.crew}</p>
                            </div>
                        </div>
                        <p className="rounded bg-stone-900/50 p-2 text-galliano font-bold">
                            {movie.imDbRating || "--"}
                        </p>
                    </div>
                </Link>
            ));
        } else if (movies && search.length > 0 && loading === false) {
            render = movies.map((movie) => (
                <Link key={movie.id} passHref href={`/movie/${movie.id}`}>
                    <div className="flex justify-between p-2 items-start hover:bg-galliano/30 cursor-pointer">
                        <div className="flex">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-[125px] mr-4"
                            />
                            <div className="self-center">
                                <h3 className="font-semibold">
                                    {movie.title} {movie.description}
                                </h3>
                            </div>
                        </div>
                    </div>
                </Link>
            ));
        } else {
            render = [
                <div key="0" className="h-screen text-center">
                    <div className="spin"></div>
                    <p className="text-4xl font-semibold">Loading...</p>
                </div>,
            ];
        }
        return render;
    };

    if (user) {
        //change to user.props after
        return (
            <div className="bg-buff h-full">
                <main>
                    <header className="bg-black flex">
                        <img
                            src="/IMDB_svg.png"
                            alt="logo"
                            className="mx-4 w-[150px] self-center justify-self-start"
                        />
                        <div className="flex justify-center w-full">
                            <input
                                className="rounded w-[600px] 2xl:w-[700px] my-8 p-1.5 self-center"
                                type="text"
                                placeholder="Search..."
                                onChange={handleSearch}
                            ></input>
                        </div>
                    </header>
                    <div className="w-[850px] mx-auto my-2">
                        {resRenderer(movies, search)}
                    </div>
                </main>

                <footer className="text-red-700"></footer>
            </div>
        );
    } else {
        return (
            <section className="w-[800px] mx-auto">
                {loginView ? (
                    <form className="flex flex-col space-y-4">
                        <h2>Login</h2>
                        <input
                            className="p-1.5 border"
                            type="text"
                            placeholder="username"
                            onChange={handleUsername}
                        ></input>
                        <input
                            className="p-1.5 border"
                            type="password"
                            placeholder="password"
                            onChange={handlePass}
                        ></input>
                        <button onClick={loginSubmit}>Login</button>
                        <p>
                            Register{" "}
                            <span
                                className="text-blue-500 hover:text-red-500 cursor-pointer"
                                onClick={() => setLoginView((prev) => !prev)}
                            >
                                here{" "}
                            </span>
                            if you doesnt have an account
                        </p>
                    </form>
                ) : (
                    <form className="flex flex-col space-y-4">
                        <h2>Register</h2>
                        <input
                            className="p-1.5 border"
                            type="text"
                            placeholder="username"
                            onChange={handleUsername}
                        ></input>
                        <input
                            className="p-1.5 border"
                            type="password"
                            placeholder="password"
                            onChange={handlePass}
                        ></input>
                        <button onClick={loginRegister}>Register</button>
                        <p>
                            Login{" "}
                            <span
                                className="text-blue-500 hover:text-red-500 cursor-pointer"
                                onClick={() => setLoginView((prev) => !prev)}
                            >
                                here
                            </span>
                        </p>
                    </form>
                )}
            </section>
        );
    }
}
