import React, { useState, useEffect ,useCallback} from 'react';
import { Plus, Trash2, MapPin, TrendingUp, AlertCircle, CheckCircle, Mail, Lock, Eye, EyeOff, Copy, Check, RefreshCw,LogOut} from 'lucide-react';
import { useI18n } from "../i18n/I18nProvider";


export default function MRFDashboard() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMRF, setShowAddMRF] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  
  const [mrfs, setMrfs] = useState([
    {
      id: 1,
      name: 'Yedapadavu MRF',
      plantId: 'yedapadavu',
      email: 'yedapadavu.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Yed',
      location: 'Yedapadavu, Karnataka',
      capacity: 500,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Narikombu MRF',
      plantId: 'narikombu',
      email: 'narikombu.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Nar',
      location: 'Narikombu, Karnataka',
      capacity: 400,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Ujire MRF',
      plantId: 'ujire',
      email: 'ujire.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Uji',
      location: 'Ujire, Karnataka',
      capacity: 350,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Kedambadi MRF',
      plantId: 'kedambadi',
      email: 'kedambadi.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Ked',
      location: 'Kedambadi, Karnataka',
      capacity: 450,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-04-05'
    }
  ]);

  const [collections] = useState([
    { id: 1, mrfName: 'Yedapadavu MRF', type: 'Plastic', weight: 45, date: '2025-11-08', time: '09:30' },
    { id: 2, mrfName: 'Narikombu MRF', type: 'Paper', weight: 78, date: '2025-11-08', time: '10:15' },
    { id: 3, mrfName: 'Yedapadavu MRF', type: 'Metal', weight: 32, date: '2025-11-08', time: '11:00' },
    { id: 4, mrfName: 'Kedambadi MRF', type: 'Glass', weight: 56, date: '2025-11-08', time: '08:45' },
    { id: 5, mrfName: 'Ujire MRF', type: 'Plastic', weight: 41, date: '2025-11-07', time: '14:20' },
    { id: 6, mrfName: 'Narikombu MRF', type: 'Organic', weight: 92, date: '2025-11-07', time: '16:30' }
  ]);

  const [newMRF, setNewMRF] = useState({
    name: '',
    email: '',
    location: '',
    capacity: ''
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formStep, setFormStep] = useState(1);

  const fetchPlantData = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000";
    let url = `${API_BASE_URL}api/entries/aggregate-all-plants`;

    const params = new URLSearchParams();
    params.append('plants', 'yedapadavu,narikombu,ujire,kedambadi');
    console.log("🌐 Fetching:", `${url}?${params.toString()}`);

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("auth_token") || "",
      },
    });

    console.log("🔍 Response Status:", response.status);
    if (!response.ok) throw new Error(`Failed to fetch (status ${response.status})`);

    const data = await response.json();
    console.log("✅ Data:", data);
    setApiData(data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);


// Fetch data from API
  useEffect(() => {
    fetchPlantData();
  }, [fetchPlantData]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = 'MRF#';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const totalCapacity = mrfs.reduce((sum, mrf) => sum + mrf.capacity, 0);
  const totalLoad = mrfs.reduce((sum, mrf) => sum + mrf.currentLoad, 0);
  const totalCollections = collections.length;
  const operationalMRFs = mrfs.filter(m => m.status === 'operational').length;

  const handleNextStep = () => {
    if (newMRF.name && newMRF.email && newMRF.location && newMRF.capacity) {
      const password = generatePassword();
      setGeneratedPassword(password);
      setFormStep(2);
    }
  };

  const handleAddMRF = async () => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000";
    console.log("📡 Sending registration to:", `${API_BASE_URL}api/auth/register`);

    // Build payload for registration
    const registerPayload = {
      email: newMRF.email,
      name: newMRF.name,
      role: "mrf_operator", // ✅ required role
      password: generatedPassword,
    };

    // 1️⃣ Send registration request
    const response = await fetch(`${API_BASE_URL}api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerPayload),
    });

    // 2️⃣ Check for success
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed (${response.status}): ${errorText}`);
    }

    console.log("✅ MRF operator registered successfully!");

    // 3️⃣ Add MRF locally (UI update)
    const newId = Math.max(...mrfs.map((m) => m.id)) + 1;
    const newEntry = {
      id: newId,
      name: newMRF.name,
      email: newMRF.email,
      password: generatedPassword,
      location: newMRF.location,
      capacity: parseInt(newMRF.capacity),
      currentLoad: 0,
      status: "operational",
      collections: 0,
      lastCollection: "Never",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setMrfs((prev) => [...prev, newEntry]);

    // 4️⃣ Reset modal form
    setNewMRF({ name: "", email: "", location: "", capacity: "" });
    setGeneratedPassword("");
    setFormStep(1);
    setShowAddMRF(false);

    alert(`✅ ${newMRF.name} registered successfully as MRF Operator!`);
  } catch (error) {
    console.error("❌ Error registering MRF:", error);
    alert(`Error registering MRF: ${error.message}`);
  }
};


  const handleCloseModal = () => {
    setShowAddMRF(false);
    setNewMRF({ name: '', email: '', location: '', capacity: '' });
    setGeneratedPassword('');
    setFormStep(1);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(id);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteMRF = (id) => {
    if (window.confirm('Are you sure you want to delete this MRF facility?')) {
      setMrfs(mrfs.filter(mrf => mrf.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return 'bg-emerald-100 text-emerald-700';
      case 'maintenance': return 'bg-amber-100 text-amber-700';
      case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getLoadPercentage = (current, capacity) => {
    return ((current / capacity) * 100).toFixed(1);
  };

  const getLoadColor = (percentage) => {
    if (percentage >= 80) return 'bg-rose-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      'Plastic': 'bg-blue-100 text-blue-700',
      'Paper': 'bg-amber-100 text-amber-700',
      'Metal': 'bg-slate-100 text-slate-700',
      'Glass': 'bg-cyan-100 text-cyan-700',
      'Organic': 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <span className="text-3xl">🏛️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{t("zilla.title")}</h1>
                  <p className="text-slate-600">{t("zilla.subtitle")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">{t("zilla.dataRange")}</p>
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="text-sm font-semibold text-slate-800 border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">{t("zilla.today")}</option>
                  <option value="week">{t("zilla.week")}</option>
                  <option value="month">{t("zilla.month")}</option>
                </select>
              </div>
              <button
                onClick={fetchPlantData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                window.location.href = "/";
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>{t("actions.logout")}</span>
            </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="text-rose-600" size={18} />
              <p className="text-sm text-rose-800">Error loading data: {error}</p>
            </div>
          )}
          
          {apiData && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium">
                ✓ Showing data from {apiData.meta?.entriesCount || 0} entries
                {apiData.query?.dateKey && ` for ${apiData.query.dateKey}`}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {operationalMRFs}/{mrfs.length} {t("zilla.active")}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">{t("zilla.totalMRF")}</p>
            <p className="text-4xl font-bold text-slate-800">{mrfs.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Live Data
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">{t("zilla.totalCollections")}</p>
            <p className="text-4xl font-bold text-slate-800">{totalCollections}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {t("zilla.capacity")}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">{t("zilla.totalCapacity")}</p>
            <p className="text-4xl font-bold text-slate-800">{totalCapacity}<span className="text-xl text-slate-500">kg</span></p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${ 
                ((totalLoad / totalCapacity) * 100) > 70 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
              }`}>
                {((totalLoad / totalCapacity) * 100) > 70 ? t("zilla.high") : t("zilla.optimal")}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">{t("zilla.currentLoad")}</p>
            <p className="text-4xl font-bold text-slate-800">{totalLoad}<span className="text-xl text-slate-500">kg</span></p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-semibold border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t("zilla.tabFacilities")}
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`py-4 px-6 font-semibold border-b-2 transition-all ${
                  activeTab === 'collections'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t("zilla.tabCollections")}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t("zilla.registeredTitle")}</h2>
                    <p className="text-slate-600 text-sm mt-1">{t("zilla.registeredSubtitle")}</p>
                  </div>
                  <button
                    onClick={() => setShowAddMRF(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <Plus size={20} />
                    {t("zilla.registerMRF")}
                  </button>
                </div>

                {/* API Data Summary Cards */}
                {apiData && apiData.counts && apiData.counts.perPlant && Object.keys(apiData.counts.perPlant).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(apiData.counts.perPlant).map(([plantId, data]) => {
                      const totalWeight = Object.values(data).reduce((sum, val) => sum + val, 0);
                      const itemTypes = Object.keys(data).length;
                      return (
                        <div key={plantId} className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                          <h4 className="font-bold text-slate-800 capitalize mb-2">{plantId}</h4>
                          <p className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(1)} kg</p>
                          <p className="text-xs text-slate-600 mt-1">{itemTypes} waste categories</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Overall Summary */}
                {apiData && apiData.counts && apiData.counts.overall && Object.keys(apiData.counts.overall).length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t("zilla.overallBreakdown")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Object.entries(apiData.counts.overall).map(([wasteName, weight]) => (
                        <div key={wasteName} className="bg-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs text-slate-600 mb-1 truncate" title={wasteName}>{wasteName}</p>
                          <p className="text-lg font-bold text-blue-600">{weight} kg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {mrfs.map((mrf) => {
                    const loadPercentage = getLoadPercentage(mrf.currentLoad, mrf.capacity);
                    return (
                      <div key={mrf.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-800">{mrf.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mrf.status)}`}>
                                {mrf.status.charAt(0).toUpperCase() + mrf.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                              <p className="flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                {mrf.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400" />
                                {mrf.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMRF(mrf.id)}
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <div className="mb-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-700">{t("zilla.capacityUtil")}</span>
                                <span className="font-bold text-slate-800">{loadPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all ${getLoadColor(loadPercentage)}`}
                                  style={{ width: `${loadPercentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                {mrf.currentLoad}kg of {mrf.capacity}kg capacity used
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 md:justify-end items-center">
                            <div className="text-center">
                              <p className="text-xs text-slate-600 mb-1">{t("zilla.collections")}</p>
                              <p className="text-2xl font-bold text-slate-800">{mrf.collections}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 mb-1">{t("zilla.lastActive")}</p>
                              <p className="text-sm font-semibold text-slate-800">{mrf.lastCollection}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lock size={14} className="text-slate-400" />
                              <span className="text-xs text-slate-600">{t("zilla.loginCreds")}</span>
                              <span className="text-sm font-mono bg-white px-3 py-1 rounded border border-slate-200">
                                {showPassword[mrf.id] ? mrf.password : '••••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(mrf.id)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                {showPassword[mrf.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(mrf.password, mrf.id)}
                                className="text-slate-400 hover:text-blue-600 p-1"
                              >
                                {copiedPassword === mrf.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <span className="text-xs text-slate-500">{t("zilla.registeredOn")}: {mrf.createdDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'collections' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{t("zilla.collectionLogTitle")}</h2>
                  <p className="text-slate-600 text-sm mt-1">{t("zilla.collectionLogSubtitle")}</p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colId")}</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colFacility")}</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colCategory")}</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colWeight")}</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colDate")}</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">{t("zilla.colTime")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((collection, index) => (
                        <tr key={collection.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-6 text-slate-600 font-medium">#{collection.id.toString().padStart(4, '0')}</td>
                          <td className="py-4 px-6 text-slate-800 font-medium">{collection.mrfName}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getWasteTypeColor(collection.type)}`}>
                              {collection.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-800 font-bold">{collection.weight} kg</td>
                          <td className="py-4 px-6 text-slate-600">{collection.date}</td>
                          <td className="py-4 px-6 text-slate-600">{collection.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add MRF Modal */}
      {showAddMRF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {formStep === 1 ? (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                    <Plus className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t("zilla.modalRegisterTitle")}</h2>
                    <p className="text-slate-600 text-sm">{t("zilla.modalRegisterSubtitle")}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("zilla.facilityName")} *
                    </label>
                    <input
                      type="text"
                      value={newMRF.name}
                      onChange={(e) => setNewMRF({...newMRF, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., South Zone MRF"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("zilla.officialEmail")} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={newMRF.email}
                        onChange={(e) => setNewMRF({...newMRF, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="facility@zillapanchayat.gov"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("zilla.location")} *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={newMRF.location}
                        onChange={(e) => setNewMRF({...newMRF, location: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Zone E - Market Area"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("zilla.storageCapacity")} *
                    </label>
                    <input
                      type="number"
                      value={newMRF.capacity}
                      onChange={(e) => setNewMRF({...newMRF, capacity: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                  >
                    {t("zilla.cancel")}
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!newMRF.name || !newMRF.email || !newMRF.location || !newMRF.capacity}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("zilla.generateCreds")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-full mb-4">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("zilla.credsGenerated")}</h2>
                  <p className="text-slate-600">{t("zilla.credsSave")}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">{t("zilla.facilityNameUpper")}</p>
                      <p className="text-lg font-bold text-slate-800">{newMRF.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">{t("zilla.emailUpper")}</p>
                      <p className="text-sm font-mono text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">{newMRF.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">{t("zilla.autoPassUpper")}</p>
                      <div className="flex items-center gap-2">
                        <p className="flex-1 text-sm font-mono font-bold text-blue-600 bg-white px-3 py-2 rounded-lg border-2 border-blue-300">{generatedPassword}</p>
                        <button
                          onClick={() => copyToClipboard(generatedPassword, 'new')}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                        >
                          {copiedPassword === 'new' ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <p className="text-sm text-amber-800">
                      <strong>{t("zilla.important")}</strong> {t("zilla.importantMsg")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                  >
                    {t("zilla.cancel")}
                  </button>
                  <button
                    onClick={handleAddMRF}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
                  >
                    {t("zilla.completeRegistration")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}