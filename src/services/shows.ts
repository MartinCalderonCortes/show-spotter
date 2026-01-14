import noShowLogo from '../assets/images/no-img-portrait-text.webp';
import type { Show, ShowDetail } from '../types';

export const searchShowsBySearch = async (search: string) => {
    try {
        const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed fetching show related with '${search}' search. Please try again`);
        const json = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const showsMapped: Show[] = json.map(({ show }: { show: any }) => ({
            id: show.id,
            title: show.name,
            image: show.image !== null ? show.image.medium : noShowLogo,
            rating: show.rating.average ?? 'N/A',
            genres: show.genres.length > 0 ? show.genres.join(', ') : 'N/A',
            summary: show.summary
        }));

        return showsMapped

    } catch (error) {
        console.log(error);
        throw new Error('Error searching shows by search');
    }
}

export const searchShowsByPage = async (page: number) => {
    try {
        const url = `https://api.tvmaze.com/shows?page=${page}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed fetching shows. Please try again");
        const shows = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const showsMapped: Show[] = shows.map((show: any) => ({
            id: show.id,
            title: show.name,
            image: show.image !== null ? show.image.medium : noShowLogo,
            rating: show.rating.average ?? 'N/A',
            genres: show.genres.length > 0 ? show.genres.join(', ') : 'N/A',
            summary: show.summary
        }));

        return showsMapped;

    } catch (error) {
        console.log(error);
        throw new Error('Error searching shows by page');
    }
}

export const searchShowByDetail = async (showId: number) => {
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
        if (!response.ok) throw new Error('Failed fetching shows details. Please try again.')
        const json = await response.json();
        const { name, image, rating, genres, summary, schedule, network, id } = json;

        const showDetail: ShowDetail = {
            id,
            title: name,
            image: image !== null ? image.original : noShowLogo,
            rating: rating.average ?? 'N/A',
            genres: genres.length > 0 ? genres.join(' | ') : 'N/A',
            summary,
            schedule: schedule !== null ? `${schedule.days.join(' ')} at ${schedule.time}` : 'N/A',
            networkInfo: network !== null ? network.name : 'N/A'
        }

        return showDetail;
    } catch (error) {
        console.log(error);
        throw new Error('Error searching show detail');
    }
}