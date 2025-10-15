document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        splash: document.getElementById('splash'),
        login: document.getElementById('login'),
        dashboard: document.getElementById('dashboard'),
        deposit: document.getElementById('deposit'),
        balance: document.getElementById('balance'),
        pay: document.getElementById('pay'),
        more: document.getElementById('more'),
        profile: document.getElementById('profile'),
        transfer: document.getElementById('transfer')
    };
     const accountLabel = document.getElementById('account-label');
  const accountNumber = document.getElementById('account-number-label');
  if (accountLabel && accountNumber) {
    // Step 1: Fade out both
    accountLabel.classList.add('hide');
    accountNumber.classList.add('hide');
    setTimeout(() => {
      // Step 2: Change to "Hello Belle" and remove account number
      accountLabel.textContent = "Hello Belle";
      accountNumber.textContent = "";
      accountLabel.classList.remove('hide');
      accountNumber.classList.remove('hide');

      // Step 3: Wait, then revert
      setTimeout(() => {
        accountLabel.classList.add('hide');
        accountNumber.classList.add('hide');
        setTimeout(() => {
          accountLabel.textContent = "CASHBACK DEBIT";
          accountNumber.textContent = "(...8179)";
          accountLabel.classList.remove('hide');
          accountNumber.classList.remove('hide');
        }, 500); // Fade in after fade out
      }, 2000); // Show "Hello Belle" for 2 seconds
    }, 500); // Fade in after fade out
  }

    let currentPage = 'splash';

    const navigateTo = (pageName, useAnimation = true) => {
        if (!pages[pageName]) return;

        const currentPageElement = pages[currentPage];
        const targetPageElement = pages[pageName];

        if (useAnimation) {
            gsap.to(currentPageElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentPageElement.classList.remove('active');
                }
            });

            setTimeout(() => {
                targetPageElement.classList.add('active');
                gsap.fromTo(targetPageElement,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3 }
                );

                if (pageName !== 'splash' && pageName !== 'login') {
                    animatePageContent(targetPageElement);
                }
            }, 300);
        } else {
            currentPageElement.classList.remove('active');
            targetPageElement.classList.add('active');
        }

        currentPage = pageName;
        updateNavigation(pageName);
    };

    const animatePageContent = (pageElement) => {
        const cards = pageElement.querySelectorAll('.promo-card, .account-card, .action-card, .info-card, .deposit-option, .activity-section, .settings-card, .promo-card-large, .profile-section, .billpay-illustration');

        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    };

    const updateNavigation = (pageName) => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.navigate === pageName) {
                item.classList.add('active');
            }
        });
    };

    const animateSplashScreen = () => {
        const logo = document.querySelector('#splash .discover-logo');
        const orangeDot = document.querySelector('#splash .orange-dot');

        gsap.fromTo(logo,
            {
                opacity: 0,
                scale: 0.8
            },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power2.out'
            }
        );

        gsap.fromTo(orangeDot,
            { scale: 1 },
            {
                scale: 1.2,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: 1
            }
        );

        setTimeout(() => {
            navigateTo('login');
        }, 3000);
    };

    // Updated handleLogin function to validate password as 'alex#234'
    const handleLogin = (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const correctPassword = 'alex#234'; // Set the correct password

        if (!password) {
            alert('Please enter your password');
            return;
        }

        if (password !== correctPassword) {
            alert('Incorrect password. Please try again.');
            return;
        }

        const loginButton = e.target.querySelector('.btn-primary');
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;

        setTimeout(() => {
            navigateTo('dashboard');
            loginButton.textContent = 'Log In';
            loginButton.disabled = false;
            document.getElementById('password').value = ''; // Clear the password field
        }, 800);
    };

    const handleLogout = () => {
        navigateTo('login');
        document.getElementById('password').value = '';
    };

    const handleDepositOption = (action) => {
        console.log(`Deposit option selected: ${action}`);
        alert(`You selected: ${action.replace('-', ' ').toUpperCase()}`);
    };

    animateSplashScreen();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    document.querySelectorAll('.btn-logout, #logoutBtn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = item.dataset.navigate;
            if (page && pages[page]) {
                navigateTo(page);
            }
        });

        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                gsap.to(item, {
                    scale: 1.1,
                    duration: 0.2,
                    ease: 'power1.out'
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.2,
                ease: 'power1.out'
            });
        });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.dataset.navigate;
            if (targetPage) {
                navigateTo(targetPage);
            }
        });
    });

    document.querySelectorAll('[data-navigate]').forEach(element => {
        if (!element.classList.contains('btn-back') && !element.classList.contains('nav-item')) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = element.dataset.navigate;
                if (targetPage && pages[targetPage]) {
                    navigateTo(targetPage);
                }
            });
        }
    });

    document.querySelectorAll('.deposit-option').forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            handleDepositOption(action);
        });
    });

    document.querySelectorAll('.btn-primary, .btn-primary-small, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power1.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power1.out'
            });
        });
    });

    document.querySelectorAll('.promo-card, .account-card, .action-card, .info-card, .deposit-option').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -4,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    const navItems = document.querySelectorAll('.nav-item.active');
    navItems.forEach(item => {
        gsap.to(item.querySelector('i'), {
            scale: 1.1,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });

    document.querySelectorAll('.btn-text-link, .link-action, .link-secondary, .header-link, .feature-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.dataset.page && !link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                console.log(`Link clicked: ${link.textContent.trim()}`);
            }
        });
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const parentTabs = tab.closest('.activity-tabs');
            parentTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            console.log(`Tab selected: ${tab.textContent.trim()}`);
        });
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log(`Checkbox ${checkbox.id} is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
        });
    });

    document.querySelectorAll('.settings-item').forEach(item => {
        const label = item.querySelector('.settings-label');
        if (label && label.textContent.trim() === 'Manage Third-Party Access') {
            item.addEventListener('click', () => {
                console.log('Navigate to: Manage Third-Party Access');
            });
        }
    });

    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            console.log('Edit profile clicked');
            alert('Edit Profile functionality');
        });
    }

    const viewAccountsBtn = document.querySelector('.promo-card-large .btn-secondary');
    if (viewAccountsBtn) {
        viewAccountsBtn.addEventListener('click', () => {
            console.log('View Accounts clicked');
        });
    }

    document.querySelectorAll('[href="#"]').forEach(link => {
        if (link.textContent.includes('Profile')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('profile');
            });
        }
    });

    console.log('Discover Bank Mobile App initialized');
});

