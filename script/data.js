  // Sample video data with working video URLs



    // DOM Elements
    const container = document.getElementById('container');
    const videoModal = document.getElementById('videoModal');
    const mainPlayer = document.getElementById('mainPlayer');
    const closeModal = document.getElementById('closeModal');
    const themeToggle = document.getElementById('themeToggle');
    const featuredBtn = document.getElementById('featuredBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const countdown = document.getElementById('countdown');
    const progressBar = document.getElementById('progressBar');
    const shareModal = document.getElementById('shareModal');
    const shareClose = document.getElementById('shareClose');
    const shareThumbnail = document.getElementById('shareThumbnail');
    const shareTitle = document.getElementById('shareTitle');
    const shareLink = document.getElementById('shareLink');
    const copyLink = document.getElementById('copyLink');
    const facebookShare = document.getElementById('facebookShare');
    const twitterShare = document.getElementById('twitterShare');
    const whatsappShare = document.getElementById('whatsappShare');
    const directShare = document.getElementById('directShare');

    // App State
    let darkMode = false;
    let currentVideo = null;
    let countdownInterval = null;
    let progressInterval = null;

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
        
        vids.forEach(v => {
          const card = createCard(v);
          card.setAttribute('data-video-id', v.id);
          row.appendChild(card);
        });
        
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
        
        singles.forEach(v => {
          const card = createCard(v);
          card.setAttribute('data-video-id', v.id);
          singleBlock.appendChild(card);
        });
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

      // Share button
      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';

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
      thumbWrap.appendChild(shareBtn);
      thumbWrap.appendChild(duration);

      card.appendChild(thumbWrap);
      card.appendChild(info);

      // Click handler - Now with loading animation
      card.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return;
        currentVideo = video;
        startLoadingAnimation(video);
      });

      // Share button click
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openShareModal(video);
      });

      // Hover effects
      card.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        shareBtn.style.opacity = '1';
      });
      
      card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        shareBtn.style.opacity = '0';
      });

      return card;
    }

    // Start 7-second loading animation
    function startLoadingAnimation(video) {
      loadingOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      let seconds = 7;
      countdown.textContent = seconds;
      
      // Update countdown every second
      countdownInterval = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        
        if (seconds <= 0) {
          clearInterval(countdownInterval);
          openVideoPlayer(video);
        }
      }, 1000);
      
      // Update progress bar
      let progress = 0;
      const increment = 100 / 70; // 70 increments over 7 seconds
      
      progressInterval = setInterval(() => {
        progress += increment;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    }

    // Open video in modal player after loading
    function openVideoPlayer(video) {
      loadingOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
      
      mainPlayer.src = video.src;
      mainPlayer.poster = video.thumb;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Try to autoplay
      const playPromise = mainPlayer.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
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

    // Open share modal
    function openShareModal(video) {
      shareThumbnail.src = video.thumb;
      shareTitle.textContent = video.title;
      
      // Generate shareable link
      const currentUrl = window.location.href.split('?')[0];
      const shareUrl = `${currentUrl}?video=${video.id}`;
      shareLink.value = shareUrl;
      
      // Set social share links
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedTitle = encodeURIComponent(`Watch "${video.title}" on MY TUBE`);
      
      facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      twitterShare.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      whatsappShare.href = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      directShare.href = shareUrl;
      
      shareModal.classList.add('active');
    }

    // Close share modal
    function closeShareModal() {
      shareModal.classList.remove('active');
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
          
          const featuredCards = document.querySelectorAll('.featured-badge');
          featuredCards.forEach(card => {
            card.style.animation = 'pulse 0.5s 3';
            setTimeout(() => {
              card.style.animation = '';
            }, 1500);
          });
        }
      });
      
      // Share modal
      shareClose.addEventListener('click', closeShareModal);
      
      // Copy link button
      copyLink.addEventListener('click', () => {
        shareLink.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyLink.innerHTML;
        copyLink.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          copyLink.innerHTML = originalText;
        }, 2000);
      });
      
      // Check for video parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('video');
      
      if (videoId) {
        const video = videos.find(v => v.id === videoId);
        if (video) {
          // Scroll to video and highlight it
          setTimeout(() => {
            const card = document.querySelector(`[data-video-id="${videoId}"]`);
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.style.boxShadow = '0 0 0 3px var(--primary)';
              setTimeout(() => {
                card.style.boxShadow = '';
              }, 3000);
            }
          }, 1000);
        }
      }
    }
