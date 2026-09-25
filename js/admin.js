document.addEventListener('DOMContentLoaded', () => {
  // --- Auth Check ---
  auth.onAuthStateChanged(user => {
    if (!user) {
      // Not logged in, redirect to login page
      window.location.href = 'login.html';
    } else {
      // Optional: Update admin profile name if available
      const adminProfileSpan = document.querySelector('.admin-profile span');
      if(adminProfileSpan && user.email) {
        adminProfileSpan.textContent = user.email.split('@')[0];
      }
      // Fetch initial data from Firebase here if needed
      loadSettings();
    }
  });

  // --- Toast Notification ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const icon = type === 'success' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3000);
  }

  // --- Sidebar Toggle Logic ---
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  
  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  // --- Tab Navigation Logic ---
  const navLinks = document.querySelectorAll('.nav-link[data-target]');
  const sections = document.querySelectorAll('.admin-section');
  const pageTitle = document.getElementById('pageTitle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active section
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetId}-section`) {
          section.classList.add('active');
        }
      });

      // Update Page Title
      pageTitle.textContent = link.textContent.trim();

      // Close sidebar on mobile after clicking a link
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('active');
      }
    });
  });

  // 1. Recent Messages (from Firestore)
  const recentMessagesBody = document.getElementById('recentMessagesBody');
  const allMessagesBody = document.getElementById('allMessagesBody');

  function renderMessages() {
    db.collection('messages').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      let recentHTML = '';
      let allHTML = '';
      let index = 0;

      snapshot.forEach((doc) => {
        const msg = doc.data();
        const msgId = doc.id;
        const statusClass = msg.status === 'New' ? 'status-new' : 'status-read';
        
        // Format date
        let dateStr = 'Unknown Date';
        if (msg.createdAt) {
          const date = msg.createdAt.toDate();
          dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        // Recent messages (only first 3)
        if (index < 3) {
          recentHTML += `
            <tr>
              <td>${msg.name || 'Anonymous'}</td>
              <td>${msg.subject || 'No Subject'}</td>
              <td>${dateStr}</td>
              <td><span class="status-badge ${statusClass}">${msg.status || 'New'}</span></td>
            </tr>
          `;
        }

        // All messages
        allHTML += `
          <tr>
            <td>${msg.name || 'Anonymous'}</td>
            <td>${msg.email || 'N/A'}</td>
            <td>${msg.subject || 'No Subject'}</td>
            <td>${dateStr}</td>
            <td>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
        `;
        index++;
      });

      if(recentMessagesBody) recentMessagesBody.innerHTML = recentHTML;
      if(allMessagesBody) allMessagesBody.innerHTML = allHTML;
    });
  }

  // 2. Projects Data (from Firestore)
  const projectsAdminGrid = document.getElementById('projectsAdminGrid');
  let currentEditProjectId = null;

  function renderProjects() {
    db.collection('projects').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      let html = '';
      snapshot.forEach((doc) => {
        const proj = doc.data();
        const projId = doc.id;
        let tagsHTML = '';
        if (proj.tags && Array.isArray(proj.tags)) {
          tagsHTML = proj.tags.map(tag => `<span class="admin-tag">${tag.trim()}</span>`).join('');
        }
        
        html += `
          <div class="project-admin-card">
            <div class="project-admin-header">
              <h4>${proj.title}</h4>
              <div class="project-actions">
                <button class="action-btn edit" title="Edit" onclick="editProject('${projId}')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" title="Delete" onclick="deleteDocument('projects', '${projId}')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div class="project-admin-tags">
              ${tagsHTML}
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Category: ${proj.category}</p>
          </div>
        `;
      });
      if(projectsAdminGrid) projectsAdminGrid.innerHTML = html || '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No projects found.</p>';
    });
  }

  // 3. Skills Data (from Firestore)
  const skillsBody = document.getElementById('skillsBody');

  function renderSkills() {
    db.collection('skills').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
      let html = '';
      snapshot.forEach((doc) => {
        const skill = doc.data();
        const skillId = doc.id;
        
        html += `
          <tr>
            <td style="font-weight: 500;">${skill.name}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 35px;">${skill.percentage}%</span>
                <div class="skill-progress-container">
                  <div class="skill-progress-bar" style="width: ${skill.percentage}%;"></div>
                </div>
              </div>
            </td>
            <td><span class="admin-tag">${skill.category}</span></td>
            <td>
              <div class="project-actions">
                <button class="action-btn delete" title="Delete" onclick="deleteDocument('skills', '${skillId}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      });
      if(skillsBody) skillsBody.innerHTML = html || '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No skills found.</td></tr>';
    });
  }

  // Generic Delete Function
  window.deleteDocument = function(collectionName, docId) {
    if(confirm('Are you sure you want to delete this item?')) {
      db.collection(collectionName).doc(docId).delete()
        .then(() => {
          showToast('Item deleted successfully!', 'success');
        })
        .catch(err => {
          console.error("Error deleting document: ", err);
          showToast('Error deleting item', 'error');
        });
    }
  };

  // Edit Project Function
  window.editProject = function(docId) {
    db.collection('projects').doc(docId).get().then(doc => {
      if (doc.exists) {
        const proj = doc.data();
        document.getElementById('projTitle').value = proj.title;
        document.getElementById('projCategory').value = proj.category;
        document.getElementById('projTags').value = (proj.tags && Array.isArray(proj.tags)) ? proj.tags.join(', ') : '';
        document.getElementById('projImage').value = proj.image || '';
        document.getElementById('projLink').value = proj.link || '';
        
        currentEditProjectId = docId;
        const modalTitle = document.getElementById('projectModalTitle');
        if (modalTitle) modalTitle.textContent = 'Edit Project';
        
        projectModal.style.display = 'flex';
      }
    }).catch(err => {
      console.error("Error fetching project for edit:", err);
      showToast('Error loading project details', 'error');
    });
  };

  // --- Modals Logic ---
  const projectModal = document.getElementById('projectModal');
  const skillModal = document.getElementById('skillModal');
  
  // Add Project
  const addProjectBtn = document.getElementById('addProjectBtn');
  if(addProjectBtn) addProjectBtn.addEventListener('click', () => {
    currentEditProjectId = null;
    document.getElementById('addProjectForm').reset();
    const modalTitle = document.getElementById('projectModalTitle');
    if (modalTitle) modalTitle.textContent = 'Add New Project';
    projectModal.style.display = 'flex';
  });
  document.getElementById('closeProjectModal')?.addEventListener('click', () => {
    projectModal.style.display = 'none';
    currentEditProjectId = null;
  });
  
  document.getElementById('addProjectForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('projTitle').value;
    const category = document.getElementById('projCategory').value;
    const tagsInput = document.getElementById('projTags').value;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    const image = document.getElementById('projImage').value;
    const link = document.getElementById('projLink').value;
    
    if (currentEditProjectId) {
      // Edit existing project
      db.collection('projects').doc(currentEditProjectId).update({
        title,
        category,
        tags,
        image,
        link,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        showToast('Project updated!', 'success');
        projectModal.style.display = 'none';
        currentEditProjectId = null;
        e.target.reset();
      }).catch(err => {
        console.error("Error updating project: ", err);
        showToast('Error updating project', 'error');
      });
    } else {
      // Add new project
      db.collection('projects').add({
        title,
        category,
        tags,
        image,
        link,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        showToast('Project added!', 'success');
        projectModal.style.display = 'none';
        e.target.reset();
      }).catch(err => showToast('Error adding project', 'error'));
    }
  });

  // Add Skill
  const addSkillBtn = document.querySelector('#skills-section .panel-header .btn-primary');
  if(addSkillBtn) addSkillBtn.addEventListener('click', () => skillModal.style.display = 'flex');
  document.getElementById('closeSkillModal')?.addEventListener('click', () => skillModal.style.display = 'none');
  
  document.getElementById('addSkillForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('skillName').value;
    const percentage = parseInt(document.getElementById('skillPct').value, 10);
    const category = document.getElementById('skillCat').value;
    
    db.collection('skills').add({
      name,
      percentage,
      category,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      showToast('Skill added!', 'success');
      skillModal.style.display = 'none';
      e.target.reset();
    }).catch(err => showToast('Error adding skill', 'error'));
  });

  // --- Settings Form (Firebase Integration) ---
  const settingsForm = document.getElementById('settingsForm');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  
  function loadSettings() {
    db.collection('settings').doc('profile').get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if(document.getElementById('adminName')) document.getElementById('adminName').value = data.name || '';
        if(document.getElementById('adminEmail')) document.getElementById('adminEmail').value = data.email || '';
        if(document.getElementById('adminBio')) document.getElementById('adminBio').value = data.bio || '';
        if(document.getElementById('adminInsta')) document.getElementById('adminInsta').value = data.instagram || '';
        if(document.getElementById('adminWa')) document.getElementById('adminWa').value = data.whatsapp || '';
        if(document.getElementById('adminTg')) document.getElementById('adminTg').value = data.telegram || '';
        if(document.getElementById('adminGithub')) document.getElementById('adminGithub').value = data.github || '';
      }
    }).catch(err => {
      console.error("Error loading settings:", err);
    });
  }

  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if(saveSettingsBtn) {
        saveSettingsBtn.textContent = 'Saving...';
        saveSettingsBtn.disabled = true;
      }

      const settingsData = {
        name: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        bio: document.getElementById('adminBio').value,
        instagram: document.getElementById('adminInsta').value,
        whatsapp: document.getElementById('adminWa').value,
        telegram: document.getElementById('adminTg').value,
        github: document.getElementById('adminGithub').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      db.collection('settings').doc('profile').set(settingsData, { merge: true })
        .then(() => {
          showToast('Settings saved to Firebase successfully!', 'success');
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          showToast('Error saving settings. Try again.', 'error');
        })
        .finally(() => {
          if(saveSettingsBtn) {
            saveSettingsBtn.textContent = 'Save Changes';
            saveSettingsBtn.disabled = false;
          }
        });
    });
  }

  // --- Broadcast Notification Form ---
  const broadcastForm = document.getElementById('broadcastForm');
  if (broadcastForm) {
    broadcastForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msgInput = document.getElementById('broadcastMessage');
      const msgText = msgInput.value.trim();
      const btn = document.getElementById('sendBroadcastBtn');
      
      if (!msgText) return;
      
      btn.disabled = true;
      btn.textContent = 'Sending...';
      
      db.collection('site_notifications').add({
        message: msgText,
        type: 'success',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        showToast('Broadcast sent successfully!', 'success');
        broadcastForm.reset();
      }).catch(err => {
        console.error("Error sending broadcast: ", err);
        showToast('Error sending broadcast', 'error');
      }).finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Broadcast';
      });
    });
  }

  // Initialize Rendering
  renderMessages();
  renderProjects();
  renderSkills();

});
