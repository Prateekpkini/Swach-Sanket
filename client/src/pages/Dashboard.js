import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ChevronDown, ChevronUp, Calendar, TrendingUp, Save, Trash2, Search, X, LogOut } from "lucide-react";

const materialList = [
  { category: "Paper", name: "News Paper", color: "#8b5cf6" },
  { category: "Paper", name: "White & colored paper", color: "#8b5cf6" },
  { category: "Paper", name: "Notebooks & other books", color: "#8b5cf6" },
  { category: "Paper", name: "Cardboard", color: "#8b5cf6" },
  { category: "Paper", name: "Plastic lined board/whiteboard", color: "#8b5cf6" },
  { category: "Plastic", name: "PET bottle", color: "#3b82f6" },
  { category: "Plastic", name: "LDPE/HDPE carry bags", color: "#3b82f6" },
  { category: "Plastic", name: "Milk packets", color: "#3b82f6" },
  { category: "Plastic", name: "HDPE (shampoo bottles, cleaners)", color: "#3b82f6" },
  { category: "Plastic", name: "PVC (plumbing pipes)", color: "#3b82f6" },
  { category: "Plastic", name: "PP (Food containers)", color: "#3b82f6" },
  { category: "Plastic", name: "PP carry bags", color: "#3b82f6" },
  { category: "Plastic", name: "Laminates", color: "#3b82f6" },
  { category: "Plastic", name: "Tetra paks", color: "#3b82f6" },
  { category: "Plastic", name: "Thermocol/PS", color: "#3b82f6" },
  { category: "Plastic", name: "Paper cups/plates", color: "#3b82f6" },
  { category: "Plastic", name: "MLP", color: "#3b82f6" },
  { category: "Metal", name: "Aluminium foils", color: "#ef4444" },
  { category: "Metal", name: "Aluminium/tin cans", color: "#ef4444" },
  { category: "Metal", name: "Other metals", color: "#ef4444" },
  { category: "Glass", name: "Glass", color: "#10b981" },
  { category: "Rubber", name: "Tyres", color: "#f59e0b" },
  { category: "Rubber", name: "Toys, gloves, others", color: "#f59e0b" },
  { category: "Textile", name: "Textiles (clothes, bags, rags, etc.)", color: "#ec4899" },
  { category: "Ceramic", name: "Ceramic (plates, cups, pots, etc.)", color: "#14b8a6" },
  { category: "Leather", name: "Leather (belts, bags, tyres etc.)", color: "#a855f7" },
  { category: "Footwear", name: "Sandals, shoes, etc.", color: "#6366f1" },
  { category: "Fibrous organic", name: "Coconut shells and husks", color: "#84cc16" },
  { category: "E-waste", name: "All kinds of E-waste", color: "#64748b" },
  { category: "Others", name: "Rejects (silt, hair, dust)", color: "#78716c" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [entries, setEntries] = useState({});
  const [data, setData] = useState(() =>
    materialList.reduce((acc, item) => {
      acc[item.name] = "";
      return acc;
    }, {})
  );
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mrf_data") || "{}");
    setEntries(stored);
    if (stored[selectedDate]) {
      setData(stored[selectedDate]);
    } else {
      setData(
        materialList.reduce((acc, item) => {
          acc[item.name] = "";
          return acc;
        }, {})
      );
    }
  }, [selectedDate]);

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = { ...entries, [selectedDate]: data };
    localStorage.setItem("mrf_data", JSON.stringify(updated));
    setEntries(updated);
    setNotificationMessage(`✅ Data saved successfully for ${selectedDate}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDeleteEntry = (date) => {
    const updated = { ...entries };
    delete updated[date];
    localStorage.setItem("mrf_data", JSON.stringify(updated));
    setEntries(updated);
    setNotificationMessage(`🗑️ Deleted entry for ${date}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const chartData = useMemo(() => {
    const categoryTotals = {};
    materialList.forEach((item) => {
      const weight = parseFloat(data[item.name]) || 0;
      categoryTotals[item.category] = {
        total: (categoryTotals[item.category]?.total || 0) + weight,
        color: item.color
      };
    });
    return Object.entries(categoryTotals).map(([category, { total, color }]) => ({
      category,
      total,
      color,
    }));
  }, [data]);

  const totalWeight = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total, 0);
  }, [chartData]);

  const materialsByCategory = useMemo(() => {
    const grouped = {};
    materialList.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return Object.keys(materialsByCategory);
    return Object.keys(materialsByCategory).filter(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materialsByCategory[category].some(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, materialsByCategory]);

  const completionPercentage = useMemo(() => {
    const filled = Object.values(data).filter(v => v && parseFloat(v) > 0).length;
    return Math.round((filled / materialList.length) * 100);
  }, [data]);

  const historicalData = useMemo(() => {
    return Object.keys(entries)
      .sort()
      .slice(-7)
      .map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
      }));
  }, [entries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">MRF Dashboard</h1>
              <p className="text-purple-100 text-sm">Zilla Panchayat Material Recovery Facility</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-lg text-sm">
                {localStorage.getItem("user_email") || "user@example.com"}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Total Weight Today</div>
            <div className="text-4xl font-bold mb-1">{totalWeight.toFixed(2)}</div>
            <div className="text-sm opacity-75">Kilograms</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Materials Recorded</div>
            <div className="text-4xl font-bold mb-1">
              {Object.values(data).filter(v => v && parseFloat(v) > 0).length}
            </div>
            <div className="text-sm opacity-75">of {materialList.length} items</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Categories Active</div>
            <div className="text-4xl font-bold mb-1">
              {chartData.filter(c => c.total > 0).length}
            </div>
            <div className="text-sm opacity-75">of {Object.keys(materialsByCategory).length} categories</div>
          </div>
        </div>

        {/* Date Picker & Save */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-purple-600" size={24} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <Save size={20} />
              Save Data
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Data Entry Progress</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            {['Data Entry', 'Analytics', 'History'].map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-4 font-semibold transition ${
                  activeTab === idx
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Data Entry Tab */}
            {activeTab === 0 && (
              <div>
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search materials or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {filteredCategories.map(category => {
                  const categoryTotal = materialsByCategory[category].reduce((sum, item) => 
                    sum + (parseFloat(data[item.name]) || 0), 0
                  );
                  const isExpanded = expandedCategories[category];
                  
                  return (
                    <div key={category} className="mb-4 border-2 border-gray-100 rounded-xl overflow-hidden">
                      <div
                        onClick={() => toggleCategory(category)}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition flex justify-between items-center"
                        style={{
                          background: `linear-gradient(90deg, ${materialsByCategory[category][0].color}15 0%, transparent 100%)`
                        }}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                          <p className="text-sm text-gray-600">
                            {materialsByCategory[category].length} materials • {categoryTotal.toFixed(2)} kg
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {materialsByCategory[category].map(item => (
                            <div key={item.name} className="bg-white p-3 rounded-lg border border-gray-200">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {item.name}
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={data[item.name]}
                                  onChange={(e) => handleChange(item.name, e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  step="0.01"
                                  className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                                />
                                <span className="text-sm text-gray-500">kg</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Category-wise Distribution</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Proportion by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData.filter(d => d.total > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.category.substring(0, 8)}`}
                          outerRadius={100}
                          dataKey="total"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {historicalData.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">7-Day Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Previously Saved Entries</h3>
                {Object.keys(entries).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-500">No data saved yet. Start by entering today's data!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(entries)
                      .sort((a, b) => b.localeCompare(a))
                      .map((date) => {
                        const dateTotal = Object.entries(entries[date])
                          .reduce((sum, [, value]) => sum + (parseFloat(value) || 0), 0);
                        return (
                          <div key={date} className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg transition">
                            <div className="text-sm text-gray-500 mb-1">
                              {new Date(date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="text-green-500" size={20} />
                              <span className="text-3xl font-bold">{dateTotal.toFixed(2)} kg</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {Object.entries(entries[date]).filter(
                                ([, value]) => value && parseFloat(value) > 0
                              ).length} materials recorded
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDate(date);
                                  setActiveTab(0);
                                }}
                                className="flex-1 bg-purple-50 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-100 transition"
                              >
                                View/Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(date)}
                                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in">
          {notificationMessage}
        </div>
      )}
    </div>
  );
}