import { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import './styles/globals.css';
import { ThemeProvider } from './styles/themeContexts';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { NotFound } from './components/404';

function MainContent() {
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [, setContactVisible] = useState(false);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01 
    };

    const projectsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setProjectsVisible(true);
        } else {
          setProjectsVisible(false);
        }
      });
    }, options);

    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setContactVisible(true);
        } else {
          setContactVisible(false);
        }
      });
    }, options);

    if (projectsRef.current) {
      projectsObserver.observe(projectsRef.current);
    }

    if (contactRef.current) {
      contactObserver.observe(contactRef.current);
    }

    return () => {
      projectsObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark transition-colors duration-200">
      <Navigation />
      <Hero />
      
      {/* Projects Section */}
      <div ref={projectsRef} className="min-h-screen">
        <Projects isVisible={projectsVisible} />
      </div>

      {/* Contact Section */}
      <div ref={contactRef} className="min-h-screen">
        <Contact />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router basename="/yohanes-kevin">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;