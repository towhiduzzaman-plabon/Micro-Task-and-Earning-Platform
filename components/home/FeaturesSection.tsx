'use client'

import { FaShieldAlt, FaClock, FaDollarSign, FaUsers, FaCheckCircle, FaHeadset } from 'react-icons/fa'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <FaShieldAlt className="text-4xl text-blue-700" />,
    title: 'Secure Platform',
    description: 'Your data and payments are protected with industry-standard security measures.',
  },
  {
    icon: <FaClock className="text-4xl text-blue-700" />,
    title: 'Quick Payments',
    description: 'Get paid fast with our streamlined payment processing system.',
  },
  {
    icon: <FaDollarSign className="text-4xl text-blue-700" />,
    title: 'Fair Pricing',
    description: 'Competitive rates for workers and affordable prices for buyers.',
  },
  {
    icon: <FaUsers className="text-4xl text-blue-700" />,
    title: 'Verified Workers',
    description: 'All workers are verified to ensure quality and reliability.',
  },
  {
    icon: <FaCheckCircle className="text-4xl text-blue-700" />,
    title: 'Quality Assurance',
    description: 'Every task is reviewed to ensure it meets the highest standards.',
  },
  {
    icon: <FaHeadset className="text-4xl text-blue-700" />,
    title: '24/7 Support',
    description: 'Our support team is always ready to help you with any questions.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black text-center mb-12">Why Choose MicroTask?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-primary-600 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




