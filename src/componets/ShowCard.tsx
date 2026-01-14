import type { Show } from "../types";

type ShowCardProps = {
    show: Show, 
    onToggleFavorite: (show: Show) => void, 
    isFavorite: boolean,
    openModal: () => void
}

const ShowCard = ({ show, onToggleFavorite, isFavorite, openModal }: ShowCardProps) => {
    const { title, image, rating, genres, summary } = show;

    return (
        <div className="relative group rounded-2xl overflow-hidden shadow-lg">
            {/* Poster */}
            <figure>
                <img
                    className="w-full h-96 object-cover group-hover:scale-110 duration-300"
                    src={image}
                    alt={title}
                    loading='lazy'
                />
            </figure>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 duration-300 flex flex-col justify-end items-center p-4">
                <h2 className="text-xl font-bold text-amber-50">{title}</h2>
                <p className="text-amber-50">{rating}</p>
                <p className="text-amber-50">{genres}</p>
                <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: summary}}></p>
                <div className="flex gap-2 m-2">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={openModal}
                    >
                        Details
                    </button>
                    <button
                    className={`btn btn-sm ${isFavorite ? "btn-error" : "btn-secondary"
                      }`}
                      onClick={() => onToggleFavorite(show)}
                  >
                    {isFavorite ? "Remove" : "Favorite"}
                  </button>
                </div>
            </div>
        </div>
    );
};

export default ShowCard;