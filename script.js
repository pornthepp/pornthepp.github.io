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
    if (!promptGrid) return;
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
    if (searchInput) searchInput.addEventListener('input', filterItems);

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterItems();
        });
    });

    if (closeModal) closeModal.addEventListener('click', handleCloseModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    if (copyBtn) copyBtn.addEventListener('click', copyPrompt);

    // Navbar Navigation
    if (navGallery) {
        navGallery.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('gallery');
        });
    }

    if (navSpecial) {
        navSpecial.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('special');
        });
    }
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

const specialData = [
    { category: "📷 Special Prompt", title: "Randomly Poses", desc: "สุ่มท่าโพสและมุมกล้อง", prompt: "A photo with Randomly select cute and cheerful portrait poses using various camera angles" },
    
    { category: "📐 Composition & Angles", title: "Rule of Thirds", desc: "กฎสามส่วน: จัดวางตัวแบบไว้ที่จุดตัดเพื่อความสมดุล", prompt: "composition following rule of thirds, subject placed at intersection points, perfect visual balance" },
    { category: "📐 Composition & Angles", title: "Headroom Illusion", desc: "เพิ่มความสูง: เว้นพื้นที่ว่างเหนือศีรษะเยอะๆ เพื่อให้ตัวแบบดูโปร่ง", prompt: "wide shot, huge negative space above head, 1:1 ratio framing, making subject look tall and slender" },
    { category: "📐 Composition & Angles", title: "Side Profile", desc: "มุมข้างหน้าเรียว: ถ่ายมุมข้างหันหน้าเข้าหาแสงเพื่อให้เห็นกรามชัด", prompt: "side profile view, showing sharp jawline, face illuminated by soft light, slimming angle" },
    { category: "📐 Composition & Angles", title: "Low Angle Legs", desc: "มุมต่ำขายาว: ถ่ายเสยจากมุมต่ำ ยื่นขามาด้านหน้า", prompt: "low angle shot, worm's-eye view, camera shooting from below, exaggerated perspective, long legs" },
    { category: "📐 Composition & Angles", title: "Symmetry", desc: "สมมาตร: จัดวางตัวแบบไว้กึ่งกลางภาพฉากหลังทรงเรขาคณิต", prompt: "centered composition, symmetrical background, circular framing element, perfect symmetry" },

    { category: "🖼️ Framing & Depth", title: "Foreground Bokeh", desc: "ฉากหน้าเบลอ: ใช้ใบไม้หรือดอกไม้บังหน้าเลนส์สร้างมิติ", prompt: "foreground bokeh, blurry flowers in foreground, shot through leaves, dreamy depth of field, focus on subject" },
    { category: "🖼️ Framing & Depth", title: "Architectural Frame", desc: "กรอบสถาปัตยกรรม: ถ่ายลอดช่องประตู หน้าต่าง หรือเสา", prompt: "framed by architecture, shot through doorway, looking through window frame, leading lines from fence" },
    { category: "🖼️ Framing & Depth", title: "Hand Framing", desc: "กรอบมือและเลนส์ไวด์: ใช้มือยื่นมาบังเลนส์ เหมาะกับเลนส์ Wide", prompt: "wide angle lens, fisheye effect, hands reaching towards camera lens, playful perspective, dynamic shot" },
    { category: "🖼️ Framing & Depth", title: "Prop Framing", desc: "กรอบจากสิ่งของ: ถ่ายผ่านแว่นตา หรือวัตถุทรงกลม", prompt: "shot through glasses lens, looking through circular object, creative framing effect" },

    { category: "💃 Posing Guide", title: "Legs Positioning", desc: "ท่าขา: ยื่นขาข้างหนึ่งมาด้านหน้าเสมอ หรือพิงสะโพก", prompt: "one leg extended forward towards camera, leaning against wall, relaxed stance, fashion pose" },
    { category: "💃 Posing Guide", title: "Triangle Arms", desc: "ท่าแขนสามเหลี่ยม: ยกแขนขึ้นจับผมหรือเท้าคาง ให้เกิดช่องว่างสามเหลี่ยม", prompt: "arms creating triangle space, arms lifted away from body, hand touching hair, tucking hair behind ear" },
    { category: "💃 Posing Guide", title: "Interaction Pose", desc: "ท่าสร้างมิติ: นั่งเท้าคางแล้วยื่นมืออีกข้างมาหาหน้ากล้อง", prompt: "resting chin on hand, reaching one hand towards camera, engaging with viewer, shallow depth of field" },
    { category: "💃 Posing Guide", title: "S-Curve", desc: "ท่าบิดเอว: ชูแขนขึ้นแล้วบิดเอวเล็กน้อยโชว์สัดส่วน", prompt: "arms raised up, twisting waist, s-curve body pose, confident expression" },

    { category: "💡 Lighting & Mood", title: "Silhouette", desc: "ย้อนแสงซิลูเอท: ถ่ายย้อนแสงให้เห็นแค่เงาและรูปร่าง", prompt: "silhouette shot, backlit, dark figure against bright background, rim light on hair, high contrast, mysterious" },
    { category: "💡 Lighting & Mood", title: "Creative Light", desc: "แสงสะท้อน: ใช้แผ่น CD หรือกระจกสร้างแนวรุ้ง", prompt: "light leak, rainbow lens flare, prismatic reflection, soft dreamy atmosphere, ethereal glow" },
    { category: "💡 Lighting & Mood", title: "Candid Moment", desc: "เผลอหัวเราะ: อารมณ์ธรรมชาติ ไม่เก๊กสวย", prompt: "candid moment, natural laughing, accidentally captured, joyful expression, unposed look" },
    { category: "💡 Lighting & Mood", title: "Black & White", desc: "ขาวดำ: เน้นอารมณ์และสายตา", prompt: "black and white photography, monochrome, emotional portrait, close-up, high contrast" },

    { category: "☕🚗 Scenarios", title: "Cafe Vibes", desc: "คาเฟ่: มุมกล้องระดับโต๊ะ หรือมุม POV", prompt: "sitting at cafe table, camera resting on table surface, eye-level with coffee cup, boyfriend point of view (POV), cozy atmosphere" },
    { category: "☕🚗 Scenarios", title: "Car Portrait", desc: "รถยนต์: ถ่ายผ่านกระจกหน้า หรือเปิดประตูหันมายิ้ม", prompt: "portrait inside car, view through windshield, open car door frame, leaning on car hood, driver looking back at passenger" },
    { category: "☕🚗 Scenarios", title: "Mirror Selfie", desc: "กระจกเงา: ถ่ายสะท้อนให้เห็นทั้งตัวจริงและเงา", prompt: "mirror reflection, shooting into mirror, double reflection composition, creative selfie style" }
];

function renderSpecialGrid() {
    const specialGroups = document.getElementById('specialGroups');
    if (!specialGroups) return;
    specialGroups.innerHTML = '';

    const groups = specialData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    for (const [category, items] of Object.entries(groups)) {
        const groupEl = document.createElement('div');
        groupEl.className = 'special-group';

        groupEl.innerHTML = `
            <div class="special-group-title">${category}</div>
            <div class="group-items">
                ${items.map(item => `
                    <div class="special-card">
                        <div class="card-content">
                            <h3>${item.title}</h3>
                            <p class="description">${item.desc}</p>
                        </div>
                        <div class="prompt-box" onclick="copyText('${item.prompt}', this)">
                            <code>${item.prompt}</code>
                            <span class="copy-hint">Click to Copy</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        specialGroups.appendChild(groupEl);
    }
}

async function copyText(text, element) {
    try {
        await navigator.clipboard.writeText(text);
        const hint = element.querySelector('.copy-hint');
        if (!hint) return;

        const originalText = hint.innerText;
        hint.innerText = 'Copied!';
        hint.style.background = '#22c55e';

        setTimeout(() => {
            hint.innerText = originalText;
            hint.style.background = 'var(--primary-color)';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy!', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    renderSpecialGrid();
});
