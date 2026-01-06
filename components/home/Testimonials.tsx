'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Worker',
    image: 'https://i.ibb.co/0jQ8X5K/user1.jpg',
    quote: 'I have been using MicroTask for 3 months now and have earned over $500. The platform is easy to use and payments are always on time.',
  },
  {
    name: 'Michael Chen',
    role: 'Buyer',
    image: 'https://i.ibb.co/0jQ8X5K/user2.jpg',
    quote: 'As a small business owner, MicroTask has been a game-changer. I can get tasks completed quickly and affordably by skilled workers.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Worker',
    image: 'https://i.ibb.co/0jQ8X5K/user3.jpg',
    quote: 'The variety of tasks available is amazing. I can work on tasks that match my skills and schedule. Highly recommend!',
  },
  {
    name: 'David Thompson',
    role: 'Buyer',
    image: 'https://i.ibb.co/0jQ8X5K/user4.jpg',
    quote: 'Fast, reliable, and cost-effective. MicroTask has helped me scale my business operations without hiring full-time staff.',
  },
  {
    name: 'Lisa Wang',
    role: 'Worker',
    image: 'https://i.ibb.co/0jQ8X5K/user5.jpg',
    quote: 'I love the flexibility. I can work from anywhere and earn money in my spare time. The withdrawal process is smooth too.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black text-center mb-12">What Our Users Say</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=0ea5e9&color=fff`
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}




