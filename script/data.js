   // Sample video data with vibrant theme
    const videos = [
      {
        title: "4K Mountain Sunrise Timelapse",
        src: "https://files.catbox.moe/abcd12.mp4",
        thumb: "https://i.imgur.com/xHkNjmw.jpeg",
        duration: "4:32",
        views: "1.2M",
        featured: true,
        description: "Beautiful sunrise over mountain peaks captured in 4K resolution."
      },
      {
        title: "Ocean Waves Relaxation Video",
        src: "https://files.catbox.moe/qojnj5.mp4",
        thumb: "https://i.imgur.com/U4l7qzY.jpeg",
        duration: "8:15",
        views: "856K",
        list: "nature",
        description: "Soothing ocean waves for relaxation and meditation."
      },
      {
        title: "City Nightlife Timelapse",
        src: "https://files.catbox.moe/abcd12.mp4",
        thumb: "https://i.imgur.com/xHkNjmw.jpeg",
        duration: "3:45",
        views: "2.1M",
        list: "urban",
        description: "Vibrant city lights and nightlife in fast motion."
      },
      {
        title: "Abstract Liquid Motion",
        src: "https://files.catbox.moe/qojnj5.mp4",
        thumb: "https://i.imgur.com/U4l7qzY.jpeg",
        duration: "2:56",
        views: "745K",
        featured: true,
        description: "Mesmerizing abstract liquid patterns in 4K slow motion."
      },
      {
        title: "Northern Lights in Iceland",
        src: "https://files.catbox.moe/abcd12.mp4",
        thumb: "https://i.imgur.com/xHkNjmw.jpeg",
        duration: "6:42",
        views: "1.5M",
        featured: true,
        description: "Aurora borealis dancing across the Icelandic sky."
      },
      {
        title: "Desert Sand Dunes",
        src: "https://files.catbox.moe/qojnj5.mp4",
        thumb: "https://i.imgur.com/U4l7qzY.jpeg",
        duration: "4:10",
        views: "920K",
        list: "travel",
        description: "Golden sand dunes stretching to the horizon."
      },
      {
        title: "Colorful Festival Lights",
        src: "https://files.catbox.moe/abcd12.mp4",
        thumb: "https://i.imgur.com/xHkNjmw.jpeg",
        duration: "5:22",
        views: "1.1M",
        list: "events",
        description: "Vibrant festival lights from around the world."
      },
      {
        title: "Sunset Beach Vibes",
        src: "https://files.catbox.moe/qojnj5.mp4",
        thumb: "https://i.imgur.com/U4l7qzY.jpeg",
        duration: "7:18",
        views: "1.3M",
        list: "nature",
        description: "Relaxing sunset at a tropical beach."
      }
    ];

    // DOM Elements
    const container = document.getElementById('container');
    const videoModal = document.getElementById('videoModal');
    const mainPlayer = document.getElementById('mainPlayer');
    const closeModal = document.getElementById('closeModal');
    const themeToggle = document.getElementById('themeToggle');
    const featuredBtn = document.getElementById('featuredBtn');

    // App State
    let darkMode = false;

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderVideos();
      setupEventListeners();
      checkDarkModePreference();
    });

    // Group videos
    function renderVideos() {
      const grouped = {};
      const singles = [];

      videos.forEach(v => {
        if (v.list) {
          if (!grouped[v.list]) grouped[v.list] = [];
          grouped[v.list].push(v);
        } else {
          singles.push(v);
        }
      });

      // Create playlist sections
      Object.entries(grouped).forEach(([group, vids]) => {
        const block = document.createElement('div');
        block.className = 'playlist';
        
        const header = document.createElement('div');
        header.className = 'playlist-header';
        header.innerHTML = `
          <h2><i class="fas fa-${getPlaylistIcon(group)}"></i> ${group.charAt(0).toUpperCase() + group.slice(1)}</h2>
          <div class="playlist-controls">
            <button class="scroll-left"><i class="fas fa-chevron-left"></i></button>
            <button class="scroll-right"><i class="fas fa-chevron-right"></i></button>
          </div>
        `;
        
        const row = document.createElement('div');
        row.className = 'playlist-row';
        
        vids.forEach(v => row.appendChild(createCard(v)));
        
        block.appendChild(header);
        block.appendChild(row);
        container.appendChild(block);
        
        // Add scroll controls
        const scrollLeft = block.querySelector('.scroll-left');
        const scrollRight = block.querySelector('.scroll-right');
        
        scrollLeft.addEventListener('click', () => {
          row.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        scrollRight.addEventListener('click', () => {
          row.scrollBy({ left: 300, behavior: 'smooth' });
        });
      });

      // Create featured videos section
      if (singles.length) {
        const singleBlock = document.createElement('div');
        singleBlock.className = 'single-videos';
        
        const header = document.createElement('h2');
        header.innerHTML = '<i class="fas fa-bolt"></i> Featured Videos';
        container.appendChild(header);
        
        singles.forEach(v => singleBlock.appendChild(createCard(v)));
        container.appendChild(singleBlock);
      }
    }

    // Create video card element
    function createCard(video) {
      const card = document.createElement('div');
      card.className = 'video-card';

      // Thumbnail wrapper
      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'thumb-wrapper';

      // Thumbnail image
      const img = document.createElement('img');
      img.src = video.thumb;
      img.alt = video.title;

      // Play icon
      const playIcon = document.createElement('div');
      playIcon.className = 'play-icon';
      playIcon.innerHTML = '<i class="fas fa-play"></i>';

      // Video info
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <div class="title">${video.title}</div>
        <div class="meta">
          <span>${video.views} views</span>
          <span><i class="fas fa-thumbs-up"></i> ${formatLikes(video.views)}</span>
        </div>
      `;

      // Duration badge
      const duration = document.createElement('div');
      duration.className = 'duration';
      duration.textContent = video.duration;

      // Featured badge
      if (video.featured) {
        const featuredBadge = document.createElement('div');
        featuredBadge.className = 'featured-badge';
        featuredBadge.innerHTML = '<i class="fas fa-bolt"></i> Featured';
        thumbWrap.appendChild(featuredBadge);
      }

      // Assemble card
      thumbWrap.appendChild(img);
      thumbWrap.appendChild(playIcon);
      thumbWrap.appendChild(duration);

      card.appendChild(thumbWrap);
      card.appendChild(info);

      // Click handler - Removed loading delay
      card.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return;
        openVideoPlayer(video);
      });

      // Hover effects
      card.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });

      return card;
    }

    // Open video in modal player
    function openVideoPlayer(video) {
      mainPlayer.src = video.src;
      mainPlayer.poster = video.thumb;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Try to autoplay (may be blocked by browser)
      const playPromise = mainPlayer.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented
          mainPlayer.controls = true;
        });
      }
    }

    // Close video modal
    function closeVideoPlayer() {
      videoModal.classList.remove('active');
      mainPlayer.pause();
      document.body.style.overflow = 'auto';
    }

    // Toggle dark mode
    function toggleDarkMode() {
      darkMode = !darkMode;
      if (darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
      } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
      }
    }

    // Check user's dark mode preference
    function checkDarkModePreference() {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'enabled') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }

    // Helper functions
    function getPlaylistIcon(category) {
      const icons = {
        nature: 'leaf',
        urban: 'city',
        travel: 'plane',
        events: 'calendar-star',
        music: 'music'
      };
      return icons[category] || 'play-circle';
    }

    function formatLikes(views) {
      const num = parseInt(views.replace(/[^\d]/g, ''));
      return Math.round(num * 0.1).toLocaleString();
    }

    // Event listeners setup
    function setupEventListeners() {
      // Video modal
      closeModal.addEventListener('click', closeVideoPlayer);
      
      // Theme toggle
      themeToggle.addEventListener('click', toggleDarkMode);
      
      // Featured button
      featuredBtn.addEventListener('click', () => {
        const featuredSection = document.querySelector('.single-videos');
        if (featuredSection) {
          featuredSection.scrollIntoView({ behavior: 'smooth' });
          
          // Add pulse animation to featured cards
          const featuredCards = document.querySelectorAll('.featured-badge');
          featuredCards.forEach(card => {
            card.style.animation = 'pulse 0.5s 3';
            setTimeout(() => {
              card.style.animation = '';
            }, 1500);
          });
        }
      });
    }