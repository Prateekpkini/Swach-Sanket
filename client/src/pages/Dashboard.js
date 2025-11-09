// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";
// import { 
//   Calendar, 
//   TrendingUp, 
//   Save, 
//   Trash2, 
//   Search, 
//   X, 
//   LogOut, 
//   Plus,
//   Edit3,
//   Home,
//   Clock,
//   ArrowRight,
//   ChevronRight
// } from "lucide-react";

// const MATERIALS = [
//   { category: "Paper", items: ["News Paper", "White & colored paper", "Notebooks & other books", "Cardboard", "Plastic lined board/whiteboard"], color: "#8b5cf6" },
//   { category: "Plastic", items: ["PET bottle", "LDPE/HDPE carry bags", "Milk packets", "HDPE (shampoo bottles, cleaners)", "PVC (plumbing pipes)", "PP (Food containers)", "PP carry bags", "Laminates", "Tetra paks", "Thermocol/PS", "Paper cups/plates", "MLP"], color: "#3b82f6" },
//   { category: "Metal", items: ["Aluminium foils", "Aluminium/tin cans", "Other metals"], color: "#ef4444" },
//   { category: "Glass", items: ["Glass"], color: "#10b981" },
//   { category: "Rubber", items: ["Tyres", "Toys, gloves, others"], color: "#f59e0b" },
//   { category: "Textile", items: ["Textiles (clothes, bags, rags, etc.)"], color: "#ec4899" },
//   { category: "Ceramic", items: ["Ceramic (plates, cups, pots, etc.)"], color: "#14b8a6" },
//   { category: "Leather", items: ["Leather (belts, bags, tyres etc.)"], color: "#a855f7" },
//   { category: "Footwear", items: ["Sandals, shoes, etc."], color: "#6366f1" },
//   { category: "Fibrous organic", items: ["Coconut shells and husks"], color: "#84cc16" },
//   { category: "E-waste", items: ["All kinds of E-waste"], color: "#64748b" },
//   { category: "Others", items: ["Rejects (silt, hair, dust)"], color: "#78716c" },
// ];

// const flatMaterials = MATERIALS.flatMap(cat => 
//   cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
// );

// export default function Dashboard() {
//   const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  
//   const [view, setView] = useState("dashboard");
//   const [entries, setEntries] = useState({});
//   const [data, setData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [notification, setNotification] = useState({ show: false, message: "" });
//   const [mode, setMode] = useState("easy");
//   const [categoryIdx, setCategoryIdx] = useState(0);
//   const [itemIdx, setItemIdx] = useState(0);
//   const [inputValue, setInputValue] = useState("");

//   // Load data on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("mrf_data");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setEntries(parsed);
//       setData(parsed[today] || {});
//     }
//   }, [today]);

//   // Auto-save helper
//   const autoSave = useCallback((newData) => {
//     const updated = { ...entries, [today]: newData };
//     localStorage.setItem("mrf_data", JSON.stringify(updated));
//     setEntries(updated);
//   }, [entries, today]);

//   // Notifications
//   const notify = useCallback((message) => {
//     setNotification({ show: true, message });
//     setTimeout(() => setNotification({ show: false, message: "" }), 2500);
//   }, []);

//   // Handle value change
//   const updateValue = useCallback((name, value) => {
//     setData(prev => {
//       const updated = { ...prev, [name]: value };
//       autoSave(updated);
//       return updated;
//     });
//   }, [autoSave]);

//   // Easy mode navigation
//   const nextItem = useCallback(() => {
//     const currentCategory = MATERIALS[categoryIdx];
//     if (itemIdx < currentCategory.items.length - 1) {
//       setItemIdx(itemIdx + 1);
//     } else if (categoryIdx < MATERIALS.length - 1) {
//       setCategoryIdx(categoryIdx + 1);
//       setItemIdx(0);
//       notify(`✅ ${currentCategory.category} completed!`);
//     } else {
//       notify("🎉 All materials completed!");
//     }
//     setInputValue("");
//   }, [categoryIdx, itemIdx, notify]);

//   const saveAndNext = useCallback(() => {
//     const currentMaterial = MATERIALS[categoryIdx].items[itemIdx];
//     if (inputValue) {
//       updateValue(currentMaterial, inputValue);
//     }
//     nextItem();
//   }, [categoryIdx, itemIdx, inputValue, updateValue, nextItem]);

//   const skipItem = useCallback(() => {
//     nextItem();
//   }, [nextItem]);

//   // Delete entry
//   const deleteEntry = useCallback((date) => {
//     const updated = { ...entries };
//     delete updated[date];
//     localStorage.setItem("mrf_data", JSON.stringify(updated));
//     setEntries(updated);
//     notify("🗑️ Entry deleted");
//   }, [entries, notify]);

//   // Computed values
//   const stats = useMemo(() => {
//     const categoryTotals = {};
//     flatMaterials.forEach(({ name, category, color }) => {
//       const weight = parseFloat(data[name]) || 0;
//       if (!categoryTotals[category]) {
//         categoryTotals[category] = { total: 0, color };
//       }
//       categoryTotals[category].total += weight;
//     });
//     const chartData = Object.entries(categoryTotals).map(([category, { total, color }]) => ({
//       category, total, color
//     }));
//     const totalWeight = chartData.reduce((sum, item) => sum + item.total, 0);
//     const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;
//     return { chartData, totalWeight, filledCount };
//   }, [data]);

//   const historyData = useMemo(() => 
//     Object.keys(entries)
//       .sort()
//       .slice(-7)
//       .map(date => ({
//         date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         total: Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
//       }))
//   , [entries]);

//   const filteredMaterials = useMemo(() => {
//     if (!searchTerm) return flatMaterials;
//     const term = searchTerm.toLowerCase();
//     return flatMaterials.filter(m =>
//       m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)
//     );
//   }, [searchTerm]);

//   // Views
//   const DashboardView = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard 
//           label="Today's Total" 
//           value={stats.totalWeight.toFixed(2)} 
//           unit="kg"
//           gradient="from-purple-500 to-indigo-600"
//         />
//         <StatCard 
//           label="Materials Logged" 
//           value={stats.filledCount} 
//           unit={`of ${flatMaterials.length}`}
//           gradient="from-pink-500 to-rose-600"
//         />
//         <StatCard 
//           label="Total Entries" 
//           value={Object.keys(entries).length} 
//           unit="days"
//           gradient="from-cyan-500 to-blue-600"
//         />
//       </div>

//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-xl font-bold mb-4">Category Distribution</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={stats.chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="total" radius={[8, 8, 0, 0]}>
//               {stats.chartData.map((entry, idx) => (
//                 <Cell key={idx} fill={entry.color} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {historyData.length > 1 && (
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h3 className="text-xl font-bold mb-4">7-Day Trend</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={historyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );

//   const EntryView = () => {
//     const currentCategory = MATERIALS[categoryIdx];
//     const currentItem = currentCategory?.items[itemIdx];
//     const progress = categoryIdx === MATERIALS.length - 1 && itemIdx === currentCategory.items.length - 1
//       ? 100
//       : ((categoryIdx * 100 + (itemIdx / currentCategory.items.length) * 100) / MATERIALS.length);

//     return (
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-sm opacity-90">Recording for</div>
//               <div className="text-2xl md:text-3xl font-bold">
//                 {new Date(today).toLocaleDateString('en-US', { 
//                   weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
//                 })}
//               </div>
//             </div>
//             <Calendar size={40} className="opacity-80" />
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <div className="flex gap-2">
//             <button
//               onClick={() => setMode("easy")}
//               className={`flex-1 py-3 rounded-xl font-semibold transition ${
//                 mode === "easy" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               ⚡ Easy Entry
//             </button>
//             <button
//               onClick={() => setMode("all")}
//               className={`flex-1 py-3 rounded-xl font-semibold transition ${
//                 mode === "all" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               📝 View All
//             </button>
//           </div>
//         </div>

//         {mode === "easy" ? (
//           <>
//             <div className="bg-white rounded-2xl shadow-lg p-4">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-semibold">{currentCategory.category}</span>
//                 <span>{categoryIdx + 1} of {MATERIALS.length} categories</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="text-center mb-6">
//                 <div 
//                   className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
//                   style={{ backgroundColor: currentCategory.color }}
//                 >
//                   {itemIdx + 1}
//                 </div>
//                 <div className="text-sm text-gray-500 mb-1">{currentCategory.category}</div>
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{currentItem}</h2>
//               </div>

//               <div className="max-w-md mx-auto mb-6">
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && saveAndNext()}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     autoFocus
//                     className="w-full text-4xl md:text-5xl font-bold text-center border-4 border-purple-200 rounded-2xl px-6 py-6 focus:outline-none focus:border-purple-500"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">kg</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
//                 {[0.5, 1, 2, 5, 10, 20, 50, 100].map(num => (
//                   <button
//                     key={num}
//                     onClick={() => setInputValue(num.toString())}
//                     className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-3 rounded-xl transition"
//                   >
//                     {num}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex gap-3 max-w-md mx-auto">
//                 <button
//                   onClick={skipItem}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition"
//                 >
//                   Skip
//                 </button>
//                 <button
//                   onClick={saveAndNext}
//                   className="flex-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition flex items-center justify-center gap-2"
//                 >
//                   Next <ArrowRight size={20} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search materials..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white shadow-md"
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               )}
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredMaterials.map(({ name, category, color }) => (
//                   <div key={name} className="bg-gray-50 p-4 rounded-xl" style={{ borderLeft: `4px solid ${color}` }}>
//                     <div className="text-xs text-gray-500 mb-1">{category}</div>
//                     <label className="block text-sm font-semibold mb-2">{name}</label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="number"
//                         value={data[name] || ""}
//                         onChange={(e) => updateValue(name, e.target.value)}
//                         placeholder="0.00"
//                         min="0"
//                         step="0.01"
//                         className="flex-1 text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
//                       />
//                       <span className="text-sm text-gray-500">kg</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const HistoryView = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h3 className="text-2xl font-bold mb-6">Saved Entries</h3>
//       {Object.keys(entries).length === 0 ? (
//         <div className="text-center py-16">
//           <div className="text-6xl mb-4">📊</div>
//           <p className="text-xl text-gray-500 mb-4">No entries yet</p>
//           <button
//             onClick={() => setView("entry")}
//             className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
//           >
//             Start Entering Data
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Object.keys(entries).sort((a, b) => b.localeCompare(a)).map((date) => {
//             const total = Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
//             const count = Object.values(entries[date]).filter(v => v && parseFloat(v) > 0).length;
//             return (
//               <div key={date} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition">
//                 <div className="text-sm text-gray-500 mb-2">
//                   {new Date(date).toLocaleDateString('en-US', { 
//                     weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
//                   })}
//                 </div>
//                 <div className="flex items-baseline gap-2 mb-3">
//                   <span className="text-4xl font-bold">{total.toFixed(2)}</span>
//                   <span className="text-lg text-gray-500">kg</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">{count} materials</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => { setView("entry"); }}
//                     className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
//                   >
//                     <Edit3 size={16} /> Edit
//                   </button>
//                   <button
//                     onClick={() => deleteEntry(date)}
//                     className="bg-red-50 text-red-600 px-4 rounded-xl hover:bg-red-100"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
//         <div className="container mx-auto px-4 md:px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">MRF Dashboard</h1>
//               <p className="text-purple-100 text-xs md:text-sm">Zilla Panchayat Material Recovery</p>
//             </div>
//             <button 
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.reload();
//               }}
//               className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2"
//             >
//               <LogOut size={18} />
//               <span className="hidden md:inline">Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <nav className="bg-white shadow-md sticky top-[72px] md:top-[88px] z-40">
//         <div className="container mx-auto px-4 md:px-6 flex">
//           {[
//             { id: "dashboard", icon: Home, label: "Dashboard" },
//             { id: "entry", icon: Plus, label: "Entry" },
//             { id: "history", icon: Clock, label: "History" }
//           ].map(({ id, icon: Icon, label }) => (
//             <button
//               key={id}
//               onClick={() => setView(id)}
//               className={`flex-1 py-3 md:py-4 font-semibold transition flex items-center justify-center gap-2 ${
//                 view === id ? 'text-purple-600 border-b-4 border-purple-600' : 'text-gray-600'
//               }`}
//             >
//               <Icon size={18} />
//               <span className="text-sm md:text-base">{label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>

//       <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
//         {view === "dashboard" && <DashboardView />}
//         {view === "entry" && <EntryView />}
//         {view === "history" && <HistoryView />}
//       </main>

//       {notification.show && (
//         <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in">
//           {notification.message}
//         </div>
//       )}
//     </div>
//   );
// }

// const StatCard = ({ label, value, unit, gradient }) => (
//   <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6`}>
//     <div className="text-sm opacity-90 mb-2">{label}</div>
//     <div className="text-4xl md:text-5xl font-bold mb-1">{value}</div>
//     <div className="text-sm opacity-75">{unit}</div>
//   </div>
// );

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell
} from "recharts";
import {
  Calendar, Search, X, Clock, Home, Plus,
  LogOut, Trash2, CheckCircle, Eye
} from "lucide-react";

import {
  getEntryByDate,
  upsertEntry,
  deleteEntryByDate,
  getEntriesHistory,
} from "../services/entriesService";

// -------------------- Static Material Data --------------------
const MATERIALS = [
  { category: "Paper", items: ["News Paper", "White & colored paper", "Notebooks & other books", "Cardboard", "Plastic lined board/whiteboard"], color: "#8b5cf6" },
  { category: "Plastic", items: ["PET bottle", "LDPE/HDPE carry bags", "Milk packets", "HDPE (shampoo bottles, cleaners)", "PVC (plumbing pipes)", "PP (Food containers)", "PP carry bags", "Laminates", "Tetra paks", "Thermocol/PS", "Paper cups/plates", "MLP"], color: "#3b82f6" },
  { category: "Metal", items: ["Aluminium foils", "Aluminium/tin cans", "Other metals"], color: "#ef4444" },
  { category: "Glass", items: ["Glass"], color: "#10b981" },
  { category: "Rubber", items: ["Tyres", "Toys, gloves, others"], color: "#f59e0b" },
  { category: "Textile", items: ["Textiles (clothes, bags, rags, etc.)"], color: "#ec4899" },
  { category: "Ceramic", items: ["Ceramic (plates, cups, pots, etc.)"], color: "#14b8a6" },
  { category: "Leather", items: ["Leather (belts, bags, tyres etc.)"], color: "#a855f7" },
  { category: "Footwear", items: ["Sandals, shoes, etc."], color: "#6366f1" },
  { category: "Fibrous organic", items: ["Coconut shells and husks"], color: "#84cc16" },
  { category: "E-waste", items: ["All kinds of E-waste"], color: "#64748b" },
  { category: "Others", items: ["Rejects (silt, hair, dust)"], color: "#78716c" },
];

const flatMaterials = MATERIALS.flatMap(cat =>
  cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
);

// -------------------- Main Component --------------------
export default function Dashboard() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [view, setView] = useState("dashboard");
  const [entries, setEntries] = useState({});
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ✅ Notification helper
  const notify = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  }, []);

  // 🚀 Fetch data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const todayEntry = await getEntryByDate(today);
        const historyList = await getEntriesHistory(30);
        const todayData = todayEntry?.data || {};

        setData(todayData);
        setOriginalData(todayData);

        const entriesMap = {};
        historyList.forEach((e) => {
          if (e.dateKey && e.data && Object.keys(e.data).length > 0) {
            entriesMap[e.dateKey] = e.data;
          }
        });

        if (Object.keys(todayData).length > 0) entriesMap[today] = todayData;

        setEntries(entriesMap);
      } catch (err) {
        console.error("Error fetching entries:", err);
        notify("❌ Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [today, notify]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [data, originalData]);

  // Update value handler
  const updateValue = useCallback((name, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    setData(prev => ({
      ...prev,
      [name]: value === "" ? "" : (isNaN(numericValue) ? 0 : numericValue),
    }));
  }, []);

  // Submit handler
  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit the data?")) return;

    setSaving(true);
    try {
      const cleanedData = {};
      Object.keys(data).forEach(key => {
        const val = parseFloat(data[key]);
        if (!isNaN(val) && val > 0) cleanedData[key] = val;
      });

      await upsertEntry(today, cleanedData);
      setOriginalData(cleanedData);
      setData(cleanedData);
      setEntries(prev => ({ ...prev, [today]: cleanedData }));
      notify("✅ Data saved successfully!", "success");
      setHasUnsavedChanges(false);
      setTimeout(() => setView("dashboard"), 1000);
    } catch (err) {
      console.error("Save failed:", err);
      notify("❌ Save failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = useCallback(async (date) => {
    if (!window.confirm(`Delete entry for ${new Date(date).toLocaleDateString()}?`)) return;
    try {
      await deleteEntryByDate(date);
      const updated = { ...entries };
      delete updated[date];
      setEntries(updated);
      notify("🗑️ Entry deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      notify("❌ Delete failed", "error");
    }
  }, [entries, notify]);

  // Stats calculations
  const stats = useMemo(() => {
    const categoryTotals = {};
    flatMaterials.forEach(({ name, category, color }) => {
      const weight = parseFloat(data[name]) || 0;
      if (!categoryTotals[category]) categoryTotals[category] = { total: 0, color };
      categoryTotals[category].total += weight;
    });

    const chartData = Object.entries(categoryTotals)
      .map(([category, { total, color }]) => ({ category, total, color }))
      .filter(item => item.total > 0);

    const totalWeight = chartData.reduce((sum, i) => sum + i.total, 0);
    const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;

    return { chartData, totalWeight, filledCount };
  }, [data]);

  const historyData = useMemo(() => {
    const sortedDates = Object.keys(entries).sort();
    return sortedDates.slice(-7).map(date => {
      const entryData = entries[date] || {};
      const total = Object.values(entryData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total,
      };
    });
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">MRF Dashboard</h1>
            <p className="text-purple-100 text-xs md:text-sm">Zilla Panchayat Material Recovery</p>
          </div>
          <button
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Proceed to logout?")) return;
              localStorage.removeItem("auth_token");
              window.location.href = "/";
            }}
            className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-white shadow-md sticky top-[64px] md:top-[72px] z-40">
        <div className="flex">
          {[{ id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "entry", icon: Plus, label: "Entry" },
            { id: "history", icon: Clock, label: "History" }].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                if (hasUnsavedChanges && view === "entry" && id !== "entry") {
                  if (!window.confirm("You have unsaved changes. Discard them?")) return;
                }
                setView(id);
              }}
              className={`flex-1 py-3 md:py-4 font-semibold flex items-center justify-center gap-2 ${
                view === id ? "text-purple-600 border-b-4 border-purple-600" : "text-gray-600"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm md:text-base">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {view === "dashboard" && <DashboardView stats={stats} historyData={historyData} entries={entries} flatMaterials={flatMaterials} />}
        {view === "entry" && (
          <EntryView
            MATERIALS={MATERIALS}
            data={data}
            updateValue={updateValue}
            handleSubmit={handleSubmit}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            saving={saving}
            hasUnsavedChanges={hasUnsavedChanges}
            today={today}
          />
        )}
        {view === "history" && (
          <HistoryView entries={entries} handleDelete={handleDelete} setView={setView} today={today} />
        )}
      </main>

      {notification.show && (
        <div
          className={`fixed bottom-6 right-6 ${
            notification.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-green-500 to-emerald-600"
          } text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

const DashboardView = ({ stats, historyData, entries, flatMaterials }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label="Today's Total" value={stats.totalWeight.toFixed(2)} unit="kg" gradient="from-purple-500 to-indigo-600" />
      <StatCard label="Materials Logged" value={stats.filledCount} unit={`of ${flatMaterials.length}`} gradient="from-pink-500 to-rose-600" />
      <StatCard label="Total Days" value={Object.keys(entries).length} unit="recorded" gradient="from-cyan-500 to-blue-600" />
    </div>

    {stats.chartData.length > 0 && (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Today's Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {stats.chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}

    {historyData.length > 1 && (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">7-Day Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}

    {stats.totalWeight === 0 && (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No data for today</h3>
        <p className="text-gray-500 mb-6">Start by entering material weights for today</p>
      </div>
    )}
  </div>
);

const StatCard = ({ label, value, unit, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6`}>
    <div className="text-sm opacity-90 mb-2">{label}</div>
    <div className="text-4xl md:text-5xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-75">{unit}</div>
  </div>
);

const EntryView = ({ MATERIALS, data, updateValue, handleSubmit, searchTerm, setSearchTerm, saving, hasUnsavedChanges, today }) => {
  const [viewMode, setViewMode] = useState("table");
  const inputRefs = React.useRef({});
  
  const flatMaterials = MATERIALS.flatMap(cat =>
    cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
  );

  const filteredMaterials = useMemo(() => {
    if (!searchTerm) return flatMaterials;
    const term = searchTerm.toLowerCase();
    return flatMaterials.filter(m =>
      m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)
    );
  }, [searchTerm, flatMaterials]);

  const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;
  const totalCount = flatMaterials.length;
  const progress = (filledCount / totalCount) * 100;

  const handleKeyDown = (e, currentName) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = filteredMaterials.findIndex(m => m.name === currentName);
      if (currentIndex < filteredMaterials.length - 1) {
        const nextName = filteredMaterials[currentIndex + 1].name;
        inputRefs.current[nextName]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = filteredMaterials.findIndex(m => m.name === currentName);
      if (currentIndex > 0) {
        const prevName = filteredMaterials[currentIndex - 1].name;
        inputRefs.current[prevName]?.focus();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90">Recording for</div>
            <div className="text-2xl md:text-3xl font-bold">
              {new Date(today).toLocaleDateString('en-US', { 
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </div>
          </div>
          <Calendar size={40} className="opacity-80" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{filledCount} of {totalCount} materials</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white shadow-md"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={20} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 bg-white rounded-xl shadow-md p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "table" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📊 Table View
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "cards" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🎴 Card View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No materials found matching "{searchTerm}"
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">S.No</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Material Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map(({ name, category, color }, index) => (
                  <tr 
                    key={name} 
                    className={`border-b hover:bg-gray-50 transition ${
                      data[name] && parseFloat(data[name]) > 0 ? 'bg-green-50' : ''
                    }`}
                    style={{ borderLeft: `4px solid ${color}` }}
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-500">{category}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                    <td className="px-4 py-3">
                      <input
                        ref={el => inputRefs.current[name] = el}
                        type="number"
                        value={data[name] || ""}
                        onChange={(e) => updateValue(name, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, name)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full text-right text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right text-gray-700">
                    Total Weight:
                  </td>
                  <td className="px-4 py-4 text-right text-purple-600 text-xl">
                    {Object.values(data).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} kg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map(({ name, category, color }) => (
              <div key={name} className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="text-xs text-gray-500 mb-1">{category}</div>
                <label className="block text-sm font-semibold mb-2">{name}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={data[name] || ""}
                    onChange={(e) => updateValue(name, e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-sm text-gray-500 font-medium">kg</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewMode === "table" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Excel-like shortcuts:</strong> Press <kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> or 
            <kbd className="px-2 py-1 bg-white rounded border ml-1">↓</kbd> to move to next row, 
            <kbd className="px-2 py-1 bg-white rounded border ml-1">↑</kbd> to move up
          </p>
        </div>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 to-transparent pt-6 pb-4">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={saving || !hasUnsavedChanges}
            className={`flex-1 ${
              saving || !hasUnsavedChanges
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl"
            } text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Submit & Save
              </>
            )}
          </button>
        </div>
        {!hasUnsavedChanges && (
          <p className="text-center text-sm text-gray-500 mt-2">No changes to save</p>
        )}
      </div>
    </div>
  );
};

const HistoryView = ({ entries, handleDelete, setView, today }) => {
  return (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">Saved Entries</h3>
      <div className="text-sm text-gray-500">
        Total: {Object.keys(entries).length} entries
      </div>
    </div>
    {Object.keys(entries).length === 0 ? (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-xl text-gray-500 mb-4">No entries yet</p>
        <button
          onClick={() => setView("entry")}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Start Entering Data
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(entries)
          .sort((a, b) => b.localeCompare(a))
          .map((date) => {
            const total = Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
            const count = Object.values(entries[date]).filter((v) => v && parseFloat(v) > 0).length;
            const isToday = date === today;
            
            return (
              <div
                key={date}
                className={`bg-gradient-to-br from-white to-gray-50 border-2 ${
                  isToday ? "border-purple-300" : "border-gray-100"
                } rounded-2xl p-6 hover:shadow-xl transition`}
              >
                {isToday && (
                  <div className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    Today
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold">{total.toFixed(2)}</span>
                  <span className="text-lg text-gray-500">kg</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{count} materials logged</p>
                <div className="flex gap-2">
                  {isToday ? (
                    <button
                      onClick={() => setView("entry")}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2 transition"
                    >
                      <Plus size={16} /> Edit Today
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      disabled
                      title="Can only edit today's entry"
                    >
                      <Eye size={16} /> View Only
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(date)}
                    className="bg-red-50 text-red-600 px-4 rounded-xl hover:bg-red-100 transition"
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    )}
  </div>
);};