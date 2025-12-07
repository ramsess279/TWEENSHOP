import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Slide {
  id: string
  image?: string
  video?: string
  title: string
  subtitle: string
  buttonText?: string
  buttonLink?: string
}

interface CarouselProps {
  slides: Slide[]
  autoPlayInterval?: number
}

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [slides.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-baby-pink/20" style={{ minHeight: '100vh' }}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-2000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {slide.video ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          <div className="relative z-10 px-4 sm:px-8 md:px-16 py-8 md:py-16 text-center h-full flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 font-nunito drop-shadow-2xl text-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-white/95 mb-6 sm:mb-8 md:mb-12 font-semibold text-lg sm:text-xl md:text-2xl drop-shadow-2xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2">
              {slide.subtitle}
            </p>
            {slide.buttonText && slide.buttonLink && (
              <Link
                to={slide.buttonLink}
                className="inline-block bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                {slide.buttonText}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white shadow-lg scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-2 sm:p-3 md:p-4 hover:bg-white/50 transition-all duration-300 shadow-lg hover:shadow-xl z-20"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-2 sm:p-3 md:p-4 hover:bg-white/50 transition-all duration-300 shadow-lg hover:shadow-xl z-20"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default Carousel