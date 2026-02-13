const promptGrid = document.getElementById('promptGrid');
const searchInput = document.getElementById('searchInput');
const catBtns = document.querySelectorAll('.cat-btn');
const modal = document.getElementById('imageModal');
const closeModal = document.querySelector('.close-modal');
const copyBtn = document.getElementById('copyBtn');

const navGallery = document.getElementById('navGallery');
const navSpecial = document.getElementById('navSpecial');
const galleryView = document.getElementById('galleryView');
const specialView = document.getElementById('specialView');

let currentCategory = 'all';

// Initialize
function init() {
    console.log("Initializing Promptlnw...");
    if (typeof promptData !== 'undefined') {
        console.log("Found data:", promptData.length, "items");
        renderGrid(promptData);
    } else {
        console.error("promptData is not defined! Check if sources.js is loaded correctly.");
        promptGrid.innerHTML = '<div class="no-results">Error: ไม่สามารถโหลดข้อมูลได้ (Data not found)</div>';
    }
    setupEventListeners();
}

// Helper to format prompt object or string
function formatPrompt(prompt) {
    if (typeof prompt === 'string') return prompt;
    if (typeof prompt === 'object' && prompt !== null) {
        return Object.entries(prompt)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
    }
    return '';
}

// Render Grid
function renderGrid(data) {
    promptGrid.innerHTML = '';

    if (!data || data.length === 0) {
        promptGrid.innerHTML = '<div class="no-results">ไม่พบผลลัพธ์ที่คุณค้นหา...</div>';
        return;
    }

    data.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'prompt-item';
        gridItem.style.backgroundColor = '#1e293b';

        const displayPrompt = formatPrompt(item.prompt);

        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=padding:20px;text-align:center;color:#64748b>Image failed to load</div>'">
            <div class="prompt-overlay">
                <h3>${item.title}</h3>
                <p>${displayPrompt}</p>
            </div>
        `;
        gridItem.addEventListener('click', () => openModal(item));
        promptGrid.appendChild(gridItem);
    });
}

// Filter Logic
function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = promptData.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;

        const fullPromptText = formatPrompt(item.prompt).toLowerCase();
        const matchesSearch = fullPromptText.includes(searchTerm) ||
            item.title.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderGrid(filtered);
}

// Modal Logic
function openModal(item) {
    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalCategory').textContent = item.category;

    const promptDisplayArea = document.getElementById('promptText');
    const displayPrompt = formatPrompt(item.prompt);

    // Display with line breaks preserved
    promptDisplayArea.style.whiteSpace = 'pre-wrap';
    promptDisplayArea.textContent = displayPrompt;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function handleCloseModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    copyBtn.classList.remove('copied');
}

// Copy Action
async function copyPrompt() {
    const text = document.getElementById('promptText').textContent;
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('copied');

        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy!', err);
    }
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterItems);

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterItems();
        });
    });

    closeModal.addEventListener('click', handleCloseModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    copyBtn.addEventListener('click', copyPrompt);

    // Navbar Navigation
    navGallery.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('gallery');
    });

    navSpecial.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('special');
    });
}

function switchView(view) {
    if (view === 'gallery') {
        galleryView.style.display = 'block';
        specialView.style.display = 'none';
        navGallery.classList.add('active');
        navSpecial.classList.remove('active');
    } else {
        galleryView.style.display = 'none';
        specialView.style.display = 'block';
        navGallery.classList.remove('active');
        navSpecial.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', init);
