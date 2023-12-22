import MovieCard from "@/components/UI/card/MovieCard";
import ScrollInfinity from "@/components/search/ScrollInfinity";
import NavSearch from "@/components/search/NavSearch";
import { fetchSearch } from "@/lib/api";
import { Media, OrganizadoPorMovie, OrganizadoPorTv } from "@/types/types";
import Link from "next/link";
import FormSearch from "@/components/shared/header/FormSearch";

export async function generateStaticParams() {
    return [{searchType: 'movie'}, {searchType: 'tv'}]
}


export default async function SearchPage({
    params,
    searchParams,
}: {
    params: { searchType: string };
    searchParams: { q: string; filter: OrganizadoPorMovie | OrganizadoPorTv, genre: string };
}) {
    // esta buscando una pelicula o una serie
    const type = params.searchType;
    const nameType = type === 'movie' ? 'Peliculas' : 'Series'

    // lo que busca el usuario se vera reflejado en la query = q
    const moviesOrSeries = await fetchSearch(type, searchParams);

    const resultadoDeBusqueda = moviesOrSeries.results;
    const totalPages = moviesOrSeries.total_pages;

    return (
        <div>
            <NavSearch type={type}>
                <FormSearch 
                    defaultValue={searchParams.q || ""}
                    type={type} 
                />
            </NavSearch>
            <header className='px-5 md:px-8 lg:px-12 2xl:px-16 text-center mb-10 mt-[60px] pt-8'>
                <h1 className='uppercase text-3xl font-semibold text-[#EEE]'>
                    Explorar
                </h1>
                <p className='text-sm text-[#999]'>
                    Explora genéros. O directores. O títulos multipremiados.
                    Encuentra películas que no sabías que estabas buscando.
                </p>
            </header>
            <main className='px-5 md:px-8 lg:px-12 2xl:px-16 min-h-screen bg-[#0a0a0a] pb-20'>
                <header className='text-center py-10 text-[#cbcbcb]'>
                    <h3 className='uppercase text-lg'>
                        Todas las {nameType} disponibles actualmente en aluraflix
                    </h3>
                </header>
                <section className='flex flex-col gap-10 md:grid md:gap-x-2 md:gap-y-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-9 lg:gap-x-4 xl:grid-cols-4 text-[#e0e0e0]'>
                    {resultadoDeBusqueda.map((result: Media) => (
                        <Link
                            href={`/media/${result.id}-${type}`}
                            key={result.id}
                        >
                            <MovieCard animate={true} result={result} />
                        </Link>
                    ))}
                    {totalPages >= 2 && (
                        <ScrollInfinity totalPages={totalPages} />
                    )}
                </section>
            </main>
        </div>
    );
}
