import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const Field = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
    <input
      type={type} name={name} value={value || ''} onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
    <h2 className="text-white font-semibold text-base mb-4 pb-3 border-b border-slate-700/70">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const AdminSettings = () => {
  const [form, setForm]     = useState({});
  const [loading, setLoad]  = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSucc]  = useState(false);
  const [error, setError]   = useState('');

  const loadSettings = async () => {
    setLoad(true);
    try { setForm(await adminApi.getSettings()); }
    catch(e) { setError('Failed to load settings'); }
    finally { setLoad(false); }
  };
  useEffect(() => { loadSettings(); }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSucc(false);
    try {
      await adminApi.saveSettings(form);
      setSucc(true);
      setTimeout(() => setSucc(false), 3000);
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Business & website configuration</p>
        </div>
        <button onClick={loadSettings} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {success && <div className="mb-5 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm"><Save className="w-4 h-4" /> Settings saved successfully!</div>}
      {error && <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        <Section title="Business Information">
          <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="Afnan Property Care Services" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+971-505387736" />
            <Field label="WhatsApp Number" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="971505387736" />
          </div>
          <Field label="Business Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@example.com" />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Building, Street, Dubai" />
          <Field label="Working Hours" name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Mon–Sat: 9 AM – 5 PM" />
          <Field label="Trade License" name="tradeLicense" value={form.tradeLicense} onChange={handleChange} placeholder="1571076" />
        </Section>

        <Section title="Analytics & Advertising">
          <Field label="Google Analytics ID" name="googleAnalyticsId" value={form.googleAnalyticsId} onChange={handleChange} placeholder="G-XXXXXXXXXX" />
          <Field label="Meta Pixel ID" name="metaPixelId" value={form.metaPixelId} onChange={handleChange} placeholder="1234567890" />
        </Section>

        <Section title="Email / SMTP (override)">
          <p className="text-slate-500 text-xs -mt-1">Leave blank to use the server's .env values.</p>
          <Field label="SMTP Email User" name="smtpUser" type="email" value={form.smtpUser} onChange={handleChange} placeholder="marpcsllc0022@gmail.com" />
          <Field label="SMTP App Password" name="smtpPass" type="password" value={form.smtpPass} onChange={handleChange} placeholder="••••••••" />
          <Field label="Owner Notification Email" name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleChange} placeholder="info@afnanpropertycare.ae" />
        </Section>

        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-900 font-bold text-sm disabled:opacity-50 hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
