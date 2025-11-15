"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  FileText,
  Briefcase,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Mail
} from "lucide-react";

interface DashboardStats {
  projects: number;
  publications: number;
  messages: number;
  views: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    publications: 0,
    messages: 0,
    views: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchStats();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch stats from Supabase
      const [projectsRes, publicationsRes, messagesRes, viewsRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('publications').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }),
        supabase.from('portfolio_views').select('id', { count: 'exact' })
      ]);

      setStats({
        projects: projectsRes.count || 0,
        publications: publicationsRes.count || 0,
        messages: messagesRes.count || 0,
        views: viewsRes.count || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Publications",
      value: stats.publications,
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Contact Messages",
      value: stats.messages,
      icon: Mail,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Portfolio Views",
      value: stats.views,
      icon: Eye,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="p-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`${stat.bgColor} border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/admin/projects" className="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus size={20} />
              <span>Manage Projects</span>
            </a>
            <a href="/admin/publications" className="flex items-center space-x-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <Plus size={20} />
              <span>Manage Publications</span>
            </a>
            <a href="/admin/messages" className="flex items-center space-x-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Mail size={20} />
              <span>View Messages</span>
            </a>
            <button className="flex items-center space-x-3 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
              <BarChart3 size={20} />
              <span>View Analytics</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Dashboard accessed</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">System initialized</p>
                <p className="text-xs text-gray-400">Today</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
