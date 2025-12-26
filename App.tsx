import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Video, 
  MonitorPlay, 
  Zap, 
  Menu, 
  Bell, 
  Search,
  ArrowUpRight,
  MoreHorizontal,
  Youtube,
  BarChart2,
  Sparkles
} from 'lucide-react';
import { Category, LeaderboardItem, AnalysisResult, ChartData } from './types';
import TrendChart from './components/TrendChart';
import AnalysisModal from './components/AnalysisModal';
import { analyzeContent } from './services/geminiService';

// Mock Data Generators
const generateMockData = (category: Category): LeaderboardItem[] => {
  return Array.from({ length: 15 }).map((_, i) => ({
    id: `${category}-${i}`,
    rank: i + 1,
    title: category === 'channels' 
      ? `Channel ${Math.floor(Math.random() * 1000)}` 
      : `Why This ${['Tech', 'Game', 'Food', 'Travel'][i % 4]} Video Blew Up ${Math.floor(Math.random() * 100)}`,
    thumbnail: `https://picsum.photos/300/200?random=${i + (category === 'videos' ? 100 : category === 'shorts' ? 200 : 0)}`,
    views: Math.floor(Math.random() * 5000000) + 50000,
    growth: Math.floor(Math.random() * 500) + 10,
    subscribers: category === 'channels' ? Math.floor(Math.random() * 10000000) : undefined,
    duration: category === 'videos' ? '12:45' : category === 'shorts' ? '0:59' : undefined,
    category,
    engagementRate: Math.floor(Math.random() * 15) + 2,
    publishedAt: `${Math.floor(Math.random() * 23)}h ago`
  })).sort((a, b) => b.views - a.views).map((item, idx) => ({ ...item, rank: idx + 1 }));
};

const mockChartData: ChartData[] = [
  { name: 'Mon', views: 4000, subs: 2400 },
  { name: 'Tue', views: 3000, subs: 1398 },
  { name: 'Wed', views: 2000, subs: 9800 },
  { name: 'Thu', views: 2780, subs: 3908 },
  { name: 'Fri', views: 1890, subs: 4800 },
  { name: 'Sat', views: 2390, subs: 3800 },
  { name: 'Sun', views: 3490, subs: 4300 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('videos');
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LeaderboardItem | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setItems(generateMockData(activeTab));
  }, [activeTab]);

  const handleAnalyze = async (item: LeaderboardItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisData(null);
    
    try {
      const result = await analyzeContent(item);
      setAnalysisData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const SidebarItem = ({ icon: Icon, label, id, active }: { icon: any, label: string, id: Category, active: boolean }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-red-50 text-red-600 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-red-600' : 'text-slate-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl tracking-tight">
            <Youtube className="w-8 h-8 fill-current" />
            <span>TubeRank AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analytics</div>
          <SidebarItem icon={Video} label="Top Videos" id="videos" active={activeTab === 'videos'} />
          <SidebarItem icon={Zap} label="Trending Shorts" id="shorts" active={activeTab === 'shorts'} />
          <SidebarItem icon={MonitorPlay} label="Top Channels" id="channels" active={activeTab === 'channels'} />
        </nav>

        <div className="p-4 m-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart2 className="w-24 h-24" />
          </div>
          <h4 className="font-semibold relative z-10">Upgrade to Pro</h4>
          <p className="text-xs text-slate-300 mt-1 relative z-10">Get real-time data & unlimited AI analysis.</p>
          <button className="mt-3 w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-lg relative z-10">View Plans</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search channels or videos..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 rounded-lg text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/100/100?random=user" alt="User" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TrendChart data={mockChartData} color="#dc2626" />
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Views Tracked</h3>
                <div className="text-3xl font-bold text-slate-900">2.4B</div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12.5% this week</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-red-100 text-xs font-semibold uppercase tracking-wider">Top Trending</h3>
                    <div className="text-xl font-bold mt-1">#Gaming</div>
                  </div>
                  <Zap className="w-6 h-6 text-red-200" />
                </div>
                <div className="w-full bg-red-800/50 rounded-full h-1.5 mb-2">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-red-200">85% higher volume than average</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 capitalize">
                  Global {activeTab} Leaderboard
                </h2>
                <p className="text-sm text-slate-500">Real-time traffic analysis updated every hour.</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/20">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold w-20">Rank</th>
                    <th className="px-6 py-4 font-semibold">Content</th>
                    <th className="px-6 py-4 font-semibold text-right">Views</th>
                    <th className="px-6 py-4 font-semibold text-right">Growth (24h)</th>
                    <th className="px-6 py-4 font-semibold text-right">Eng. Rate</th>
                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className={`
                          w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm
                          ${item.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                            item.rank === 2 ? 'bg-slate-200 text-slate-700' :
                            item.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'}
                        `}>
                          {item.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all">
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                            {item.duration && (
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                                {item.duration}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 line-clamp-2 max-w-xs">{item.title}</div>
                            <div className="text-xs text-slate-500 mt-1">{item.publishedAt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          {item.growth}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 text-sm">
                        {item.engagementRate}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleAnalyze(item)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Insight
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-center">
              <button className="text-sm text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1">
                Load More <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <AnalysisModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isAnalyzing}
        data={analysisData}
        item={selectedItem}
      />
    </div>
  );
};

export default App;