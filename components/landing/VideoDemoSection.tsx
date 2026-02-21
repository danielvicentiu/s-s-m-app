'use client';

import { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  {
    src: '/screenshots/dashboard-overview.png',
    caption: 'Tablou de bord complet cu toate informațiile importante',
  },
  {
    src: '/screenshots/medical-records.png',
    caption: 'Gestionare simplă a examinărilor medicale',
  },
  {
    src: '/screenshots/trainings.png',
    caption: 'Programare și urmărire instruiri SSM/PSI',
  },
  {
    src: '/screenshots/equipment.png',
    caption: 'Inventar echipamente cu alerte expirare',
  },
  {
    src: '/screenshots/alerts.png',
    caption: 'Notificări automate pentru termene importante',
  },
];

export default function VideoDemoSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vezi platforma în acțiune
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descoperă cum s-s-m.ro simplifică gestionarea compliance-ului SSM/PSI
            și îți economisește timp prețios
          </p>
        </div>

        {/* Video/Carousel Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setShowCarousel(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !showCarousel
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Video Demo
            </button>
            <button
              onClick={() => setShowCarousel(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                showCarousel
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Screenshots
            </button>
          </div>
        </div>

        {/* Main Content */}
        {!showCarousel ? (
          /* Video Placeholder */
          <div className="relative max-w-5xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={openVideoModal}
            >
              {/* Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
                <img
                  src="/screenshots/dashboard-thumbnail.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-white rounded-full p-6 shadow-2xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-12 h-12 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-6 right-6 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                2:30
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Urmărește un tur complet al platformei în doar 2 minute
              </p>
            </div>
          </div>
        ) : (
          /* Screenshot Carousel */
          <div className="relative max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              {/* Screenshot Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={screenshots[currentSlide].src}
                  alt={screenshots[currentSlide].caption}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23f3f4f6" width="800" height="450"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EScreenshot %23' + (currentSlide + 1) + '%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              {/* Slide Counter */}
              <div className="absolute top-6 right-6 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                {currentSlide + 1} / {screenshots.length}
              </div>
            </div>

            {/* Caption */}
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-900 font-medium">
                {screenshots[currentSlide].caption}
              </p>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.src}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video Embed */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* Replace with actual video embed URL */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Video Demo"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
