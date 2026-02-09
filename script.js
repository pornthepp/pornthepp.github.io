const promptData = [
    {
        id: 1,
        category: "portrait",
        title: "Cyberpunk Samurai",
        prompt: "A futuristic samurai standing in the neon-lit streets of Neo-Tokyo, wearing high-tech carbon fiber armor with glowing blue accents, holding a laser katana, cinematic lighting, ultra-detailed, 8k, cyberpunk aesthetic.",
        image: "https://images.unsplash.com/photo-1623126389902-6c846c80f4c8?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        category: "portrait",
        title: "Ethereal Forest Spirit",
        prompt: "A mystical forest spirit with skin made of bark and eyes like glowing emeralds, surrounded by bioluminescent flora, soft ethereal light filtering through ancient trees, masterpiece, highly intricate, fantasy style.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        category: "product",
        title: "Luxury Perfume Bottle",
        prompt: "Luxury perfume bottle on a dark marble base, water droplets, soft golden lighting, minimalist and elegant composition, depth of field, 8k resolution, professional product photography.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 4,
        category: "product",
        title: "Modern Coffee Machine",
        prompt: "Modern minimalist espresso machine, matte black finish, steam rising from a cup, warm moody lighting, high-end kitchen aesthetic, clean lines, macro shot, hyper-realistic.",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 5,
        category: "portrait",
        title: "Vintage Cinema Star",
        prompt: "1950s Hollywood starlet portrait, classic black and white, dramatic noir lighting, elegant dress and pearls, film grain, nostalgic atmosphere, high contrast, elegant beauty.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 6,
        category: "product",
        title: "Wireless Silver Headphones",
        prompt: "Sleek silver wireless headphones floating in a dark void, neon purple rim lighting, futuristic tech vibes, clean render, 3D unreal engine 5 style, advertising photography.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 7,
        category: "portrait",
        title: "Desert Explorer",
        prompt: "A nomadic explorer crossing vast golden sand dunes at sunset, wearing flowing desert robes and goggles, warm orange sunlight, cinematic composition, epic scale, adventure core.",
        image: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 8,
        category: "product",
        title: "Emerald Watch",
        prompt: "Luxury emerald green watch face with gold accents, macro photography, focusing on texture and craftsmanship, dark velvet background, sophisticated lighting, premium brand style.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
    }
];

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
