import { useState, useEffect } from "react";
import userbase from "userbase-js";
import Layout from "../components/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState();

    useEffect(() => {
        userbase.init({ appId: process.env.NEXT_PUBLIC_USERBASE_APP_ID });
    }, []);

    return (
        <Layout user={user} setUser={setUser}>
            <Component user={user} setUser={setUser} {...pageProps} />
        </Layout>
    );
}

export default MyApp;
