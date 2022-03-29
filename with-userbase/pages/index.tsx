import React, { useState, useEffect } from "react";
import userbase from "userbase-js";

import styles from "../styles/Home.module.css";

export default function Home(props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>();
    const [loginView, setLoginView] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    // useEffect(() => {
    //     (async () => {
    //         //database initialization/pull
    //     })();
    // }, []);

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const startUpPage = async () => {
        const res = await fetch(
            "https://imdb-api.com/en/API/MostPopularMovies/k_dh913x3w"
        );
        const data = res.json();
        console.log(data);
    };

    const loginSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
        e.preventDefault();

        try {
            const userPull = await userbase.signIn({
                username,
                password,
                rememberMe: "session",
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

    if (props.user) {
        return (
            <div className="bg-buff h-screen">
                <main>
                    <header className="bg-black flex">
                        <img
                            src="/IMDB_svg.png"
                            alt="logo"
                            className="w-[150px] p-4"
                        />
                        <input
                            className="rounded w-[500px] my-8 mx-48 p-1.5"
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                        ></input>
                    </header>
                    <h1>hello world</h1>
                    {/* {search.length === 0 ? (
                        startUpPage()
                    ) : (
                        <div>/search render/</div>
                    )} breaks render*/}
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
