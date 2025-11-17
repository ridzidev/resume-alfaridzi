"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

interface ViewData {
  id: string;
  page: string;
  user_agent: string;
  ip_address: string;
  referrer: string | null;
  viewed_at: string;
}

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  topPages: { page: string; views: number }[];
  deviceStats: { desktop: number; mobile: number; tablet: number };
  referrerStats: { referrer: string; count: number }[];
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    topPages: [],
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    referrerStats: []
  });
  const [recentViews, setRecentViews] = useState<ViewData[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchAnalytics();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    } else {
      setUser(user);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all view data
      const { data: views, error } = await supabase
        .from('portfolio_views')
        .select('*')
        .order('viewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      if (!views) return;

      // Calculate stats
      const totalViews = views.length;
      const uniqueIPs = new Set(views.map(v => v.ip_address)).size;

      // Today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayViews = views.filter(v => new Date(v.viewed_at) >= today).length;

      // Top pages
      const pageCounts = views.reduce((acc, view) => {
        acc[view.page] = (acc[view.page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(pageCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([page, views]) => ({ page, views }));

      // Device stats
      const deviceStats = views.reduce((acc, view) => {
        const ua = view.user_agent.toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
          acc.mobile++;
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
          acc.tablet++;
        } else {
          acc.desktop++;
        }
        return acc;
      }, { desktop: 0, mobile: 0, tablet: 0 });

      // Referrer stats
      const referrerCounts = views.reduce((acc, view) => {
        const referrer = view.referrer || 'Direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const referrerStats = Object.entries(referrerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([referrer, count]) => ({ referrer, count }));

      setAnalyticsData({
        totalViews,
        uniqueVisitors: uniqueIPs,
        todayViews,
        topPages,
        deviceStats,
        referrerStats
      });

      // Set recent views (last 10)
      setRecentViews(views.slice(0, 10));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone size={16} />;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Smartphone size={16} />;
    } else {
      return <Monitor size={16} />;
    }
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 p-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-gray-400">Portfolio view analytics</p>
            </div>
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </motion.header>

      <div className="p-6">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold mt-1">{analyticsData.totalViews}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Visitors</p>
                <p className="text-2xl font-bold mt-1">{analyticsData.uniqueVisitors}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Views</p>
                <p className="text-2xl font-bold mt-1">{analyticsData.todayViews}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. per Day</p>
                <p className="text-2xl font-bold mt-1">
                  {analyticsData.totalViews > 0 ? Math.round(analyticsData.totalViews / 30) : 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-mono">#{index + 1}</span>
                    <span>{page.page}</span>
                  </div>
                  <span className="font-semibold">{page.views} views</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Device Types</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor size={16} />
                  <span>Desktop</span>
                </div>
                <span className="font-semibold">{analyticsData.deviceStats.desktop}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone size={16} />
                  <span>Mobile</span>
                </div>
                <span className="font-semibold">{analyticsData.deviceStats.mobile}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone size={16} />
                  <span>Tablet</span>
                </div>
                <span className="font-semibold">{analyticsData.deviceStats.tablet}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Top Referrers</h2>
          <div className="space-y-3">
            {analyticsData.referrerStats.map((ref, index) => (
              <div key={ref.referrer} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe size={16} />
                  <span className="truncate">{ref.referrer}</span>
                </div>
                <span className="font-semibold">{ref.count} visits</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Views</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-400">Time</th>
                  <th className="text-left p-3 text-gray-400">Page</th>
                  <th className="text-left p-3 text-gray-400">Device</th>
                  <th className="text-left p-3 text-gray-400">IP</th>
                  <th className="text-left p-3 text-gray-400">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentViews.map((view) => (
                  <tr key={view.id} className="border-b border-gray-700/50">
                    <td className="p-3 text-sm">{formatDate(view.viewed_at)}</td>
                    <td className="p-3 text-sm">{view.page}</td>
                    <td className="p-3 text-sm flex items-center space-x-2">
                      {getDeviceIcon(view.user_agent)}
                      <span className="truncate max-w-24">{view.user_agent.split(' ')[0]}</span>
                    </td>
                    <td className="p-3 text-sm font-mono">{view.ip_address}</td>
                    <td className="p-3 text-sm truncate max-w-32">{view.referrer || 'Direct'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
