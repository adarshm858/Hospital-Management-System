import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  UserPlus,
  CalendarPlus,
  FilePlus,
  Receipt,
  Users,
  Stethoscope,
  Pill,
  Activity,
  ArrowRight,
  Sliders,
  History
} from 'lucide-react';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import medicineService from '../../services/medicineService';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Quick action commands
  const quickActions = [
    {
      id: 'act-new-patient',
      type: 'action',
      title: 'Register New Patient',
      subtitle: 'Add demographic & clinical profile',
      icon: UserPlus,
      shortcut: '⌘P',
      handler: () => navigate('/patients/add')
    },
    {
      id: 'act-new-appointment',
      type: 'action',
      title: 'Schedule Appointment',
      subtitle: 'Book physician consultation slot',
      icon: CalendarPlus,
      shortcut: '⌘A',
      handler: () => navigate('/appointments/add')
    },
    {
      id: 'act-new-bill',
      type: 'action',
      title: 'Generate Patient Invoice',
      subtitle: 'Formulate hospital charges breakdown',
      icon: Receipt,
      shortcut: '⌘B',
      handler: () => navigate('/bills/add')
    },
    {
      id: 'act-new-prescription',
      type: 'action',
      title: 'Create Prescription',
      subtitle: 'Rx formulation for consultation',
      icon: FilePlus,
      shortcut: '⌘R',
      handler: () => navigate('/prescriptions/add')
    },
    {
      id: 'act-command-center',
      type: 'action',
      title: 'Open Hospital Command Center',
      subtitle: 'Live telemetry, bed capacity & triage',
      icon: Activity,
      shortcut: '⌘L',
      handler: () => navigate('/command-center')
    },
    {
      id: 'act-audit-logs',
      type: 'action',
      title: 'View System Audit Logs',
      subtitle: 'Security access & clinical event records',
      icon: History,
      shortcut: '⌘U',
      handler: () => navigate('/audit-logs')
    },
    {
      id: 'act-settings-roles',
      type: 'action',
      title: 'Roles & Permissions Matrix',
      subtitle: 'Access control & clinical security policies',
      icon: Sliders,
      shortcut: '⌘S',
      handler: () => navigate('/settings/roles')
    }
  ];

  // Load data when opened
  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);

    const loadDirectory = async () => {
      try {
        setLoading(true);
        const [pData, dData, aData, mData] = await Promise.allSettled([
          patientService.getAll(),
          doctorService.getAll(),
          appointmentService.getAll(),
          medicineService.getAll()
        ]);
        if (pData.status === 'fulfilled') setPatients(pData.value || []);
        if (dData.status === 'fulfilled') setDoctors(dData.value || []);
        if (aData.status === 'fulfilled') setAppointments(aData.value || []);
        if (mData.status === 'fulfilled') setMedicines(mData.value || []);
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };

    loadDirectory();
  }, [isOpen]);

  // Compute filtered search results
  const searchResults = (() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return quickActions;
    }

    const matchedActions = quickActions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );

    const matchedPatients = patients
      .filter((p) => {
        const name = (p.name || `${p.firstName || ''} ${p.lastName || ''}`).toLowerCase();
        const phone = String(p.phone || '');
        const id = String(p.id || '');
        return name.includes(q) || phone.includes(q) || id.includes(q);
      })
      .slice(0, 4)
      .map((p) => ({
        id: `patient-${p.id}`,
        type: 'patient',
        title: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || `Patient #${p.id}`,
        subtitle: `Patient #${p.id} · ${p.gender || 'Unknown'} · ${p.bloodGroup || 'Blood Group N/A'}`,
        icon: Users,
        handler: () => navigate(`/patients/profile/${p.id}`)
      }));

    const matchedDoctors = doctors
      .filter((d) => {
        const name = (d.name || `${d.firstName || ''} ${d.lastName || ''}`).toLowerCase();
        const spec = (d.specialization || d.department || '').toLowerCase();
        return name.includes(q) || spec.includes(q);
      })
      .slice(0, 3)
      .map((d) => ({
        id: `doctor-${d.id}`,
        type: 'doctor',
        title: `Dr. ${d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim()}`,
        subtitle: `${d.specialization || 'General Physician'} · ${d.department || 'Clinical'}`,
        icon: Stethoscope,
        handler: () => navigate('/doctors')
      }));

    const matchedMedicines = medicines
      .filter((m) => {
        const name = (m.name || '').toLowerCase();
        const batch = (m.batchNumber || '').toLowerCase();
        return name.includes(q) || batch.includes(q);
      })
      .slice(0, 3)
      .map((m) => ({
        id: `med-${m.id}`,
        type: 'medicine',
        title: m.name,
        subtitle: `Stock: ${m.stockQuantity ?? m.quantity ?? 0} · Batch: ${m.batchNumber || 'N/A'}`,
        icon: Pill,
        handler: () => navigate('/medicines')
      }));

    const matchedAppointments = appointments
      .filter((a) => {
        const pName = (a.patientName || '').toLowerCase();
        const dName = (a.doctorName || '').toLowerCase();
        const rsn = (a.reason || '').toLowerCase();
        return pName.includes(q) || dName.includes(q) || rsn.includes(q);
      })
      .slice(0, 3)
      .map((a) => ({
        id: `appt-${a.id}`,
        type: 'appointment',
        title: `Appointment: ${a.patientName || 'Patient'}`,
        subtitle: `Dr. ${a.doctorName || 'Assigned'} · ${a.reason || 'General'}`,
        icon: Activity,
        handler: () => navigate('/appointments')
      }));

    return [...matchedActions, ...matchedPatients, ...matchedDoctors, ...matchedAppointments, ...matchedMedicines];
  })();

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = searchResults[selectedIndex];
      if (current) {
        current.handler();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a clinical command, search patient, doctor, medicine..."
            className="w-full ml-3 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-hidden"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results / Commands List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && !searchResults.length ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Querying hospital registry...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.handler();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching clinical entities or commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Navigate with <kbd className="font-mono font-semibold">↑</kbd> <kbd className="font-mono font-semibold">↓</kbd>
          </span>
          <span>
            Select with <kbd className="font-mono font-semibold">↵ Enter</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
