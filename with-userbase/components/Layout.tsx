import React from "react";
import Head from "next/head";

interface UserData {
    authToken: string;
    creationDate: string;
    paymentsMode?: string;
    userId: string;
    username: string;
    sessionId?: string;
}

export default function Layout({
    user,
    setUser,
    children,
}: {
    user: UserData;
    setUser: React.Dispatch<React.SetStateAction<UserData>>;
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
