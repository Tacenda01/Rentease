import { useState } from "react";
import {
  FaTimes, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

export default function PropertyModal({ property, onClose }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const imagesForScroll = [...property.images, ...property.images];

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        aria-modal="true"
        role="dialog"
      >
        <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <p className="text-gray-600 mb-4">{property.city}</p>

          <div
            className="relative overflow-hidden mb-4"
            style={{ height: "6rem" }}
          >
            <div
              className="flex space-x-2 absolute top-0 left-0 animate-scroll-left hover:animation-play-state-paused"
              style={{ width: `${imagesForScroll.length * 8}rem` }}
            >
              {imagesForScroll.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Slide ${idx}`}
                  className="h-24 w-32 object-cover rounded flex-shrink-0 cursor-pointer"
                  onClick={() => openGallery(idx % property.images.length)}
                  draggable={false}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-line">{property.description}</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
              Contact Owner
            </button>
            <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
              Book this Property
            </button>
          </div>
        </div>
      </div>

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeGallery}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute top-5 right-5 text-white text-3xl z-110"
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
            aria-label="Close gallery"
          >
            <FaTimes />
          </button>

          <button
            className="absolute left-5 text-white text-4xl p-2 hover:text-gray-300 z-110"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <img
            src={property.images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-5 text-white text-4xl p-2 hover:text-gray-300 z-110"
            onClick={nextImage}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
        .hover\\:animation-play-state-paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
