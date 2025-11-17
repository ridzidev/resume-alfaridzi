"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText, Calendar, Users, Award, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('Error fetching publications:', error);
        return;
      }

      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
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
            Research Publications
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Academic contributions in mathematics, computer science, and interdisciplinary research.
          </motion.p>
        </motion.div>

        {/* Publications List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {publications.map((publication, index) => (
            <motion.div
              key={publication.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Featured Badge */}
              {publication.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 flex items-center space-x-2">
                  <Award size={16} />
                  <span className="text-sm font-semibold">Featured Publication</span>
                </div>
              )}

              <div className="p-8">
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                  {publication.title}
                </h3>

                {/* Authors */}
                <div className="flex items-center space-x-2 mb-4">
                  <Users size={18} className="text-gray-500 dark:text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {publication.authors.map((author, authorIndex) => (
                      <span
                        key={authorIndex}
                        className={`text-sm font-medium ${
                          author.toLowerCase().includes('ridzi') || author.toLowerCase().includes('alfa')
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {author}{authorIndex < publication.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Journal and Year */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText size={18} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {publication.journal}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {publication.year}
                    </span>
                  </div>
                </div>

                {/* Abstract */}
                {publication.abstract && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Abstract</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {publication.abstract}
                    </p>
                  </div>
                )}

                {/* Keywords */}
                {publication.keywords && publication.keywords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {publication.keywords.map((keyword, keywordIndex) => (
                        <span
                          key={keywordIndex}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {publication.citation_count > 0 && (
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Award size={16} />
                        <span className="text-sm">{publication.citation_count} citations</span>
                      </div>
                    )}
                    {publication.doi && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        DOI: {publication.doi}
                      </div>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {publication.journal_url && (
                    <a
                      href={publication.journal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                    >
                      <ExternalLink size={16} />
                      <span>View Paper</span>
                    </a>
                  )}
                  {publication.pdf_url && (
                    <a
                      href={publication.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                    >
                      <Download size={16} />
                      <span>Download PDF</span>
                    </a>
                  )}
                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                    >
                      <FileText size={16} />
                      <span>DOI Link</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {publications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No publications yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Publications will appear here once added to the database.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
