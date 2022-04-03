import React from "react";
import Head from "next/head";

interface User {
    authToken: string;
    creationDate: string;
    paymentsMode: string;
    userId: string;
    username: string;
}

export default function Layout({
    user,
    setUser,
    children,
}: {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    children: JSX.Element;
}) {
    return (
        <div>
            <Head>
                <title>IMDB clone</title>
                <meta name="peronal IMDB clone" content="movie api" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {children}
        </div>
    );
}
