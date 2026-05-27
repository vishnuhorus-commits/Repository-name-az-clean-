/* =============================================
   AZ CLEAN - Main Application Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    console.log('AZ Clean Platform initialized');
    initializeNavigation();
    initializeScrollEffects();
    initializeModules();
});

/* NAVIGATION */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/* SCROLL EFFECTS */
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .module-card, .demo-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

/* MODULE NAVIGATION */
function navigateToModule(moduleName) {
    const modules = {
        'organize': 'pages/organize.html',
        'index': 'pages/index.html',
        'sort': 'pages/sort.html',
        'archive': 'pages/archive.html'
    };
    
    const moduleUrl = modules[moduleName.toLowerCase()];
    
    if (moduleUrl) {
        console.log(`Navigating to ${moduleName} module...`);
        window.location.href = moduleUrl;
    } else {
        console.error(`Module ${moduleName} not found`);
        alert(`Module "${moduleName}" is being prepared. Please try again later.`);
    }
}

/* ORGANIZER CLASS */
class AZOrganizer {
    constructor(data = []) {
        this.data = data;
        this.organized = {};
    }
    
    organize(key = 'name') {
        this.organized = {};
        
        this.data.forEach(item => {
            const firstLetter = item[key].charAt(0).toUpperCase();
            
            if (!this.organized[firstLetter]) {
                this.organized[firstLetter] = [];
            }
            
            this.organized[firstLetter].push(item);
        });
        
        return this.organized;
    }
    
    getSorted() {
        const sorted = {};
        Object.keys(this.organized).sort().forEach(key => {
            sorted[key] = this.organized[key];
        });
        return sorted;
    }
    
    search(query) {
        const results = [];
        
        Object.values(this.organized).forEach(letter => {
            letter.forEach(item => {
                if (JSON.stringify(item).toLowerCase().includes(query.toLowerCase())) {
                    results.push(item);
                }
            });
        });
        
        return results;
    }
}

/* MODULE INIT */
function initializeModules() {
    console.log('Modules initialized');
    window.azOrganizer = new AZOrganizer();
}

/* LOCAL STORAGE */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Data saved: ${key}`);
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Storage error:', error);
        return null;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

/* EXPORT */
window.AZOrganizer = AZOrganizer;
window.navigateToModule = navigateToModule;
window.scrollToSection = scrollToSection;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.removeFromLocalStorage = removeFromLocalStorage;

console.log('AZ Clean App: Ready');
