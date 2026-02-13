'use client'

import { useState } from 'react'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Închide video"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <iframe
            src={videoUrl}
            title="Video demonstrație platformă SSM/PSI"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}

interface ScreenshotCarouselProps {
  screenshots: Array<{ src: string; caption: string }>
}

function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <div className="relative">
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden">
        {/* Screenshot Image */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">{screenshots[currentSlide].src}</div>
            <p className="text-gray-600">{screenshots[currentSlide].caption}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Screenshot anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Screenshot următor"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Mergi la screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface VideoDemoSectionProps {
  videoUrl?: string
  thumbnailUrl?: string
  showCarousel?: boolean
}

export default function VideoDemoSection({
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  thumbnailUrl,
  showCarousel = false,
}: VideoDemoSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Screenshot data for carousel fallback
  const screenshots = [
    {
      src: '📊',
      caption: 'Dashboard central cu metrici în timp real',
    },
    {
      src: '👥',
      caption: 'Gestiune angajați și dosare medicale',
    },
    {
      src: '📋',
      caption: 'Planificare instruiri și cursuri SSM',
    },
    {
      src: '⚠️',
      caption: 'Sistem de alerte și notificări automate',
    },
    {
      src: '📄',
      caption: 'Generare rapoarte și documente conforme',
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Vezi platforma în acțiune
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descoperă cum platforma SSM/PSI simplifică gestionarea conformității
            și te ajută să economisești timp prețios
          </p>
        </div>

        {/* Video Player or Carousel */}
        {!showCarousel ? (
          <div className="relative max-w-5xl mx-auto">
            {/* Video Thumbnail with Play Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative w-full aspect-video bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl overflow-hidden group shadow-2xl"
            >
              {/* Thumbnail Image (if provided) */}
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Previzualizare dashboard platformă SSM/PSI"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-xl font-semibold">Video demonstrație platformă</p>
                    <p className="text-blue-200 mt-2">Click pentru a viziona</p>
                  </div>
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="bg-white rounded-full p-6 group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-12 h-12 text-blue-600 fill-blue-600" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-6 right-6 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                3:45
              </div>
            </button>

            {/* Video Modal */}
            <VideoModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              videoUrl={videoUrl}
            />
          </div>
        ) : (
          // Screenshot Carousel Fallback
          <div className="max-w-5xl mx-auto">
            <ScreenshotCarousel screenshots={screenshots} />
          </div>
        )}

        {/* Key Features Below Video */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rapid și intuitiv</h3>
            <p className="text-gray-600 text-sm">
              Interfață modernă, ușor de utilizat de către orice membru al echipei
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Securizat și conform</h3>
            <p className="text-gray-600 text-sm">
              Date protejate cu cele mai înalte standarde de securitate
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Acces de oriunde</h3>
            <p className="text-gray-600 text-sm">
              Disponibil pe desktop, tabletă și telefon, oriunde te-ai afla
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
