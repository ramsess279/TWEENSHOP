import React from 'react'
import Carousel from '../components/Carousel'

const Home: React.FC = () => {
  // Carousel slides data
  const carouselSlides = [
    {
      id: 'welcome',
      video: '/assets/video1.mp4',
      title: 'Bienvenue aux Petits Trésors',
      subtitle: 'Découvrez notre collection exclusive pour bébés, conçue avec amour et sécurité pour les premiers moments de vie',
      buttonText: 'Explorer les bébés',
      buttonLink: '/products?category=bebe'
    },
    {
      id: 'quality',
      video: '/assets/video2.mp4',
      title: 'Fun & Créativité pour les Enfants',
      subtitle: 'Des jouets éducatifs, vêtements tendance et accessoires pour accompagner leur croissance et leurs aventures',
      buttonText: 'Voir les enfants',
      buttonLink: '/products?category=enfants'
    }
  ]

  return (
    <Carousel slides={carouselSlides} autoPlayInterval={8000} />
  )
}

export default Home
