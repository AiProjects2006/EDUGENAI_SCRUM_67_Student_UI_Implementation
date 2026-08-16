import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOceanAudio } from '../../../context/AudioContext';
import OceanBackground from '../../../components/layout/OceanBackground/OceanBackground';
import './LandingPage.css';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();
  const { isVoiceEnabled, isBgmPlaying, triggerMascotVoice, toggleVoiceSystem, toggleBgmSystem } = useOceanAudio();

  React.useEffect(() => {
    triggerMascotVoice("Hi! I'm Bubbles! Welcome to our magical ocean adventure!");
  }, [triggerMascotVoice]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Background Ocean Decor (specific to Landing Page, since OceanLayout is not wrapping this) */}
      <OceanBackground />
      <div className="ocean-background">
        <div className="light-ray-1"></div>
        <div className="light-ray-2"></div>
        <div className="bubble-container" id="background-bubbles">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="bubble" 
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 8}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        <div className="floating-items-container">
          <div className="float-item letter-a">A</div>
          <div className="float-item letter-b">B</div>
          <div className="float-item number-1">1</div>
          <div className="float-item number-2">2</div>
          <div className="float-item book-icon"><i className="fa-solid fa-book-open"></i></div>
          <div className="float-item atom-icon"><i className="fa-solid fa-atom"></i></div>
          <div className="float-item fish-1"><i className="fa-solid fa-fish"></i></div>
          <div className="float-item fish-2"><i className="fa-solid fa-fish-fins"></i></div>
        </div>
      </div>

      {/* Global Sound Control Indicator */}
      <div className="global-audio-controller">
        <button 
          id="btn-global-voice" 
          className={`audio-btn ${!isVoiceEnabled ? 'muted' : ''}`} 
          title="Toggle Bubbles Voice Guidance"
          onClick={toggleVoiceSystem}
        >
          {isVoiceEnabled ? <i className="fa-solid fa-volume-high"></i> : <i className="fa-solid fa-volume-xmark"></i>}
        </button>
        <button 
          id="btn-global-bgm" 
          className={`audio-btn ${!isBgmPlaying ? 'muted' : ''}`} 
          title="Toggle Magical Ambient BGM"
          onClick={toggleBgmSystem}
        >
          {isBgmPlaying ? <i className="fa-solid fa-music"></i> : <i className="fa-solid fa-music-slash"></i>}
        </button>
      </div>

      <div className="app-shell full-width" id="app-shell">
        <main className="main-content" id="main-content">
          <section id="page-landing" className="app-view active-view">
            <div className="landing-hero-container">
             <div>
              <div className="landing-hero-main">
                <div className="hero-left">
                  <div className="badge-premium"><i className="fa-solid fa-crown"></i> Play to Learn!</div>
                  <h1 className="landing-title">AI-Powered School<br/><span className="highlight-text">Student Learning Aid</span></h1>
                  <p className="landing-desc">Ditch the boring dashboards! Dive into a magical underwater adventure game where solving quizzes unlocks coral treasures, builds your ocean empire, and helps you master school like a gaming legend.</p>
                  
                  <div className="hero-btn-group">
                    <button className="btn btn-primary btn-large btn-bounce" onClick={() => navigate('/registration')}>Get Started <i className="fa-solid fa-arrow-right"></i></button>
                    <button className="btn btn-secondary btn-large" onClick={() => navigate('/login')}>Login</button>
                  </div>
                  <div className="landing-sub-links">
                    <button className="text-btn" onClick={() => scrollToSection('about-platform')}>About Adventure</button> • 
                    <button className="text-btn" onClick={() => scrollToSection('how-it-works')}>How it Works</button> • 
                    <button className="text-btn" onClick={() => scrollToSection('landing-faqs')}>Contact & FAQ</button>
                  </div>
                </div>
                
                <div className="hero-right">
                  <div className="floating-mascot-showcase">
                    <div className="mascot-glowing-backdrop"></div>
                    <div className="showcase-octopus-container">
                      <div className="mascot-octopus floating" style={{ width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="/octopus.png" alt="Bubbles Mascot" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'hue-rotate(180deg) brightness(1.1) saturate(1.2)' }} />
                      </div>
                    </div>
                    <div className="hero-bubble-chat">
                      <p>"Hi, explorer! I'm <strong>Bubbles</strong>, your baby octopus AI buddy. Let's start our underwater learning quest!"</p>
                      <button className="bubbles-voice-btn" onClick={() => triggerMascotVoice("Hi, explorer! I am Bubbles, your baby octopus AI buddy. Let us start our underwater learning quest!")}>
                        <i className="fa-solid fa-volume-high"></i> Listen
                      </button>
                    </div>
                  </div>
                </div>

              </div>
              <div id="magical-powers" className="highlight-split-section">
                {/*<h2 className="section-title text-center">🐚 Magical Superpowers</h2>*/}
                <div className="landing-features-grid1">
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("10k+. Students")} style={{cursor: 'pointer'}}>
                    {/*<div className="feat-icon" ><i className="fa-solid fa-wand-magic-sparkles"></i></div>*/}
                    <h3>10k+</h3>
                    <p>Students</p>
                  </div>
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("500+. Resources")} style={{cursor: 'pointer'}}>
                    {/*<div className="feat-icon" ><i className="fa-solid fa-lightbulb"></i></div>*/}
                    <h3>500+</h3>
                    <p>Resources</p>
                  </div>
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("100k+. Activities")} style={{cursor: 'pointer'}}>
                    {/*<div className="feat-icon" ><i className="fa-solid fa-gamepad"></i></div>*/}
                    <h3>100k+</h3>
                    <p>Activities</p>
                  </div>
                  {/*<div className="feature-item-card" onClick={() => triggerMascotVoice("Voice-Guided. Bubbles reads notes, checks inputs, and talks you through answers.")} style={{cursor: 'pointer'}}>*/}
                  {/*  <div className="feat-icon" ><i className="fa-solid fa-microphone-lines"></i></div>*/}
                  {/*  <h3>Voice-Guided</h3>*/}
                  {/*  <p>Bubbles reads notes, checks inputs, and talks you through answers.</p>*/}
                  {/*</div>*/}
                </div>
              </div>
              <div id="magical-powers" className="highlight-split-section">
              <h2 className="section-title text-center">🐚 Magical Superpowers</h2>
              <div className="landing-features-grid">
                <div className="feature-item-card" onClick={() => triggerMascotVoice("AI Activities. Custom generated lessons tailored dynamically to your needs.")} style={{cursor: 'pointer'}}>
                  <div className="feat-icon" ><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                  <h3>AI Activities</h3>
                  <p>Custom generated lessons tailored dynamically to your needs.</p>
                </div>
                <div className="feature-item-card" onClick={() => triggerMascotVoice("Smart Suggest. Recommends topics automatically based on your mistakes.")} style={{cursor: 'pointer'}}>
                  <div className="feat-icon" ><i className="fa-solid fa-lightbulb"></i></div>
                  <h3>Smart Suggest</h3>
                  <p>Recommends topics automatically based on your mistakes.</p>
                </div>
                <div className="feature-item-card" onClick={() => triggerMascotVoice("Gamified Quizzes. Earn XP, Coins, Stars, and unlock level maps as you learn.")} style={{cursor: 'pointer'}}>
                  <div className="feat-icon" ><i className="fa-solid fa-gamepad"></i></div>
                  <h3>Gamified Quizzes</h3>
                  <p>Earn XP, Coins, Stars, and unlock level maps as you learn.</p>
                </div>
                <div className="feature-item-card" onClick={() => triggerMascotVoice("Voice-Guided. Bubbles reads notes, checks inputs, and talks you through answers.")} style={{cursor: 'pointer'}}>
                  <div className="feat-icon" ><i className="fa-solid fa-microphone-lines"></i></div>
                  <h3>Voice-Guided</h3>
                  <p>Bubbles reads notes, checks inputs, and talks you through answers.</p>
                </div>
              </div>
            </div>
           </div>
              <div id="how-it-works" className="highlight-split-section">
                <h2 className="section-title text-center">How It Works</h2>
                <div className="landing-features-grid">
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("1st . AI Generates. AI engine analyzes and builds diverse activity types instantly.")} style={{cursor: 'pointer', borderRadius: '30px'}}>
                    <div className="feat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--blue-grad)', color: 'var(--ocean-dark)', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 15px auto' }}>1</div>
                    <h3>AI Generates</h3>
                    <p>AI engine analyzes and builds diverse activity types instantly.</p>
                  </div>
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("2nd . Engage with quizzes,flashcards, and short answers in a focus mode.")} style={{cursor: 'pointer', borderRadius: '30px'}}>
                    <div className="feat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--blue-grad)', color: 'var(--ocean-dark)', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 15px auto' }}>2</div>
                    <h3>Student Practice</h3>
                    <p>Engage with quizzes,flashcards, and short answers in a focus mode.</p>
                  </div>
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("3rd . Evaluation. Get instant grading and detailed feedback on every response.")} style={{cursor: 'pointer', borderRadius: '30px'}}>
                    <div className="feat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--blue-grad)', color: 'var(--ocean-dark)', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 15px auto' }}>3</div>
                    <h3>Evaluation</h3>
                    <p>Get instant grading and detailed feedback on every response.</p>
                  </div>
                  <div className="feature-item-card" onClick={() => triggerMascotVoice("4th . Personalized Path. Receive custom recommendations based on your performance data.")} style={{cursor: 'pointer', borderRadius: '30px'}}>
                    <div className="feat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--blue-grad)', color: 'var(--ocean-dark)', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 15px auto' }}>4</div>
                    <h3>Personalized Path</h3>
                   <p>Receive custom recommendations based on your performance data.</p>
                  </div>
                </div>
              </div>

              <div id="engineered-ages" className="highlight-split-section">
                <h2 className="section-title text-center">Engineered for All Ages</h2>
                <div className="split-cards-container">
                  <div className="feature-item-card primary-split split-card" onClick={() => triggerMascotVoice("For Primary Students . Fun learning games , Voice support ,  Rewards & Badges , Animated lessons ")} style={{cursor: 'pointer'}}>
                  {/*<div className="split-card primary-split">*/}
                    <div className="split-badge">Grades 3 - 5</div>


                    <h2>For Primary Students</h2>
                    <ul className="split-list">
                      <li><i className="fa-solid fa-circle-check"></i> <strong>🎮 Fun learning games</strong> </li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>🔊 Voice support</strong> </li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>🎁 Rewards & Badges</strong> </li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>🐠 Animated lessons</strong> </li>
                    </ul>
                    {/*</div>*/}
                    {/*<button className="btn btn-primary" onClick={() => navigate('/register', {state: {gradeGroup: 'primary'}})}>Enter Kids Portal</button>*/}
                  </div>
                  <div className=" split-card secondary-split feature-item-card primary-split split-card" onClick={() => triggerMascotVoice("For Secondary Students . Structured learning , AI assistant ,  Practice exams , Progress analytics ")} style={{cursor: 'pointer'}}>

                  {/*<div className="split-card secondary-split">*/}
                    <h2>For Secondary Students</h2>
                    <ul className="split-list">

                      <div className="split-badge">Grades 6 - 11</div>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>📚 Structured learning</strong> </li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>🤖 AI assistant</strong></li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>📝 Practice exams</strong></li>
                      <li><i className="fa-solid fa-circle-check"></i> <strong>📈 Progress analytics</strong></li>
                    </ul>
                    {/*<button className="btn btn-secondary" onClick={() => navigate('/register', {state: {gradeGroup: 'secondary'}})}>Enter Teens Portal</button>*/}
                  </div>

                </div>
              </div>

              <div id="trusted-explorers" className="highlight-split-section">
                <h2 className="section-title text-center">Trusted by Sea Explorers</h2>
                {/*<div className="text-center">Hear what parents and teachers say about Bubbles the learning buddy</div>*/}
                <div className="split-cards-container">

                  <div className="testimonials-slider">
                    {/*<h3>What Explorers Say</h3>*/}
                    <div className="testimonial-card">
                      <p className="quote">"I used to hate doing math homework, but on OceanAid, I just want to beat the Pearl Bridge levels. Bubbles is the cutest math teacher ever!"</p>
                      <div className="author">
                        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Timmy" alt="Timmy" className="author-img" />
                        <div>
                          <h5>Timmy R.</h5>
                          <span>Grade 4 Explorer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="testimonials-slider">
                    {/*<h3>What Explorers Say</h3>*/}
                    <div className="testimonial-card">
                      <p className="quote">"I used to hate doing math homework, but on OceanAid, I just want to beat the Pearl Bridge levels. Bubbles is the cutest math teacher ever!"</p>
                      <div className="author">
                        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Timmy" alt="Timmy" className="author-img" />
                        <div>
                          <h5>Timmy R.</h5>
                          <span>Grade 4 Explorer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>



              {/*<div id="landing-faqs" className="landing-faqs-section">*/}
              {/*  <h2 className="section-title text-center">❓ Frequently Asked Quests</h2>*/}
              {/*  <div className="faq-accordion">*/}
              {/*    <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}>*/}
              {/*      <div className="faq-question">How does Bubbles help with learning? <i className="fa-solid fa-chevron-down"></i></div>*/}
              {/*      <div className="faq-answer"><p>Bubbles floats by your side and uses advanced text-to-speech to read out reading paragraphs, suggests hints when you are stuck, and changes facial expressions dynamically as you solve quiz items.</p></div>*/}
              {/*    </div>*/}
              {/*    <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}>*/}
              {/*      <div className="faq-question">What subjects are supported? <i className="fa-solid fa-chevron-down"></i></div>*/}
              {/*      <div className="faq-answer"><p>We currently provide sri Lanka Local syllabus English medium for Mathematics, ICT , and Science corresponding to grades 3 through 11.</p></div>*/}
              {/*    </div>*/}
              {/*    <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}>*/}
              {/*      <div className="faq-question">Is there parent monitoring? <i className="fa-solid fa-chevron-down"></i></div>*/}
              {/*      <div className="faq-answer"><p>Yes! Parents can review activity completion reports, identify areas where their child needs improvement.</p></div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <footer className="landing-footer">
                <div className="footer-links">
                  <a href="#">Terms of Adventure</a>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Support Base</a>
                  <a href="#">Join the Crew</a>
                </div>
                <p>© 2026 AI-Powered School Student Learning Aid. Crafting magical learning moments under the sea.</p>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
