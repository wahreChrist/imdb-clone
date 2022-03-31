/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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

export default function MovieInfo() {
    const { query } = useRouter();
    const [movieData, setMovieData] = useState<MovieData[] | []>([]);

    useEffect(() => {
        (async () => {
            const res = await fetch(
                `https://imdb-api.com/en/API/Title/k_dh913x3w/${query.id}`
            );
            const data = await res.json();
            console.log(data);
            setMovieData([data]);
        })();
    }, []);

    return (
        <main className="bg-buff flex flex-col">
            <header className="bg-black flex justify-center">
                <Link href="/" passHref>
                    <img
                        src="/IMDB_svg.png"
                        alt="logo"
                        className="py-4 w-[150px] self-center justify-self-start cursor-pointer"
                    />
                </Link>
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
                                    <button className="bg-galliano mt-12 text-base py-1 px-2 text-black hover:text-white font-bold rounded ">
                                        Review
                                    </button>
                                </div>
                            </div>
                            <section className="flex overflow-x-auto mx-auto flex-col">
                                <h3 className="border-l-4 border-galliano p-2 text-lg">
                                    Similar movies:
                                </h3>
                                <div className="flex space-x-8 max-w-[800px]">
                                    {mov.similars.length &&
                                        mov.similars
                                            .slice(0, 4)
                                            .map((suggestion) => (
                                                <div
                                                    key={suggestion.id}
                                                    className="bg-stone-200 rounded-b-md drop-shadow-xl shadow-inner shadow-stone-800 w-[175px] my-4"
                                                >
                                                    <img
                                                        src={suggestion.image}
                                                        alt={suggestion.title}
                                                        className="w-full object-cover h-[245px]"
                                                    />
                                                    <Link
                                                        passHref
                                                        href={`../movie/${suggestion.id}`}
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

// const movieObject = {
//     actorList: [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}],
//     awards: "Awards, 43 wins & 71 nominations",
//     boxOffice: {budget: '$4,000,000 (estimated)', openingWeekendUSA: '$8,800,230', grossUSA: '$25,138,705', cumulativeWorldwideGross: '$40,423,945'},
//     companies: "Parts and Labor, RT Features, Rooks Nest Entertainment",
//     companyList: [{…}, {…}, {…}],
//     contentRating: "R",
//     countries: "USA, Canada, UK",
//     countryList: [{…}, {…}, {…}],
//     directorList: [{…}],
//     directors: "Robert Eggers",
//     errorMessage: null,
//     fullCast: null,
//     fullTitle: "The Witch (2015)",
//     genreList: [{…}, {…}, {…}],
//     genres: "Drama, Horror, Mystery",
//     id: "tt4263482",
//     imDbRating: "6.9",
//     imDbRatingVotes: "236008",
//     image: "https://imdb-api.com/images/original/MV5BMTUyNzkwMzAxOF5BMl5BanBnXkFtZTgwMzc1OTk1NjE@._V1_Ratio0.6751_AL_.jpg",
//     images: null,
//     keywordList: (5) ['witch', 'goat', 'black magic', 'isolation', 'new england'],
//     keywords: "witch,goat,black magic,isolation,new england",
//     languageList: [{…}],
//     languages: "English",
//     metacriticRating: "83",
//     originalTitle: "The VVitch: A New-England Folktale",
//     plot: "New England, 1630: William and Katherine try to lead a devout Christian life, homesteading on the edge of an impassible wilderness, with five children. When their newborn son mysteriously vanishes and their crops fail, the family begins to turn on one another. 'The Witch' is a chilling portrait of a family unraveling within their own sins, leaving them prey for an inconceivable evil.",
//     plotLocal: "",
//     plotLocalIsRtl: false,
//     posters: null,
//     ratings: null,
//     releaseDate: "2016-02-19",
//     runtimeMins: "92",
//     runtimeStr: "1h 32min",
//     similars: [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}],
//     starList: [{…}, {…}, {…}],
//     stars: "Anya Taylor-Joy, Ralph Ineson, Kate Dickie",
//     tagline: "A New-England Folktale.",
//     title: "The Witch",
//     trailer: null,
//     tvEpisodeInfo: null,
//     tvSeriesInfo: null,
//     type: "Movie",
//     wikipedia: null,
//     writerList: [{…}],
//     writers: "Robert Eggers",
//     year: "2015"
// }
