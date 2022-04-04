import { useState, useEffect } from "react";
import userbase from "userbase-js";
import Layout from "../components/Layout";

import "../styles/globals.css";

interface UserData {
    authToken: string;
    creationDate: string;
    paymentsMode?: string;
    userId: string;
    username: string;
    sessionId?: string;
}

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState<UserData | undefined>();

    useEffect(() => {
        userbase.init({ appId: process.env.NEXT_PUBLIC_USERBASE_APP_ID });
    }, []);

    let locStore: UserData;
    if (typeof window !== "undefined") {
        locStore = JSON.parse(localStorage.getItem("userbaseCurrentSession"));
        if (!user && locStore) {
            setUser(locStore);
            console.log("props.user after localstorage", user);
        }
    }

    return (
        <Layout user={user} setUser={setUser}>
            <Component user={user} setUser={setUser} {...pageProps} />
        </Layout>
    );
}

export default MyApp;
