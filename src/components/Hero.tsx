"use client";

import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Sparkles, Code, Calculator } from "lucide-react";

export default function Hero() {
  const floatingIcons = [
    { Icon: Code, delay: 0, x: -100, y: -50 },
    { Icon: Calculator, delay: 1, x: 100, y: -30 },
    { Icon: Sparkles, delay: 2, x: -80, y: 50 },
    { Icon: Github, delay: 3, x: 80, y: 70 },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/30 dark:text-blue-300/30"
          initial={{ opacity: 0, x, y }}
          animate={{
            opacity: [0, 0.5, 0],
            x: [x, x + Math.random() * 40 - 20],
            y: [y, y + Math.random() * 40 - 20],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon size={32 + Math.random() * 16} />
        </motion.div>
      ))}

      <div className="relative container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Title with Enhanced Animation */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              M. Alfa Ridzi
            </motion.h1>

            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.div>

          {/* Subtitle with Typewriter Effect */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.p
              className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Mathematician & Full-Stack Developer
            </motion.p>
            <motion.p
              className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Bridging the gap between mathematical theory and practical software solutions.
              Creating innovative applications that make complex problems simple.
            </motion.p>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href="#about"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore My Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="group px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div
            className="flex justify-center space-x-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { Icon: Github, href: "https://github.com", label: "GitHub" },
              { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { Icon: Mail, href: "mailto:alfa@example.com", label: "Email" },
            ].map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                className="group relative p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                aria-label={label}
              >
                <Icon size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={false}
                />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Scroll Down</span>
          <ChevronDown size={32} className="text-gray-400 hover:text-blue-500 transition-colors duration-300" />
        </motion.div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-gray-900/50 pointer-events-none" />
    </section>
  );
}
