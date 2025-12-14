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

    let currentPage = 'splash';

    const navigateTo = (pageName, useAnimation = true) => {
        if (!pages[pageName]) {
            console.error(`Page ${pageName} not found`);
            return;
        }

        console.log(`Navigating to ${pageName}`);

        const currentPageElement = pages[currentPage];
        const targetPageElement = pages[pageName];

        if (!currentPageElement || !targetPageElement) {
            console.error(`Page element missing: ${pageName}`);
            return;
        }

        if (useAnimation) {
            gsap.to(currentPageElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentPageElement.classList.remove('active');
                    targetPageElement.classList.add('active');
                    gsap.fromTo(targetPageElement,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3 }
                    );

                    if (pageName !== 'splash' && pageName !== 'login') {
                        animatePageContent(targetPageElement);
                    }

                    if (pageName === 'dashboard') {
                        animateAccountCard();
                    }

                    if (pageName === 'balance') {
                        const balanceElement = targetPageElement.querySelector('.balance-amount-dark');
                        if (balanceElement) {
                            gsap.to(balanceElement, { opacity: 1, duration: 0.3 });
                        }
                    }
                }
            });
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
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
        );
    };

    const updateNavigation = (pageName) => {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.navigate === pageName) {
                item.classList.add('active');
            }
        });
    };

    const animateSplashScreen = () => {
        const logo = document.querySelector('#splash .discover-logo');
        const orangeDot = document.querySelector('#splash .logo-circle');

        if (!logo || !orangeDot) {
            console.error('Splash screen elements missing');
            setTimeout(() => navigateTo('login'), 3000);
            return;
        }

        gsap.fromTo(logo,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
        );

        gsap.fromTo(orangeDot,
            { scale: 1 },
            { scale: 1.2, duration: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 }
        );

        setTimeout(() => {
            navigateTo('login');
        }, 3000);
    };

    const animateAccountCard = () => {
        const accountLabel = document.getElementById('account-label');
        const accountNumber = document.getElementById('account-number-label');
        if (accountLabel && accountNumber) {
            gsap.to([accountLabel, accountNumber], {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    accountLabel.textContent = 'Welcome Mike';
                    accountNumber.textContent = '';
                    gsap.to([accountLabel, accountNumber], {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    setTimeout(() => {
                        gsap.to([accountLabel, accountNumber], {
                            opacity: 0,
                            duration: 0.5,
                            ease: 'power2.out',
                            onComplete: () => {
                                accountLabel.textContent = 'CASHBACK DEBIT';
                                accountNumber.textContent = '(...8179)';
                                gsap.to([accountLabel, accountNumber], {
                                    opacity: 1,
                                    duration: 0.5,
                                    ease: 'power2.out'
                                });
                            }
                        });
                    }, 2000);
                }
            });
        }
    };

    const handleBiometricLogin = async (button) => {
        button.textContent = 'Authenticating...';
        button.disabled = true;

        try {
            if (!window.PublicKeyCredential) {
                throw new Error('Biometric authentication is not supported on this device.');
            }

            const publicKey = {
                challenge: new Uint8Array(32).fill(0),
                rpId: window.location.hostname,
                userVerification: 'preferred'
            };

            const credential = await navigator.credentials.get({ publicKey });
            if (credential) {
                console.log('Biometric authentication successful');
                setTimeout(() => {
                    navigateTo('dashboard');
                    button.textContent = 'Log In with Biometrics';
                    button.disabled = false;
                }, 800);
            } else {
                throw new Error('Biometric authentication failed.');
            }
        } catch (error) {
            console.error('Biometric error:', error);
            alert(error.message || 'Biometric authentication failed. Please use password login.');
            button.textContent = 'Log In with Biometrics';
            button.disabled = false;
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const loginButton = e.target.querySelector('.btn-primary');

        if (!password) {
            alert('Please enter your password');
            return;
        }

        if (password !== 'shawn@324') {
            alert('Incorrect password. Please try again.');
            return;
        }

        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;

        setTimeout(() => {
            navigateTo('dashboard');
            loginButton.textContent = 'Log In';
            loginButton.disabled = false;
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

    document.querySelectorAll('.btn-faceid').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'biometric') {
                handleBiometricLogin(btn);
            } else if (btn.dataset.action === 'faceid-legacy') {
                alert('Face ID login is deprecated. Please use Biometric Login.');
            }
        });
    });

    document.querySelectorAll('.btn-logout, #logoutBtn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
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

    document.querySelectorAll('.bottom-nav .nav-item.active').forEach(item => {
        gsap.to(item.querySelector('i'), {
            scale: 1.1,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
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

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log(`Checkbox ${checkbox.id} is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
        });
    });

    console.log('Discover Bank Mobile App initialized');
});




