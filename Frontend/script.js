class URLShortenerApp {
    constructor() {
        this.currentSection = 'leaderboards';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFormHandler();
        this.loadLeaderboard();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetSection = e.target.getAttribute('data-section');
                this.showSection(targetSection);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav link
        const activeNavLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load leaderboard data when switching to leaderboards section
        if (sectionName === 'leaderboards') {
            this.loadLeaderboard();
        }
    }

    async loadLeaderboard() {
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');
        const contentElement = document.getElementById('leaderboard-content');

        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        contentElement.classList.add('hidden');

        try {
            const response = await fetch('http://127.0.0.1:8000/leaderboard');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.renderLeaderboard(data);
            
            // Show content and hide loading
            loadingElement.classList.add('hidden');
            contentElement.classList.remove('hidden');
            
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            
            // Show error and hide loading
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
            
            // Retry button functionality
            errorElement.innerHTML = `
                <div>Failed to load leaderboard data</div>
                <button onclick="app.loadLeaderboard()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 500;
                    box-shadow: var(--shadow-purple);
                ">Retry</button>
            `;
        }
    }

    renderLeaderboard(data) {
        const contentElement = document.getElementById('leaderboard-content');
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            contentElement.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    No leaderboard data available
                </div>
            `;
            return;
        }

        // Backend already returns sorted data, so no need to sort
        const leaderboardHTML = data.map((item, index) => {
            const rank = index + 1;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '---';
            
            return `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">
                        ${rankEmoji} #${rank}
                    </div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-url">
                            http://127.0.0.1:8000/${item.short_link}
                        </div>
                        <div class="leaderboard-stats">
                            ${item.clicks} clicks
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        contentElement.innerHTML = leaderboardHTML;
    }

    truncateUrl(url, maxLength = 50) {
        if (!url) return 'Unknown URL';
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    }

    setupFormHandler() {
        const form = document.getElementById('url-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const urlInput = document.getElementById('url-input');
            const shortenInput = document.getElementById('shorten-input');
            
            const formData = {
                url: urlInput.value.trim(),
                shorten: shortenInput.value.trim()
            };

            // Call the URL shortening handler
            this.handleUrlSubmission(formData);
        });
    }

    async handleUrlSubmission(formData) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Shortening...';
        
        try {
            const requestBody = {
                url: formData.url,
                shorten_url: formData.shorten,
                recaptchaResponse: grecaptcha.getResponse() // Get reCAPTCHA response
            };

            const response = await fetch('http://127.0.0.1:8000/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            
            // Show success message
            this.showSuccessMessage(data);
            
            // Clear form
            document.getElementById('url-input').value = '';
            document.getElementById('shorten-input').value = '';
            
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage('Failed to shorten URL. Please try again.');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showSuccessMessage(data) {
        // Create or update success message container
        let successContainer = document.getElementById('success-message');
        if (!successContainer) {
            successContainer = document.createElement('div');
            successContainer.id = 'success-message';
            successContainer.style.cssText = `
                margin-top: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, var(--success-color), #059669);
                color: white;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
            `;
            document.querySelector('.url-form-card').appendChild(successContainer);
        }

        // You can customize this based on what your API returns
        successContainer.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">✅ URL shortened successfully!</div>
            <div>Your shortened URL is ready to use.</div>
            <div>http://127.0.0.1:8000/${data['short_link']}</div>
        `;

        // Auto-hide after seconds
        setTimeout(() => {
            if (successContainer) {
                successContainer.remove();
            }
        }, 8000);
    }

    showErrorMessage(message) {
        // Create or update error message container
        let errorContainer = document.getElementById('error-message');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'error-message';
            errorContainer.style.cssText = `
                margin-top: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, var(--error-color), #dc2626);
                color: white;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
            `;
            document.querySelector('.url-form-card').appendChild(errorContainer);
        }

        errorContainer.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">❌ Error</div>
            <div><p>Make sure you have a unique Custom URL or finished captcha</p></div>
        `;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorContainer) {
                errorContainer.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new URLShortenerApp();
});