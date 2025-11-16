"use client";

import { motion } from "framer-motion";
import { Calculator, Code, Smartphone, Monitor, Wrench, Globe, Award, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function About() {
  const [stats, setStats] = useState({
    projects: 0,
    publications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects count
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        // Fetch publications count
        const { count: publicationsCount } = await supabase
          .from('publications')
          .select('*', { count: 'exact', head: true });

        setStats({
          projects: projectsCount || 0,
          publications: publicationsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const highlights = [
    {
      icon: Award,
      title: "S.Mat Degree",
      desc: "Bachelor's in Mathematics",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Code,
      title: "Full-Stack Expert",
      desc: "Modern web technologies",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Research Publications",
      desc: "Academic contributions",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      desc: "Web, Mobile, Desktop",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const skills = [
    { icon: Calculator, label: "Mathematics", desc: "Advanced mathematical modeling and analysis" },
    { icon: Code, label: "Full-Stack Development", desc: "End-to-end web application development" },
    { icon: Smartphone, label: "Mobile Apps", desc: "Cross-platform mobile solutions" },
    { icon: Monitor, label: "Desktop Apps", desc: "Native desktop application development" },
    { icon: Wrench, label: "Utility Tools", desc: "Efficient automation and productivity tools" },
    { icon: Globe, label: "Web Apps", desc: "Scalable and responsive web applications" },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            With a strong foundation in mathematics (S.Mat) and extensive experience in software development,
            I specialize in creating innovative solutions that bridge theoretical concepts with practical applications.
          </motion.p>
        </motion.div>

        {/* Highlights Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${highlight.color} flex items-center justify-center mb-4`}>
                <highlight.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{highlight.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Journey</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  As a mathematician turned full-stack developer, I bring a unique perspective to software development.
                  My mathematical background enables me to approach problems with analytical rigor and creative problem-solving skills.
                </p>
                <p>
                  I have extensive experience developing applications across various platforms, from web and mobile to desktop solutions.
                  My work spans mathematical tools, utility applications, and complex software systems.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new mathematical concepts, contributing to open-source projects,
                  or sharing knowledge through publications and presentations.
                </p>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { number: "8+", label: "Years Experience" },
                { number: stats.projects.toString(), label: "Projects Completed" },
                { number: stats.publications.toString(), label: "Publications" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-2xl font-semibold mb-6 text-center">Expertise Areas</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.label}
                  className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <skill.icon size={32} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-semibold mb-1">{skill.label}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{skill.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
