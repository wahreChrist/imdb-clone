import { Dispatch, SetStateAction } from "react";
import Head from "next/head";

export default function Layout({
    user,
    setUser,
    children,
}: {
    user: string;
    setUser: Dispatch<SetStateAction<string>>;
    children: JSX.Element;
}) {
    return (
        <div>
            <Head>
                <title>IMDB clone</title>
                <meta name="peronal IMDB clone" content="movie api" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* navbar? */}
            {children}
        </div>
    );
}
