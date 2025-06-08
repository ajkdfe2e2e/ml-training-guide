// 基于面向对象的大模型训练指南 - 交互脚本

class MLTrainingGuide {
    constructor() {
        this.init();
        this.initializeComponents();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupAudioSystem();
    }

    // 初始化
    init() {
        this.isPlaying = false;
        this.currentAudio = null;
        this.scrollRevealElements = [];
        this.mobileMenuOpen = false;
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        this.initializeScrollReveal();
        this.initializeCurriculumTabs();
        this.setupSmoothScrolling();
    }

    // 初始化组件
    initializeComponents() {
        // 初始化导航栏
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        // 初始化语音控制
        this.voiceBtn = document.querySelector('.voice-btn');
        this.lessonPlayButtons = document.querySelectorAll('.lesson-play');
        
        // 初始化表单
        this.contactForm = document.querySelector('#contactForm');
        
        // 初始化课程标签
        this.curriculumTabs = document.querySelectorAll('.curriculum-tab');
        this.curriculumPanels = document.querySelectorAll('.curriculum-panel');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 滚动事件
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 窗口大小改变事件
        window.addEventListener('resize', () => this.handleResize());
        
        // 移动端菜单
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // 语音播放按钮
        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => this.toggleGlobalVoice());
        }
        
        // 课程语音播放按钮
        this.lessonPlayButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.playLessonAudio(e));
        });
        
        // 课程标签
        this.curriculumTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchCurriculumTab(e));
        });
        
        // 表单提交
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // 导航链接平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.smoothScrollTo(e));
        });
    }

    // 滚动处理
    handleScroll() {
        this.updateNavbarBackground();
        this.revealElementsOnScroll();
    }

    // 更新导航栏背景
    updateNavbarBackground() {
        if (!this.navbar) return;
        
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }

    // 窗口大小改变处理
    handleResize() {
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    // 切换移动端菜单
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (this.mobileMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.navMenu) {
            this.navMenu.style.display = 'flex';
            this.navMenu.style.position = 'fixed';
            this.navMenu.style.top = '64px';
            this.navMenu.style.left = '0';
            this.navMenu.style.right = '0';
            this.navMenu.style.flexDirection = 'column';
            this.navMenu.style.background = 'white';
            this.navMenu.style.padding = '2rem';
            this.navMenu.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            this.navMenu.style.zIndex = '999';
        }
        
        if (this.hamburger) {
            this.hamburger.classList.add('active');
        }
        
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        if (this.navMenu) {
            this.navMenu.style.display = '';
            this.navMenu.style.position = '';
            this.navMenu.style.top = '';
            this.navMenu.style.left = '';
            this.navMenu.style.right = '';
            this.navMenu.style.flexDirection = '';
            this.navMenu.style.background = '';
            this.navMenu.style.padding = '';
            this.navMenu.style.boxShadow = '';
            this.navMenu.style.zIndex = '';
        }
        
        if (this.hamburger) {
            this.hamburger.classList.remove('active');
        }
        
        document.body.style.overflow = '';
        this.mobileMenuOpen = false;
    }

    // 设置滚动动画
    setupScrollAnimations() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, this.observerOptions);
    }

    // 初始化滚动揭示
    initializeScrollReveal() {
        this.scrollRevealElements = document.querySelectorAll('.overview-card, .project-card, .resource-category');
        
        this.scrollRevealElements.forEach(element => {
            element.classList.add('scroll-reveal');
            if (this.observer) {
                this.observer.observe(element);
            }
        });
    }

    // 在滚动时揭示元素
    revealElementsOnScroll() {
        this.scrollRevealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    // 设置音频系统
    setupAudioSystem() {
        // 检查浏览器是否支持语音合成
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            this.currentUtterance = null;
        } else {
            console.warn('浏览器不支持语音合成功能');
            this.disableVoiceFeatures();
        }
    }

    // 禁用语音功能
    disableVoiceFeatures() {
        if (this.voiceBtn) {
            this.voiceBtn.style.display = 'none';
        }
        
        this.lessonPlayButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // 切换全局语音
    toggleGlobalVoice() {
        if (this.isPlaying) {
            this.stopAllAudio();
        } else {
            this.playWelcomeMessage();
        }
    }

    // 播放欢迎消息
    playWelcomeMessage() {
        const welcomeText = "欢迎来到基于面向对象的大模型训练指南。这里将帮助您深入理解如何运用面向对象编程思想进行大型语言模型的训练和开发。";
        this.speak(welcomeText);
    }

    // 播放课程音频
    playLessonAudio(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const button = event.currentTarget;
        const text = button.getAttribute('data-text');
        
        if (!text) return;
        
        // 停止当前播放的音频
        this.stopAllAudio();
        
        // 播放新的音频
        this.speak(text, button);
    }

    // 语音合成
    speak(text, button = null) {
        if (!this.speechSynthesis) return;
        
        // 停止当前播放
        this.speechSynthesis.cancel();
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = 'zh-CN';
        this.currentUtterance.rate = 0.9;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 0.8;
        
        // 设置事件监听器
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.updatePlayingState(true, button);
        };
        
        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.updatePlayingState(false, button);
        };
        
        this.currentUtterance.onerror = () => {
            this.isPlaying = false;
            this.updatePlayingState(false, button);
            console.error('语音播放出错');
        };
        
        // 开始播放
        this.speechSynthesis.speak(this.currentUtterance);
    }

    // 停止所有音频
    stopAllAudio() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        
        this.isPlaying = false;
        this.updatePlayingState(false);
    }

    // 更新播放状态
    updatePlayingState(playing, activeButton = null) {
        // 更新全局语音按钮
        if (this.voiceBtn) {
            if (playing) {
                this.voiceBtn.classList.add('playing');
                this.voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            } else {
                this.voiceBtn.classList.remove('playing');
                this.voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
        
        // 更新课程播放按钮
        this.lessonPlayButtons.forEach(btn => {
            if (btn === activeButton && playing) {
                btn.classList.add('playing');
                btn.innerHTML = '<i class="fas fa-stop"></i>';
            } else {
                btn.classList.remove('playing');
                btn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // 初始化课程标签
    initializeCurriculumTabs() {
        if (this.curriculumTabs.length > 0) {
            // 默认激活第一个标签
            this.curriculumTabs[0].classList.add('active');
            if (this.curriculumPanels.length > 0) {
                this.curriculumPanels[0].classList.add('active');
            }
        }
    }

    // 切换课程标签
    switchCurriculumTab(event) {
        event.preventDefault();
        
        const clickedTab = event.currentTarget;
        const targetId = clickedTab.getAttribute('data-tab');
        
        // 移除所有活动状态
        this.curriculumTabs.forEach(tab => tab.classList.remove('active'));
        this.curriculumPanels.forEach(panel => panel.classList.remove('active'));
        
        // 激活点击的标签
        clickedTab.classList.add('active');
        
        // 激活对应的面板
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }

    // 设置平滑滚动
    setupSmoothScrolling() {
        // 已在CSS中设置了scroll-behavior: smooth
        // 这里可以添加额外的平滑滚动逻辑
    }

    // 平滑滚动到指定位置
    smoothScrollTo(event) {
        const href = event.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            event.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏的高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        }
    }

    // 处理表单提交
    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // 简单的表单验证
        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    }

    // 表单验证
    validateForm(data) {
        const required = ['name', 'email', 'message'];
        const missing = required.filter(field => !data[field] || data[field].trim() === '');
        
        if (missing.length > 0) {
            this.showNotification('请填写所有必填字段', 'error');
            return false;
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('请输入有效的邮箱地址', 'error');
            return false;
        }
        
        return true;
    }

    // 提交表单
    submitForm(data) {
        // 模拟表单提交
        this.showNotification('消息已发送，我们会尽快回复您！', 'success');
        
        // 重置表单
        if (this.contactForm) {
            this.contactForm.reset();
        }
        
        // 实际项目中，这里应该发送数据到服务器
        console.log('表单数据:', data);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // 设置背景颜色
        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'warning':
                notification.style.background = '#f59e0b';
                break;
            default:
                notification.style.background = '#3b82f6';
        }
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 工具函数：节流
    throttle(func, wait) {
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

    // 工具函数：防抖
    debounce(func, wait) {
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
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MLTrainingGuide();
});

// 兼容性：如果DOM已经加载完成
if (document.readyState !== 'loading') {
    new MLTrainingGuide();
}