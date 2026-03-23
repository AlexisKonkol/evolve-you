import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { ArrowLeft, Sparkles, TrendingUp, Compass, Zap, Brain, Activity } from "lucide-react";

const energyData = [
  { day: "Mon", energy: 45, alignment: 30 },
  { day: "Tue", energy: 52, alignment: 40 },
  { day: "Wed", energy: 48, alignment: 35 },
  { day: "Thu", energy: 70, alignment: 60 },
  { day: "Fri", energy: 65, alignment: 55 },
  { day: "Sat", energy: 85, alignment: 80 },
  { day: "Sun", energy: 90, alignment: 85 },
];

const valuesData = [
  { subject: "Focus", A: 85, fullMark: 100 },
  { subject: "Energy", A: 65, fullMark: 100 },
  { subject: "Purpose", A: 90, fullMark: 100 },
  { subject: "Growth", A: 75, fullMark: 100 },
  { subject: "Action", A: 60, fullMark: 100 },
];

const insights = [
  {
    icon: <Sparkles className="w-4 h-4 text-[#A78BFA]" />,
    title: "High Alignment Detected",
    desc: "Your energy peaks consistently when focusing on creative problem-solving.",
  },
  {
    icon: <Zap className="w-4 h-4 text-[#2DD4BF]" />,
    title: "Action Gap",
    desc: "You have strong purpose clarity but lower action execution this week.",
  },
  {
    icon: <Brain className="w-4 h-4 text-[#6366F1]" />,
    title: "Cognitive Load",
    desc: "Consider taking a break to restore your decision-making capacity.",
  }
];

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#F5F7FB] pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 border-b border-indigo-500/10 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-400" />
          </button>
          <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase">
            Intelligence
          </div>
          <div className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-['Playfair_Display'] font-normal text-white mb-2">
          Your Analytics
        </h1>
        <p className="text-white/40 text-sm">
          Tracking your clarity, energy, and alignment over time.
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Hub Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-light text-white mb-1">84%</div>
            <div className="text-xs font-semibold tracking-wider text-white/40 uppercase">Clarity Score</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-light text-white mb-1">12</div>
            <div className="text-xs font-semibold tracking-wider text-white/40 uppercase">Session Streak</div>
          </div>
        </div>

        {/* Energy & Alignment Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold tracking-widest text-indigo-400 uppercase">Energy & Alignment</h2>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlignment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', zIndex: 100 }}
                  itemStyle={{ color: '#F5F7FB', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="energy" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
                <Area type="monotone" dataKey="alignment" stroke="#2DD4BF" strokeWidth={2} fillOpacity={1} fill="url(#colorAlignment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart & Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Core Values Radar */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold tracking-widest text-[#A78BFA] uppercase w-full mb-2">Core Pillars</h2>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={valuesData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="User" dataKey="A" stroke="#2DD4BF" strokeWidth={2} fill="#2DD4BF" fillOpacity={0.2} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F5F7FB', fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights List */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4 ml-1">AI Insights</h2>
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  {insight.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{insight.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
