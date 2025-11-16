"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 md:pb-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">M. Alfa Ridzi</h3>
            <p className="text-gray-400 mb-4">
              Mathematician & Full-Stack Developer creating innovative solutions
              at the intersection of mathematics and technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/ridzidev"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/ridzima/"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:alfa@example.com"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Projects
                </a>
              </li>
              <li>
                <a href="#publications" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Publications
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">Specializations</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Mathematical Modeling</li>
              <li>Full-Stack Development</li>
              <li>Cross-Platform Apps</li>
              <li>Algorithm Optimization</li>
              <li>Data Visualization</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400 flex items-center justify-center">
            © {currentYear} M. Alfa Ridzi. Made with <Heart size={16} className="mx-1 text-red-500" /> using Next.js
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
