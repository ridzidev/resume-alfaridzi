"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Star,
  StarOff,
  ExternalLink,
  Github,
  Save,
  X
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

const categories = [
  { value: "math_tools", label: "Math Tools" },
  { value: "web_apps", label: "Web Apps" },
  { value: "mobile_apps", label: "Mobile Apps" },
  { value: "desktop_apps", label: "Desktop Apps" },
  { value: "utility_tools", label: "Utility Tools" },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    category: "web_apps",
    technologies: [] as string[],
    github_url: "",
    live_url: "",
    image_url: "",
    featured: false,
  });

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, categoryFilter]);

  const checkUser = async () => {
    if (!supabase) {
      router.push("/admin/login");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    }
  };

  const fetchProjects = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      long_description: "",
      category: "web_apps",
      technologies: [],
      github_url: "",
      live_url: "",
      image_url: "",
      featured: false,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const projectData = {
        ...formData,
        technologies: formData.technologies.filter(tech => tech.trim() !== ""),
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      long_description: project.long_description || "",
      category: project.category,
      technologies: project.technologies,
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
      featured: project.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', project.id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, ""]
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Projects</h1>
            <p className="text-gray-400">Add, edit, and manage your portfolio projects</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {/* Project Image */}
              <div className="relative h-48 bg-gray-700">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {categories.find(cat => cat.value === project.category)?.label}
                  </span>
                  <div className="flex space-x-1">
                    {project.github_url && <Github size={16} className="text-gray-400" />}
                    {project.live_url && <ExternalLink size={16} className="text-gray-400" />}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-400 hover:bg-gray-700 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-2 rounded ${project.featured ? 'text-yellow-400' : 'text-gray-400'} hover:bg-gray-700`}
                    >
                      {project.featured ? <Star size={16} /> : <StarOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-400 hover:bg-gray-700 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Long Description (Optional)</label>
                    <textarea
                      value={formData.long_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Technologies</label>
                    <div className="space-y-2">
                      {formData.technologies.map((tech, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => updateTechnology(index, e.target.value)}
                            placeholder="e.g., React, Node.js"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeTechnology(index)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Technology
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">GitHub URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Live URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.live_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm">Mark as featured project</label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      <span>{editingProject ? 'Update' : 'Create'} Project</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
