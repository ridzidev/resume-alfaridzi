"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, FileText, Mail, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const sections = [
  { id: "hero", label: "Home", icon: Home, color: "text-blue-500" },
  { id: "about", label: "About", icon: User, color: "text-green-500" },
  { id: "projects", label: "Projects", icon: Briefcase, color: "text-purple-500" },
  { id: "publications", label: "Publications", icon: FileText, color: "text-orange-500" },
  { id: "contact", label: "Contact", icon: Mail, color: "text-pink-500" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="relative">
          {/* Enhanced Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl"
            animate={{ scale: isHovered ? 1.3 : 1, opacity: isHovered ? 0.8 : 0.4 }}
            transition={{ duration: 0.3 }}
          />

          {/* Sidebar container with enhanced styling */}
          <motion.div
            className="relative bg-white/15 backdrop-blur-xl border border-white/30 rounded-full p-3 shadow-2xl overflow-hidden"
            animate={{ width: isHovered ? 200 : 70 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Animated sparkles background */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
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
                >
                  <Sparkles size={4} className="text-white" />
                </motion.div>
              ))}
            </div>

            <div className="relative flex flex-col space-y-3">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`relative flex items-center space-x-4 px-4 py-4 rounded-full transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/20"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    {/* Enhanced Icon */}
                    <motion.div
                      className={`relative ${isActive ? 'text-white' : section.color}`}
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={24} />
                      {/* Icon glow effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-full blur-sm ${section.color} opacity-0 group-hover:opacity-50`}
                        animate={{ scale: isActive ? 1.5 : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>

                    {/* Enhanced Label */}
                    <motion.span
                      className="font-semibold text-sm whitespace-nowrap"
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {section.label}
                    </motion.span>

                    {/* Active indicator with enhanced animation */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Hover tooltip for collapsed state */}
                    {!isHovered && (
                      <motion.div
                        className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {section.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-6 right-6 z-50 md:hidden bg-white/15 backdrop-blur-xl border border-white/30 rounded-full p-3 shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        <motion.div
          className="absolute right-6 top-20 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl min-w-[220px]"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0.8,
            y: isOpen ? 0 : -20
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <motion.div
                    className={`relative ${isActive ? 'text-white' : section.color}`}
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={24} />
                  </motion.div>
                  <span className="font-semibold">{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
