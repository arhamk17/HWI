'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FooterChapter } from '@/components/chapters/FooterChapter';
import './JoinForm.css';

export default function JoinPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    department: '',
    interests: '',
    skills: '',
    motivation: '',
    portfolio: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current.querySelector('.join-content'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call for backend-ready architecture
    setTimeout(() => {
      // In real implementation: await fetch('/api/join', { method: 'POST', body: JSON.stringify(formData) })
      console.log('Submitted Payload:', formData);
      setStatus('success');
    }, 1500);
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }} ref={containerRef}>
      <section className="chapter" style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="container join-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-64)', alignItems: 'start' }}>
          
          {/* Left: Typography & Context */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <p className="type-eyebrow text-accent" style={{ marginBottom: 'var(--space-16)' }}>JOIN THE CHAPTER</p>
            <h1 className="type-display" style={{ marginBottom: 'var(--space-24)' }}>BUILD<br/>WITH US.</h1>
            <p className="type-body text-secondary" style={{ maxWidth: '400px' }}>
              We are looking for builders, designers, and innovators. Join the HWI BVUDET-NM chapter to push boundaries and ship real projects.
            </p>
          </div>

          {/* Right: The Form */}
          <div className="join-form-wrapper">
            {status === 'success' ? (
              <div className="join-success">
                <h3 className="type-heading-1 text-primary">APPLICATION RECEIVED</h3>
                <p className="type-body text-secondary" style={{ marginTop: 'var(--space-16)' }}>
                  Thank you for applying. Our team will review your application and get back to you soon.
                </p>
                <button className="btn btn--outline" onClick={() => setStatus('idle')} style={{ marginTop: 'var(--space-32)' }}>Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="join-form">
                
                <div className="form-group form-group--full">
                  <h3 className="type-label text-accent" style={{ marginBottom: 'var(--space-16)', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>PERSONAL INFO</h3>
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group form-group--full">
                  <h3 className="type-label text-accent" style={{ marginTop: 'var(--space-32)', marginBottom: 'var(--space-16)', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>ACADEMICS</h3>
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="college">College / University *</label>
                  <input type="text" id="college" name="college" required value={formData.college} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year of Study *</label>
                  <select id="year" name="year" required value={formData.year} onChange={handleChange}>
                    <option value="" disabled>Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>

                <div className="form-group form-group--full">
                  <h3 className="type-label text-accent" style={{ marginTop: 'var(--space-32)', marginBottom: 'var(--space-16)', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>EXPERIENCE & GOALS</h3>
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="interests">Areas of Interest *</label>
                  <input type="text" id="interests" name="interests" placeholder="e.g. Web Dev, AI, Design, Operations" required value={formData.interests} onChange={handleChange} />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="skills">Technical / Creative Skills</label>
                  <textarea id="skills" name="skills" rows={2} value={formData.skills} onChange={handleChange} />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="motivation">Why do you want to join? *</label>
                  <textarea id="motivation" name="motivation" rows={4} required value={formData.motivation} onChange={handleChange} />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="portfolio">Portfolio / GitHub / LinkedIn URL</label>
                  <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} />
                </div>

                <div className="form-group form-group--full" style={{ marginTop: 'var(--space-32)' }}>
                  <button type="submit" className="btn btn--primary" disabled={status === 'loading'} style={{ width: '100%' }}>
                    {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                  </button>
                  {status === 'error' && <p className="text-accent" style={{ marginTop: '8px', fontSize: '14px' }}>Something went wrong. Please try again.</p>}
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      <FooterChapter />
    </main>
  );
}
