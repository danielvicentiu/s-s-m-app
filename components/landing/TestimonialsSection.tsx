'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  name: string
  title: string
  company: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'Platforma s-s-m.ro ne-a transformat complet modul în care gestionăm conformitatea SSM. Am redus timpul de administrare cu 60% și avem acum vizibilitate completă asupra tuturor aspectelor de siguranță.',
    name: 'Elena Popescu',
    title: 'Director Resurse Umane',
    company: 'SC Construcții Alpha SRL',
    avatar: 'EP',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Ca și consultant SSM, gestionez peste 50 de firme. Această platformă mi-a simplificat enorm munca - totul este centralizat, automatizat și profesional. Clienții mei sunt încântați de transparență.',
    name: 'Mihai Ionescu',
    title: 'Consultant SSM Senior',
    company: 'SafeWork Consulting',
    avatar: 'MI',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'În industria HoReCa, conformitatea SSM este crucială. Cu s-s-m.ro am trecut toate auditele fără probleme și am digitalizat complet registrele de instruire și controlul medical. Recomand cu încredere!',
    name: 'Andrei Dumitrescu',
    title: 'Manager General',
    company: 'Restaurant Panoramic',
    avatar: 'AD',
    rating: 5,
  },
  {
    id: 4,
    quote:
      'Sistemul de alerte automate ne-a salvat de la amenzi în nenumărate rânduri. Primim notificări cu 30 de zile înainte de expirarea avizelor ISCIR și a documentelor PSI. Echipa noastră este mereu la zi.',
    name: 'Carmen Stanciu',
    title: 'Responsabil SSM',
    company: 'SC Producție Textilă BestFab',
    avatar: 'CS',
    rating: 5,
  },
  {
    id: 5,
    quote:
      'Am implementat platforma în toate cele 3 fabrici ale noastre. Raportarea către management este acum instantanee, iar angajații pot accesa documentele lor SSM din telefon. Investiție excelentă!',
    name: 'Gabriel Radu',
    title: 'Director Operațional',
    company: 'MetalWorks Industries',
    avatar: 'GR',
    rating: 5,
  },
  {
    id: 6,
    quote:
      'Interfața intuitivă și suportul excelent al echipei s-s-m.ro ne-au convins să migrăm complet de la Excel. Acum avem istoric complet, rapoarte detaliate și conformitate garantată. Nu mai revenim la sistemul vechi!',
    name: 'Laura Munteanu',
    title: 'Administrator',
    company: 'TransLog Logistics SRL',
    avatar: 'LM',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, nextSlide])

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce spun clienții noștri
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Peste 100+ companii din România și-au transformat gestionarea SSM/PSI
            cu platforma noastră
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonials[currentIndex].rating }).map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                )
              )}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 flex-grow">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {testimonials[currentIndex].avatar}
              </div>

              {/* Info */}
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentIndex].title}
                </div>
                <div className="text-blue-600 font-medium">
                  {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-200 group"
            aria-label="Testimonial anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-200 group"
            aria-label="Testimonial următor"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Mergi la testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Companii active</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
            <div className="text-gray-600">Angajați monitorizați</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfacție clienți</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Suport disponibil</div>
          </div>
        </div>
      </div>
    </section>
  )
}
