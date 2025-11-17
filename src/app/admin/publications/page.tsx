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
  Download,
  FileText,
  Save,
  X
} from "lucide-react";

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
  keywords: string[];
  pdf_url?: string;
  journal_url?: string;
  citation_count: number;
  featured: boolean;
  created_at: string;
}

export default function AdminPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    authors: [] as string[],
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    abstract: "",
    keywords: [] as string[],
    pdf_url: "",
    journal_url: "",
    citation_count: 0,
    featured: false,
  });

  useEffect(() => {
    checkUser();
    fetchPublications();
  }, []);

  useEffect(() => {
    let filtered = publications;

    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        pub.journal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter(pub => pub.year.toString() === yearFilter);
    }

    setFilteredPublications(filtered);
  }, [publications, searchTerm, yearFilter]);

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

  const fetchPublications = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { data, error } = await supabase!
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const publicationData = {
        ...formData,
        authors: formData.authors.filter(author => author.trim() !== ""),
        keywords: formData.keywords.filter(keyword => keyword.trim() !== ""),
      };

      if (editingPublication) {
        const { error } = await supabase!
          .from('publications')
          .update(publicationData)
          .eq('id', editingPublication.id);

        if (error) throw error;
      } else {
        const { error } = await supabase!
          .from('publications')
          .insert([publicationData]);

        if (error) throw error;
      }

      resetForm();
      fetchPublications();
    } catch (error) {
      console.error('Error saving publication:', error);
      alert('Error saving publication. Please try again.');
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      authors: publication.authors,
      journal: publication.journal,
      year: publication.year,
      doi: publication.doi || "",
      abstract: publication.abstract || "",
      keywords: publication.keywords,
      pdf_url: publication.pdf_url || "",
      journal_url: publication.journal_url || "",
      citation_count: publication.citation_count,
      featured: publication.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { error } = await supabase!
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Error deleting publication. Please try again.');
    }
  };

  const toggleFeatured = async (publication: Publication) => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { error } = await supabase!
        .from('publications')
        .update({ featured: !publication.featured })
        .eq('id', publication.id);

      if (error) throw error;
      fetchPublications();
    } catch (error) {
      console.error('Error updating publication:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authors: [] as string[],
      journal: "",
      year: new Date().getFullYear(),
      doi: "",
      abstract: "",
      keywords: [] as string[],
      pdf_url: "",
      journal_url: "",
      citation_count: 0,
      featured: false,
    });
    setEditingPublication(null);
    setShowForm(false);
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, ""]
    }));
  };

  const updateAuthor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => i === index ? value : author)
    }));
  };

  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      keywords: [...prev.keywords, ""]
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.map((keyword, i) => i === index ? value : keyword)
    }));
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  // Get unique years for filter
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

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
            <h1 className="text-3xl font-bold">Manage Publications</h1>
            <p className="text-gray-400">Add, edit, and manage your research publications</p>
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
              <span>Add Publication</span>
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
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6 mb-8">
          {filteredPublications.map((publication) => (
            <div key={publication.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {publication.featured && (
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </div>
                    )}
                    <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                      {publication.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{publication.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {publication.authors.map((author, index) => (
                      <span
                        key={index}
                        className={`text-sm ${
                          author.toLowerCase().includes('ridzi') || author.toLowerCase().includes('alfa')
                            ? 'text-blue-400 font-semibold'
                            : 'text-gray-300'
                        }`}
                      >
                        {author}{index < publication.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 mb-2">{publication.journal}</p>
                  {publication.doi && (
                    <p className="text-sm text-gray-500">DOI: {publication.doi}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {publication.citation_count > 0 && (
                    <span className="text-sm text-gray-400">
                      {publication.citation_count} citations
                    </span>
                  )}
                  <div className="flex space-x-1">
                    {publication.journal_url && <ExternalLink size={16} className="text-gray-400" />}
                    {publication.pdf_url && <Download size={16} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {publication.abstract && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm line-clamp-3">{publication.abstract}</p>
                </div>
              )}

              {publication.keywords.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(publication)}
                    className="p-2 text-blue-400 hover:bg-gray-700 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => toggleFeatured(publication)}
                    className={`p-2 rounded ${publication.featured ? 'text-yellow-400' : 'text-gray-400'} hover:bg-gray-700`}
                  >
                    {publication.featured ? <Star size={16} /> : <StarOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(publication.id)}
                    className="p-2 text-red-400 hover:bg-gray-700 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Added {new Date(publication.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingPublication ? 'Edit Publication' : 'Add New Publication'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Authors *</label>
                    <div className="space-y-2">
                      {formData.authors.map((author, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={author}
                            onChange={(e) => updateAuthor(index, e.target.value)}
                            placeholder="Author name"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addAuthor}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Author
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Journal *</label>
                      <input
                        type="text"
                        value={formData.journal}
                        onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year *</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">DOI (Optional)</label>
                      <input
                        type="text"
                        value={formData.doi}
                        onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                        placeholder="10.xxxx/xxxxx"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Citation Count</label>
                      <input
                        type="number"
                        value={formData.citation_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, citation_count: parseInt(e.target.value) || 0 }))}
                        min="0"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Abstract (Optional)</label>
                    <textarea
                      value={formData.abstract}
                      onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Keywords</label>
                    <div className="space-y-2">
                      {formData.keywords.map((keyword, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={keyword}
                            onChange={(e) => updateKeyword(index, e.target.value)}
                            placeholder="e.g., Machine Learning"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Keyword
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Journal URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.journal_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, journal_url: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">PDF URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.pdf_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm">Mark as featured publication</label>
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
                      <span>{editingPublication ? 'Update' : 'Create'} Publication</span>
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
