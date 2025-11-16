"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Calendar, Code, Smartphone, Monitor, Wrench, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  technologies: string[] | string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

const categoryIcons = {
  math_tools: Code,
  mobile_apps: Smartphone,
  desktop_apps: Monitor,
  utility_tools: Wrench,
  web_apps: Globe,
};

const categoryColors = {
  math_tools: "from-blue-500 to-blue-600",
  mobile_apps: "from-green-500 to-green-600",
  desktop_apps: "from-purple-500 to-purple-600",
  utility_tools: "from-orange-500 to-orange-600",
  web_apps: "from-pink-500 to-pink-600",
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeCategory));
    }
  }, [projects, activeCategory]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "math_tools", label: "Math Tools", count: projects.filter(p => p.category === "math_tools").length },
    { id: "web_apps", label: "Web Apps", count: projects.filter(p => p.category === "web_apps").length },
    { id: "mobile_apps", label: "Mobile Apps", count: projects.filter(p => p.category === "mobile_apps").length },
    { id: "desktop_apps", label: "Desktop Apps", count: projects.filter(p => p.category === "desktop_apps").length },
    { id: "utility_tools", label: "Utility Tools", count: projects.filter(p => p.category === "utility_tools").length },
  ];

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-900 relative overflow-hidden">
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
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A showcase of innovative applications spanning mathematics, web development, and software engineering.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label} ({category.count})
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => {
            const CategoryIcon = categoryIcons[project.category as keyof typeof categoryIcons] || Code;
            const categoryColor = categoryColors[project.category as keyof typeof categoryColors] || "from-gray-500 to-gray-600";

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-2xl"
                whileHover={{ y: -5 }}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CategoryIcon size={64} className="text-gray-600" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${categoryColor} text-white p-2 rounded-full`}>
                    <CategoryIcon size={16} />
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map((tech: string) => tech.trim())).slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map((tech: string) => tech.trim())).length > 3 && (
                      <span className="px-3 py-1 bg-gray-600/50 text-gray-400 rounded-full text-sm">
                        +{(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map((tech: string) => tech.trim())).length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex space-x-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Github size={18} />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink size={18} />
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 mt-4 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Code size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
          </motion.div>
        )}

        {/* Technology Usage Chart */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <motion.h3
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Technology Stack Overview
            </motion.h3>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <TechnologyChart projects={projects} />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Technology Chart Component
function TechnologyChart({ projects }: { projects: Project[] }) {
  const [techCounts, setTechCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const counts: { [key: string]: number } = {};
    projects.forEach(project => {
      // Handle both array and string formats, split by comma and clean up
      const techs = Array.isArray(project.technologies)
        ? project.technologies
        : project.technologies.split(',').map((tech: string) => tech.trim().toLowerCase());

      techs.forEach((tech: string) => {
        if (tech && tech !== '') { // Skip empty strings
          counts[tech] = (counts[tech] || 0) + 1;
        }
      });
    });
    setTechCounts(counts);
  }, [projects]);

  const sortedTechs = Object.entries(techCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20); // Show top 20 technologies

  const totalProjects = projects.length;
  const totalTechMentions = Object.values(techCounts).reduce((sum, count) => sum + count, 0);

  const getTechColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-cyan-500 to-cyan-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-emerald-500 to-emerald-600',
      'from-violet-500 to-violet-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">{totalProjects}</div>
          <div className="text-gray-300 text-sm">Total Projects</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-3xl font-bold text-green-400 mb-2">{Object.keys(techCounts).length}</div>
          <div className="text-gray-300 text-sm">Unique Technologies</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-3xl font-bold text-purple-400 mb-2">{totalTechMentions}</div>
          <div className="text-gray-300 text-sm">Technology Mentions</div>
        </motion.div>
      </div>

      {/* Bubble Chart */}
      <div className="relative">
        <div className="relative w-full h-[600px] overflow-hidden">
          {sortedTechs.map(([tech, count], index) => {
            const size = Math.max(40, Math.min(140, 40 + count * 20)); // More dynamic sizing: base 40, +20 per count, max 140
            const colorClass = getTechColor(index);
            const randomX = Math.random() * (90 - (size / 6)) + 5 + (size / 12); // Random position as percentage, accounting for bubble size, with 5% margin
            const randomY = Math.random() * (90 - (size / 6)) + 5 + (size / 12); // Random position as percentage, accounting for bubble size, with 5% margin

            return (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
                className={`absolute flex items-center justify-center bg-gradient-to-br ${colorClass} rounded-full shadow-lg cursor-pointer group`}
                style={{
                  width: size,
                  height: size,
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
              >
                <div className="text-center text-white">
                  <div className="font-bold text-lg leading-tight">{count}</div>
                  <div className="text-xs opacity-90 leading-tight px-1">
                    {tech.length > 8 ? tech.substring(0, 6) + '...' : tech}
                  </div>
                </div>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10 pointer-events-none"
                >
                  {tech}: {count} project{count !== 1 ? 's' : ''}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center text-gray-400 text-sm"
      >
        <p>Bubble size represents usage frequency • Hover for details</p>
      </motion.div>

      {sortedTechs.length === 0 && (
        <div className="text-center py-8">
          <Code size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No technology data available</p>
        </div>
      )}
    </div>
  );
}
