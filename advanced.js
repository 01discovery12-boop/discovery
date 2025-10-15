class DiscoverApp {
  constructor() {
    this.currentPage = 'splash';
    this.history = [];
    this.userData = {
      balance: 0,
      transactions: [],
      quickViewEnabled: true,
      widgetEnabled: false
    };
    this.particles = [];
    this.init();
  }

  init() {
    this.createParticleSystem();
    this.initAdvancedSplashScreen();
    this.initSwipeGestures();
    this.initPullToRefresh();
    this.initParallaxEffects();
    this.initTypingEffect();
    this.initBalanceCounter();
    this.initCarousel();
    this.initKeyboardShortcuts();
    this.initHapticFeedback();
    this.initAdvancedAnimations();
  }

  createParticleSystem() {
    const splashContainer = document.querySelector('.splash-container');
    if (!splashContainer) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    splashContainer.insertBefore(canvas, splashContainer.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = splashContainer.offsetWidth;
    canvas.height = splashContainer.offsetHeight;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(229, 92, 32, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();
  }

  initAdvancedSplashScreen() {
    const logo = document.querySelector('.discover-logo');
    const logoCircle = document.querySelector('.logo-circle');

    if (!logo || !logoCircle) return;

    const timeline = gsap.timeline();

    timeline
      .from('.logo-text', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)'
      })
      .from('.logo-circle', {
        scale: 0,
        rotation: 360,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.4')
      .to('.logo-circle', {
        boxShadow: '0 0 40px rgba(229, 92, 32, 0.8)',
        duration: 1,
        repeat: -1,
        yoyo: true
      });

    const logoTexts = document.querySelectorAll('.logo-text');
    logoTexts.forEach((text, index) => {
      text.addEventListener('mouseenter', () => {
        gsap.to(text, {
          scale: 1.2,
          color: '#F9A021',
          duration: 0.3
        });
      });

      text.addEventListener('mouseleave', () => {
        gsap.to(text, {
          scale: 1,
          color: '#FFFFFF',
          duration: 0.3
        });
      });
    });
  }

  initSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });
  }

  handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    if (absDiffX > absDiffY && absDiffX > 50) {
      if (diffX > 0) {
        console.log('Swiped Right');
        this.handleSwipeRight();
      } else {
        console.log('Swiped Left');
        this.handleSwipeLeft();
      }
    } else if (absDiffY > 50) {
      if (diffY > 0) {
        console.log('Swiped Down');
      } else {
        console.log('Swiped Up');
      }
    }
  }

  handleSwipeRight() {
    const carousel = document.querySelector('.carousel-dots');
    if (carousel) {
      const dots = carousel.querySelectorAll('.dot');
      const activeDot = carousel.querySelector('.dot.active');
      const activeIndex = Array.from(dots).indexOf(activeDot);

      if (activeIndex > 0) {
        dots[activeIndex].classList.remove('active');
        dots[activeIndex - 1].classList.add('active');
        this.animateCarouselTransition(-1);
      }
    }
  }

  handleSwipeLeft() {
    const carousel = document.querySelector('.carousel-dots');
    if (carousel) {
      const dots = carousel.querySelectorAll('.dot');
      const activeDot = carousel.querySelector('.dot.active');
      const activeIndex = Array.from(dots).indexOf(activeDot);

      if (activeIndex < dots.length - 1) {
        dots[activeIndex].classList.remove('active');
        dots[activeIndex + 1].classList.add('active');
        this.animateCarouselTransition(1);
      }
    }
  }

  animateCarouselTransition(direction) {
    const billpayContent = document.querySelector('.billpay-illustration');
    if (billpayContent) {
      gsap.fromTo(billpayContent,
        { x: direction * 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  initPullToRefresh() {
    let startY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', (e) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 0 && pullDistance < 100) {
        const header = document.querySelector('.page-header');
        if (header) {
          gsap.to(header, {
            y: pullDistance * 0.5,
            duration: 0.1
          });
        }
      }

      if (pullDistance > 100) {
        this.triggerRefresh();
        isPulling = false;
      }
    });

    document.addEventListener('touchend', () => {
      if (isPulling) {
        const header = document.querySelector('.page-header');
        if (header) {
          gsap.to(header, {
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
        isPulling = false;
      }
    });
  }

  triggerRefresh() {
    const activePage = document.querySelector('.page.active');
    const cards = activePage.querySelectorAll('.account-card, .promo-card, .settings-card');

    gsap.fromTo(cards,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );

    console.log('Page refreshed!');
  }

  initParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      const parallaxElements = document.querySelectorAll('.promo-card, .balance-header-dark');
      parallaxElements.forEach((el) => {
        const speed = 0.5;
        gsap.to(el, {
          y: scrolled * speed,
          duration: 0.1
        });
      });
    });
  }

  initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.opacity = '1';

      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
    });
  }

  initBalanceCounter() {
    const balanceElements = document.querySelectorAll('.balance-amount, .balance-amount-dark, .balance');
    balanceElements.forEach(element => {
      const targetText = element.textContent;
      if (!targetText) return;

      const match = targetText.match(/[\d,]+\.?\d*/);
      if (!match) {
        // Fallback: ensure element is visible with original text
        gsap.to(element, { opacity: 1, duration: 0.3 });
        return;
      }

      const targetValue = parseFloat(match[0].replace(/,/g, ''));
      const prefix = targetText.substring(0, targetText.indexOf(match[0]));
      const suffix = targetText.substring(targetText.indexOf(match[0]) + match[0].length);

      // Ensure initial visibility
      element.style.opacity = '1';

      gsap.from({ value: 0 }, {
        value: targetValue,
        duration: 2,
        ease: 'power1.out',
        onUpdate: function() {
          const currentValue = this.targets()[0].value;
          element.textContent = prefix + currentValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        },
        onComplete: () => {
          // Ensure final value is set and visible
          element.textContent = prefix + targetValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
          gsap.to(element, { opacity: 1, duration: 0.3 });
        }
      });
    });
  }

  initCarousel() {
    const dots = document.querySelectorAll('.carousel-dots .dot');

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        gsap.to(dot, {
          scale: 1.5,
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      });
    });

    let currentDot = 0;
    setInterval(() => {
      if (document.querySelector('.billpay-content')) {
        dots.forEach(d => d.classList.remove('active'));
        currentDot = (currentDot + 1) % dots.length;
        if (dots[currentDot]) {
          dots[currentDot].classList.add('active');
        }
      }
    }, 3000);
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'h':
            e.preventDefault();
            this.navigateToPage('dashboard');
            break;
          case 'd':
            e.preventDefault();
            this.navigateToPage('deposit');
            break;
          case 'p':
            e.preventDefault();
            this.navigateToPage('profile');
            break;
          case 'l':
            e.preventDefault();
            document.querySelector('[data-action="logout"]')?.click();
            break;
        }
      }
    });
  }

  navigateToPage(pageName) {
    const button = document.querySelector(`[data-navigate="${pageName}"]`);
    if (button) button.click();
  }

  initHapticFeedback() {
    const interactiveElements = document.querySelectorAll('button, .nav-item, .deposit-option-card, .settings-item');

    interactiveElements.forEach(element => {
      element.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });
  }

  initAdvancedAnimations() {
    this.initMorphingShapes();
    this.initGlowEffects();
    this.initRippleEffect();
    this.initFloatingElements();
  }

  initMorphingShapes() {
    const circles = document.querySelectorAll('.logo-circle, .logo-circle-small');

    circles.forEach(circle => {
      gsap.to(circle, {
        borderRadius: ['50%', '40%', '50%'],
        duration: 3,
        repeat: -1,
        ease: 'sine.inOut'
      });
    });
  }

  initGlowEffects() {
    const glowElements = document.querySelectorAll('.btn-primary, .nav-item.active');

    glowElements.forEach(element => {
      gsap.to(element, {
        boxShadow: '0 0 20px rgba(229, 92, 32, 0.5)',
        duration: 1.5,
        repeat: -1,
        yoyo: true
      });
    });
  }

  initRippleEffect() {
    document.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(229, 92, 32, 0.5)';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';

      document.body.appendChild(ripple);

      gsap.to(ripple, {
        scale: 10,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    });
  }

  initFloatingElements() {
    const floatingElements = document.querySelectorAll('.promo-icon, .bill-graphic');

    floatingElements.forEach(element => {
      gsap.to(element, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new DiscoverApp();
  window.discoverApp = app;
});
