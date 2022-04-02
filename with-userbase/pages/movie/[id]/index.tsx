/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import userbase from "userbase-js";

interface Similar {
    id: string;
    image: string;
    title: string;
}

interface MovieData {
    awards: string;
    boxOffice: {
        budget: string;
        grossUSA: string;
        cumulativeWorldwideGross: string;
    };
    countries: string;
    directors: string;
    fullTitle: string;
    id: string;
    imDbRating: string;
    image: string;
    originalTitle: string;
    plot: string;
    releaseDate: string;
    runtimeMins: string;
    runtimeStr: string;
    similars: Similar[];
    stars: string;
    title: string;
    year: string;
}

interface DBitem {
    name: string;
    timestamp: Date;
    text: string;
    movieId: string;
}

export default function MovieInfo(props) {
    const { query, push } = useRouter();
    const [movieData, setMovieData] = useState<MovieData[] | []>([]);
    const [reviewDisplay, setReviewDisplay] = useState<boolean>(false);
    const [reviews, setReviews] = useState<userbase.Item[] | DBitem[]>();
    const [reviewText, setReviewText] = useState<string>("");
    const [dbId, setDbId] = useState<string>("");

    useEffect(() => {
        if (!props.user) {
            push("/");
        } else if (props.user.username == "testuser1") {
            const openDatabase = async () => {
                try {
                    console.log("opening db...");
                    console.log(reviews);
                    // const dbRes = await userbase.getDatabases();
                    // console.log("response from getDb", dbRes);
                    await userbase.openDatabase({
                        databaseName: "imdb-clone",
                        changeHandler: function (items) {
                            console.log(items);
                            console.log(items[0].item.movieId);
                            items.map((mov) => {
                                if (mov.item.movieId === query.id) {
                                    setReviews(items);
                                }
                            });
                        },
                    });
                } catch (err) {
                    console.log(
                        "error in estaclishing connection to database",
                        err
                    );
                }
            };
            openDatabase();

            (async () => {
                try {
                    await userbase.shareDatabase({
                        databaseName: "imdb-clone",
                        username: "testuser3",
                        readOnly: false,
                        requireVerified: false,
                    });
                } catch (err) {
                    console.log("error in sharing dbs", err);
                }
            })();
        } else {
            const openDatabase = async () => {
                try {
                    console.log("opening db...");
                    const dbRes = await userbase.getDatabases();
                    console.log("response from getDb", dbRes);
                    setDbId(dbRes.databases[0].databaseId);
                    await userbase.openDatabase({
                        databaseId: dbRes.databases[0].databaseId,
                        changeHandler: function (items) {
                            setReviews(items);
                        },
                    });
                } catch (err) {
                    console.log(
                        "error in estaclishing connection to database",
                        err
                    );
                }
            };
            openDatabase();
        }

        (async () => {
            const res = await fetch(
                `https://imdb-api.com/en/API/Title/k_dh913x3w/${query.id}`
            );
            const data = await res.json();
            // console.log(data);
            setMovieData([data]);
        })();
    }, []);

    async function addReview(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> {
        e.preventDefault();
        try {
            await userbase.insertItem({
                databaseId: dbId,
                item: {
                    name: props.username,
                    timestamp: new Date().toLocaleDateString("en-UK", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    movieId: movieData[0].id,
                    text: reviewText,
                },
            });
            setReviewDisplay(false);
            setReviewText("");
            // setReviews(reviews => [...reviews, item])
        } catch (err) {
            console.log("error in adding review", err);
        }
    }

    async function deleteReview(itemId) {
        try {
            await userbase.deleteItem({
                databaseName: "imdb-clone",
                itemId,
            });
        } catch (err) {
            console.log("error in deleting item", err);
        }
    }

    const logOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
        try {
            await userbase.signOut();
            props.setUser(null);
            push("/");
        } catch (e) {
            console.error(e.message);
        }
    };

    return (
        <main className="bg-buff flex flex-col min-h-screen">
            <header className="bg-black flex justify-between">
                <Link href="/" passHref>
                    <img
                        src="/imdb-logo-3.png"
                        alt="logo"
                        className="py-4 w-[150px] self-center justify-self-start cursor-pointer ml-4"
                    />
                </Link>
                <button
                    className="font-bold p-1.5 text-black bg-white hover:bg-red-600 hover:text-white self-center rounded mr-4"
                    onClick={logOut}
                >
                    Log out
                </button>
            </header>
            <div className="w-[900px] bg-black/80 text-white rounded-md mx-auto my-8">
                {movieData[0] ? (
                    movieData.map((mov) => (
                        <div key="0" className="flex flex-col text-xs">
                            <div className="flex w-full">
                                <img
                                    src={mov.image}
                                    alt={mov.title}
                                    className="w-[250px] m-6 "
                                />
                                <div className="space-y-2 m-4">
                                    <h1 className="font-bold text-5xl">
                                        {mov.fullTitle}
                                    </h1>
                                    <h3 className="text-base italic">
                                        {mov.originalTitle} ({mov.year})
                                    </h3>
                                    <p>Director: {mov.directors}</p>
                                    <p>Cast: {mov.stars}</p>
                                    <div className="flex justify-between items-center w-11/12">
                                        <p>
                                            Runtime: {mov.runtimeMins} /{" "}
                                            {mov.runtimeStr}
                                        </p>
                                        <p> Country: {mov.countries}</p>
                                        <p className="rounded bg-black p-2 text-galliano font-bold">
                                            {mov.imDbRating || "--"}
                                        </p>
                                    </div>
                                    <p className="text-sm pr-6">{mov.plot}</p>
                                    <p className="italic">{mov.awards}</p>
                                    <p className="flex justify-between w-11/12 items-center">
                                        Budget:{" "}
                                        {mov.boxOffice?.budget || "unknown"} /
                                        USA: {mov.boxOffice?.grossUSA} / World:{" "}
                                        {
                                            mov.boxOffice
                                                ?.cumulativeWorldwideGross
                                        }
                                    </p>
                                    <button
                                        className="bg-galliano mt-12 text-base py-1 px-2 text-black hover:text-white hover:shadow-lg hover:shadow-galliano/50 font-bold rounded"
                                        onClick={() =>
                                            setReviewDisplay((prev) => !prev)
                                        }
                                    >
                                        Review
                                    </button>
                                </div>
                            </div>
                            {reviewDisplay && (
                                <>
                                    <textarea
                                        onChange={(e) =>
                                            setReviewText(e.target.value)
                                        }
                                        className="rounded-md bg-stone-200 shadow-stone-800 text-black text-base p-2 shadow-inner min-h-[120px] w-10/12 mx-auto mt-4"
                                    ></textarea>
                                    <button
                                        className="bg-stone-200 my-4 text-sm py-1 px-2 text-galliano hover:text-white hover:bg-galliano font-bold self-end mr-20 rounded"
                                        onClick={addReview}
                                    >
                                        Post
                                    </button>
                                </>
                            )}
                            {reviews &&
                                reviews.map((rev, index) => (
                                    <div
                                        key={index}
                                        className="rounded-md bg-stone-200/90 shadow-stone-800 text-black shadow-inner min-h-[200px] w-10/12 mx-auto my-4"
                                    >
                                        <div>
                                            <h3 className="border-b-4 border-galliano flex font-semibold py-4 w-11/12 mx-auto text-base">
                                                {rev.createdBy.username}{" "}
                                                {rev.item.timestamp}
                                            </h3>
                                            <p className="w-11/12 my-4 mx-auto text-base">
                                                {rev.item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            <section className="flex overflow-x-auto mx-auto flex-col">
                                <h3 className="border-l-4 border-galliano p-2 text-lg">
                                    Similar movies:
                                </h3>
                                <div className="flex space-x-8 max-w-[800px]">
                                    {mov.similars?.length &&
                                        mov.similars
                                            .slice(0, 4)
                                            .map((suggestion) => (
                                                <div
                                                    key={suggestion.id}
                                                    className="bg-stone-200 rounded-b-md drop-shadow-xl shadow-inner shadow-stone-800 w-[175px] mt-4 mb-6"
                                                >
                                                    <img
                                                        src={suggestion.image}
                                                        alt={suggestion.title}
                                                        className="w-full object-cover h-[245px]"
                                                    />
                                                    <Link
                                                        passHref
                                                        href={`/movie/${suggestion.id}`}
                                                    >
                                                        <p className="text-center font-medium justify-self-center p-2 text-[#063BDB] cursor-pointer hover:text-galliano">
                                                            {suggestion.title}
                                                        </p>
                                                    </Link>
                                                </div>
                                            ))}
                                </div>
                            </section>
                        </div>
                    ))
                ) : (
                    <div key="0" className="h-screen text-center">
                        <div className="spin"></div>
                        <p className="text-4xl font-semibold">Loading...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
