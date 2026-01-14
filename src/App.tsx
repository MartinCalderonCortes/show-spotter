import { useEffect, useState } from 'react';

import noShowLogo from './assets/images/no-img-portrait-text.webp';
import ErrorMessage from './componets/ErrorMessage';
import SearchBar from './componets/SearchBar';
import ShowCard from './componets/ShowCard';
import ShowDetailModal from './componets/ShowDetailModal';
import Spinner from './componets/Spinner';
import type { Show, ShowDetail, View } from './types';

function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [favorites, setFavorites] = useState<Show[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [view, setView] = useState<View>('search');
  const [showDetail, setShowDetail] = useState<ShowDetail | null>(null);
  const [page, setPage] = useState(0);

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const toggleFavorite = (show: Show) => {
    const exists = favorites.some((f) => f.id === show.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== show.id));
    } else {
      setFavorites([...favorites, show]);
    }
  }

  const isFavorite = (showId: number) => favorites.some((favorite) => favorite.id === showId);

  const openModal = async (showId: number) => {
    setError(null)
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
      setShowDetail(showDetail);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
    }
  }

  const closeModal = () => setShowDetail(null);

  const handleNextShows = () => {
    setPage((currentPage) => currentPage + 1)
  }

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    setInitialized(true);
  }, [])

  useEffect(() => {
    if (initialized) {  
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [favorites, initialized])

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        if (search) {
          const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed fetching show related with '${search}' search. Please try again`);
          const json = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const showsMapped = json.map(({ show }: { show: any }) => ({
            id: show.id,
            title: show.name,
            image: show.image !== null ? show.image.medium : noShowLogo,
            rating: show.rating.average ?? 'N/A',
            genres: show.genres.length > 0 ? show.genres.join(', ') : 'N/A',
            summary: show.summary
          }));
          setShows(showsMapped);
        } else {
          const url = `https://api.tvmaze.com/shows?page=${page}`;
          const response = await fetch(url);
          if (response.ok) throw new Error("Failed fetching shows. Please try again");
          const shows = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const showsMapped = shows.map((show: any) => ({
            id: show.id,
            title: show.name,
            image: show.image !== null ? show.image.medium : noShowLogo,
            rating: show.rating.average ?? 'N/A',
            genres: show.genres.length > 0 ? show.genres.join(', ') : 'N/A',
            summary: show.summary
          }));
          setShows((prevShows) => page === 0 ? showsMapped : prevShows.concat(showsMapped));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [search, page]);

  const displayedShows = view === 'search' ? shows : favorites;

  return (
    <div className='container mx-auto p-4 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-6 drop-shadow-2xl'>Show Spotter: TV Show Search & Favorites App</h1>
      <div className='tabs tabs-border mb-6'>
        <button
          className={`tab text-lg ${view === 'search' ? 'tab-active' : ''}`}
          onClick={() => {
            setView('search')
          }}
        >
          Search
        </button>
        <button className={`tab text-lg ${view === 'favorites' ? 'tab-active' : ''}`} onClick={() => setView('favorites')}>Favorites ({favorites.length})</button>
      </div>
      {view === 'search' && <SearchBar onSearch={handleSearch} />}

      {loading && <Spinner />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && displayedShows.length === 0 &&
        <p>No shows found. {view === 'search' ? 'Try a different search' : 'Add some to your favorites'}</p>
      }

      {!loading && !error && displayedShows.length > 0 &&
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
          {displayedShows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(show.id)}
              openModal={() => openModal(show.id)} />
          ))}
        </div>}

      {!loading && !error && view === 'search' && search === '' && <button className='btn btn-success m-4' type="button" onClick={handleNextShows}>More shows</button>}

      {showDetail && (
        <ShowDetailModal
          show={showDetail}
          onClose={closeModal}
          isFavorite={isFavorite(showDetail.id)}
          onToggleFavorite={() => toggleFavorite(showDetail)} />
      )}

    </div>
  )
}

export default App
