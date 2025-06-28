// ABOUT PAGE SPECIFIC JAVASCRIPT
// This file contains functionality specific to the about page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize about page specific functionality
    initFeatureCardAnimations();
    initScrollAnimations();
    initFeatureCardInteractions();
    initAccessibilityEnhancements();
});

// FEATURE CARD ANIMATIONS
function initFeatureCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add initial animation state to all cards
    featureCards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0'; // Start invisible
        card.style.transform = 'translateY(50px)'; // Start below final position
        
        // Animate cards in with staggered timing
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; // Smooth transition
            card.style.opacity = '1'; // Fade in
            card.style.transform = 'translateY(0)'; // Move to final position
        }, 200 + (index * 150)); // Stagger each card by 150ms
    });
}

// ENHANCED FEATURE CARD INTERACTIONS WITH FLIP AND EXPANSION
function initFeatureCardInteractions() {
    const featureCards = document.querySelectorAll('.feature-card');
    let expandedCard = null; // Track currently expanded card
    
    featureCards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            // Only apply hover effects if card is not expanded
            if (!this.classList.contains('expanded')) {
                // Scale up the icon with rotation
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)'; // Scale and rotate icon
                    icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // Bouncy transition
                }
                
                // Add subtle glow effect to card
                this.style.boxShadow = '0 20px 50px rgba(220, 53, 69, 0.3)'; // Enhanced red glow
                
                // Announce to screen reader if function exists
                if (window.announceToScreenReader) {
                    const title = this.querySelector('h4').textContent;
                    window.announceToScreenReader(`Viewing ${title} feature details`);
                }
            }
        });
        
        // Reset effects on mouse leave
        card.addEventListener('mouseleave', function() {
            // Only reset hover effects if card is not expanded
            if (!this.classList.contains('expanded')) {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)'; // Reset icon transform
                }
                
                // Reset box shadow
                this.style.boxShadow = ''; // Remove enhanced glow
            }
        });
        
        // Card click handler for flip and expansion
        card.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling
            
            if (this.classList.contains('expanded')) {
                // Card is already expanded, close it
                closeCard(this);
            } else {
                // Create ripple effect first
                createRippleEffect(this, event);
                
                // Then expand the card
                setTimeout(() => {
                    expandCard(this);
                }, 200); // Small delay for ripple effect
            }
            
            // Log interaction for analytics
            const title = this.querySelector('h4').textContent;
            console.log(`Feature card clicked: ${title}`);
        });
        
        // Close button handler
        const closeBtn = card.querySelector('.close-card');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent card click
                closeCard(card);
            });
        }
        
        // Add keyboard support
        card.addEventListener('keydown', function(event) {
            // Trigger click on Enter or Space
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default behavior
                this.click(); // Trigger click event
            }
        });
        
        // Make cards focusable for keyboard navigation
        card.setAttribute('tabindex', '0'); // Make focusable
        card.setAttribute('role', 'button'); // Indicate it's interactive
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h4').textContent}`); // Accessibility label
    });
    
    // Close card when clicking backdrop
    document.addEventListener('click', function(event) {
        if (expandedCard && !expandedCard.contains(event.target)) {
            closeCard(expandedCard);
        }
    });
    
    // Close card with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && expandedCard) {
            closeCard(expandedCard);
        }
    });
    
    // Update expandedCard reference when cards are manipulated
    function updateExpandedCardReference() {
        expandedCard = document.querySelector('.feature-card.expanded');
    }
    
    // CARD EXPANSION FUNCTION
    function expandCard(card) {
        // Close any other expanded card first
        if (expandedCard && expandedCard !== card) {
            closeCard(expandedCard);
        }
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'card-backdrop';
        document.body.appendChild(backdrop);
        
        // Force reflow then activate backdrop
        backdrop.offsetHeight;
        backdrop.classList.add('active');
             
        // Expand and flip the card
        setTimeout(() => {
            card.classList.add('expanded', 'flipped');
            expandedCard = card;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Announce to screen reader
            if (window.announceToScreenReader) {
                const title = card.querySelector('h4').textContent;
                window.announceToScreenReader(`${title} details expanded. Press Escape to close.`);
            }
        }, 50);
    }
    
    // CARD CLOSE FUNCTION
    function closeCard(card) {
        // Remove expanded and flipped classes
        card.classList.remove('expanded', 'flipped');
        
        
        expandedCard = null;
        
        // Remove backdrop
        const backdrop = document.querySelector('.card-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 400);
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Announce to screen reader
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Card details closed');
        }
    }
    
    // Make functions available to the rest of the script
    window.expandCard = expandCard;
    window.closeCard = closeCard;
}

// CREATE RIPPLE EFFECT ON CLICK
function createRippleEffect(element, event) {
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    // Calculate ripple position
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height); // Use larger dimension
    const x = event.clientX - rect.left - size / 2; // Center horizontally
    const y = event.clientY - rect.top - size / 2; // Center vertically
    
    // Style the ripple
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(220, 53, 69, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple to element
    element.style.position = 'relative'; // Ensure relative positioning
    element.style.overflow = 'hidden'; // Hide overflow
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// SCROLL-TRIGGERED ANIMATIONS
function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        // Create observer for scroll animations
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class when element enters viewport
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for feature cards
                    if (entry.target.classList.contains('feature-card')) {
                        // Add staggered animation to feature cards
                        const cards = document.querySelectorAll('.feature-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('feature-visible');
                            }, index * 100); // Stagger by 100ms
                        });
                    }
                    
                    // Stop observing this element
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // Start animation 50px before entering viewport
        });
        
        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.about-description, .feature-card, .about-more');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ACCESSIBILITY ENHANCEMENTS
function initAccessibilityEnhancements() {
    // Add skip link for keyboard users
    addSkipLink();
    
    // Enhance focus management
    enhanceFocusManagement();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
}

// ADD SKIP LINK FOR KEYBOARD NAVIGATION
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content'; // Link to main content
    skipLink.textContent = 'Skip to main content'; // Screen reader text
    skipLink.className = 'skip-link'; // CSS class for styling
    
    // Style the skip link (hidden until focused)
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    // Show skip link when focused
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px'; // Move into view
    });
    
    // Hide skip link when focus is lost
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px'; // Move out of view
    });
    
    // Add skip link to page
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

// ENHANCE FOCUS MANAGEMENT
function enhanceFocusManagement() {
    // Track focus for better keyboard navigation
    let focusedElement = null;
    
    document.addEventListener('focusin', function(event) {
        focusedElement = event.target; // Track currently focused element
    });
    
    // Handle escape key to clear focus
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && focusedElement) {
            focusedElement.blur(); // Remove focus
            focusedElement = null; // Clear tracked element
        }
    });
}

// ADD KEYBOARD SHORTCUTS
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only trigger shortcuts when no input is focused
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return; // Don't interfere with form inputs
        }
        
        // Alt + H: Go to home page
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            window.location.href = 'index.html';
        }
        
        // Alt + F: Focus first feature card
        if (event.altKey && event.key === 'f') {
            event.preventDefault();
            const firstCard = document.querySelector('.feature-card');
            if (firstCard) {
                firstCard.focus(); // Focus first feature card
            }
        }
    });
}

// PERFORMANCE MONITORING FOR ABOUT PAGE
function initPerformanceMonitoring() {
    // Monitor animation performance
    let animationFrameCount = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        animationFrameCount++;
        const currentTime = performance.now();
        
        // Log FPS every second
        if (currentTime - lastTime >= 1000) {
            console.log(`About page FPS: ${animationFrameCount}`);
            animationFrameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    // Start monitoring
    requestAnimationFrame(countFrames);
}

// Initialize performance monitoring
setTimeout(initPerformanceMonitoring, 1000);