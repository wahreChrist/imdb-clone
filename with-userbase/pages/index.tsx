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

interface LocalStorage {
    creationDate: string;
    expirationDate: string;
    sessionId: string;
    signedIn: boolean;
    username: string;
}

export default function Home(props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>();
    const [loginView, setLoginView] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [movies, setMovies] = useState<Movie[] | SearchMovie[]>();
    const [loading, setLoading] = useState<boolean>(false);

    const user = props.user;

    useEffect(() => {
        console.log("props:", props);

        //check for local storage for a login
        if (search.length == 0) {
            (async () => {
                try {
                    const res = await fetch(
                        "https://imdb-api.com/en/API/MostPopularMovies/k_dh913x3w"
                    );
                    const data = await res.json();
                    // console.log("popular movies data", data);
                    setMovies(data.items);
                } catch (err) {
                    console.log("error in gettin popular movies", err);
                }
            })();
        } else if (search.length > 0) {
            let timer;
            setLoading(true);

            const movieFetch = async (): Promise<void> => {
                try {
                    const res = await fetch(
                        `https://imdb-api.com/en/API/SearchMovie/k_dh913x3w/${search}`
                    );
                    const data = await res.json();
                    // console.log("data object from search query", data);
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
            // console.log("response from a logged user", userPull);
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
                rememberMe: "local",
            });
            props.setUser(userPull);
        } catch (err) {
            console.log("error in login in", err);
        }
    };

    const logOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
        try {
            await userbase.signOut();
            props.setUser(null);
            localStorage.removeItem("userbaseCurrentSession");
        } catch (e) {
            console.error(e.message);
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

    if (props.user?.userId) {
        return (
            <div className="bg-buff h-full">
                <main>
                    <header className="bg-black flex justify-between">
                        <img
                            src="/IMDB_svg.png"
                            alt="logo"
                            className="mx-4 w-[150px] self-center justify-self-start"
                        />

                        <input
                            className="rounded w-[600px] 2xl:w-[700px] my-8 p-1.5 self-center"
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                        ></input>
                        <button
                            className="font-bold p-1.5 text-black bg-white hover:bg-red-600 hover:text-white self-center rounded mr-4"
                            onClick={logOut}
                        >
                            Log out
                        </button>
                    </header>
                    <div className="w-[850px] mx-auto my-2 min-h-screen">
                        {resRenderer(movies, search)}
                    </div>
                </main>
            </div>
        );
    } else {
        return (
            <section className=" bg-black text-white min-h-screen flex items-center">
                <div className="w-[400px] mx-auto text-center ">
                    {loginView ? (
                        <form className="flex flex-col space-y-4">
                            <img
                                src="/imdb-icon-png-15.jpg"
                                alt="Login log"
                                className="w-full mx-auto pt-4"
                            />
                            <h2 className="text-xl font-semibold">Login</h2>
                            <input
                                className="p-1.5 rounded text-black"
                                type="text"
                                placeholder="username"
                                onChange={handleUsername}
                            ></input>
                            <input
                                className="p-1.5 rounded text-black"
                                type="password"
                                placeholder="password"
                                onChange={handlePass}
                            ></input>
                            <button
                                onClick={loginSubmit}
                                className="bg-galliano p-1.5 px-6 font-bold rounded-md text-black hover:text-white hover:shadow-lg hover:shadow-galliano/50 self-center"
                            >
                                Login
                            </button>
                            <p className="pb-4">
                                Register{" "}
                                <span
                                    className="text-buff hover:text-red-500 cursor-pointer"
                                    onClick={() =>
                                        setLoginView((prev) => !prev)
                                    }
                                >
                                    here{" "}
                                </span>
                                if you doesnt have an account
                            </p>
                        </form>
                    ) : (
                        <form className="flex flex-col space-y-4">
                            <img
                                src="/imdb-icon-png-15.jpg"
                                alt="Login log"
                                className="w-full mx-auto pt-4"
                            />
                            <h2 className="text-xl font-semibold">
                                Register a new user:
                            </h2>
                            <input
                                className="p-1.5 rounded text-black"
                                type="text"
                                placeholder="username"
                                onChange={handleUsername}
                            ></input>
                            <input
                                className="p-1.5 rounded text-black"
                                type="password"
                                placeholder="password"
                                onChange={handlePass}
                            ></input>
                            <button
                                onClick={loginRegister}
                                className="bg-galliano p-1.5 px-6 font-bold rounded-md text-black hover:text-white hover:shadow-lg hover:shadow-galliano/50 self-center"
                            >
                                Sign Up
                            </button>
                            <p>
                                Login{" "}
                                <span
                                    className="text-buff hover:text-red-500 cursor-pointer"
                                    onClick={() =>
                                        setLoginView((prev) => !prev)
                                    }
                                >
                                    here
                                </span>
                            </p>
                        </form>
                    )}
                </div>
            </section>
        );
    }
}
