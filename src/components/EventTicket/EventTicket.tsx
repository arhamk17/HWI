'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Printer,
  Download,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Mail,
  Building,
  Layers,
  ShieldCheck,
  User,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { EVENTS_DATA } from '@/data/events';
import './EventTicket.css';

interface TicketFormData {
  name: string;
  email: string;
  eventId: string;
  organization: string;
  trackPreference: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  eventId?: string;
}

type PrinterStatus = 'idle' | 'printing' | 'complete';

export function EventTicket() {
  const upcomingEvents = EVENTS_DATA.filter((e) => e.status === 'upcoming');
  const availableEvents = EVENTS_DATA;

  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    email: '',
    eventId: availableEvents[availableEvents.length - 1]?.id || '',
    organization: '',
    trackPreference: 'Full-Stack & Systems',
  });

  // State committed for the printed ticket
  const [printedData, setPrintedData] = useState<TicketFormData>({
    name: '',
    email: '',
    eventId: availableEvents[availableEvents.length - 1]?.id || '',
    organization: '',
    trackPreference: 'Full-Stack & Systems',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>('idle');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printIteration, setPrintIteration] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [ticketRefCode, setTicketRefCode] = useState<string>('TKT-2026-HWI-7C81AE');
  const [issuedTimestamp, setIssuedTimestamp] = useState<string>('20 OCT 2026 • 23:30 IST');

  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState('');

  const ticketRef = useRef<HTMLDivElement>(null);
  const printTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Use printedData once form is submitted, otherwise formData
  const activeEventId = formSubmitted ? printedData.eventId : formData.eventId;
  const selectedEvent = availableEvents.find((e) => e.id === activeEventId) || availableEvents[availableEvents.length - 1];

  const generateTicketCode = (name: string, eventId: string) => {
    const cleanName = name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'HWI';
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase().padStart(6, '0');
    return `TKT-2026-${cleanName}-${randomHex}`;
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.eventId) {
      errors.eventId = 'Please select an event edition';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePreviewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isPrinting) return;

    // Immediately commit latest form values to ticket
    const code = generateTicketCode(formData.name, formData.eventId);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    setPrintedData({ ...formData });
    setTicketRefCode(code);
    setIssuedTimestamp(`${dateStr} • ${timeStr} IST`);
    setFormSubmitted(true);
    setPrintIteration((prev) => prev + 1);

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setPrinterStatus('complete');
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setPrinterStatus('idle');
      }, 1500);
      return;
    }

    setIsPrinting(true);
    setPrinterStatus('printing');

    // No automatic scrolling or recentering during preview animation

    // Complete printing after 1.4 seconds
    if (printTimerRef.current) clearTimeout(printTimerRef.current);
    printTimerRef.current = setTimeout(() => {
      setIsPrinting(false);
      setPrinterStatus('complete');

      // Settle and reset to idle after 1.6 seconds
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setPrinterStatus('idle');
      }, 1600);
    }, 1400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isDownloading || isPrinting) return;
    setIsDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FBFBF9',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const ticketWidthMm = 90;
      const ticketHeightMm = (canvas.height * ticketWidthMm) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [ticketWidthMm + 10, ticketHeightMm + 10],
      });

      pdf.addImage(imgData, 'PNG', 5, 5, ticketWidthMm, ticketHeightMm);
      const activeName = formSubmitted ? printedData.name : formData.name;
      const sanitizedName = activeName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Attendee';
      pdf.save(`HWI-Pass-${selectedEvent.id}-${sanitizedName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!notifyEmail || !emailRegex.test(notifyEmail)) {
      setNotifyError('Please provide a valid email address.');
      return;
    }
    setNotifyError('');
    setNotifySuccess(true);
    setNotifyEmail('');
  };

  const currentAttendeeName = formSubmitted && printedData.name.trim()
    ? printedData.name.trim().toUpperCase()
    : 'GUEST BUILDER';

  const currentAttendeeEmail = formSubmitted && printedData.email.trim()
    ? printedData.email.trim()
    : 'attendee@preview.local';

  const currentAttendeeOrg = formSubmitted && printedData.organization.trim()
    ? printedData.organization.trim()
    : 'Independent Builder';

  const currentTrack = formSubmitted && printedData.trackPreference
    ? printedData.trackPreference
    : 'Full-Stack & Systems';

  return (
    <div className="hwi-ticket-page">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="hwi-ticket-hero">
        <div className="container">
          <div className="ticket-hero-badges">
            <span className="ticket-hero-pill">
              <span className="ticket-hero-beacon" />
              <span>HWI // EVENT TICKETING ENGINE</span>
            </span>
            <span className="ticket-hero-secondary-badge">BVUDET NAVI MUMBAI</span>
          </div>

          <h1 className="ticket-hero-title">
            Claim Your <span className="text-accent">Chapter Pass.</span>
          </h1>

          <p className="ticket-hero-desc">
            Discover upcoming flagship initiatives, preview your commemorative thermal receipt pass,
            and keep an authenticated offline record for campus check-ins and hackathon showcases.
          </p>
        </div>
      </section>

      {/* ─── Section 1: Upcoming Events or Thermal Empty State ────────────── */}
      <section className="hwi-upcoming-section" aria-label="Upcoming Events">
        <div className="container">
          <div className="ticket-section-header">
            <div className="ticket-section-header__left">
              <span className="ticket-section-kicker">01 · SCHEDULED RELEASES</span>
              <h2 className="ticket-section-title">Upcoming Event Runs</h2>
            </div>
            <span className="ticket-system-status">
              <span className="system-status-indicator" />
              <span>{upcomingEvents.length > 0 ? `${upcomingEvents.length} RUNS ACTIVE` : 'ALL EDITIONS ARCHIVED'}</span>
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="upcoming-events-grid">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="upcoming-event-card">
                  <div className="upcoming-card-header">
                    <span className="upcoming-badge">UPCOMING</span>
                    <span className="upcoming-edition">EDITION {evt.edition}</span>
                  </div>
                  <h3 className="upcoming-title">{evt.title}</h3>
                  <div className="upcoming-meta">
                    <div className="upcoming-meta-row">
                      <Calendar size={14} />
                      <span>{evt.date || 'Date To Be Announced'}</span>
                    </div>
                    <div className="upcoming-meta-row">
                      <MapPin size={14} />
                      <span>{evt.venue || 'BVUDET Navi Mumbai'}</span>
                    </div>
                  </div>
                  <a href="#ticket-form" className="upcoming-claim-btn">
                    <span>CONFIGURE PASS</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            /* Thermal Paper Empty State Receipt */
            <div className="thermal-empty-state">
              <div className="thermal-empty-ticket">
                <div className="thermal-tear-top" aria-hidden="true" />
                <div className="thermal-empty-body">
                  <div className="receipt-brand-row">
                    <span className="receipt-brand-name">HACK WITH INDIA</span>
                    <span className="receipt-brand-sub">OFFICIAL DISPATCH PROTOCOL</span>
                  </div>
                  <div className="receipt-divider-line" />

                  <div className="receipt-alert-box">
                    <span className="receipt-alert-badge">
                      <Clock size={12} />
                      <span>DISPATCH STATUS: ARCHIVE DORMANT</span>
                    </span>
                    <h3 className="receipt-empty-headline">No Active Public Ticket Runs</h3>
                    <p className="receipt-empty-text">
                      All 07 milestone editions (including HackWithMumbai 2.0 &amp; RocketRide Buildathon)
                      have concluded. The next major national hackathon and cohort intake window opens shortly.
                    </p>
                  </div>

                  <div className="receipt-notify-block">
                    <span className="receipt-notify-label">GET NOTIFIED FOR THE NEXT RELEASE</span>
                    {notifySuccess ? (
                      <div className="receipt-notify-success">
                        <CheckCircle2 size={16} />
                        <span>You are subscribed for early access dispatches.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleNotifySubmit} className="receipt-notify-form">
                        <div className="notify-input-wrap">
                          <Mail size={14} className="notify-mail-icon" />
                          <input
                            type="email"
                            placeholder="Enter your student email..."
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                            aria-label="Student email for notification"
                          />
                        </div>
                        <button type="submit" className="receipt-notify-btn">
                          Notify Me
                        </button>
                      </form>
                    )}
                    {notifyError && <span className="receipt-notify-err">{notifyError}</span>}
                  </div>

                  <div className="receipt-footer-stamp">
                    <span>BVUDET-NM CHAPTER ARCHIVE • DISPATCH 2026–27</span>
                  </div>
                </div>
                <div className="thermal-tear-bottom" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 2: Personalize Your Ticket & Thermal Preview ─────────── */}
      <section className="hwi-personalize-section" id="ticket-form" aria-label="Personalize Ticket">
        <div className="container">
          <div className="ticket-split-grid">
            {/* Form Column */}
            <div className="ticket-form-card">
              <div className="ticket-form-header">
                <span className="form-step-badge">
                  <Ticket size={14} />
                  <span>STEP 01 // PASS DETAILS</span>
                </span>
                <h2 className="ticket-form-title">Personalize Your Pass</h2>
                <p className="ticket-form-desc">
                  Input your builder credentials to generate a personalized physical receipt pass.
                  Preview your ticket live, review event specs, and save an offline PDF copy.
                </p>
              </div>

              <form onSubmit={handlePreviewTicket} className="ticket-personalize-form" noValidate>
                <div className="ticket-form-field">
                  <label htmlFor="tkt-name" className="ticket-label">
                    <span>Full Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="ticket-input-wrap">
                    <User size={16} className="field-icon" />
                    <input
                      type="text"
                      id="tkt-name"
                      name="name"
                      placeholder="e.g. Aryan Shinde"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <span className="field-error-msg" id="name-error">
                      <AlertCircle size={13} />
                      <span>{formErrors.name}</span>
                    </span>
                  )}
                </div>

                <div className="ticket-form-field">
                  <label htmlFor="tkt-email" className="ticket-label">
                    <span>Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="ticket-input-wrap">
                    <Mail size={16} className="field-icon" />
                    <input
                      type="email"
                      id="tkt-email"
                      name="email"
                      placeholder="e.g. aryan@bvudet.edu.in"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <span className="field-error-msg" id="email-error">
                      <AlertCircle size={13} />
                      <span>{formErrors.email}</span>
                    </span>
                  )}
                </div>

                <div className="ticket-form-field">
                  <label htmlFor="tkt-event" className="ticket-label">
                    <span>Select Event Edition</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="ticket-input-wrap">
                    <select
                      id="tkt-event"
                      name="eventId"
                      value={formData.eventId}
                      onChange={handleInputChange}
                      aria-label="Event edition selector"
                    >
                      {availableEvents.map((evt, idx) => (
                        <option key={evt.id} value={evt.id}>
                          Edition {String(idx + 1).padStart(2, '0')}: {evt.title} ({evt.year})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ticket-form-field">
                  <label htmlFor="tkt-org" className="ticket-label">
                    <span>College or Organization</span>
                    <span className="optional-tag">(Optional)</span>
                  </label>
                  <div className="ticket-input-wrap">
                    <Building size={16} className="field-icon" />
                    <input
                      type="text"
                      id="tkt-org"
                      name="organization"
                      placeholder="e.g. BVUDET Navi Mumbai / Independent"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="ticket-form-field">
                  <label htmlFor="tkt-track" className="ticket-label">
                    <span>Engineering Focus</span>
                    <span className="optional-tag">(Optional)</span>
                  </label>
                  <div className="ticket-input-wrap">
                    <Layers size={16} className="field-icon" />
                    <select
                      id="tkt-track"
                      name="trackPreference"
                      value={formData.trackPreference}
                      onChange={handleInputChange}
                      aria-label="Engineering focus track"
                    >
                      <option value="Full-Stack Web & Systems">Full-Stack Web &amp; Systems</option>
                      <option value="Solidity & Web3 Infrastructure">Solidity &amp; Web3 Infrastructure</option>
                      <option value="AI Agents & Applied ML">AI Agents &amp; Applied ML</option>
                      <option value="Offensive Security & Air-Gapped CTF">Offensive Security &amp; Air-Gapped CTF</option>
                      <option value="UI/UX & Product Architecture">UI/UX &amp; Product Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="ticket-form-actions">
                  <button
                    type="submit"
                    className="ticket-generate-btn"
                    disabled={isPrinting}
                    id="preview-ticket-btn"
                  >
                    {isPrinting ? (
                      <>
                        <RefreshCw size={16} className="spin-icon" />
                        <span>PRINTING TICKET...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>PREVIEW TICKET</span>
                      </>
                    )}
                  </button>

                  <p className="ticket-privacy-notice">
                    <ShieldCheck size={13} />
                    <span>
                      Local Generation Protocol: Your information is processed strictly within your browser.
                      Details are not logged to remote servers, external databases, or shared query strings.
                    </span>
                  </p>
                </div>
              </form>
            </div>

            {/* Preview Column */}
            <div className="ticket-preview-pane" id="ticket-preview-anchor">
              <div className="preview-header-bar">
                <span className="preview-kicker">LIVE THERMAL RECEIPT PASS</span>
                <span className="preview-mode-tag">
                  {formSubmitted ? 'PERSONALIZED PREVIEW' : 'DEFAULT PREVIEW'}
                </span>
              </div>

              {/* ─── Unified Thermal Printer & Receipt Assembly ───────────────── */}
              <div className="thermal-printer-assembly" id="thermal-printer-assembly">
                {/* Compact Thermal Printer Hardware Housing */}
                <div className="thermal-printer-unit" aria-label="Thermal receipt printer">
                  <div className="thermal-printer-unit__housing">
                    <div className="thermal-printer-unit__meta">
                      <div className="thermal-printer-status-group">
                        <span
                          className={`thermal-printer-led thermal-printer-led--${printerStatus}`}
                          aria-hidden="true"
                        />
                        <span className="thermal-printer-status-label">
                          {printerStatus === 'printing'
                            ? 'FEEDING PAPER // PRINT HEAD ACTIVE'
                            : printerStatus === 'complete'
                            ? 'PRINT COMPLETE // PASS ISSUED'
                            : 'THERMAL FEED READY // DISPATCH SLOT'}
                        </span>
                      </div>
                      <div className="thermal-printer-specs">
                        <span>203 DPI</span>
                        <span className="specs-sep">·</span>
                        <span>80MM FEED</span>
                      </div>
                    </div>

                    {/* Physical output slot with recessed cavity & front cutter bezel */}
                    <div className="thermal-printer-slot">
                      <div className="thermal-printer-slot__cavity">
                        <div className="thermal-printer-slot__slit" />
                      </div>
                      <div className="thermal-printer-slot__cutter-lip">
                        <div className="thermal-printer-slot__cutter-edge" />
                      </div>
                      {/* Active print-head optical scanner line during printing */}
                      {printerStatus === 'printing' && (
                        <div className="thermal-printhead-beam" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </div>

              {/* ─── Paper Feeding Stage: Stable Reserved Layout Space ─────── */}
              <div
                className="thermal-feed-stage"
                id="thermal-feed-stage"
              >
                {/* Physical Paper Feed Viewport: Window reveals paper emerging from slot */}
                <div
                  key={printIteration}
                  className={`thermal-feed-window ${printerStatus === 'printing' ? 'is-printing' : ''}`}
                >
                  {/* Luminous thermal print-head burn line at leading edge of emerging paper */}
                  {printerStatus === 'printing' && (
                    <div className="thermal-print-burn-line" aria-hidden="true" />
                  )}

                  <div className="thermal-ticket-container">
                    <div
                      className={`thermal-ticket ${printerStatus === 'printing' ? 'is-printing' : ''}`}
                      ref={ticketRef}
                      id="hwi-thermal-ticket"
                    >
                    <div className="ticket-scallop-edge ticket-scallop-edge--top" aria-hidden="true" />

                    <div className="ticket-header-block">
                      <div className="ticket-meta-headline">
                        <span className="ticket-bold-brand">HACK WITH INDIA</span>
                        <span className="ticket-chapter-sub">BVUDET NAVI MUMBAI CHAPTER</span>
                      </div>
                      <div className="ticket-pass-badge">
                        <span>COMMEMORATIVE EVENT PASS</span>
                      </div>
                      <div className="ticket-dash-rule" />
                    </div>

                    <div className="ticket-section-block">
                      <div className="ticket-field-line">
                        <span className="ticket-lbl">EVENT</span>
                        <span className="ticket-val-title">{selectedEvent.title}</span>
                      </div>

                      <div className="ticket-field-row">
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">SCHEDULED DATE</span>
                          <span className="ticket-val">{selectedEvent.date || 'To Be Announced'}</span>
                        </div>
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">YEAR</span>
                          <span className="ticket-val">{selectedEvent.year}</span>
                        </div>
                      </div>

                      <div className="ticket-field-line">
                        <span className="ticket-lbl">HOST VENUE</span>
                        <span className="ticket-val-venue">
                          {selectedEvent.venue || 'Department of Engineering & Technology, Sector 3, Belpada, Kharghar, Navi Mumbai – 410210'}
                        </span>
                      </div>

                      <div className="ticket-field-row">
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">TIER / ACCESS</span>
                          <span className="ticket-val">GENERAL BUILDER PASS</span>
                        </div>
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">FOCUS TRACK</span>
                          <span className="ticket-val">{currentTrack}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-dash-rule" />

                    <div className="ticket-section-block">
                      <div className="ticket-field-line">
                        <span className="ticket-lbl">ATTENDEE NAME</span>
                        <span className="ticket-val-attendee">{currentAttendeeName}</span>
                      </div>

                      <div className="ticket-field-row">
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">EMAIL</span>
                          <span className="ticket-val-mono">{currentAttendeeEmail}</span>
                        </div>
                        <div className="ticket-subfield">
                          <span className="ticket-lbl">AFFILIATION</span>
                          <span className="ticket-val">{currentAttendeeOrg}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-dash-rule" />

                    <div className="ticket-verification-block">
                      <div className="ticket-ref-row">
                        <span className="ticket-lbl">PASS REFERENCE // LOCAL PREVIEW</span>
                        <span className="ticket-ref-code">{ticketRefCode}</span>
                      </div>

                      <div className="ticket-timestamp-row">
                        <span>ISSUED: {issuedTimestamp}</span>
                        <span>DISPATCH TERMINAL #01</span>
                      </div>

                      <div className="ticket-barcode-wrap" aria-label={`Barcode for reference ${ticketRefCode}`}>
                        <svg className="ticket-barcode-svg" viewBox="0 0 280 48" preserveAspectRatio="none">
                          <rect x="0" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="5" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="9" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="16" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="20" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="26" y="0" width="5" height="48" fill="#18151D" />
                          <rect x="34" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="38" y="0" width="3.5" height="48" fill="#18151D" />
                          <rect x="44" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="48" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="55" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="60" y="0" width="4.5" height="48" fill="#18151D" />
                          <rect x="67" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="72" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="76" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="82" y="0" width="5" height="48" fill="#18151D" />
                          <rect x="90" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="95" y="0" width="3.5" height="48" fill="#18151D" />
                          <rect x="101" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="106" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="113" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="117" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="123" y="0" width="5" height="48" fill="#18151D" />
                          <rect x="131" y="0" width="2.5" height="48" fill="#18151D" />
                          <rect x="136" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="141" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="148" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="152" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="158" y="0" width="5.5" height="48" fill="#18151D" />
                          <rect x="166" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="171" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="176" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="180" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="187" y="0" width="2.5" height="48" fill="#18151D" />
                          <rect x="192" y="0" width="5" height="48" fill="#18151D" />
                          <rect x="200" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="204" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="210" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="214" y="0" width="4.5" height="48" fill="#18151D" />
                          <rect x="221" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="226" y="0" width="3.5" height="48" fill="#18151D" />
                          <rect x="232" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="236" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="243" y="0" width="1.5" height="48" fill="#18151D" />
                          <rect x="247" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="253" y="0" width="5" height="48" fill="#18151D" />
                          <rect x="261" y="0" width="2" height="48" fill="#18151D" />
                          <rect x="266" y="0" width="3" height="48" fill="#18151D" />
                          <rect x="272" y="0" width="4" height="48" fill="#18151D" />
                          <rect x="278" y="0" width="2" height="48" fill="#18151D" />
                        </svg>
                        <div className="barcode-number-row">
                          <span>* {ticketRefCode} *</span>
                        </div>
                      </div>

                      <div className="ticket-disclaimer-box">
                        <p>
                          <strong>NOTICE:</strong> This is a locally generated commemorative pass preview.
                          Generating or holding this pass does not guarantee entrance capacity or confirm official registration.
                          Physical admission is verified via authorized chapter registration desks.
                        </p>
                      </div>
                    </div>

                    <div className="ticket-scallop-edge ticket-scallop-edge--bottom" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* ─── Ticket Output Controls ─────────────────────────────────── */}
              <div className="ticket-output-controls">
                <button
                  type="button"
                  className="ticket-action-btn ticket-action-btn--print"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  title="Print this ticket"
                >
                  <Printer size={16} />
                  <span>PRINT TICKET</span>
                </button>

                <button
                  type="button"
                  className="ticket-action-btn ticket-action-btn--download"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isPrinting}
                  title="Download ticket as PDF"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>CREATING PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>DOWNLOAD PDF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="ticket-print-guidance">
                <span>Print optimization active: Only the thermal ticket preview is sent to the printer.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
