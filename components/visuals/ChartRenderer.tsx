import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LabelList
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Target, Clock, List, 
  CheckCircle2, Globe, Package, BarChart3, Lightbulb, Activity
} from 'lucide-react';
import { VisualType, DataPoint } from '../../types';

interface ChartRendererProps {
  type: VisualType;
  data: DataPoint[];
  visualSymbol?: string;
  colorTheme?: string;
}

// --- RICH COLOR PALETTES ---
// Designed to be vivid and varied, avoiding "single color" monotony.
const PALETTES: Record<string, string[]> = {
  indigo:  ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#3b82f6'], // Tech: Indigo, Purple, Cyan, Pink, Blue
  emerald: ['#10b981', '#f59e0b', '#06b6d4', '#84cc16', '#059669'], // Money: Green, Amber, Cyan, Lime, DarkGreen
  rose:    ['#f43f5e', '#f97316', '#a855f7', '#e11d48', '#db2777'], // Urgent: Rose, Orange, Purple, Red, Pink
  amber:   ['#f59e0b', '#ef4444', '#84cc16', '#eab308', '#d97706'], // Warning: Amber, Red, Lime, Yellow, Orange
  cyan:    ['#06b6d4', '#3b82f6', '#8b5cf6', '#14b8a6', '#0ea5e9'], // Clean: Cyan, Blue, Purple, Teal, Sky
  default: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'], // Mixed
};

// Helper to get theme base props
const getThemeProps = (themeName: string) => {
  const colors = PALETTES[themeName] || PALETTES['default'];
  return {
    colors,
    primary: colors[0],
    bgGradient: `from-${themeName}-50 to-white`
  };
};

// --- ICON MAPPING ---
const ICON_MAP: Record<string, React.ElementType> = {
  trend_up: TrendingUp,
  trend_down: TrendingDown,
  users: Users,
  money: DollarSign,
  target: Target,
  time: Clock,
  list: List,
  check: CheckCircle2,
  global: Globe,
  product: Package,
  chart: BarChart3,
  idea: Lightbulb,
};

// Helper to darken a hex color for 3D shading
const darkenColor = (col: string, amt: number) => {
  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, visualSymbol = 'chart', colorTheme = 'indigo' }) => {
  const { colors } = getThemeProps(colorTheme);
  const IconComponent = ICON_MAP[visualSymbol] || Activity;

  // Sanitize data for Recharts
  const chartData = data.map((d, i) => ({
    name: d.label,
    value: parseFloat(d.value.toString().replace(/[^0-9.-]+/g, "")) || 0,
    originalValue: d.value,
    color: colors[i % colors.length], // Assign distinct color to each point
    fullObj: d
  }));

  // --- 3D FILTERS & DYNAMIC DEFS ---
  const SvgDefs = () => (
    <defs>
      {/* Dynamic Cylinder Gradients for each color in the palette */}
      {colors.map((color, idx) => (
        <linearGradient key={`3d-bar-${idx}`} id={`3d-bar-${idx}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darkenColor(color, -40)} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={darkenColor(color, -40)} />
        </linearGradient>
      ))}
      
      {/* General Area Gradient */}
      <linearGradient id={`gradient-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
        <stop offset="95%" stopColor={colors[1]} stopOpacity={0.1}/>
      </linearGradient>

      {/* Drop Shadow Filter */}
      <filter id="shadow-3d" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <g>
        <text x={x + width / 2} y={y - 12} fill="#334155" textAnchor="middle" fontWeight="800" fontSize={16} style={{ filter: 'drop-shadow(0px 1px 0px rgba(255,255,255,0.8))' }}>
          {value}
        </text>
      </g>
    );
  };

  // Wrap content in a container that ensures it looks good in 16:9
  const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`w-full h-full relative ${className} flex flex-col justify-center`}>
       {/* Subtle textured background for richness */}
       <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 opacity-50 pointer-events-none"></div>
      {children}
    </div>
  );

  switch (type) {
    case VisualType.BAR_CHART:
      return (
        <Container className="pl-4 pt-6 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 30, right: 30, left: 10, bottom: 10 }} barSize={60}>
              <SvgDefs />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={14} 
                fontWeight={700}
                tickLine={false} 
                axisLine={{ stroke: '#94a3b8', strokeWidth: 2 }}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} filter="url(#shadow-3d)">
                {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={`url(#3d-bar-${index % colors.length})`} />
                ))}
                <LabelList dataKey="value" content={renderCustomBarLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Container>
      );

    case VisualType.LINE_CHART:
      return (
        <Container className="pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 30, right: 30, left: 10, bottom: 10 }}>
              <SvgDefs />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={14} 
                fontWeight={700}
                tickLine={false} 
                axisLine={{ stroke: '#94a3b8', strokeWidth: 2 }}
                dy={10} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={6} 
                fillOpacity={1} 
                fill={`url(#gradient-area)`}
                filter="url(#shadow-3d)"
              >
                 <LabelList dataKey="value" position="top" offset={15} fill={colors[0]} fontSize={15} fontWeight={800} />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </Container>
      );

    case VisualType.PIE_CHART:
      return (
        <Container>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <SvgDefs />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
                filter="url(#shadow-3d)"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                ))}
                 <LabelList 
                  dataKey="value" 
                  position="outside" 
                  offset={25} 
                  fill="#1e293b" 
                  fontSize={14} 
                  fontWeight={800} 
                  stroke="none"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
             <div 
               className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-md"
               style={{ backgroundColor: colors[0] }}
             >
               <IconComponent className="w-9 h-9 text-white drop-shadow-md" />
             </div>
          </div>
        </Container>
      );

    case VisualType.STAT_CARD:
      return (
        <Container className="p-8">
          <div className="w-full h-full grid grid-cols-2 gap-8 content-center">
            {data.map((item, idx) => {
              const itemColor = colors[idx % colors.length];
              return (
                <div key={idx} className="relative group overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-lg flex flex-col justify-between p-6">
                   <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10" style={{ backgroundColor: itemColor }}></div>
                   
                   <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100">
                        {item.label}
                      </span>
                      <IconComponent className="w-6 h-6 opacity-50" style={{ color: itemColor }} />
                   </div>
                   
                   <div>
                      <h3 
                        className="text-5xl font-black tracking-tighter mb-2 drop-shadow-sm"
                        style={{ color: itemColor }}
                      >
                        {item.value}
                      </h3>
                      {item.description && (
                        <p className="text-slate-400 font-semibold text-sm leading-tight">
                          {item.description}
                        </p>
                      )}
                   </div>
                </div>
              )
            })}
          </div>
        </Container>
      );

    case VisualType.PROCESS_FLOW:
      return (
        <Container className="p-6">
          <div className="flex flex-col justify-center h-full space-y-4">
            {data.map((step, idx) => {
              const stepColor = colors[idx % colors.length];
              const isEven = idx % 2 === 0;
              
              return (
                <div key={idx} className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-4`}>
                   {/* Step Number Bubble */}
                   <div 
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10 relative"
                    style={{ backgroundColor: stepColor }}
                   >
                      <span className="text-white font-black text-lg">{idx + 1}</span>
                   </div>

                   {/* Content Card */}
                   <div className="flex-1 relative group">
                      <div className="bg-white rounded-2xl p-4 border-l-4 shadow-md flex items-center justify-between" style={{ borderLeftColor: stepColor }}>
                         <h4 className="font-bold text-slate-700 text-lg">{step.label}</h4>
                         <span className="text-slate-500 font-semibold">{step.value}</span>
                      </div>
                      {/* Connecting Line (Visual only) */}
                      {idx < data.length - 1 && (
                        <div 
                          className="absolute top-full w-1 bg-slate-200 h-6"
                          style={{ 
                            left: isEven ? '-1.75rem' : 'auto', 
                            right: isEven ? 'auto' : '-1.75rem',
                            transform: 'translateX(50%)'
                          }}
                        ></div>
                      )}
                   </div>
                </div>
              );
            })}
          </div>
        </Container>
      );

    case VisualType.KEY_POINTS:
      return (
        <Container className="p-8">
          <div className="grid grid-cols-1 gap-4 h-full content-center">
            {data.map((point, idx) => {
              const pointColor = colors[idx % colors.length];
              return (
                <div key={idx} className="flex items-center bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: pointColor }}></div>
                  
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-5 shadow-sm"
                    style={{ backgroundColor: `${pointColor}20` }} // 20% opacity
                  >
                    <span className="text-xl font-black" style={{ color: pointColor }}>{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-800 text-lg leading-tight">{point.label}</h5>
                    <p className="text-slate-500 font-medium text-sm mt-1">{point.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      );

    default:
      return <p className="text-slate-400 italic">Visualization type not supported</p>;
  }
};