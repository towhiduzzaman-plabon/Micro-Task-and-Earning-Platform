'use client'

import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  const slides = [
    {
      title: 'Earn Money by Completing Simple Tasks',
      description: 'Join thousands of workers earning money by completing micro tasks. Start earning today!',
      bgColor: 'bg-gradient-to-r from-primary-500 to-primary-700',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop&auto=format',
      imageAlt: 'People working on tasks',
    },
    {
      title: 'Get Your Tasks Done Quickly',
      description: 'Post your tasks and get them completed by verified workers. Fast, reliable, and affordable.',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&auto=format',
      imageAlt: 'Team collaboration',
    },
    {
      title: 'Trusted Platform for Micro Tasks',
      description: 'Secure payments, verified workers, and instant task completion. Join our growing community.',
      bgColor: 'bg-gradient-to-r from-green-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&auto=format',
      imageAlt: 'Digital platform',
    },
  ]

  return (
    <div className="relative h-[600px]">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        transitionTime={500}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[600px] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement?.classList.add(slide.bgColor)
                }}
              />
              <div className={`absolute inset-0 ${slide.bgColor} opacity-80`}></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md"
                >
                  {slide.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link
                    href="/register"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

