import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';

export default function GalleryPage() {
  return (
    <main>
      {/* Calm Cinematic Atmosphere Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 10%, rgba(0, 240, 255, 0.12) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <Navigation />
      
      <div style={{ padding: 'calc(var(--space-section) + 64px) 0 var(--space-section)', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-24)' }}>
          <h1 className="type-display text-primary" style={{ marginBottom: 'var(--space-64)' }}>
            HACKWITHINDIA<br/>
            <span className="text-secondary">GALLERY</span>
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gridAutoRows: '250px', 
            gap: 'var(--space-24)' 
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                gridRowEnd: i % 3 === 0 ? 'span 2' : 'span 1'
              }}>
                <div style={{ 
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase'
                }}>
                  Memory {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
