const promptGrid = document.getElementById('promptGrid');
const searchInput = document.getElementById('searchInput');
const catBtns = document.querySelectorAll('.cat-btn');
const modal = document.getElementById('imageModal');
const closeModal = document.querySelector('.close-modal');
const copyBtn = document.getElementById('copyBtn');

let currentCategory = 'all';

// Initialize
function init() {
    renderGrid(promptData);
    setupEventListeners();
}

// Render Grid
function renderGrid(data) {
    promptGrid.innerHTML = '';

    if (data.length === 0) {
        promptGrid.innerHTML = '<div class="no-results">ไม่พบผลลัพธ์ที่คุณค้นหา...</div>';
        return;
    }

    data.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'prompt-item';
        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="prompt-overlay">
                <h3>${item.title}</h3>
                <p>${item.prompt}</p>
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
        const matchesSearch = item.prompt.toLowerCase().includes(searchTerm) ||
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
    document.getElementById('promptText').textContent = item.prompt;

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
}

document.addEventListener('DOMContentLoaded', init);
