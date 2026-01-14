import type { ShowDetail } from "../types";

type ShowDetailsModalProps = {
  show: ShowDetail,
  onClose: () => void,
  isFavorite: boolean,
  onToggleFavorite: () => void
}

const ShowDetailModal = ({ show, onClose, isFavorite, onToggleFavorite }: ShowDetailsModalProps) => {

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-full max-w-2xl sm:max-w-3xl bg-base-100 shadow-xl">
        <h3 className="font-bold text-xl sm:text-2xl mb-4 text-center">{show.title}</h3>
        {/* Poster */}
        <img
          src={show.image}
          alt={show.title}
          className="rounded-lg mb-4 w-full object-contain max-h-96"
          loading="eager"
        />
        {/* Description */}
        <div className="text-left space-y-2">
          <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: show.summary}}></p>
          <p className="font-semibold">
            <span>Rating</span> {show.rating}
          </p>
          <p>
            <span>Genres:</span>{" "}
            {show.genres}
          </p>
        </div>
        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-end mt-6">
          <button
            onClick={onToggleFavorite}
            className={`btn ${isFavorite ? "btn-error" : "btn-secondary"}`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      {/* Modal Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default ShowDetailModal;
