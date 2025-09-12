export const fetchBtn = document.getElementById('fetch-btn');
export const bibleRef = document.getElementById('bible-ref');
export const bibleText = document.getElementById('bible-text');
export const prayerText = document.getElementById('prayer-text');
export const summaryText = document.getElementById('summary-text');
export const capturedText = document.getElementById('captured-text');
export const meditationText = document.getElementById('meditation-text');
export const characterText = document.getElementById('character-text');
export const actionText = document.getElementById('action-text');
export const finalPrayer = document.getElementById('final-prayer');
export const saveBtn = document.getElementById('save-btn');
export const shareBtn = document.getElementById('share-btn');
export const savedContent = document.getElementById('saved-content');
export const savedText = document.getElementById('saved-text');
export const copyBtn = document.getElementById('copy-btn');
export const loadingIndicator = document.getElementById('loading-indicator');
export const dailyDevotionalBtn = document.getElementById('daily-devotional-btn');

export function addToRecentSearches(reference) {
    const recentSearches = document.getElementById('recent-searches');
    if (!Array.from(recentSearches.options).some(option => option.value === reference)) {
        const option = document.createElement('option');
        option.value = reference;
        recentSearches.appendChild(option);
    }
}

export function initializeDarkMode() {
    const darkModeToggle = document.getElementById("darkmode-toggle");
    
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}
