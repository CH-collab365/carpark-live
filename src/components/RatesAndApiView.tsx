import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink,
  Zap,
  DollarSign
} from 'lucide-react';

export const RatesAndApiView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const apiSnippet = `// Example: Fetch real-time Singapore carpark availability
async function fetchSingaporeCarparks() {
  // Option 1: data.gov.sg API (Open Data, no key needed)
  const resGov = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
  const dataGov = await resGov.json();
  const items = dataGov.items[0].carpark_data;

  // Option 2: LTA DataMall v2 (Requires AccountKey header)
  // const resLta = await fetch('http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2', {
  //   headers: { 'AccountKey': 'YOUR_LTA_KEY' }
  // });

  return items.map((item: any) => ({
    code: item.carpark_number,
    availableLots: parseInt(item.carpark_info[0].lots_available, 10),
    totalLots: parseInt(item.carpark_info[0].total_lots, 10),
    lotType: item.carpark_info[0].lot_type, // 'C' (Car), 'M' (Motor), 'H' (Heavy)
    updatedAt: item.update_datetime
  }));
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(apiSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Singapore Parking Guide &amp; API</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Official HDB / URA parking charges, Free Parking Scheme rules, and Developer API hookup
        </p>
      </div>

      {/* Official Singapore Parking Schemes */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">HDB &amp; URA Standard Parking Rates</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="font-bold text-slate-800 block text-xs">Non-Central Area (HDB &amp; URA)</span>
            <span className="text-lg font-black text-rose-600 font-mono mt-1 block">
              $0.60 <span className="text-xs font-normal text-slate-500">/ 30 minutes</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Applies across residential estates (Tampines, Toa Payoh, Bishan, Woodlands, Jurong, etc.). Night parking capped at $5.00 (10:30pm - 7:00am).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="font-bold text-slate-800 block text-xs">Central Area Designated Carparks</span>
            <span className="text-lg font-black text-rose-600 font-mono mt-1 block">
              $1.20 <span className="text-xs font-normal text-slate-500">/ 30 minutes</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Peak hours: Monday to Saturday 7:00am - 5:00pm. Outside peak hours reverts to $0.60 per 30 minutes.
            </p>
          </div>
        </div>

        {/* Free Parking Scheme & Grace Period */}
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              HDB Free Parking Scheme (FPS)
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              Available at most residential HDB carparks on <strong>Sundays and Public Holidays</strong> from <strong>7:00am to 10:30pm</strong>. Valid for cars and motorcycles without requiring coupons or Parking.sg activation.
            </p>
          </div>

          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Standard 15-Minute Grace Period
            </div>
            <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
              All HDB and URA Electronic Parking System (EPS) carparks offer a <strong>15-minute grace period</strong> for vehicles picking up or dropping off passengers. Vehicles exiting within 15 minutes are not charged.
            </p>
          </div>
        </div>
      </div>

      {/* Developer API Setup Information */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">API Connection Ready</h3>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          As requested, this app currently runs on a high-fidelity frontend simulation matching the live schema. When you are ready to connect to real-time Singapore data, here are the official government endpoints:
        </p>

        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
          <li>
            <strong className="text-slate-800">data.gov.sg:</strong>{' '}
            <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">
              https://api.data.gov.sg/v1/transport/carpark-availability
            </code>{' '}
            (Updated every 1 minute, no API key required).
          </li>
          <li>
            <strong className="text-slate-800">LTA DataMall v2:</strong>{' '}
            <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">
              CarParkAvailabilityv2
            </code>{' '}
            (Includes commercial malls, Marina Bay, Orchard, Sentosa &amp; HDB).
          </li>
        </ul>

        <div className="mt-2">
          <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
            {apiSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
