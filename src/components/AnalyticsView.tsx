import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, X } from 'lucide-react';
import { PeriodModal } from './PeriodModal';

export const AnalyticsView = ({ jobs: rawJobs, appSettings, customers = [], professors = [] }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [detailModalContent, setDetailModalContent] = useState<'encordoamentos' | 'ordens' | 'ganhos' | null>(null);
  const [chartMetric, setChartMetric] = useState<'ordens'|'encordoamentos'|'ganhos'>('ordens');
  const [chartPeriod, setChartPeriod] = useState<'dia'|'semana'|'mes'>('mes');
  const [activeReport, setActiveReport] = useState<string|null>(null);
  const [periodFilter, setPeriodFilter] = useState<{ startDate: string, endDate: string } | null>(null);

  const jobs = useMemo(() => {
    if (!periodFilter) return rawJobs || [];
    const sDate = new Date(periodFilter.startDate + 'T00:00:00Z');
    const eDate = new Date(periodFilter.endDate + 'T23:59:59Z');
    
    return (rawJobs || []).filter((j: any) => {
       if (!j.date) return false;
       let d: Date;
       if (j.date.includes('/')) {
         const parts = j.date.split(' ')[0].split('/');
         if (parts.length === 3) d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
         else d = new Date();
       } else {
         d = new Date(j.date);
       }
       if (isNaN(d.getTime())) return false;
       return d >= sDate && d <= eDate;
    });
  }, [rawJobs, periodFilter]);

  // Computed data
  const ordersCount = new Set(jobs.map((j: any) => j.orderCode).filter(Boolean)).size || 0;
  const totalEarnings = jobs.reduce((acc: number, j: any) => acc + (j.price || 0), 0);
  const pickupPoints = appSettings?.pickupPoints || ['Test', 'Loja 1'];

  const chartData = useMemo(() => {
    const grouped: any = {};
    jobs.forEach((j: any) => {
       if (!j.date) return;
       let d: Date;
       if (j.date.includes('/')) {
         const parts = j.date.split(' ')[0].split('/'); // hande DD/MM/YYYY HH:MM
         if (parts.length === 3) d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
         else d = new Date();
       } else {
         d = new Date(j.date);
       }
       if (isNaN(d.getTime())) d = new Date(); // fallback

       let key = '';
       if (chartPeriod === 'dia') {
          key = d.toISOString().split('T')[0];
       } else if (chartPeriod === 'mes') {
          key = d.toISOString().substring(0, 7); // YYYY-MM
       } else {
          // semana
          const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
          const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${d.getFullYear()}-W${weekNum}`;
       }
       
       if (!grouped[key]) grouped[key] = { ordens: new Set(), encord: 0, ganhos: 0 };
       if (j.orderCode) grouped[key].ordens.add(j.orderCode);
       grouped[key].encord += 1;
       grouped[key].ganhos += j.price || 0;
    });

    let dates = Object.keys(grouped).sort();
    
    if (chartPeriod === 'dia' && dates.length > 0) {
      const first = new Date(dates[0]);
      const last = new Date(dates[dates.length - 1]);
      const filled = [];
      const curr = new Date(first);
      while (curr <= last && filled.length < 30) {
         filled.push(curr.toISOString().split('T')[0]);
         curr.setDate(curr.getDate() + 1);
      }
      dates = filled;
    } else if (dates.length === 0) {
      if (chartPeriod === 'dia') {
         dates = [new Date().toISOString().split('T')[0]];
      } else {
         dates = ['N/A'];
      }
    }

    if (dates.length > 15 && chartPeriod === 'dia') {
       dates = dates.slice(-15); 
    }

    let points = dates.map(d => {
       const g = grouped[d] || { ordens: new Set(), encord: 0, ganhos: 0 };
       let val = 0;
       if (chartMetric === 'ordens') val = g.ordens ? g.ordens.size : 0;
       else if (chartMetric === 'encordoamentos') val = g.encord || 0;
       else val = g.ganhos || 0;

       let label = d;
       if (chartPeriod === 'dia' && d.includes('-')) {
          const parts = d.split('-');
          if (parts.length === 3) label = `${parts[2]}/${parts[1]}`; 
       }
       return { label, val };
    });

    if (points.length < 2) {
       points.unshift({ label: '-', val: 0 });
    }

    let maxVal = Math.max(...points.map(p => p.val));
    if (maxVal < 4 && chartMetric !== 'ganhos') maxVal = 4;
    if (maxVal === 0) maxVal = 4;

    const width = 1000;
    const height = 200;
    const path = points.map((p, idx) => {
       const x = (idx / (points.length - 1)) * width;
       const y = height - (p.val / maxVal) * (height * 0.8) - (height * 0.1); 
       return `${idx === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    
    return { path, maxVal, points };
  }, [jobs, chartMetric, chartPeriod]);

  const metricBoxStyle = (bg: string) => ({
    background: bg,
    padding: '24px',
    borderRadius: '8px',
    color: 'white',
    flex: 1,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    cursor: 'pointer'
  });

  const panelStyle = {
    background: 'var(--bg-panel)',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const costCenters = useMemo(() => {
     let stringing = 0, grip = 0, overgrip = 0, custom = 0, others = 0, racket = 0;
     jobs.forEach((j: any) => {
         const baseStrPrice = j.basePrice || 0;
         const strDiscount = (j.priceDiscountPercent || 0) / 100;
         stringing += baseStrPrice * (1 - strDiscount);
         
         if (Array.isArray(j.auxServices)) {
            j.auxServices.forEach((aux: any) => {
               if (aux.isActive) {
                   const auxPrice = aux.price || 0;
                   const auxDisc = aux.discountPercent ? aux.discountPercent / 100 : 0;
                   const finalAux = auxPrice * (1 - auxDisc);
                   switch (aux.type) {
                     case 'Trocar grip base': grip += finalAux; break;
                     case 'Trocar overgrip': overgrip += finalAux; break;
                     case 'Serviço customizado': custom += finalAux; break;
                     case 'Compra de raquete nova': racket += finalAux; break;
                     case 'Outros serviços': others += finalAux; break;
                   }
               }
            });
         }
     });

     return [
       { label: 'Encordoamento', value: stringing, color: '#4298E7' },
       { label: 'Overgrip', value: overgrip, color: '#6FCF97' },
       { label: 'Grip', value: grip, color: '#F2C94C' },
       { label: 'Customização', value: custom, color: '#EB5757' },
       { label: 'Outros serviços', value: others, color: '#9B51E0' },
       { label: 'Raquete nova', value: racket, color: '#111827' },
     ];
  }, [jobs]);

  const genderStats = useMemo(() => {
     let males = 0, females = 0, uninformed = 0;
     jobs.forEach((j: any) => {
         const custName = j.customerName;
         const c = customers.find((c: any) => c.name === custName);
         if (!c || !c.gender || c.gender === 'N' || c.gender === '') {
             uninformed++;
         } else if (c.gender === 'M') {
             males++;
         } else if (c.gender === 'F') {
             females++;
         } else {
             uninformed++;
         }
     });
     return [
       { label: 'Masculino', value: males, color: '#4298E7' },
       { label: 'Feminino', value: females, color: '#6FCF97' },
       { label: 'Não informado', value: uninformed, color: '#F2C94C' }
     ];
  }, [jobs, customers]);

  const stringTypes = useMemo(() => {
     let multifilamento = 0, monofilamento = 0, tripa = 0;
     const stringsConfig = appSettings?.strings || [];
     
     jobs.forEach((j: any) => {
         if (j.mainString) {
             const strConf = stringsConfig.find((s: any) => typeof s === 'object' && s.name === j.mainString);
             let type = strConf?.type;
             
             if (!type && stringsConfig.includes(j.mainString)) {
                 type = 'Monofilamento';
             }

             if (type === 'Multifilamento') multifilamento++;
             else if (type === 'Monofilamento') monofilamento++;
             else if (type === 'Tripa Natural') tripa++;
         }
     });

     return [
       { label: 'Monofilamento', value: monofilamento, color: '#4298E7' },
       { label: 'Multifilamento', value: multifilamento, color: '#9B51E0' },
       { label: 'Tripa Natural', value: tripa, color: '#F2C94C' }
     ];
  }, [jobs, appSettings]);

  const topBrands = useMemo(() => {
     const counts: Record<string, number> = {};
     const stringsConfig = appSettings?.strings || [];
     
     jobs.forEach((j: any) => {
         if (j.mainString) {
             const strConf = stringsConfig.find((s: any) => typeof s === 'object' && s.name === j.mainString);
             const brand = strConf?.brand || 'Desconhecida';
             counts[brand] = (counts[brand] || 0) + 1;
         }
     });
     
     return Object.entries(counts)
       .map(([name, count]) => ({ name, count }))
       .sort((a,b) => b.count - a.count)
       .slice(0, 5);
  }, [jobs, appSettings]);

  const topRacketBrands = useMemo(() => {
     const counts: Record<string, number> = {};
     const savedRackets = localStorage.getItem('tt_rackets');
     const rackets = savedRackets ? JSON.parse(savedRackets) : [];
     
     jobs.forEach((j: any) => {
         if (j.racketModel) {
             const matchedRacket = rackets.find((r: any) => r.name === j.racketModel);
             const brand = (matchedRacket && matchedRacket.brand) ? matchedRacket.brand : 'Desconhecida';
             counts[brand] = (counts[brand] || 0) + 1;
         }
     });
     
     return Object.entries(counts)
       .map(([name, count]) => ({ name, count }))
       .sort((a,b) => b.count - a.count)
       .slice(0, 5);
  }, [jobs]);

  const tensionStats = useMemo(() => {
     let totalTension = 0;
     let count = 0;
     let maxTension = 0;
     let minTension = Infinity;

     jobs.forEach((j: any) => {
         let main = 0;
         let cross = 0;
         
         if (j.tension) {
             const match = j.tension.match(/(\d+)(?:\/(\d+))?/);
             if (match) {
                 main = Number(match[1]);
                 cross = match[2] ? Number(match[2]) : 0; // if it's not hybrid, cross isn't tracked here, but we could use 'main' for both if we wanted. For average, let's just count 'main' twice or 'main' once. Usually if it's "50 lbs" it applies to both mains and crosses. So if no cross, let's assume cross = main so weight is correct.
                 if (!match[2]) cross = main; 
             }
         }
         
         if (main > 0) {
             totalTension += main;
             count++;
             if (main > maxTension) maxTension = main;
             if (main < minTension) minTension = main;
         }
         
         // Only count cross separately if it's a hybrid setup (match[2] exists) or we count both mains/crosses for every job.
         // Wait, if it says "50 lbs", that means mains AND crosses are 50, so counting it twice or once doesn't change the average. But let's count both since they are two parameters.
         if (cross > 0) {
             totalTension += cross;
             count++;
             if (cross > maxTension) maxTension = cross;
             if (cross < minTension) minTension = cross;
         }
     });

     if (minTension === Infinity) minTension = 0;

     return {
        avg: count > 0 ? (totalTension / count) : 0,
        max: maxTension,
        min: minTension
     };
  }, [jobs]);

  const renderCircleDonut = (items: { label: string, value: number, color: string }[]) => {
    const total = items.reduce((acc, i) => acc + i.value, 0) || 1;
    let currentOffset = 0;
    const circumference = 2 * Math.PI * 40;

    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '16px' }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '120px', height: '120px', flexShrink: 0 }}>
          {total === items.reduce((acc, i) => acc + i.value, 0) && items.map((item, i) => {
             if (item.value === 0) return null;
             const percent = item.value / total;
             const dashArray = `${percent * circumference} ${circumference}`;
             const offset = -currentOffset * circumference;
             currentOffset += percent;
             return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={item.color} strokeWidth="20" strokeDasharray={dashArray} strokeDashoffset={offset} />;
          })}
          {(items.reduce((acc, i) => acc + i.value, 0) === 0) && <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" />}
        </svg>
        <div style={{ marginLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', maxHeight: '130px' }}>
           {items.map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ color: '#4B5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{item.label}</span>
                </div>
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {items.reduce((acc, count) => acc + count.value, 0) > 0 ? (item.value / total * 100).toFixed(1) : 0}%
                </span>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const getReportData = (type: string) => {
     let data: any[] = [];
     let headers: string[] = [];
     let title = '';

     if (type === 'strings_brands') {
         title = "Cordas mais usadas";
         headers = ["Marca", "Encordoamentos"];
         const counts: Record<string, number> = {};
         jobs.forEach((j:any) => {
             if (j.mainString) {
                 const strConf = (appSettings?.strings || []).find((s: any) => typeof s === 'object' && s.name === j.mainString);
                 const brand = strConf?.brand || 'Desconhecida';
                 counts[brand] = (counts[brand] || 0) + 1;
             }
         });
         data = Object.entries(counts).map(([model, count]) => ({ col1: model, col2: count }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'strings') {
         title = "Modelos mais usados (corda)";
         headers = ["Modelo", "Encordoamentos"];
         const counts: Record<string, number> = {};
         jobs.forEach((j:any) => {
             if (j.mainString) {
                 const str = j.isHybrid && j.crossString ? `${j.mainString} / ${j.crossString}` : j.mainString;
                 counts[str] = (counts[str] || 0) + 1;
             }
         });
         data = Object.entries(counts).map(([model, count]) => ({ col1: model, col2: count }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'rackets_brands') {
         title = "Raquetes mais usadas";
         headers = ["Marca", "Encordoamentos"];
         const counts: Record<string, number> = {};
         const savedRackets = localStorage.getItem('tt_rackets');
         const rackets = savedRackets ? JSON.parse(savedRackets) : [];
         jobs.forEach((j:any) => {
             if (j.racketModel) {
                 const matchedRacket = rackets.find((r: any) => r.name === j.racketModel);
                 const brand = (matchedRacket && matchedRacket.brand) ? matchedRacket.brand : 'Desconhecida';
                 counts[brand] = (counts[brand] || 0) + 1;
             }
         });
         data = Object.entries(counts).map(([model, count]) => ({ col1: model, col2: count }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'rackets') {
         title = "Modelos mais usados (raquete)";
         headers = ["Modelo", "Raquetes"];
         const counts: Record<string, number> = {};
         jobs.forEach((j:any) => {
             if (j.racketModel) {
                 counts[j.racketModel] = (counts[j.racketModel] || 0) + 1;
             }
         });
         data = Object.entries(counts).map(([model, count]) => ({ col1: model, col2: count }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'stringers') {
         title = "Encordoamentos por encordoador";
         headers = ["Encordoador", "Encordoamentos", "Ganhos"];
         const stats: Record<string, { count: number, earnings: number }> = {};
         jobs.forEach((j:any) => {
             const str = j.stringerName || 'Desconhecido';
             if (!stats[str]) stats[str] = { count: 0, earnings: 0 };
             stats[str].count += 1;
             stats[str].earnings += (j.price || 0);
         });
         data = Object.entries(stats).map(([name, s]) => ({ col1: name, col2: s.count, col3: `BRL ${s.earnings.toFixed(2)}` }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'professors') {
         title = "Encordoamentos por professor";
         headers = ["Professor indicado", "Encordoamentos", "Ganhos"];
         const stats: Record<string, { count: number, earnings: number }> = {};
         jobs.forEach((j:any) => {
             if (j.commissionedProfessorId) {
                 const p = professors.find((p:any) => p.id === j.commissionedProfessorId);
                 const name = p ? p.name : 'Desconhecido';
                 if (!stats[name]) stats[name] = { count: 0, earnings: 0 };
                 stats[name].count += 1; // 1 per job = 1 per racket
                 stats[name].earnings += (j.price || 0);
             }
         });
         data = Object.entries(stats).map(([name, s]) => ({ col1: name, col2: s.count, col3: `BRL ${s.earnings.toFixed(2)}` }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'clubs') {
         title = "Encordoamentos por clube";
         headers = ["Clube indicado", "Encordoamentos", "Ganhos"];
         const stats: Record<string, { count: number, earnings: number }> = {};
         jobs.forEach((j:any) => {
             let club = "Sem Clube";
             const cust = customers.find((c:any) => c.name === j.customerName);
             if (cust && cust.originClub) {
                 club = cust.originClub;
             }
             if (!stats[club]) stats[club] = { count: 0, earnings: 0 };
             stats[club].count += 1;
             stats[club].earnings += (j.price || 0);
         });
         data = Object.entries(stats).map(([name, s]) => ({ col1: name, col2: s.count, col3: `BRL ${s.earnings.toFixed(2)}` }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'top_customers_stringings') {
         title = "Top clientes (encordoamentos)";
         headers = ["Cliente", "Encordoamentos"];
         const counts: Record<string, number> = {};
         jobs.forEach((j:any) => {
             const name = j.customerName || 'Desconhecido';
             counts[name] = (counts[name] || 0) + 1;
         });
         data = Object.entries(counts).map(([name, count]) => ({ col1: name, col2: count }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'top_customers_orders') {
         title = "Top clientes (ordens)";
         headers = ["Cliente", "Ordens"];
         const stats: Record<string, Set<string>> = {};
         jobs.forEach((j:any) => {
             const name = j.customerName || 'Desconhecido';
             if (!stats[name]) stats[name] = new Set();
             if (j.orderCode) stats[name].add(j.orderCode);
         });
         data = Object.entries(stats).map(([name, set]) => ({ col1: name, col2: set.size }));
         data.sort((a,b) => b.col2 - a.col2);
     } else if (type === 'top_customers_earnings') {
         title = "Top clientes (ganhos)";
         headers = ["Cliente", "Ganhos"];
         const counts: Record<string, number> = {};
         jobs.forEach((j:any) => {
             const name = j.customerName || 'Desconhecido';
             counts[name] = (counts[name] || 0) + (j.price || 0);
         });
         data = Object.entries(counts).map(([name, val]) => ({ col1: name, col2: `BRL ${val.toFixed(2)}`, raw: val }));
         data.sort((a,b) => b.raw - a.raw);
     }

     return { title, headers, data };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Analytics {periodFilter ? `(${periodFilter.startDate.split('-').reverse().join('/')} - ${periodFilter.endDate.split('-').reverse().join('/')})` : ''}</h2>
        <button onClick={() => setIsPeriodModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <Calendar size={18} /> Período
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'overview' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Visão Geral</button>
        <button onClick={() => setActiveTab('stringings')} style={{ background: 'none', border: 'none', color: activeTab === 'stringings' ? '#6136B3' : 'var(--text-secondary)', fontWeight: activeTab === 'stringings' ? 700 : 500, fontSize: '16px', cursor: 'pointer' }}>Encordoamentos</button>
      </div>

      {/* Dashboard View */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '64px' }}>
          {/* Top 3 KPI */}
          <div style={{ display: 'flex', gap: '24px' }}>
             <div style={metricBoxStyle('#F2C94C')} onClick={() => setDetailModalContent('encordoamentos')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{jobs?.length || 0}</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Encordoamentos</div>
             </div>
             <div style={metricBoxStyle('#EB5757')} onClick={() => setDetailModalContent('ordens')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{ordersCount}</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ordens</div>
             </div>
             <div style={metricBoxStyle('#6FCF97')} onClick={() => setDetailModalContent('ganhos')}>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalEarnings.toFixed(2)} BRL</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Ganhos</div>
             </div>
          </div>

          <div style={{ ...panelStyle, padding: '16px 24px', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            {/* Chart Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <select 
                  value={chartMetric} 
                  onChange={(e) => setChartMetric(e.target.value as any)}
                  style={{ border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#111827', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '20px', fontFamily: 'inherit' }}>
                  <option value="ordens">Ordens</option>
                  <option value="encordoamentos">Encordoamentos</option>
                  <option value="ganhos">Ganhos</option>
                </select>
                <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setChartPeriod('dia')} style={{ background: chartPeriod === 'dia' ? '#4298E7' : 'transparent', color: chartPeriod === 'dia' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Dia</button>
                <button onClick={() => setChartPeriod('semana')} style={{ background: chartPeriod === 'semana' ? '#4298E7' : 'transparent', color: chartPeriod === 'semana' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Semana</button>
                <button onClick={() => setChartPeriod('mes')} style={{ background: chartPeriod === 'mes' ? '#4298E7' : 'transparent', color: chartPeriod === 'mes' ? 'white' : '#4298E7', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Mês</button>
              </div>
            </div>

            {/* Chart Body */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', marginTop: '32px' }}>
               {/* Horizontal Grid lines */}
               <div style={{ position: 'relative', height: '220px' }}>
                 {[chartData.maxVal, chartData.maxVal * 0.75, chartData.maxVal * 0.5, chartData.maxVal * 0.25, 0].map((val, idx) => {
                    const bottom = `${(val / chartData.maxVal) * 80 + 10}%`;
                    return (
                      <div key={idx} style={{ position: 'absolute', left: 0, right: 0, bottom, display: 'flex', alignItems: 'center', transform: 'translateY(50%)' }}>
                         <span style={{ width: '40px', fontSize: '12px', color: '#9CA3AF', textAlign: 'right', paddingRight: '12px' }}>
                           {chartMetric === 'ganhos' ? val.toFixed(0) : Math.round(val)}
                         </span>
                         <div style={{ flex: 1, borderTop: '1px solid #F3F4F6' }}></div>
                      </div>
                    )
                 })}
                 
                 {/* SVG Line */}
                 <svg style={{ position: 'absolute', top: 0, left: '40px', right: 0, bottom: 0, width: 'calc(100% - 40px)', height: '100%', pointerEvents: 'none', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 1000 200">
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }} 
                      animate={{ pathLength: 1, opacity: 1 }} 
                      transition={{ duration: 1, ease: 'easeOut' }}
                      d={chartData.path} fill="none" stroke="#4298E7" strokeWidth="3" strokeLinejoin="round" 
                    />
                 </svg>

                 {/* Square nodes */}
                 <div style={{ position: 'absolute', top: 0, left: '40px', right: 0, bottom: 0, pointerEvents: 'none' }}>
                    {chartData.points.map((p, idx) => {
                       const left = `${(idx / (chartData.points.length - 1)) * 100}%`;
                       const bottom = `${(p.val / chartData.maxVal) * 80 + 10}%`; 
                       return (
                         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + (idx * 0.05) }} key={idx} 
                              style={{ position: 'absolute', left, bottom, transform: 'translate(-50%, 50%)', 
                                      background: '#4298E7', color: 'white', fontSize: '11px', 
                                      padding: '2px 5px', borderRadius: '4px', fontWeight: 'bold', zIndex: 10 }}>
                            {chartMetric === 'ganhos' ? p.val.toFixed(0) : p.val}
                         </motion.div>
                       )
                    })}
                 </div>
               </div>

               {/* X axis labels */}
               <div style={{ position: 'relative', height: '24px', marginLeft: '40px', marginTop: '16px' }}>
                 {chartData.points.map((p, idx) => {
                    const left = `${(idx / (chartData.points.length - 1)) * 100}%`;
                    return (
                       <div key={idx} style={{ position: 'absolute', left, top: 0, transform: 'translateX(-50%)', fontSize: '11px', color: 'white', whiteSpace: 'nowrap' }}>
                          {p.label}
                       </div>
                    );
                 })}
               </div>
            </div>
          </div>

          {/* 4 Small Metrics */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{...metricBoxStyle('#4298E7'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>0.00 m</div>
              <div style={{ fontSize: '13px' }}>Metros de corda usados</div>
            </div>
            <div style={{...metricBoxStyle('#9B51E0'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tensionStats.avg.toFixed(2)} Lbs</div>
              <div style={{ fontSize: '13px' }}>Tensão média</div>
            </div>
            <div style={{...metricBoxStyle('#EB5757'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tensionStats.max.toFixed(2)} Lbs</div>
              <div style={{ fontSize: '13px' }}>Maior tensão</div>
            </div>
            <div style={{...metricBoxStyle('#6FCF97'), minHeight: '80px', padding: '16px'}}>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{tensionStats.min.toFixed(2)} Lbs</div>
              <div style={{ fontSize: '13px' }}>Menor tensão</div>
            </div>
          </div>

          {/* Pie Charts Row 1 */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{...panelStyle, flex: 1.5}}>
              <h3>Centros de custo</h3>
              <div style={{ height: '170px', background: '#F9FAFB', marginTop: '16px', borderRadius: '8px' }}>
                 {renderCircleDonut(costCenters)}
              </div>
            </div>
            <div style={{...panelStyle, flex: 1}}>
              <h3>Encordoamentos por gênero</h3>
              <div style={{ height: '170px', background: '#F9FAFB', marginTop: '16px', borderRadius: '8px' }}>
                 {renderCircleDonut(genderStats)}
              </div>
            </div>
          </div>

          {/* Pie Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={panelStyle}>
              <h3>Tipos de cordas</h3>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px', borderRadius: '8px' }}>
                 {renderCircleDonut(stringTypes)}
              </div>
            </div>
            <div style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ margin: 0, fontSize: '18px', whiteSpace: 'nowrap' }}>Cordas mais usadas</h3>
                 <button onClick={() => setActiveReport('strings_brands')} style={{ background: '#E5E7EB', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 600, color: '#374151', cursor: 'pointer', fontSize: '13px' }}>Ver Todos</button>
              </div>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px', borderRadius: '8px', padding: '16px', overflowY: 'auto' }}>
                 {topBrands.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                      Nenhum dado
                    </div>
                 ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topBrands.map((brand, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx < topBrands.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ color: '#9CA3AF', fontWeight: 700, fontSize: '14px' }}>{idx + 1}</span>
                              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{brand.name}</span>
                           </div>
                           <span style={{ color: '#4298E7', fontWeight: 700, fontSize: '14px', background: 'rgba(66, 152, 231, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                             {brand.count}
                           </span>
                        </div>
                      ))}
                    </div>
                 )}
              </div>
            </div>
            <div style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ margin: 0, fontSize: '18px', whiteSpace: 'nowrap' }}>Raquetes mais usadas</h3>
                 <button onClick={() => setActiveReport('rackets_brands')} style={{ background: '#E5E7EB', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 600, color: '#374151', cursor: 'pointer', fontSize: '13px' }}>Ver Todos</button>
              </div>
              <div style={{ height: '200px', background: '#F9FAFB', marginTop: '16px', borderRadius: '8px', padding: '16px', overflowY: 'auto' }}>
                 {topRacketBrands.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                      Nenhum dado
                    </div>
                 ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topRacketBrands.map((brand, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx < topRacketBrands.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ color: '#9CA3AF', fontWeight: 700, fontSize: '14px' }}>{idx + 1}</span>
                              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{brand.name}</span>
                           </div>
                           <span style={{ color: '#4298E7', fontWeight: 700, fontSize: '14px', background: 'rgba(66, 152, 231, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                             {brand.count}
                           </span>
                        </div>
                      ))}
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Top Models and Stringers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: '#4298E7', color: 'white', cursor: 'pointer', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(66, 152, 231, 0.3)' }} onClick={() => setActiveReport('strings')}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Modelos mais usados (corda)</h3>
              <div style={{ marginTop: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '14px' }}>Clique para ver detalhes</div>
            </div>
            <div style={{...panelStyle, background: '#9B51E0', color: 'white', cursor: 'pointer', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(155, 81, 224, 0.3)' }} onClick={() => setActiveReport('rackets')}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Modelos mais usados (raquete)</h3>
              <div style={{ marginTop: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '14px' }}>Clique para ver detalhes</div>
            </div>
          </div>

          {/* Ranking Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: '#2D9CDB', color: 'white', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(45, 156, 219, 0.3)' }} onClick={() => setActiveReport('stringers')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Por encordoador</h4>
            </div>
            <div style={{...panelStyle, background: '#F2C94C', color: '#111827', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)' }} onClick={() => setActiveReport('professors')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Por professor</h4>
            </div>
            <div style={{...panelStyle, background: '#27AE60', color: 'white', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)' }} onClick={() => setActiveReport('clubs')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Por clube</h4>
            </div>
          </div>

          {/* Top Customers Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div style={{...panelStyle, background: '#F2994A', color: 'white', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(242, 153, 74, 0.3)' }} onClick={() => setActiveReport('top_customers_stringings')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Top clientes (encordoamentos)</h4>
            </div>
            <div style={{...panelStyle, background: '#EB5757', color: 'white', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(235, 87, 87, 0.3)' }} onClick={() => setActiveReport('top_customers_orders')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Top clientes (ordens)</h4>
            </div>
            <div style={{...panelStyle, background: '#6FCF97', color: '#111827', cursor: 'pointer', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(111, 207, 151, 0.3)' }} onClick={() => setActiveReport('top_customers_earnings')}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Top clientes (ganhos)</h4>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stringings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Raquetes encordoadas (Hoje)</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4298E7', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Filter size={16} /> Filtros
              </button>
              <button onClick={() => setIsPeriodModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6136B3', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Calendar size={16} /> Período
              </button>
            </div>
          </div>

          <div style={{ ...panelStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6FCF97', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Download size={16} /> Exportar
              </button>
              <input type="text" placeholder="Pesquisar..." style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#F9FAFB' }}>
                  <tr>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Cliente</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Data</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Raquete</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Mains</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Crosses</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>HZ</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>DT</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>CH</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Clube</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Professor</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Encordoador</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Máquina</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Preço</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Horas de jogo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={14} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                      Nenhum dado disponível na tabela
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '14px' }}>
              <div>Mostrando 0 a 0 de 0 registros</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600 }}>Anterior</button>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontWeight: 600 }}>Próximo</button>
              </div>
            </div>
          </div>

        </div>
      )}

    <PeriodModal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} onApply={(dates: any) => { console.log('Period selected:', dates); setPeriodFilter(dates); setIsPeriodModalOpen(false); }} />
    
    {detailModalContent && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, color: '#333' }}>
        <div style={{ background: 'white', width: '80%', maxWidth: '900px', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
              {detailModalContent === 'encordoamentos' ? 'Encordoamentos' : detailModalContent === 'ordens' ? 'Ordens' : 'Ganhos'}
            </h2>
            <button onClick={() => setDetailModalContent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} color="#6B7280" /></button>
          </div>
          
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#F9FAFB', fontWeight: 600, color: '#374151', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ flex: 1 }}>Ponto de encordoamento</div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                {detailModalContent === 'encordoamentos' ? 'Encordoamentos' : detailModalContent === 'ordens' ? 'Ordens' : 'Ganhos'}
              </div>
            </div>
            
            {pickupPoints.map((point: string, idx: number) => {
              // for now, we just divide the values proportionally or show full values as placeholder
              // since stringingPoint is not strictly recorded on jobs yet
              const pointValue = detailModalContent === 'encordoamentos' 
                ? (idx === 0 ? jobs.length : 0) // mockup: all goes to first point
                : detailModalContent === 'ordens' 
                ? (idx === 0 ? ordersCount : 0)
                : `${(idx === 0 ? totalEarnings : 0).toFixed(2)} BRL`;

              return (
                <div key={point} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '14px', color: '#6B7280', background: 'white', borderBottom: idx < pickupPoints.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                   <div style={{ flex: 1 }}>{point}</div>
                   <div style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
                     {pointValue}
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {activeReport && (() => {
       const report = getReportData(activeReport);
       return (
         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, color: '#333' }}>
           <div style={{ background: 'white', width: '90%', maxWidth: '1000px', maxHeight: '80vh', overflow: 'hidden', borderRadius: '8px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', padding: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
                 {report.title}
               </h2>
               <button onClick={() => setActiveReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} color="#6B7280" /></button>
             </div>
             
             <div style={{ overflowY: 'auto', padding: '24px' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #F3F4F6' }}>
                 <thead style={{ background: '#F9FAFB' }}>
                   <tr>
                     {report.headers.map((h, i) => <th key={i} style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>{h}</th>)}
                   </tr>
                 </thead>
                 <tbody>
                   {report.data.length === 0 ? (
                     <tr>
                       <td colSpan={report.headers.length} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                         Nenhum dado disponível na tabela
                       </td>
                     </tr>
                   ) : (
                     report.data.map((row, i) => (
                       <tr key={i}>
                         <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>{row.col1}</td>
                         {row.col2 !== undefined && <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>{row.col2}</td>}
                         {row.col3 !== undefined && <td style={{ padding: '16px', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>{row.col3}</td>}
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
               
               <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '14px' }}>
                 <div>Mostrando {report.data.length} de {report.data.length} registros</div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button style={{ background: 'none', border: 'none', color: '#D1D5DB', fontWeight: 600 }}>Anterior</button>
                   <button style={{ background: 'none', border: 'none', color: '#D1D5DB', fontWeight: 600 }}>Próximo</button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       );
    })()}

    </motion.div>
  );
};
