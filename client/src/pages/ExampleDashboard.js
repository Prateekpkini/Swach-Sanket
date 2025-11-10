import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  Zap,
  BarChart3,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Example Dashboard Component
 * 
 * A clean, modern dashboard example with:
 * - Stat cards with icons and growth indicators
 * - Multiple chart types (Bar, Line, Pie)
 * - Responsive design (mobile-friendly)
 * - Mock data for demonstration
 * 
 * USAGE:
 * 1. Access at: http://localhost:3000/example-dashboard
 * 2. Replace mock data with real API calls
 * 3. Customize colors, labels, and metrics to fit your needs
 * 
 * TO INTEGRATE REAL DATA:
 * - Replace the mock data with useEffect + API calls
 * - Use your existing services (e.g., entriesService, api.js)
 * - Update the stats and chart data based on your backend
 */
export default function ExampleDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dashboardRef = useRef(null);

  // Mock data - replace with real API calls
  const stats = useMemo(() => ({
    totalRevenue: 125430,
    totalUsers: 2847,
    activeUsers: 1243,
    growthRate: 12.5,
    avgRevenuePerUser: 44.08,
    conversionRate: 3.2,
    retentionRate: 87.5,
    topCategory: "Category A",
  }), []);

  // Calculate insights and highlights
  const highlights = useMemo(() => [
    {
      icon: TrendingUp,
      title: "Strong Growth Trajectory",
      description: `Revenue increased by ${stats.growthRate}% compared to last period, indicating healthy business expansion.`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "User Engagement Up",
      description: `Active user rate at ${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%, showing strong platform engagement.`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: DollarSign,
      title: "Revenue Per User",
      description: `Average revenue per user is $${stats.avgRevenuePerUser.toFixed(2)}, demonstrating strong monetization.`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Target,
      title: "High Retention",
      description: `${stats.retentionRate}% user retention rate indicates excellent product-market fit.`,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ], [stats]);

  const keyPoints = useMemo(() => [
    {
      type: "success",
      text: `Total revenue reached $${stats.totalRevenue.toLocaleString()} with ${stats.growthRate}% growth`,
    },
    {
      type: "info",
      text: `${stats.activeUsers.toLocaleString()} active users out of ${stats.totalUsers.toLocaleString()} total users`,
    },
    {
      type: "success",
      text: `${stats.topCategory} is the top-performing category with highest engagement`,
    },
    {
      type: "warning",
      text: `Conversion rate at ${stats.conversionRate}% - opportunity to optimize funnel`,
    },
    {
      type: "success",
      text: `User retention rate of ${stats.retentionRate}% exceeds industry average`,
    },
    {
      type: "info",
      text: `Average revenue per user increased by 8.2% compared to previous period`,
    },
  ], [stats]);

  const recommendations = useMemo(() => [
    "Focus marketing efforts on Category A to maximize revenue potential",
    "Implement user onboarding improvements to increase conversion rate",
    "Launch retention campaigns to maintain high user engagement",
    "Explore expansion opportunities in underperforming categories",
    "Consider premium features to increase average revenue per user",
  ], []);

  // Mock chart data
  const revenueData = [
    { month: "Jan", revenue: 4000, profit: 2400 },
    { month: "Feb", revenue: 3000, profit: 1398 },
    { month: "Mar", revenue: 2000, profit: 9800 },
    { month: "Apr", revenue: 2780, profit: 3908 },
    { month: "May", revenue: 1890, profit: 4800 },
    { month: "Jun", revenue: 2390, profit: 3800 },
  ];

  const categoryData = [
    { name: "Category A", value: 400, color: "#8b5cf6" },
    { name: "Category B", value: 300, color: "#3b82f6" },
    { name: "Category C", value: 200, color: "#10b981" },
    { name: "Category D", value: 100, color: "#f59e0b" },
  ];

  const trendData = [
    { date: "Mon", value: 400 },
    { date: "Tue", value: 300 },
    { date: "Wed", value: 500 },
    { date: "Thu", value: 450 },
    { date: "Fri", value: 600 },
    { date: "Sat", value: 550 },
    { date: "Sun", value: 700 },
  ];

  // Helper function to convert SVG to image
  const svgToImage = (svgElement) => {
    return new Promise((resolve) => {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = url;
    });
  };

  // Helper function to capture chart container
  const captureChartContainer = async (container) => {
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 10000,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing chart:", error);
      return null;
    }
  };

  // PDF Generation Function
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // Wait for all charts to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Initialize PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      let yPos = 20;

      // Add title page
      pdf.setFontSize(24);
      pdf.text("Dashboard Report", pdfWidth / 2, yPos, { align: "center" });
      yPos += 10;
      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pdfWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 7;
      pdf.text(
        `Period: ${selectedPeriod === "7d" ? "7 Days" : selectedPeriod === "30d" ? "30 Days" : selectedPeriod === "90d" ? "90 Days" : "1 Year"}`,
        pdfWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 15;

      // Add summary stats
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("Summary Statistics", 20, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text(`Total Revenue: $${stats.totalRevenue.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`Total Users: ${stats.totalUsers.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`Active Users: ${stats.activeUsers.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`Growth Rate: ${stats.growthRate}%`, 20, yPos);
      yPos += 6;
      pdf.text(`Avg Revenue Per User: $${stats.avgRevenuePerUser.toFixed(2)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Conversion Rate: ${stats.conversionRate}%`, 20, yPos);
      yPos += 6;
      pdf.text(`Retention Rate: ${stats.retentionRate}%`, 20, yPos);
      yPos += 10;

      // Add Summary Highlights
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("Summary Highlights", 20, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      highlights.forEach((highlight, idx) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text(`${idx + 1}. ${highlight.title}`, 20, yPos);
        yPos += 7;
        pdf.setFont(undefined, "normal");
        pdf.setFontSize(9);
        const lines = pdf.splitTextToSize(highlight.description, pdfWidth - 40);
        lines.forEach((line) => {
          pdf.text(line, 25, yPos);
          yPos += 5;
        });
        yPos += 3;
      });

      // Add Key Points
      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("Key Points", 20, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      keyPoints.forEach((point) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${point.text}`, 20, yPos);
        yPos += 7;
      });

      // Add Performance Metrics
      if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("Performance Metrics", 20, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      
      // User Engagement Metrics
      pdf.setFont(undefined, "bold");
      pdf.text("User Engagement:", 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, "normal");
      pdf.text(`  Active Rate: ${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`, 20, yPos);
      yPos += 6;
      pdf.text(`  Retention Rate: ${stats.retentionRate}%`, 20, yPos);
      yPos += 6;
      pdf.text(`  Conversion Rate: ${stats.conversionRate}%`, 20, yPos);
      yPos += 8;
      
      // Revenue Metrics
      pdf.setFont(undefined, "bold");
      pdf.text("Revenue Metrics:", 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, "normal");
      pdf.text(`  Total Revenue: $${stats.totalRevenue.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`  Revenue per User: $${stats.avgRevenuePerUser.toFixed(2)}`, 20, yPos);
      yPos += 6;
      pdf.text(`  Growth Rate: ${stats.growthRate}%`, 20, yPos);
      yPos += 8;
      
      // User Base Metrics
      pdf.setFont(undefined, "bold");
      pdf.text("User Base:", 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, "normal");
      pdf.text(`  Total Users: ${stats.totalUsers.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`  Active Users: ${stats.activeUsers.toLocaleString()}`, 20, yPos);
      yPos += 6;
      pdf.text(`  Top Category: ${stats.topCategory}`, 20, yPos);
      yPos += 8;

      // Add Recommendations
      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("Recommendations", 20, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      recommendations.forEach((rec, idx) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`${idx + 1}. ${rec}`, 20, yPos);
        yPos += 7;
      });

      // Capture and add charts individually
      const chartContainers = dashboardRef.current.querySelectorAll('[class*="recharts"]');
      const chartCards = dashboardRef.current.querySelectorAll('.bg-white.rounded-2xl.shadow-lg');

      if (chartContainers.length > 0 || chartCards.length > 0) {
        // Add section header for charts
        if (yPos > 220) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(14);
        pdf.setFont(undefined, "bold");
        pdf.text("Dashboard Charts & Visualizations", 20, yPos);
        yPos += 10;

        // Capture each chart card individually
        for (let i = 0; i < chartCards.length; i++) {
          const card = chartCards[i];
          const titleElement = card.querySelector('h3');
          const chartTitle = titleElement ? titleElement.textContent : `Chart ${i + 1}`;
          
          // Check if this card contains a chart
          const hasChart = card.querySelector('svg') || card.querySelector('[class*="recharts"]');
          if (!hasChart) continue;

          // Check if we need a new page
          if (yPos > 200) {
            pdf.addPage();
            yPos = 20;
          }

          // Add chart title
          pdf.setFontSize(11);
          pdf.setFont(undefined, "bold");
          pdf.text(chartTitle, 20, yPos);
          yPos += 8;

          // Capture the chart card
          try {
            const chartImage = await captureChartContainer(card);
            if (chartImage) {
              const img = new Image();
              img.src = chartImage;
              await new Promise((resolve) => {
                img.onload = () => {
                  const imgWidth = img.width;
                  const imgHeight = img.height;
                  const maxWidth = pdfWidth - 40; // Leave margins
                  const maxHeight = pdfHeight - yPos - 20; // Leave space at bottom
                  const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                  const scaledWidth = imgWidth * ratio;
                  const scaledHeight = imgHeight * ratio;

                  // If chart is too tall, add to new page
                  if (scaledHeight > maxHeight) {
                    pdf.addPage();
                    yPos = 20;
                    const newRatio = Math.min(maxWidth / imgWidth, (pdfHeight - 40) / imgHeight);
                    pdf.addImage(chartImage, "PNG", 20, yPos, imgWidth * newRatio, imgHeight * newRatio);
                    yPos += imgHeight * newRatio + 10;
                  } else {
                    pdf.addImage(chartImage, "PNG", 20, yPos, scaledWidth, scaledHeight);
                    yPos += scaledHeight + 10;
                  }
                  resolve();
                };
              });
            }
          } catch (error) {
            console.error(`Error capturing chart ${i + 1}:`, error);
            pdf.setFontSize(9);
            pdf.setFont(undefined, "normal");
            pdf.text(`Chart "${chartTitle}" could not be captured`, 20, yPos);
            yPos += 10;
          }
        }
      }

      // Also capture the entire dashboard as a fallback
      if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Complete Dashboard View", 20, yPos);
      yPos += 10;

      // Create a container for the full dashboard
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.width = "1200px";
      pdfContainer.style.backgroundColor = "#f9fafb";
      pdfContainer.style.padding = "40px";

      const clonedContent = dashboardRef.current.cloneNode(true);
      const buttons = clonedContent.querySelectorAll("button");
      buttons.forEach((btn) => (btn.style.display = "none"));

      pdfContainer.appendChild(clonedContent);
      document.body.appendChild(pdfContainer);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const fullCanvas = await html2canvas(pdfContainer, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb",
        allowTaint: true,
      });

      document.body.removeChild(pdfContainer);

      const fullImgData = fullCanvas.toDataURL("image/png");
      const fullImgWidth = fullCanvas.width;
      const fullImgHeight = fullCanvas.height;
      const maxWidth = pdfWidth - 40;
      const maxHeight = pdfHeight - yPos - 20;
      const fullRatio = Math.min(maxWidth / fullImgWidth, maxHeight / fullImgHeight);
      const scaledFullWidth = fullImgWidth * fullRatio;
      const scaledFullHeight = fullImgHeight * fullRatio;

      // Add full dashboard image (may span multiple pages)
      if (scaledFullHeight > maxHeight) {
        // Split across pages
        let heightLeft = scaledFullHeight;
        let sourceY = 0;
        let currentY = yPos;
        
        while (heightLeft > 0) {
          if (currentY + Math.min(heightLeft, pdfHeight - currentY - 10) > pdfHeight - 10) {
            pdf.addPage();
            currentY = 20;
          }
          
          const sliceHeight = Math.min(heightLeft, pdfHeight - currentY - 10);
          const sourceHeight = (sliceHeight / fullRatio);
          
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = fullCanvas.width;
          sliceCanvas.height = sourceHeight;
          const sliceCtx = sliceCanvas.getContext("2d");
          sliceCtx.drawImage(
            fullCanvas,
            0, sourceY, fullCanvas.width, sourceHeight,
            0, 0, fullCanvas.width, sourceHeight
          );

          const sliceData = sliceCanvas.toDataURL("image/png");
          pdf.addImage(sliceData, "PNG", 20, currentY, scaledFullWidth, sliceHeight);

          heightLeft -= sliceHeight;
          sourceY += sourceHeight;
          currentY += sliceHeight;
        }
      } else {
        pdf.addImage(fullImgData, "PNG", 20, yPos, scaledFullWidth, scaledFullHeight);
      }

      // Save the PDF
      const fileName = `Dashboard_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" ref={dashboardRef}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        {["7d", "30d", "90d", "1y"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "1 Year"}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={+stats.growthRate}
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={+8.2}
          gradient="from-blue-500 to-cyan-600"
        />
        <StatCard
          icon={Activity}
          label="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change={+15.3}
          gradient="from-purple-500 to-indigo-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Growth Rate"
          value={`${stats.growthRate}%`}
          change={+2.4}
          gradient="from-pink-500 to-rose-600"
        />
      </div>

      {/* Summary Highlights */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Summary Highlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className={`${highlight.bgColor} rounded-xl p-6 border-l-4 border-purple-600`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-white ${highlight.color}`}>
                  <highlight.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-gray-700 text-sm">{highlight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Key Points</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    point.type === "success"
                      ? "text-green-600"
                      : point.type === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                />
                <p className="text-gray-700 text-sm">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <ChartCard title="Revenue & Profit Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Trend Chart */}
        <ChartCard title="Weekly Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Recent Activity">
          <div className="space-y-4">
            {[
              { action: "New user registered", time: "2 minutes ago", type: "success" },
              { action: "Payment received", time: "15 minutes ago", type: "success" },
              { action: "Order completed", time: "1 hour ago", type: "info" },
              { action: "System update", time: "2 hours ago", type: "info" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">User Engagement</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="Active Rate" value={`${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`} />
              <MetricItem label="Retention Rate" value={`${stats.retentionRate}%`} />
              <MetricItem label="Conversion Rate" value={`${stats.conversionRate}%`} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Revenue Metrics</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} />
              <MetricItem label="Revenue/User" value={`$${stats.avgRevenuePerUser.toFixed(2)}`} />
              <MetricItem label="Growth Rate" value={`${stats.growthRate}%`} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">User Base</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="Total Users" value={stats.totalUsers.toLocaleString()} />
              <MetricItem label="Active Users" value={stats.activeUsers.toLocaleString()} />
              <MetricItem label="Top Category" value={stats.topCategory} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-gray-700 flex-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Item Component
 */
function MetricItem({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ icon: Icon, label, value, change, gradient }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

/**
 * Chart Card Wrapper Component
 */
function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

