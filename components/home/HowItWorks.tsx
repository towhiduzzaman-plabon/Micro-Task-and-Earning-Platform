'use client'

import { FaUserPlus, FaTasks, FaCheckCircle, FaCoins } from 'react-icons/fa'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: <FaUserPlus className="text-4xl text-black" />,
    title: 'Sign Up',
    description: 'Create your account as a worker or buyer in just a few minutes.',
  },
  {
    icon: <FaTasks className="text-4xl text-black" />,
    title: 'Browse Tasks',
    description: 'Workers can browse available tasks, buyers can post new tasks.',
  },
  {
    icon: <FaCheckCircle className="text-4xl text-black" />,
    title: 'Complete & Review',
    description: 'Workers complete tasks, buyers review and approve submissions.',
  },
  {
    icon: <FaCoins className="text-4xl text-black" />,
    title: 'Get Paid',
    description: 'Workers earn coins and can withdraw, buyers get tasks done.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                {step.icon}
              </div>
              <div className="flex items-center justify-center mb-2">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




