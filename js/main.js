// Dark/Light Mode Toggle
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('light-mode');
  
  if (isDark) {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    const themeIcon = document.querySelector('.header-icon[title="Toggle Theme"]');
    if (themeIcon) {
      themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
    }
  } else {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    const themeIcon = document.querySelector('.header-icon[title="Toggle Theme"]');
    if (themeIcon) {
      themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    const themeIcon = document.querySelector('.header-icon[title="Toggle Theme"]');
    if (themeIcon) {
      themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  
  // Load user login status
  loadUserStatus();
  initializeSearch();
  
  // Add click handlers for copy buttons if they exist
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const text = this.getAttribute('data-text') || this.textContent;
      copyToClipboard(text);
    });
  });
});

let currentUser = null;

function toggleLogin() {
  if (currentUser) {
    // User is logged in, show profile menu
    showProfileMenu();
  } else {
    // User not logged in, redirect to accounts page
    window.location.href = '/accounts/';
  }
}

function showProfileMenu() {
  // Create a simple dropdown menu
  const existingMenu = document.querySelector('.profile-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.style.cssText = `
    position: absolute;
    top: 60px;
    right: 20px;
    background: #2a2a2a;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1001;
    min-width: 200px;
  `;
  
  menu.innerHTML = `
    <div style="color: #fff; padding: 8px; border-bottom: 1px solid #3a3a3a;">
      <strong>${currentUser.username}</strong>
      <div style="font-size: 12px; color: #888;">${currentUser.email}</div>
    </div>
    <div style="padding: 8px; cursor: pointer; color: #ccc;" onclick="viewFavorites()">
      <i class="fas fa-heart" style="margin-right: 8px;"></i>My Favorites
    </div>
    <div style="padding: 8px; cursor: pointer; color: #ccc;" onclick="logout()">
      <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Logout
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}

function login(username, email, password) {
  // Simple login simulation
  currentUser = {
    username: username,
    email: email,
    favorites: JSON.parse(localStorage.getItem(`favorites_${username}`)) || []
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserIcon();
  return true;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUserIcon();
  document.querySelector('.profile-menu')?.remove();
  showNotification('Logged out successfully', 'success');
}

function loadUserStatus() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUserIcon();
  }
}

function updateUserIcon() {
  const userIcon = document.querySelector('.header-icon[title="Profile"]');
  if (userIcon) {
    if (currentUser) {
      userIcon.style.color = '#00d4aa';
      userIcon.title = `Profile - ${currentUser.username}`;
    } else {
      userIcon.style.color = '#888';
      userIcon.title = 'Profile';
    }
  }
}

// Admin Functions
function isAdmin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) return false;
  return currentUser.username === 'MD_TECH_HACKER' || 
         currentUser.email === 'keygenmd5@gmail.com' || 
         currentUser.email === 'm.dharaaneesh123@gmail.com' ||
         currentUser.username === 'admin';
}

// Favorites Management
function addToFavorites(type, item) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    showNotification('Please login to save favorites', 'error');
    return;
  }
  
  if (!currentUser.favorites) currentUser.favorites = [];
  
  const favoriteItem = {
    id: Date.now(),
    type: type,
    ...item,
    savedAt: new Date().toISOString()
  };
  
  currentUser.favorites.push(favoriteItem);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update users array in localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex].favorites = currentUser.favorites;
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  showNotification('Added to favorites!', 'success');
}

function removeFromFavorites(itemId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || !currentUser.favorites) return;
  
  currentUser.favorites = currentUser.favorites.filter(item => item.id !== itemId);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update users array in localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex].favorites = currentUser.favorites;
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  showNotification('Removed from favorites', 'success');
}

function viewFavorites() {
  if (!currentUser) return;
  
  // Create favorites modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: #2a2a2a;
    border-radius: 10px;
    padding: 20px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: #fff;
  `;
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>My Favorites</h2>
      <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;">&times;</button>
    </div>
    <div id="favorites-list">
      ${currentUser.favorites.length === 0 ? 
        '<p style="color: #888; text-align: center;">No favorites saved yet</p>' :
        currentUser.favorites.map(item => `
          <div style="background: #3a3a3a; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4 style="margin: 0 0 5px 0; color: #00d4aa;">${item.title || item.name}</h4>
                <p style="margin: 0; color: #ccc; font-size: 14px;">${item.description || item.details || ''}</p>
                <small style="color: #888;">Saved: ${new Date(item.savedAt).toLocaleDateString()}</small>
              </div>
              <button onclick="removeFromFavorites(${item.id}); this.closest('.modal').remove(); viewFavorites();" 
                      style="background: #dc3545; border: none; color: #fff; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                Remove
              </button>
            </div>
          </div>
        `).join('')
      }
    </div>
  `;
  
  modal.className = 'modal';
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: #fff;
    font-weight: 500;
    z-index: 3000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  switch(type) {
    case 'success':
      notification.style.background = '#28a745';
      break;
    case 'error':
      notification.style.background = '#dc3545';
      break;
    case 'warning':
      notification.style.background = '#ffc107';
      notification.style.color = '#000';
      break;
    default:
      notification.style.background = '#007bff';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Search Functionality
function initializeSearch() {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      // Implement search logic here
      console.log('Searching for:', query);
    });
  }
}

// Copy to Clipboard Function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy', 'error');
  });
}

// API Functions for backend integration
const API_BASE = window.location.origin;

async function fetchPosts() {
  try {
    const response = await fetch(`${API_BASE}/api/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    showNotification('Failed to load posts', 'error');
    return [];
  }
}

async function createPost(postData) {
  try {
    const response = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) throw new Error('Failed to create post');
    const result = await response.json();
    showNotification('Post created successfully!', 'success');
    return result;
  } catch (error) {
    console.error('Error creating post:', error);
    showNotification('Failed to create post', 'error');
    throw error;
  }
}

// Make functions globally available
window.showNotification = showNotification;
window.toggleTheme = toggleTheme;
window.toggleLogin = toggleLogin;
window.isAdmin = isAdmin;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.viewFavorites = viewFavorites;
window.copyToClipboard = copyToClipboard;

// Export functions for use in other files
window.MDTech = {
  toggleTheme,
  toggleLogin,
  login,
  logout,
  addToFavorites,
  removeFromFavorites,
  showNotification,
  isAdmin,
  viewFavorites,
  copyToClipboard,
  fetchPosts,
  createPost
};
