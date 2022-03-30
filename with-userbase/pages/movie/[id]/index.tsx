import { useRouter } from "next/router";

export default function MovieInfo() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <h1>Movie Info</h1>
        </div>
    );
}
