import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // We'll create this

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <header className="welcome-header">
        <div className="welcome-nav">
          <div className="welcome-logo">
            <span className="logo-gradient">FocusFlow</span>
          </div>
          <div className="welcome-nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
        
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your <span className="gradient-text">Productivity</span> with Smart Focus
            </h1>
            <p className="hero-subtitle">
              FocusFlow combines intelligent task management with time tracking to help you achieve more in less time. 
              Built for deep work, designed for results.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-primary btn-large">
                Start Free Trial
              </Link>
              <Link to="/login" className="btn-secondary btn-large">
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Productive Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Focus Hours</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              {/* This would be a screenshot or animation of the dashboard */}
              <div className="mock-dashboard">
                <div className="mock-header">
                  <div className="mock-nav">
                    <span className="mock-logo">FocusFlow</span>
                    <div className="mock-user">👤</div>
                  </div>
                </div>
                <div className="mock-grid">
                  <div className="mock-card card-timer">
                    <div className="mock-timer">25:00</div>
                    <div className="mock-buttons">
                      <div className="mock-btn primary">Start Focus</div>
                      <div className="mock-btn secondary">Reset</div>
                    </div>
                  </div>
                  <div className="mock-card card-stats">
                    <div className="mock-stats-grid">
                      <div className="mock-stat">23.5h</div>
                      <div className="mock-stat">6</div>
                      <div className="mock-stat">42</div>
                      <div className="mock-stat">85%</div>
                    </div>
                  </div>
                  <div className="mock-card card-tasks">
                    <div className="mock-task active">Deep Work Project</div>
                    <div className="mock-task">Break + Walk</div>
                    <div className="mock-task completed">Emails</div>
                  </div>
                  <div className="mock-card card-chart">
                    <div className="mock-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features for Maximum Focus</h2>
          <p className="section-subtitle">Everything you need to eliminate distractions and get things done</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Smart Focus Timer</h3>
            <p>Pomodoro technique with adaptive breaks based on your focus patterns. Works with your natural rhythm.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>Track your productivity trends, identify peak hours, and get personalized insights for improvement.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>AI Task Prioritization</h3>
            <p>Automatically organize tasks by urgency and importance. Focus on what matters most.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Cross-Platform Sync</h3>
            <p>Access your focus sessions anywhere. Desktop, mobile, tablet – your data is always in sync.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚫</div>
            <h3>Distraction Blocker</h3>
            <p>Temporarily block distracting websites and apps during focus sessions. Stay on track.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Share focus sessions, coordinate deep work hours, and track team productivity together.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How FocusFlow Works</h2>
          <p className="section-subtitle">Get started in minutes, see results immediately</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Add Your Tasks</h3>
              <p>Import tasks from your favorite tools or create new ones. Set priorities and estimated times.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Start Focusing</h3>
              <p>Select a task and start the timer. Our intelligent system adapts to your work patterns.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Track Progress</h3>
              <p>Watch your productivity grow with detailed analytics and beautiful visualizations.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Achieve More</h3>
              <p>Complete more meaningful work in less time. Build habits that lead to long-term success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Trusted by Productive People</h2>
          <p className="section-subtitle">See what our users have to say</p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">
              "FocusFlow helped me double my productive output. The analytics showed me I was most productive in the mornings, so I reshaped my schedule."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍💼</div>
              <div className="author-info">
                <div className="author-name">Sarah Chen</div>
                <div className="author-role">Software Engineer</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "As a student, staying focused is challenging. FocusFlow's timer and task management helped me study more effectively for finals."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🎓</div>
              <div className="author-info">
                <div className="author-name">Marcus Johnson</div>
                <div className="author-role">University Student</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "Our remote team uses FocusFlow to coordinate deep work hours. It's transformed how we collaborate across time zones."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍💼</div>
              <div className="author-info">
                <div className="author-name">David Park</div>
                <div className="author-role">Team Lead</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Transform Your Productivity?</h2>
          <p>Join thousands of users who are getting more done with FocusFlow. No credit card required.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary btn-large">
              Start Free Today
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Sign In
            </Link>
          </div>
          <div className="cta-features">
            <span>✓ Free 14-day trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-gradient">FocusFlow</span>
            <p>Smart focus for productive people.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#">Pricing</a>
              <a href="#">Updates</a>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Community</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;