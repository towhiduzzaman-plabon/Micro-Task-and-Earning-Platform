'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import BestWorkers from '@/components/home/BestWorkers'
import Testimonials from '@/components/home/Testimonials'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowItWorks from '@/components/home/HowItWorks'
import StatsSection from '@/components/home/StatsSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <BestWorkers />
        <HowItWorks />
        <FeaturesSection />
        <StatsSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}



