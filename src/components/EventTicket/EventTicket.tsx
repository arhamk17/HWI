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
  const [printerType, setPrinterType] = useState<'thermal' | 'matrix'>('thermal');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isTorn, setIsTorn] = useState<boolean>(false);
  const [isArmed, setIsArmed] = useState<boolean>(false);
  const [isFeeding, setIsFeeding] = useState<boolean>(false);
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

  const triggerPrintFlow = (onFeedStart?: () => void) => {
    if (isBusy || isTorn) return;

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      if (onFeedStart) onFeedStart();
      return;
    }

    // Step 1: Tear off existing paper with realistic drop rotation
    setIsTorn(true);

    if (printTimerRef.current) clearTimeout(printTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    // Step 2: After 600ms (paper drops away), reset receipt inside slot and activate motor buzz
    printTimerRef.current = setTimeout(() => {
      setIsTorn(false);
      setIsArmed(true);
      setIsBusy(true);

      if (onFeedStart) {
        onFeedStart();
      }

      // Step 3: Brief tick for CSS transform to compute translateY(-100%), then smoothly feed out
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsArmed(false);
          setIsFeeding(true);

          // Step 4: Settle print after feed completes (~1.4s)
          resetTimerRef.current = setTimeout(() => {
            setIsFeeding(false);
            setIsBusy(false);
          }, 1400);
        }, 50);
      });
    }, 600);
  };

  const handleReprint = () => {
    triggerPrintFlow();
  };

  const handlePreviewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isBusy || isTorn) return;

    const code = generateTicketCode(formData.name, formData.eventId);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    triggerPrintFlow(() => {
      setPrintedData({ ...formData });
      setTicketRefCode(code);
      setIssuedTimestamp(`${dateStr} • ${timeStr} IST`);
      setFormSubmitted(true);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isDownloading || isBusy || isTorn) return;
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
                    disabled={isBusy || isTorn}
                    id="preview-ticket-btn"
                  >
                    {isBusy ? (
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
                <span className="preview-kicker">PASS DISPATCH ENGINE</span>
                <span className="preview-mode-tag">
                  {formSubmitted ? 'PERSONALIZED PASS' : 'SAMPLE PASS'}
                </span>
              </div>

              {/* ─── Unified Thermal & Dot Matrix Printer Stage ───────────────── */}
              <div className="stage" data-printer={printerType}>
                {/* Mode toggle and Reprint button */}
                <div className="printer-bar">
                  <div className="printer-pick" role="group" aria-label="Printer Type">
                    <button
                      type="button"
                      aria-pressed={printerType === 'thermal'}
                      onClick={() => setPrinterType('thermal')}
                    >
                      Thermal
                    </button>
                    <button
                      type="button"
                      aria-pressed={printerType === 'matrix'}
                      onClick={() => setPrinterType('matrix')}
                    >
                      Dot matrix
                    </button>
                  </div>
                  <button
                    type="button"
                    className="printer-btn"
                    onClick={handleReprint}
                    disabled={isBusy || isTorn}
                    title="Reprint pass with authentic mechanical animation"
                  >
                    <RefreshCw size={12} className={isBusy ? 'spin-icon' : ''} />
                    <span>Reprint</span>
                  </button>
                </div>

                {/* Hardware Printer Chassis */}
                <div className={`printer ${isBusy ? 'is-busy' : ''}`} aria-hidden="true">
                  {printerType === 'thermal' ? (
                    <>
                      <span className={`printer-led ${isBusy ? '' : 'is-live'}`} />
                      <span className="printer-label">HACKWITHINDIA · PASS DISPATCH</span>
                      <span className="printer-slot" />
                      <span className="printer-cutter" />
                    </>
                  ) : (
                    <>
                      <div className="matrix-panel">
                        <span className={`printer-led ${isBusy ? '' : 'is-live'}`} />
                        <span>HWI-9PIN</span>
                      </div>
                      <div className="matrix-window">
                        <div className="matrix-head" />
                      </div>
                      <span className="printer-slot" />
                    </>
                  )}
                </div>

                {/* Receipt Paper Hang Container with Tear & Feed */}
                <div className={`receipt-hang ${isTorn ? 'is-torn' : ''} ${isFeeding ? 'is-feeding' : ''}`}>
                  <div
                    className="receipt"
                    ref={ticketRef}
                    id="hwi-thermal-ticket"
                    style={{
                      transform: isArmed
                        ? 'translateY(-100%)'
                        : isFeeding
                        ? 'translateY(0%)'
                        : undefined,
                      transition: isFeeding
                        ? 'transform 1.35s cubic-bezier(0.16, 1, 0.3, 1)'
                        : isArmed
                        ? 'none'
                        : undefined,
                    }}
                  >
                    <header className="r-head">
                      <p className="r-brand">HACK WITH INDIA</p>
                      <p className="r-sub">BVUDET NAVI MUMBAI · CHAPTER ADMISSION PASS</p>
                      <p className="r-doc">Official Event Receipt</p>
                      <div className="r-meta">
                        <span>Pass #{ticketRefCode}</span>
                        <span>{issuedTimestamp}</span>
                      </div>
                    </header>

                    <hr />

                    <section aria-labelledby="r-up">
                      <div className="r-title">
                        <h3 id="r-up">{selectedEvent.title}</h3>
                        <span className="r-tag">CONFIRMED</span>
                      </div>
                      <div className="r-next">
                        <p className="r-big">COMMEMORATIVE PASS</p>
                        <p className="r-sum">
                          Official builder dispatch for {currentAttendeeName} ({currentAttendeeOrg}). Admitted to engineering focus track: {currentTrack}.
                        </p>
                        <div className="r-lines">
                          <div className="r-line">
                            <span>Attendee</span>
                            <i aria-hidden="true" />
                            <span>{currentAttendeeName}</span>
                          </div>
                          <div className="r-line">
                            <span>Email</span>
                            <i aria-hidden="true" />
                            <span>{currentAttendeeEmail}</span>
                          </div>
                          <div className="r-line">
                            <span>Edition</span>
                            <i aria-hidden="true" />
                            <span>
                              {selectedEvent.edition
                                ? selectedEvent.edition.toLowerCase().startsWith('edition')
                                  ? selectedEvent.edition
                                  : `Edition ${selectedEvent.edition}`
                                : `Edition (${selectedEvent.year})`}
                            </span>
                          </div>
                          <div className="r-line">
                            <span>Date</span>
                            <i aria-hidden="true" />
                            <span>{selectedEvent.date || 'To Be Announced'}</span>
                          </div>
                          <div className="r-line">
                            <span>Venue</span>
                            <i aria-hidden="true" />
                            <span>{selectedEvent.venue || 'BVUDET Navi Mumbai'}</span>
                          </div>
                          <div className="r-line">
                            <span>Track</span>
                            <i aria-hidden="true" />
                            <span>{currentTrack}</span>
                          </div>
                          <div className="r-line">
                            <span>Access</span>
                            <i aria-hidden="true" />
                            <span>GENERAL BUILDER PASS</span>
                          </div>
                          <div className="r-line">
                            <span>Status</span>
                            <i aria-hidden="true" />
                            <span>AUTHENTICATED</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <hr />

                    <div className="r-lines">
                      <div className="r-line">
                        <span>Chapter Builders</span>
                        <i aria-hidden="true" />
                        <span>800+</span>
                      </div>
                      <div className="r-line">
                        <span>Active Core</span>
                        <i aria-hidden="true" />
                        <span>41</span>
                      </div>
                      <div className="r-line">
                        <span>Flagship Runs</span>
                        <i aria-hidden="true" />
                        <span>07 Editions</span>
                      </div>
                      <div className="r-line">
                        <span>Station</span>
                        <i aria-hidden="true" />
                        <span>Terminal #01</span>
                      </div>
                    </div>

                    <hr />

                    <footer className="r-foot">
                      <svg className="r-barcode" viewBox="0 0 280 44" preserveAspectRatio="none" aria-hidden="true">
                        <rect x="0" y="0" width="3" height="44" />
                        <rect x="5" y="0" width="2" height="44" />
                        <rect x="9" y="0" width="4" height="44" />
                        <rect x="16" y="0" width="1.5" height="44" />
                        <rect x="20" y="0" width="3" height="44" />
                        <rect x="26" y="0" width="5" height="44" />
                        <rect x="34" y="0" width="2" height="44" />
                        <rect x="38" y="0" width="3.5" height="44" />
                        <rect x="44" y="0" width="1.5" height="44" />
                        <rect x="48" y="0" width="4" height="44" />
                        <rect x="55" y="0" width="2" height="44" />
                        <rect x="60" y="0" width="4.5" height="44" />
                        <rect x="67" y="0" width="2" height="44" />
                        <rect x="72" y="0" width="1.5" height="44" />
                        <rect x="76" y="0" width="3" height="44" />
                        <rect x="82" y="0" width="5" height="44" />
                        <rect x="90" y="0" width="2" height="44" />
                        <rect x="95" y="0" width="3.5" height="44" />
                        <rect x="101" y="0" width="2" height="44" />
                        <rect x="106" y="0" width="4" height="44" />
                        <rect x="113" y="0" width="1.5" height="44" />
                        <rect x="117" y="0" width="3" height="44" />
                        <rect x="123" y="0" width="5" height="44" />
                        <rect x="131" y="0" width="2.5" height="44" />
                        <rect x="136" y="0" width="2" height="44" />
                        <rect x="141" y="0" width="4" height="44" />
                        <rect x="148" y="0" width="1.5" height="44" />
                        <rect x="152" y="0" width="3" height="44" />
                        <rect x="158" y="0" width="5.5" height="44" />
                        <rect x="166" y="0" width="2" height="44" />
                        <rect x="171" y="0" width="3" height="44" />
                        <rect x="176" y="0" width="1.5" height="44" />
                        <rect x="180" y="0" width="4" height="44" />
                        <rect x="187" y="0" width="2.5" height="44" />
                        <rect x="192" y="0" width="5" height="44" />
                        <rect x="200" y="0" width="2" height="44" />
                        <rect x="204" y="0" width="3" height="44" />
                        <rect x="210" y="0" width="1.5" height="44" />
                        <rect x="214" y="0" width="4.5" height="44" />
                        <rect x="221" y="0" width="2" height="44" />
                        <rect x="226" y="0" width="3.5" height="44" />
                        <rect x="232" y="0" width="2" height="44" />
                        <rect x="236" y="0" width="4" height="44" />
                        <rect x="243" y="0" width="1.5" height="44" />
                        <rect x="247" y="0" width="3" height="44" />
                        <rect x="253" y="0" width="5" height="44" />
                        <rect x="261" y="0" width="2" height="44" />
                        <rect x="266" y="0" width="3" height="44" />
                        <rect x="272" y="0" width="4" height="44" />
                        <rect x="278" y="0" width="2" height="44" />
                      </svg>
                      <div className="barcode-number-row">
                        <span>* {ticketRefCode} *</span>
                      </div>
                      <p className="r-foot-note">Thank you for building with HWI</p>
                      <p className="r-foot-sub">Keep this receipt for campus badge verification</p>
                    </footer>
                  </div>
                </div>
              </div>

              {/* ─── Ticket Output Controls ─────────────────────────────────── */}
              <div className="ticket-output-controls">
                <button
                  type="button"
                  className="ticket-action-btn ticket-action-btn--print"
                  onClick={handlePrint}
                  disabled={isBusy || isTorn}
                  title="Print this ticket"
                >
                  <Printer size={16} />
                  <span>PRINT TICKET</span>
                </button>

                <button
                  type="button"
                  className="ticket-action-btn ticket-action-btn--download"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isBusy || isTorn}
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
                <span>Print optimization active: Only the authentic receipt pass is sent to the printer.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
