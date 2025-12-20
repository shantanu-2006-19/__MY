// =============================================
// पिंपळगाव ग्रामपंचायत वेबसाइट - मुख्य स्क्रिप्ट
// तयारकर्ता: पिंपळगाव ग्रामपंचायत
// भाषा: मराठी
// =============================================

// DOM लोड झाल्यावर कोड चालवा
document.addEventListener('DOMContentLoaded', function() {
  console.log('पिंपळगाव ग्रामपंचायत वेबसाइट लोड झाली');
  
  // सर्व प्रमुख घटकांची निवड
  const elements = {
    loading: document.getElementById('loading'),
    themeToggle: document.getElementById('theme-toggle'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    backToTop: document.getElementById('back-to-top'),
    currentTime: document.getElementById('time-display'),
    todayDate: document.getElementById('today-date'),
    visitorCount: document.getElementById('visitor-count'),
    shareLocation: document.getElementById('share-location'),
    imageModal: document.getElementById('image-modal'),
    modalImage: document.getElementById('modal-image'),
    modalCaption: document.getElementById('modal-caption'),
    closeModal: document.querySelector('.close-modal'),
    messageForm: document.getElementById('message-form'),
    newsletterForm: document.getElementById('newsletter-submit')
  };
  
  // वेबसाइट स्टेट
  const state = {
    currentTheme: localStorage.getItem('theme') || 'light',
    currentImageIndex: 0,
    galleryImages: [],
    visitorCount: parseInt(localStorage.getItem('visitorCount')) || 1245,
    currentSection: 'home'
  };
  
  // ==================== सुरुवातीची सेटअप ====================
  
  // लोडिंग स्क्रीन दाखवा
  function initLoadingScreen() {
    setTimeout(() => {
      elements.loading.classList.add('hidden');
      
      // थोड्या वेळाने लोडिंग स्क्रीन पूर्णपणे काढा
      setTimeout(() => {
        elements.loading.style.display = 'none';
      }, 500);
      
      // सर्व सेक्शन्स दाखवा
      document.querySelectorAll('.section').forEach(section => {
        section.classList.add('active');
      });
    }, 2000);
  }
  
  // थीम सेट करा
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    
    // थीम टॉगल बटण अपडेट करा
    const themeIcon = elements.themeToggle.querySelector('i');
    themeIcon.className = state.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // थीम टॉगल कार्यक्षमता
    elements.themeToggle.addEventListener('click', function() {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.currentTheme);
      localStorage.setItem('theme', state.currentTheme);
      
      // आयकन बदला
      const icon = this.querySelector('i');
      icon.className = state.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      
      // थीम बदलल्याची सूचना दाखवा
      showNotification(`थीम ${state.currentTheme === 'dark' ? 'डार्क' : 'लाइट'} मोडमध्ये बदलली`);
    });
  }
  
  // वेळ आणि तारीख अपडेट करा
  function initDateTime() {
    function updateDateTime() {
      const now = new Date();
      
      // वेळ अपडेट करा
      const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      };
      elements.currentTime.textContent = now.toLocaleTimeString('mr-IN', timeOptions);
      
      // तारीख अपडेट करा
      const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      elements.todayDate.textContent = now.toLocaleDateString('mr-IN', dateOptions);
      
      // कॅलेंडर सेक्शनमध्ये तारीख
      const currentDateElement = document.getElementById('current-date');
      if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('mr-IN', dateOptions);
      }
    }
    
    // आत्ताची वेळ दाखवा
    updateDateTime();
    
    // प्रत्येक सेकंदाला वेळ अपडेट करा
    setInterval(updateDateTime, 1000);
  }
  
  // भेटींची संख्या अपडेट करा
  function initVisitorCount() {
    state.visitorCount++;
    localStorage.setItem('visitorCount', state.visitorCount);
    elements.visitorCount.textContent = state.visitorCount.toLocaleString('mr-IN');
  }
  
  // नेव्हिगेशन सेटअप
  function initNavigation() {
    // मोबाइल नेव्हिगेशन टॉगल
    elements.navToggle.addEventListener('click', function() {
      elements.navMenu.classList.toggle('active');
      this.querySelector('i').className = elements.navMenu.classList.contains('active') ? 
        'fas fa-times' : 'fas fa-bars';
    });
    
    // नेव्हिगेशन लिंक्सवर क्लिक करताना
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        // मोबाइलवर नेव्हिगेशन बंद करा
        if (window.innerWidth <= 768) {
          elements.navMenu.classList.remove('active');
          elements.navToggle.querySelector('i').className = 'fas fa-bars';
        }
        
        // सक्रिय क्लास अपडेट करा
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // स्क्रोल करा
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            window.scrollTo({
              top: targetSection.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // स्क्रोल करताना सक्रिय सेक्शन अपडेट करा
    window.addEventListener('scroll', debounce(updateActiveSection, 100));
  }
  
  // सक्रिय सेक्शन अपडेट करा
  function updateActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });
    
    if (currentSection !== state.currentSection) {
      state.currentSection = currentSection;
      
      // नेव्हिगेशन अपडेट करा
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
  }
  
  // बॅक टू टॉप बटण
  function initBackToTop() {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        elements.backToTop.classList.add('visible');
      } else {
        elements.backToTop.classList.remove('visible');
      }
    });
    
    elements.backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ==================== इमेज स्लाइडर ====================
  
  function initImageSlider() {
    const sliderItems = document.querySelectorAll('.slider-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    
    function showSlide(index) {
      // सर्व स्लाइड्स लपवा
      sliderItems.forEach(item => item.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // नवीन स्लाइड दाखवा
      currentSlide = (index + sliderItems.length) % sliderItems.length;
      sliderItems[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    // पुढची स्लाइड
    function nextSlide() {
      showSlide(currentSlide + 1);
    }
    
    // मागची स्लाइड
    function prevSlide() {
      showSlide(currentSlide - 1);
    }
    
    // इव्हेंट लिसनर्स जोडा
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // डॉट्सवर क्लिक करण्यासाठी
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });
    
    // ऑटो स्लाइड
    let slideInterval = setInterval(nextSlide, 5000);
    
    // स्लाइडरवर हवर केल्यावर ऑटो स्लाइड थांबवा
    const slider = document.querySelector('.image-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
      slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
    
    // सुरुवातीची स्लाइड दाखवा
    showSlide(0);
  }
  
  // ==================== कार्यक्रम आणि कामे ====================
  
  function initEventsAndWorks() {
    // कार्यक्रम डेटा (मॉक डेटा)
    const eventsData = [
      {
        id: 1,
        title: 'महाराष्ट्र दिन सोहळा',
        date: '2024-05-01',
        description: 'महाराष्ट्र दिनाचा सोहळा गावातील सर्व नागरिकांच्या सहभागाने साजरा केला जाईल. सांस्कृतिक कार्यक्रम, पुरस्कार वितरण, आणि सामुदायिक भोजनाचे आयोजन आहे.',
        category: 'येणारी',
        location: 'ग्रामपंचायत मैदान',
        organizer: 'युवक मंडळ'
      },
      {
        id: 2,
        title: 'आरोग्य शिबिर',
        date: '2024-05-15',
        description: 'विनामूल्य आरोग्य तपासणी शिबिर. रक्तदाब, शर्करा, आणि सामान्य आरोग्य तपासणी उपलब्ध. सर्व वयोगटातील नागरिकांनी सहभागी व्हावे.',
        category: 'चालू',
        location: 'आरोग्य केंद्र',
        organizer: 'आरोग्य विभाग'
      },
      {
        id: 3,
        title: 'कृषी मेळावा',
        date: '2024-04-20',
        description: 'नवीन शेती तंत्रज्ञान, सबसिडी योजना, आणि बियाणे वितरण कार्यक्रम. कृषी तज्ञांचे मार्गदर्शन उपलब्ध.',
        category: 'पूर्ण',
        location: 'कृषी उत्पन्नकर्ता कंपनी',
        organizer: 'कृषी विभाग'
      },
      {
        id: 4,
        title: 'वृक्षारोपण अभियान',
        date: '2024-06-05',
        description: 'पर्यावरण दिनानिमित्त वृक्षारोपण अभियान. प्रत्येक कुटुंबासाठी एक झाड लावण्याचे आवाहन. फळझाडे व निसर्गरक्षण झाडांचे वितरण.',
        category: 'येणारी',
        location: 'गाव परिसर',
        organizer: 'पर्यावरण समिती'
      }
    ];
    
    // कामे डेटा (मॉक डेटा)
    const worksData = [
      {
        id: 1,
        title: 'सडा बांधकाम',
        description: 'गावातील मुख्य रस्त्याचा बांधकाम कार्य. सिमेंट काँक्रीट रस्ता तयार करण्याचे काम सुरू आहे.',
        status: 'चालू',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        budget: 500000,
        contractor: 'एम.के. बांधकाम',
        progress: 75
      },
      {
        id: 2,
        title: 'जलनिधी सुधारणा',
        description: 'गावातील जलतलावाची सुधारणा आणि खोदकाम. पाणी साठवण क्षमता वाढवण्याचे कार्य.',
        status: 'चालू',
        startDate: '2024-02-01',
        endDate: '2024-05-31',
        budget: 300000,
        contractor: 'जल संसाधन विभाग',
        progress: 90
      },
      {
        id: 3,
        title: 'शाळा सुधारणा',
        description: 'प्राथमिक शाळेच्या इमारतीची सुधारणा. नवीन वर्गखोल्या, शौचालये, आणि पाण्याची सोय.',
        status: 'चालू',
        startDate: '2024-03-01',
        endDate: '2024-07-15',
        budget: 400000,
        contractor: 'शिक्षण विभाग',
        progress: 60
      },
      {
        id: 4,
        title: 'स्ट्रीट लाइट',
        description: 'गावातील सर्व रस्त्यांवर LED स्ट्रीट लाइट बसवण्याचे कार्य. उर्जा बचत आणि चांगले प्रकाश योजना.',
        status: 'येणारी',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        budget: 250000,
        contractor: 'महावितरण',
        progress: 0
      },
      {
        id: 5,
        title: 'आरोग्य केंद्र विस्तार',
        description: 'आरोग्य केंद्राचा विस्तार आणि आधुनिकीकरण. नवीन उपकरणे आणि सुविधा उपलब्ध करून देण्याचे कार्य.',
        status: 'पूर्ण',
        startDate: '2023-11-01',
        endDate: '2024-02-28',
        budget: 350000,
        contractor: 'आरोग्य विभाग',
        progress: 100
      }
    ];
    
    // कार्यक्रम लोड करा
    function loadEvents() {
      const container = document.getElementById('events-container');
      if (!container) return;
      
      // लोडिंग दाखवा
      container.innerHTML = `
        <div class="loading-events">
          <div class="spinner"></div>
          <p>कार्यक्रम लोड करत आहे...</p>
        </div>
      `;
      
      // थोड्या वेळाने डेटा दाखवा
      setTimeout(() => {
        renderEvents(eventsData);
        initEventFilters();
        initCalendar();
      }, 1000);
    }
    
    // कार्यक्रम रेंडर करा
    function renderEvents(events) {
      const container = document.getElementById('events-container');
      if (!container) return;
      
      if (events.length === 0) {
        container.innerHTML = '<p class="no-data">कोणतेही कार्यक्रम उपलब्ध नाहीत</p>';
        return;
      }
      
      container.innerHTML = events.map(event => `
        <div class="event-card" data-category="${event.category}">
          <div class="event-header">
            <span class="event-category ${event.category.toLowerCase()}">${event.category}</span>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <div class="event-body">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
          </div>
          <div class="event-footer">
            <div class="event-location">
              <i class="fas fa-map-marker-alt"></i> ${event.location}
            </div>
            <a href="#contact" class="event-button">सहभागी व्हा</a>
          </div>
        </div>
      `).join('');
    }
    
    // कामे लोड करा
    function loadWorks() {
      const container = document.getElementById('works-container');
      if (!container) return;
      
      // लोडिंग दाखवा
      container.innerHTML = `
        <div class="loading-works">
          <div class="spinner"></div>
          <p>कामे लोड करत आहे...</p>
        </div>
      `;
      
      // थोड्या वेळाने डेटा दाखवा
      setTimeout(() => {
        renderWorks(worksData);
        initWorkFilters();
        initProgressBars();
      }, 1000);
    }
    
    // कामे रेंडर करा
    function renderWorks(works) {
      const container = document.getElementById('works-container');
      if (!container) return;
      
      if (works.length === 0) {
        container.innerHTML = '<p class="no-data">कोणतीही कामे उपलब्ध नाहीत</p>';
        return;
      }
      
      container.innerHTML = works.map(work => `
        <div class="work-card" data-status="${work.status}">
          <div class="work-header">
            <span class="work-status ${work.status.toLowerCase()}">${work.status}</span>
            <span class="work-date">${formatDate(work.startDate)} - ${formatDate(work.endDate)}</span>
          </div>
          <div class="work-body">
            <h3 class="work-title">${work.title}</h3>
            <p class="work-description">${work.description}</p>
            <div class="work-progress">
              <div class="progress-label">
                <span>प्रगती</span>
                <span>${work.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${work.progress}%"></div>
              </div>
            </div>
          </div>
          <div class="work-footer">
            <div class="work-contractor">
              <i class="fas fa-user-hard-hat"></i> ${work.contractor}
            </div>
            <div class="work-budget">
              <i class="fas fa-rupee-sign"></i> ${work.budget.toLocaleString('mr-IN')}
            </div>
          </div>
        </div>
      `).join('');
    }
    
    // कार्यक्रम फिल्टर
    function initEventFilters() {
      const filterButtons = document.querySelectorAll('#events .filter-btn');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // सक्रिय क्लास अपडेट करा
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // फिल्टर लागू करा
          const filter = this.getAttribute('data-filter');
          const eventCards = document.querySelectorAll('.event-card');
          
          eventCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
    
    // कामे फिल्टर
    function initWorkFilters() {
      const filterButtons = document.querySelectorAll('#works .filter-btn');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // सक्रिय क्लास अपडेट करा
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // फिल्टर लागू करा
          const filter = this.getAttribute('data-filter');
          const workCards = document.querySelectorAll('.work-card');
          
          workCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-status') === filter) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
    
    // प्रगती बार ॲनिमेशन
    function initProgressBars() {
      const progressBars = document.querySelectorAll('.progress-fill');
      
      // थोड्या वेळाने ॲनिमेशन सुरू करा
      setTimeout(() => {
        progressBars.forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
        });
      }, 500);
    }
    
    // कॅलेंडर तयार करा
    function initCalendar() {
      const currentMonthElement = document.getElementById('current-month');
      const calendarGrid = document.getElementById('calendar-grid');
      const prevMonthBtn = document.getElementById('prev-month');
      const nextMonthBtn = document.getElementById('next-month');
      
      let currentDate = new Date();
      
      // महिना आणि वर्ष अपडेट करा
      function updateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthNames = [
          'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
          'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
        ];
        
        // महिना दाखवा
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // पहिला दिवस आणि शेवटचा दिवस
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        
        // कॅलेंडर ग्रिड तयार करा
        let calendarHTML = '';
        
        // आठवड्याचे दिवस
        const weekdays = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];
        weekdays.forEach(day => {
          calendarHTML += `<div class="calendar-day header">${day}</div>`;
        });
        
        // रिकाम्या पेशी
        for (let i = 0; i < firstDayIndex; i++) {
          calendarHTML += '<div class="calendar-day"></div>';
        }
        
        // महिन्याचे दिवस
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
          const dayDate = new Date(year, month, day);
          const isToday = dayDate.toDateString() === today.toDateString();
          const hasEvent = Math.random() > 0.7; // मॉक डेटा
          
          let dayClass = 'calendar-day';
          if (isToday) dayClass += ' today';
          if (hasEvent) dayClass += ' event';
          
          calendarHTML += `<div class="${dayClass}">${day}</div>`;
        }
        
        calendarGrid.innerHTML = calendarHTML;
      }
      
      // पुढचा महिना
      nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar(currentDate);
      });
      
      // मागचा महिना
      prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar(currentDate);
      });
      
      // सुरुवातीचा कॅलेंडर दाखवा
      updateCalendar(currentDate);
    }
    
    // तारीख फॉरमॅट करा
    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('mr-IN', options);
    }
    
    // कार्यक्रम आणि कामे लोड करा
    loadEvents();
    loadWorks();
  }
  
  // ==================== गॅलरी ====================
  
  function initGallery() {
    // गॅलरी डेटा (मॉक डेटा)
    const galleryData = [
      { id: 1, title: 'हेमाडपंथी शिव मंदिर', category: 'मंदिर', image: 'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 2, title: 'ग्राम दिन सोहळा', category: 'कार्यक्रम', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 3, title: 'सडा बांधकाम', category: 'कामे', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 4, title: 'महाशिवरात्री उत्सव', category: 'उत्सव', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 5, title: 'गावाचे नैसर्गिक दृश्य', category: 'सामान्य', image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 6, title: 'कृषी मेळावा', category: 'कार्यक्रम', image: 'https://images.unsplash.com/photo-1586769852044-692eb57e5d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 7, title: 'जलतलाव', category: 'सामान्य', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 8, title: 'शाळा इमारत', category: 'कामे', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
    ];
    
    // गॅलरी लोड करा
    function loadGallery() {
      const container = document.getElementById('gallery-container');
      if (!container) return;
      
      // लोडिंग दाखवा
      container.innerHTML = `
        <div class="loading-gallery">
          <div class="spinner"></div>
          <p>फोटो लोड करत आहे...</p>
        </div>
      `;
      
      // थोड्या वेळाने डेटा दाखवा
      setTimeout(() => {
        renderGallery(galleryData);
        initGalleryFilters();
        initGalleryModal();
      }, 1000);
    }
    
    // गॅलरी रेंडर करा
    function renderGallery(images) {
      const container = document.getElementById('gallery-container');
      if (!container) return;
      
      if (images.length === 0) {
        container.innerHTML = '<p class="no-data">कोणतेही फोटो उपलब्ध नाहीत</p>';
        return;
      }
      
      // गॅलरी डेटा सेव्ह करा
      state.galleryImages = images;
      
      container.innerHTML = images.map((image, index) => `
        <div class="gallery-item" data-category="${image.category}" data-index="${index}">
          <img src="${image.image}" alt="${image.title}" loading="lazy">
          <div class="gallery-overlay">
            <h4>${image.title}</h4>
            <p>${image.category}</p>
          </div>
        </div>
      `).join('');
    }
    
    // गॅलरी फिल्टर
    function initGalleryFilters() {
      const filterButtons = document.querySelectorAll('.gallery-filter-btn');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // सक्रिय क्लास अपडेट करा
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // फिल्टर लागू करा
          const category = this.getAttribute('data-category');
          const galleryItems = document.querySelectorAll('.gallery-item');
          
          galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }
    
    // गॅलरी मोडल
    function initGalleryModal() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const modalPrev = document.querySelector('.modal-nav.prev');
      const modalNext = document.querySelector('.modal-nav.next');
      
      // गॅलरी आयटम क्लिक करण्यासाठी
      galleryItems.forEach(item => {
        item.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          openModal(index);
        });
      });
      
      // मोडल उघडा
      function openModal(index) {
        state.currentImageIndex = index;
        const image = state.galleryImages[index];
        
        elements.modalImage.src = image.image;
        elements.modalImage.alt = image.title;
        elements.modalCaption.textContent = `${image.title} - ${image.category}`;
        
        elements.imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      // मोडल बंद करा
      function closeModal() {
        elements.imageModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
      
      // पुढचे फोटो
      function nextImage() {
        state.currentImageIndex = (state.currentImageIndex + 1) % state.galleryImages.length;
        openModal(state.currentImageIndex);
      }
      
      // मागचे फोटो
      function prevImage() {
        state.currentImageIndex = (state.currentImageIndex - 1 + state.galleryImages.length) % state.galleryImages.length;
        openModal(state.currentImageIndex);
      }
      
      // इव्हेंट लिसनर्स जोडा
      elements.closeModal.addEventListener('click', closeModal);
      elements.imageModal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
      });
      
      if (modalPrev) modalPrev.addEventListener('click', prevImage);
      if (modalNext) modalNext.addEventListener('click', nextImage);
      
      // कीबोर्ड नेव्हिगेशन
      document.addEventListener('keydown', function(e) {
        if (!elements.imageModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      });
    }
    
    // गॅलरी लोड करा
    loadGallery();
  }
  
  // ==================== सूचना ====================
  
  function initNotices() {
    // सूचना डेटा (मॉक डेटा)
    const noticesData = [
      {
        id: 1,
        title: 'पाणी टंचाई तातडीची सूचना',
        content: 'उन्हाळ्यामुळे पाण्याचा तुटवडा निर्माण झाला आहे. सर्व नागरिकांना पाणी बचत करण्याची विनंती. फवारणी टाकी वापरणे टाळावे.',
        category: 'important',
        date: '2024-04-25',
        priority: 1
      },
      {
        id: 2,
        title: 'नवीन रस्ता बांधकाम',
        content: 'गावातील मुख्य रस्त्यावर बांधकाम सुरू आहे. सावधगिरी बाळगावी. पर्यायी मार्ग वापरावा. मोटारसायकल हेल्मेट घालणे अनिवार्य.',
        category: 'important',
        date: '2024-04-20',
        priority: 1
      },
      {
        id: 3,
        title: 'कृषी सबसिडी अर्ज',
        content: 'कृषी सबसिडीसाठी अर्ज करण्याची अंतिम तारीख ३१ मे २०२४ आहे. सर्व संबंधित शेतकऱ्यांनी वेळेत अर्ज करावेत.',
        category: 'government',
        date: '2024-04-15',
        priority: 2
      },
      {
        id: 4,
        title: 'महाराष्ट्र दिन सोहळा',
        content: '१ मे रोजी सकाळी ९ वाजता ग्रामस्थांची सर्वांची सहभागाची विनंती. सांस्कृतिक कार्यक्रम आणि पुरस्कार वितरण समारंभ.',
        category: 'new',
        date: '2024-04-30',
        priority: 2
      },
      {
        id: 5,
        title: 'विद्युत बिल भरणे',
        content: 'विद्युत बिल भरण्याची अंतिम तारीख २० मे आहे. वेळेत बिल भरावे. विलंब रक्कम भरण्याची गरज नाही.',
        category: 'new',
        date: '2024-04-28',
        priority: 3
      },
      {
        id: 6,
        title: 'आरोग्य शिबिर',
        content: '१५ मे रोजी सकाळी १० ते ४ वाजेपर्यंत विनामूल्य आरोग्य तपासणी शिबिर. सर्व नागरिकांनी सहभागी व्हावे.',
        category: 'new',
        date: '2024-04-22',
        priority: 2
      }
    ];
    
    // सूचना लोड करा
    function loadNotices() {
      const container = document.getElementById('notices-list');
      if (!container) return;
      
      // लोडिंग दाखवा
      container.innerHTML = `
        <div class="loading-notices">
          <div class="spinner"></div>
          <p>सूचना लोड करत आहे...</p>
        </div>
      `;
      
      // थोड्या वेळाने डेटा दाखवा
      setTimeout(() => {
        renderNotices(noticesData);
        initNoticeFilters();
      }, 1000);
    }
    
    // सूचना रेंडर करा
    function renderNotices(notices) {
      const container = document.getElementById('notices-list');
      if (!container) return;
      
      if (notices.length === 0) {
        container.innerHTML = '<p class="no-data">कोणत्याही सूचना उपलब्ध नाहीत</p>';
        return;
      }
      
      // तारखेनुसार सॉर्ट करा (नवीन प्रथम)
      notices.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      container.innerHTML = notices.map(notice => `
        <div class="notice-item ${notice.category}">
          <div class="notice-header">
            <span class="notice-category ${notice.category}">
              ${getCategoryLabel(notice.category)}
            </span>
            <span class="notice-date">${formatDate(notice.date)}</span>
          </div>
          <h3 class="notice-title">${notice.title}</h3>
          <p class="notice-content">${notice.content}</p>
        </div>
      `).join('');
    }
    
    // सूचना फिल्टर
    function initNoticeFilters() {
      const filterButtons = document.querySelectorAll('.notice-filter');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // सक्रिय क्लास अपडेट करा
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // फिल्टर लागू करा
          const filter = this.id.replace('notice-filter-', '');
          const noticeItems = document.querySelectorAll('.notice-item');
          
          noticeItems.forEach(item => {
            if (filter === 'all') {
              item.style.display = 'block';
            } else if (filter === 'important' && item.classList.contains('important')) {
              item.style.display = 'block';
            } else if (filter === 'new' && item.classList.contains('new')) {
              item.style.display = 'block';
            } else if (filter === 'government' && item.classList.contains('government')) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }
    
    // श्रेणी लेबल मिळवा
    function getCategoryLabel(category) {
      const labels = {
        important: 'महत्वाची',
        new: 'नवीन',
        government: 'सरकारी'
      };
      return labels[category] || category;
    }
    
    // सूचना लोड करा
    loadNotices();
  }
  
  // ==================== नकाशा ====================
  
  function initMap() {
    // लोकेशन शेअर करणे
    if (elements.shareLocation) {
      elements.shareLocation.addEventListener('click', function() {
        const shareData = {
          title: 'पिंपळगाव हेमाडपंथी शिव मंदिर',
          text: 'पिंपळगाव हेमाडपंथी शिव मंदिर, पिंपळगाव, महाराष्ट्र ४३१५०३',
          url: 'https://maps.app.goo.gl/XGhVKA7Jaqgz5DZN9'
        };
        
        if (navigator.share) {
          navigator.share(shareData)
            .then(() => console.log('शेअर यशस्वी'))
            .catch(error => console.log('शेअर त्रुटी:', error));
        } else {
          // Fallback: क्लिपबोर्डवर कॉपी करा
          navigator.clipboard.writeText(shareData.url)
            .then(() => {
              showNotification('लिंक क्लिपबोर्डवर कॉपी झाला!');
            })
            .catch(err => {
              console.error('कॉपी त्रुटी:', err);
            });
        }
      });
    }
    
    // नकाशा इंटरॅक्शन
    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe) {
      // नकाशा लोड झाल्यावर इव्हेंट
      mapIframe.addEventListener('load', function() {
        console.log('नकाशा लोड झाला');
        
        // थोड्या वेळाने झूम इफेक्ट
        setTimeout(() => {
          mapIframe.style.transition = 'transform 0.5s ease';
          mapIframe.style.transform = 'scale(1.02)';
          
          setTimeout(() => {
            mapIframe.style.transform = 'scale(1)';
          }, 500);
        }, 1000);
      });
    }
  }
  
  // ==================== संपर्क फॉर्म ====================
  
  function initForms() {
    // संदेश फॉर्म
    if (elements.messageForm) {
      elements.messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // फॉर्म डेटा मिळवा
        const formData = {
          name: document.getElementById('sender-name').value,
          phone: document.getElementById('sender-phone').value,
          email: document.getElementById('sender-email').value || 'नाही',
          subject: document.getElementById('message-subject').value,
          content: document.getElementById('message-content').value,
          category: document.getElementById('message-category').value,
          timestamp: new Date().toLocaleString('mr-IN')
        };
        
        // फॉर्म रीसेट करा
        this.reset();
        
        // संदेश पाठवल्याची सूचना दाखवा
        showNotification('तुमचा संदेश यशस्वीरित्या पाठवला गेला आहे! आम्ही लवकरच तुमच्याशी संपर्क साधू.');
        
        // कन्सोलवर डेटा दाखवा (वास्तविक अ‍ॅप्लिकेशनमध्ये बॅकएंडवर पाठवा)
        console.log('संदेश पाठवला:', formData);
        
        // लोकल स्टोरेजमध्ये सेव्ह करा
        const messages = JSON.parse(localStorage.getItem('villageMessages') || '[]');
        messages.push(formData);
        localStorage.setItem('villageMessages', JSON.stringify(messages));
      });
    }
    
    // न्यूजलेटर फॉर्म
    if (elements.newsletterForm) {
      elements.newsletterForm.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        
        if (!email || !validateEmail(email)) {
          showNotification('कृपया वैध ईमेल पत्ता प्रविष्ट करा', 'error');
          return;
        }
        
        // ईमेल सेव्ह करा
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }
        
        // फॉर्म रीसेट करा
        document.getElementById('newsletter-email').value = '';
        
        // सूचना दाखवा
        showNotification('तुमची नोंदणी यशस्वी झाली आहे! धन्यवाद.');
      });
    }
  }
  
  // ==================== सहाय्यक कार्ये ====================
  
  // सूचना दाखवा
  function showNotification(message, type = 'success') {
    // विद्यमान सूचना काढून टाका
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // नवीन सूचना तयार करा
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // स्टाइल जोडा
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;
    
    // स्टाइलशीटमध्ये ॲनिमेशन जोडा
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
      }
    `;
    document.head.appendChild(style);
    
    // बंद करण्याचे बटण
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // पेजवर जोडा
    document.body.appendChild(notification);
    
    // 5 सेकंदांनंतर आपोआप काढून टाका
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  // ईमेल वैधता तपासा
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // डीबाउन्स फंक्शन
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // ==================== इनिशियलायझेशन ====================
  
  // सर्व फंक्शन्स इनिशियलायझ करा
  function initializeWebsite() {
    initLoadingScreen();
    initTheme();
    initDateTime();
    initVisitorCount();
    initNavigation();
    initBackToTop();
    initImageSlider();
    initEventsAndWorks();
    initGallery();
    initNotices();
    initMap();
    initForms();
    
    // स्क्रोलवर सेक्शन्स दाखवा
    initScrollAnimations();
    
    // वेबसाइट तयार झाल्याची सूचना
    console.log('पिंपळगाव ग्रामपंचायत वेबसाइट तयार झाली!');
    setTimeout(() => {
      showNotification('पिंपळगाव ग्रामपंचायत वेबसाइटमध्ये आपले स्वागत आहे!', 'success');
    }, 2500);
  }
  
  // स्क्रोल ॲनिमेशन
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);
    
    // ॲनिमेट करायचे घटक
    document.querySelectorAll('.stat-card, .about-card, .member-card, .event-card, .work-card, .gallery-item').forEach(el => {
      observer.observe(el);
    });
  }
  
  // वेबसाइट इनिशियलायझ करा
  initializeWebsite();
  
  // विंडो ऑब्जेक्टवर काही उपयुक्त फंक्शन्स जोडा
  window.villageWebsite = {
    refresh: function() {
      location.reload();
    },
    getTheme: function() {
      return state.currentTheme;
    },
    setTheme: function(theme) {
      if (theme === 'light' || theme === 'dark') {
        state.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = elements.themeToggle.querySelector('i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    },
    showNotification: showNotification
  };
});
