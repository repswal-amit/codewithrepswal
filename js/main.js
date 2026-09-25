/* ══════════════════════════════════════════════════════════
   code with repswal — Portfolio Interactions & Animations
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PARTICLE CANVAS BACKGROUND
     ───────────────────────────────────────── */
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
          this.opacity = Math.min(this.opacity + 0.02, 0.8);
        }
      }

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.12;
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });


  /* ─────────────────────────────────────────
     2. TYPING EFFECT
     ───────────────────────────────────────── */
  const roles = [
    'Web Developer 💻',
    'App Developer 📱',
    'Code ka Magician ✨',
    'Bug Crusher 🚀',
    'code with repswal 📚',
    'Tech Community Builder 👥'
  ];
  const typedEl = document.getElementById('typedText');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typedEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // pause before deleting
      }
    } else {
      typedEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // pause before next word
      }
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();


  /* ─────────────────────────────────────────
     3. NAVBAR SCROLL BEHAVIOR
     ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }

    // Active nav link highlight
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) {
        currentSection = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─────────────────────────────────────────
     4. HAMBURGER MENU
     ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ─────────────────────────────────────────
     5. SCROLL REVEAL (Intersection Observer)
     ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  function initReveals() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    reveals.forEach(el => revealObserver.observe(el));
  }
  
  // Initial call for static elements
  initReveals();


  /* ─────────────────────────────────────────
     6. SKILL BAR ANIMATION
     ───────────────────────────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => skillObserver.observe(bar));
  }


  /* ─────────────────────────────────────────
     7. COUNTER ANIMATION
     ───────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(num => counterObserver.observe(num));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easedProgress * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }


  /* ─────────────────────────────────────────
     8. PROJECT FILTER LOGIC
     ───────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  function initProjectFilters() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add tilt effect to dynamically created cards
    projectCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Remove existing event listeners by cloning buttons if needed, or just relying on event delegation
    // For simplicity, we just clear and re-attach or use a boolean flag.
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const projectCards = document.querySelectorAll('.project-card');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.toLowerCase() === filter.toLowerCase()) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ─────────────────────────────────────────
     9. CONTACT FORM (EmailJS + Firestore)
     ───────────────────────────────────────── */
  // Initialize EmailJS
  emailjs.init('181CrxvRfcxOZz4vD');

  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending... ⏳';
    submitBtn.disabled = true;

    try {
      const templateParams = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmailInput').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
      };

      // 1. Send via EmailJS (Optional, but keeping since it was there)
      await emailjs.send('service_q1slzbu', 'template_v31nwfe', templateParams);

      // 2. Save to Firestore for Admin Panel
      if (typeof db !== 'undefined') {
        await db.collection('messages').add({
          ...templateParams,
          status: 'New',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      formSuccess.textContent = '✅ Message sent! Main jald hi reply karunga. 🙏';
      formSuccess.style.color = '';
      formSuccess.classList.add('show');
      submitBtn.textContent = 'Sent! ✅';
      contactForm.reset();
    } catch (error) {
      console.error("Error submitting form: ", error);
      formSuccess.textContent = '❌ Kuch gadbad ho gayi. Please try again!';
      formSuccess.style.color = '#ff6b6b';
      formSuccess.classList.add('show');
      submitBtn.textContent = 'Try Again 🔄';
    }

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      formSuccess.classList.remove('show');
      formSuccess.style.color = '';
    }, 5000);
  });


  /* ─────────────────────────────────────────
     10. SMOOTH ANCHOR SCROLLING
     ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────
     11. FIREBASE DYNAMIC DATA FETCHING
     ───────────────────────────────────────── */
  if (typeof db !== 'undefined') {
    
    // 11.1 Load Profile Settings
    function loadProfileSettings() {
      db.collection('settings').doc('profile').get().then(doc => {
        if(doc.exists) {
          const data = doc.data();
          
          if(data.name && document.getElementById('heroName')) {
            document.getElementById('heroName').innerHTML = `${data.name.split(' ')[0]} <span class="gradient-text">${data.name.split(' ').slice(1).join(' ')}</span>`;
          }
          if(data.bio && document.getElementById('aboutBioText')) {
            document.getElementById('aboutBioText').innerHTML = data.bio;
          }
          
          // Social Links (Hero & Footer)
          if(data.instagram) {
            if(document.getElementById('instaIcon')) document.getElementById('instaIcon').href = data.instagram;
            if(document.getElementById('footerInsta')) document.getElementById('footerInsta').href = data.instagram;
            if(document.getElementById('instaFollowBtn')) document.getElementById('instaFollowBtn').href = data.instagram;
          }
          if(data.github && document.getElementById('githubIcon')) document.getElementById('githubIcon').href = data.github;
          if(data.github && document.getElementById('footerGithub')) document.getElementById('footerGithub').href = data.github;
          if(data.whatsapp && document.getElementById('whatsappIcon')) document.getElementById('whatsappIcon').href = data.whatsapp;
          if(data.whatsapp && document.getElementById('waJoinBtn')) document.getElementById('waJoinBtn').href = data.whatsapp;
          if(data.telegram && document.getElementById('telegramIcon')) document.getElementById('telegramIcon').href = data.telegram;
          if(data.telegram && document.getElementById('tgJoinBtn')) document.getElementById('tgJoinBtn').href = data.telegram;
        }
      });
    }

    // 11.2 Load Skills
    function loadSkills() {
      db.collection('skills').orderBy('percentage', 'desc').get().then(snapshot => {
        const skillContainer = document.getElementById('skillBarsContainer');
        if(!skillContainer) return;
        
        if(snapshot.empty) {
          skillContainer.innerHTML = '<p style="color: var(--text-muted);">Skills coming soon...</p>';
          return;
        }

        let html = '';
        snapshot.forEach(doc => {
          const skill = doc.data();
          const name = skill.name || 'Unknown Skill';
          const percentage = skill.percentage || 0;
          html += `
            <div class="skill-bar-item">
              <div class="skill-bar-header">
                <span>${name}</span><span class="skill-pct">${percentage}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" data-width="${percentage}"></div>
              </div>
            </div>
          `;
        });
        
        skillContainer.innerHTML = html;
        initSkillBars(); // Re-initialize observers for new bars
      }).catch(err => {
        console.error("Error loading skills:", err);
        const skillContainer = document.getElementById('skillBarsContainer');
        if(skillContainer) skillContainer.innerHTML = `<p style="color: red;">Error loading skills: ${err.message}</p>`;
      });
    }

    // 11.3 Load Projects
    function loadProjects() {
      db.collection('projects').orderBy('createdAt', 'desc').get().then(snapshot => {
        const projGrid = document.getElementById('projectsGrid');
        if(!projGrid) return;
        
        if(snapshot.empty) {
          projGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Projects coming soon...</p>';
          return;
        }

        let html = '';
        snapshot.forEach(doc => {
          const proj = doc.data();
          const category = proj.category || 'Other';
          const title = proj.title || 'Untitled Project';
          
          // Map category to icon/placeholder
          let placeholderHTML = '<div class="project-placeholder other-placeholder">🤖</div>';
          let categoryClass = 'other';
          
          if(category.toLowerCase().includes('web')) {
             placeholderHTML = '<div class="project-placeholder web-placeholder">🌐</div>';
             categoryClass = 'web';
          } else if(category.toLowerCase().includes('mobile') || category.toLowerCase().includes('app')) {
             placeholderHTML = '<div class="project-placeholder mobile-placeholder">📱</div>';
             categoryClass = 'mobile';
          }
          
          if (proj.image) {
            placeholderHTML = `<img src="${proj.image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg) var(--radius-lg) 0 0;" />`;
          }
          
          let tagsHTML = '';
          if(proj.tags && Array.isArray(proj.tags)) {
            tagsHTML = proj.tags.map(t => `<span class="tag">${t.trim()}</span>`).join('');
          }
          
          let linkHTML = '<a href="#" class="btn-sm btn-primary" onclick="event.preventDefault()">Coming Soon 🚀</a>';
          if (proj.link) {
            linkHTML = `<a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-primary">Live Demo 🚀</a>`;
          }

          html += `
            <div class="project-card reveal" data-category="${categoryClass}">
              <div class="project-glow"></div>
              <div class="project-img" style="${proj.image ? 'padding: 0; background: transparent;' : ''}">
                ${placeholderHTML}
              </div>
              <div class="project-body">
                <div class="project-tags">
                  ${tagsHTML}
                </div>
                <h3>${title}</h3>
                <p>Category: ${category}</p>
                <div class="project-links">
                  ${linkHTML}
                </div>
              </div>
            </div>
          `;
        });
        
        projGrid.innerHTML = html;
        initProjectFilters(); // Re-init tilt effects
        initReveals(); // Re-init scroll reveals for new project cards
      }).catch(err => {
        console.error("Error loading projects:", err);
        const projGrid = document.getElementById('projectsGrid');
        if(projGrid) projGrid.innerHTML = `<p style="color: red; text-align: center; grid-column: 1/-1;">Error loading projects: ${err.message}</p>`;
      });
    }

    // 11.4 Listen for Site Notifications
    function listenForNotifications() {
      const toastContainer = document.getElementById('siteToastContainer');
      if (!toastContainer) return;
      
      let initialLoad = true;
      db.collection('site_notifications').orderBy('createdAt', 'desc').limit(1).onSnapshot(snapshot => {
        if (initialLoad) {
          initialLoad = false;
          return;
        }
        
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            showSiteToast(data.message, data.type || 'success');
          }
        });
      });
    }

    function showSiteToast(message, type = 'success') {
      const container = document.getElementById('siteToastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      
      const icon = type === 'success' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

      toast.innerHTML = `${icon} <span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
          toast.remove();
        });
      }, 5000);
    }

    // Execute dynamic fetches
    loadProfileSettings();
    loadSkills();
    loadProjects();
    listenForNotifications();
  }


  /* ─────────────────────────────────────────
     12. BADGE HOVER PULSE COLORS
     ───────────────────────────────────────── */
  const badges = document.querySelectorAll('.badge');
  const badgeColors = [
    '#E44D26', '#264DE4', '#F7DF1E', '#61DAFB',
    '#339933', '#777BB4', '#3776AB', '#ED8B00',
    '#3DDC84', '#4479A1', '#FFCA28', '#F05032',
    '#F24E1E', '#007ACC'
  ];
  badges.forEach((badge, i) => {
    badge.addEventListener('mouseenter', () => {
      const color = badgeColors[i % badgeColors.length];
      badge.style.borderColor = color;
      badge.style.color = color;
      badge.style.background = color + '15';
      badge.style.boxShadow = `0 6px 20px ${color}25`;
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.borderColor = '';
      badge.style.color = '';
      badge.style.background = '';
      badge.style.boxShadow = '';
    });
  });

});
