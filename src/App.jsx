import React from 'react'
import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Navbar from './components/Navbar'
import Story from './components/Story'
import TeamSection from './components/TeamSection'
import Contact from './components/Contact'
import Services from './components/Services'
import Clients from './components/Clients'
import LetWork from './components/LetWork'
import BelieveHeading from './components/TextEffects/BelieveHeading'
import MillionDollarScrollbar from './components/MillionDollarScrollbar'
import ConnectingVisions from './components/ConnectingVisions'
import ScrollVelocity from './components/Scrolls/ScrollVelocity'
import ProjectsSection from './components/ProjectsSection'
import Preloader from './components/Preloader'
import NotFound404 from './components/NotFound404';
import ElevenLabsWidget from './components/ElevenLabsWidget'


//
const knownPaths = [
  '/', '/about', '/services', '/projects', '/story', '/believe', '/clients', '/letwork', '/connecting', '/team', '/contact'
];

const getCurrentPath = () => window.location.pathname.replace(/\/+$/, '') || '/';




const App = () => {
  const [loading, setLoading] = useState(true);
  const [showWidget, setShowWidget] = useState(false);
 
  const currentPath = getCurrentPath();
  const isKnown = knownPaths.includes(currentPath);

   // Handle scroll event for voice bot widget
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show widget when scrolled past 50% of the page
      if (scrollY + windowHeight >= docHeight / 2) {
        setShowWidget(true);
      }
    };

     window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: "hero", title: "Hero",color:"#3B82F6" },
    { id: "about", title: "About",color:"#60A5FA" },
    { id: "services", title: "Services",color:'#EC4899' },
    { id: "story", title: "Story", color: '#F59E0B' },
    { id: "projects", title: "Projects", color: '#22C55E' },
    { id: "believe", title: "Believe", color: '#60A5FA' },
    { id: "clients", title: "Clients", color: '#EC4899' },
    { id: "letwork", title: "Let Work", color: '#F59E0B' },
    { id: "connecting", title: "Connecting", color: '#22C55E' },
    { id: "team", title: "Team", color: '#22C55E' },
    { id: "contact", title: "Contact", color: '##e2e8f0' },

    
  ];


  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden '>
     {loading && <Preloader onFinish={() => setLoading(false)} />}
      
      {!loading && (
        isKnown ? (
      <>
      <Navbar />
      <MillionDollarScrollbar sections={sections} />
  
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="projects"><ProjectsSection /></section>
      <section id="story" ><Story /></section>
      <section id="believe"><BelieveHeading /></section>
      <ScrollVelocity texts={['VIDANA', 'CONSULTING']} velocity={100} className="custom-scroll-text"/>
      <section><ConnectingVisions /></section>
      <section id="clients"><Clients /></section>
      <section id="team"><TeamSection /></section>
      <section id="letwork"> <LetWork /></section>
            <section id="contact"><Contact /></section>
            {showWidget && <ElevenLabsWidget />}
          </>
          ) : (
          <NotFound404 />
        )
      )}

   </main>
  )
}

export default App