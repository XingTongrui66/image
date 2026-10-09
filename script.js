// 示例作品数据（使用实际图片路径）
const examples = [
    { id: '1', src: 'assets/examples/case-1.jpg' },
    { id: '2', src: 'assets/examples/case-2.jpg' },
    { id: '3', src: 'assets/examples/case-3.jpg' },
    { id: '4', src: 'assets/examples/case-4.jpg' },
    { id: '6', src: 'assets/examples/case-6.jpg' },
    { id: '7', src: 'assets/examples/case-7.jpg' },
    { id: '8', src: 'assets/examples/case-8.jpg' },
    { id: '9', src: 'assets/examples/case-9.jpg' },
    { id: '10', src: 'assets/examples/case-10.jpg' },
    { id: '11', src: 'assets/examples/case-11.jpg' }
];

// 标题库（根据照片主题）
const titles = {
    architecture: [
        "Echoes of Time",
        "Lines and Light",
        "Structure in Silence",
        "Urban Rhythm",
        "Shadows of the City",
        "Concrete Poetry",
        "Vertical Dreams",
        "Window to the Past"
    ],
    landscape: [
        "Horizon Whisper",
        "Fields of Memory",
        "Nature's Blueprint",
        "Morning Light",
        "Earth and Sky",
        "The Long Path",
        "Silent Panorama"
    ],
    nature: [
        "Organic Forms",
        "Growth and Flow",
        "Rooted in Place",
        "Branching Out",
        "Natural Harmony",
        "Green Whispers"
    ],
    people: [
        "Moments in Time",
        "Shared Spaces",
        "Everyday Poetry",
        "Human Connection",
        "Quiet Companions",
        "Life in Motion"
    ],
    abstract: [
        "Abstract Echo",
        "Form and Shadow",
        "Visual Rhythm",
        "Color Memory",
        "Geometric Soul"
    ],
    default: [
        "Visual Memory",
        "Stillness Revealed",
        "Quiet Moments",
        "The Art of Space",
        "Light and Form",
        "Frozen in Time"
    ]
};

// 随机选择函数
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 根据图片内容确定标题类型（这里用随机方式，实际可以结合AI识别）
function determineTitleType() {
    const types = ['architecture', 'landscape', 'nature', 'people', 'abstract', 'default'];
    return getRandomItem(types);
}

// 生成随机抽象面板样式
function generateMockPanel() {
    const colors = [
        ['#F3F0E8', '#E8E4D9', '#D4CDB8'], // 象牙色系
        ['#F5E6E6', '#E6D6D6', '#D4C2C2'], // 粉色系
        ['#E6F0E6', '#D6E6D6', '#C2D4C2'], // 绿色系
        ['#E6E6F0', '#D6D6E6', '#C2C2D4'], // 蓝色系
        ['#F0E6D6', '#E6D6C2', '#D4C2B0']  // 棕色系
    ];
    
    const selectedColors = getRandomItem(colors);
    
    // 生成 CSS 渐变背景
    const gradientType = getRandomItem(['linear', 'radial']);
    const angle = Math.floor(Math.random() * 360);
    const gradient = gradientType === 'linear' 
        ? `linear-gradient(${angle}deg, ${selectedColors[0]}, ${selectedColors[1]})`
        : `radial-gradient(circle at 50% 50%, ${selectedColors[1]}, ${selectedColors[0]})`;
    
    // 随机形状和颜色
    const shapes = [];
    const numShapes = Math.floor(Math.random() * 5) + 2; // 2-6 个形状
    
    for (let i = 0; i < numShapes; i++) {
        const shapeType = getRandomItem(['circle', 'rect', 'arc', 'ellipse']);
        const shapeColor = getRandomItem([selectedColors[1], selectedColors[2]]);
        const shapeSize = Math.floor(Math.random() * 30) + 10; // 10-40% 大小
        const shapeTop = Math.floor(Math.random() * 60) + 20; // 20-80% 位置
        const shapeLeft = Math.floor(Math.random() * 70) + 15; // 15-85% 位置
        
        shapes.push({
            type: shapeType,
            color: shapeColor,
            size: shapeSize,
            top: shapeTop,
            left: shapeLeft
        });
    }
    
    return {
        gradient: gradient,
        shapes: shapes
    };
}

// 渲染示例网格
function renderExampleGrid() {
    const grid = document.querySelector('.example-grid');
    grid.innerHTML = '';
    
    examples.forEach(ex => {
        const item = document.createElement('div');
        item.className = 'example-item-preview';
        item.innerHTML = `<img src="${ex.src}" alt="示例${ex.id}">`;
        bindExamplePopup(item, ex.src);
        grid.appendChild(item);
    });
}

// 渲染示例作品网格
function renderExamplesGrid() {
    const track = document.querySelector('.examples-grid');
    track.innerHTML = '';
    
    // 渲染两遍，配合 CSS 动画实现无缝循环滚动
    [0, 1].forEach(round => {
        examples.forEach(ex => {
            const item = document.createElement('div');
            item.className = 'example-item';
            item.innerHTML = `<img src="${ex.src}" alt="示例${ex.id}">`;
            if (round === 1) item.setAttribute('aria-hidden', 'true');
            bindExamplePopup(item, ex.src);
            track.appendChild(item);
        });
    });
}

// 示例大图弹框：悬停或点击示例时显示完整成品图，鼠标移开后收起
const popup = document.createElement('div');
popup.className = 'example-popup';
popup.innerHTML = '<img alt="示例大图">';
document.body.appendChild(popup);
const popupImg = popup.querySelector('img');

let popupToken = 0;

function showExamplePopup(item, src) {
    const token = ++popupToken;
    const margin = 16;
    const padding = 8;
    // 图片最大尺寸受视口限制，过长的图会等比缩小
    popupImg.style.maxWidth = Math.min(420, window.innerWidth - margin * 2 - padding * 2) + 'px';
    popupImg.style.maxHeight = (window.innerHeight - margin * 2 - padding * 2) + 'px';

    const place = () => {
        if (token !== popupToken) return;
        const rect = item.getBoundingClientRect();
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        // 优先放在示例右侧，放不下则放左侧
        let left = rect.right + margin;
        if (left + popupWidth > window.innerWidth - margin) {
            left = Math.max(margin, rect.left - popupWidth - margin);
        }
        const top = Math.min(rect.top, window.innerHeight - popupHeight - margin);
        popup.style.left = left + 'px';
        popup.style.top = Math.max(margin, top) + 'px';
        popup.classList.add('visible');
    };

    // 图片加载完成后再测量尺寸并定位，避免高度不准
    popupImg.onload = place;
    if (popupImg.getAttribute('src') !== src) {
        popup.classList.remove('visible');
        popupImg.src = src;
    }
    if (popupImg.complete && popupImg.naturalWidth) place();
}

function hideExamplePopup() {
    popupToken++;
    popup.classList.remove('visible');
}

function bindExamplePopup(item, src) {
    item.addEventListener('mouseenter', () => showExamplePopup(item, src));
    item.addEventListener('mouseleave', hideExamplePopup);
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        showExamplePopup(item, src);
    });
}

// 点击页面其他位置收起弹框（触屏设备）
document.addEventListener('click', hideExamplePopup);

// 显示模拟结果（用于用户上传的图片）
// saved 不为空时表示从历史记录还原，沿用当时的面板和标题
function showMockResult(imageSrc, saved) {
    const originalImage = document.getElementById('originalImage');
    const mockArtwork = document.getElementById('mockArtwork');
    const titleDisplay = document.getElementById('titleDisplay');
    
    // 显示原图
    originalImage.innerHTML = `<img src="${imageSrc}" alt="上传图片">`;
    
    // 生成抽象面板
    const panelData = saved ? saved.panel : generateMockPanel();
    
    let shapesHTML = '';
    panelData.shapes.forEach(shape => {
        let shapeStyle = '';
        switch (shape.type) {
            case 'circle':
                shapeStyle = `width: ${shape.size}%; height: ${shape.size}%; border-radius: 50%;`;
                break;
            case 'rect':
                shapeStyle = `width: ${shape.size * 1.5}%; height: ${shape.size * 0.6}%; border-radius: 4px;`;
                break;
            case 'arc':
                shapeStyle = `width: ${shape.size * 2}%; height: ${shape.size * 2}%; border-radius: 50% 50% 0 0;`;
                break;
            case 'ellipse':
                shapeStyle = `width: ${shape.size * 2}%; height: ${shape.size}%; border-radius: 50%;`;
                break;
        }
        shapesHTML += `<div class="mock-shape" style="position: absolute; top: ${shape.top}%; left: ${shape.left}%; ${shapeStyle}; background: ${shape.color};"></div>`;
    });
    
    mockArtwork.innerHTML = `
        <div class="mock-panel-bg" style="position: absolute; width: 100%; height: 100%; background: ${panelData.gradient};"></div>
        ${shapesHTML}
    `;
    
    // 添加形状元素的 CSS
    if (!document.getElementById('mock-shape-style')) {
        const style = document.createElement('style');
        style.id = 'mock-shape-style';
        style.innerHTML = `
            .mock-shape {
                opacity: 0.8;
                transition: transform 0.3s;
            }
            .mock-shape:hover {
                transform: scale(1.05);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 生成标题
    const titleText = saved ? saved.title : getRandomItem(titles[determineTitleType()]);
    
    titleDisplay.innerHTML = `<p class="title-text">${titleText}</p>`;

    if (!saved) addHistory(imageSrc, panelData, titleText);
}

// ===== 历史记录（保存在浏览器 localStorage，最多 20 条）=====
const HISTORY_KEY = 'pae-history';
const HISTORY_MAX = 20;

function loadHistory() {
    try {
        const list = JSON.parse(localStorage.getItem(HISTORY_KEY));
        return Array.isArray(list) ? list : [];
    } catch (err) {
        return [];
    }
}

function saveHistory(list) {
    // 空间不足时从最旧的记录开始丢弃，直到能存下
    const items = list.slice(0, HISTORY_MAX);
    while (items.length) {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
            return items;
        } catch (err) {
            items.pop();
        }
    }
    localStorage.removeItem(HISTORY_KEY);
    return items;
}

// 压缩图片后再存，避免 localStorage 超限
function compressImage(src, maxSize = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.naturalWidth * scale);
            canvas.height = Math.round(img.naturalHeight * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(src);
        img.src = src;
    });
}

async function addHistory(imageSrc, panel, title) {
    const image = await compressImage(imageSrc);
    const entry = { id: Date.now(), time: Date.now(), image, panel, title };
    saveHistory([entry, ...loadHistory()]);
    renderHistory();
}

function renderHistory() {
    const listEl = document.getElementById('historyList');
    const list = loadHistory();
    listEl.innerHTML = '';

    if (!list.length) {
        const empty = document.createElement('p');
        empty.className = 'history-empty';
        empty.textContent = '暂无历史记录';
        listEl.appendChild(empty);
        return;
    }

    list.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const thumb = document.createElement('img');
        thumb.src = entry.image;
        thumb.alt = entry.title;

        const info = document.createElement('div');
        info.className = 'history-info';
        const name = document.createElement('div');
        name.className = 'history-name';
        name.textContent = entry.title;
        const time = document.createElement('div');
        time.className = 'history-time';
        time.textContent = new Date(entry.time).toLocaleString('zh-CN', {
            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        info.append(name, time);

        const del = document.createElement('button');
        del.className = 'history-delete';
        del.type = 'button';
        del.setAttribute('aria-label', '删除这条记录');
        del.textContent = '×';
        del.addEventListener('click', (e) => {
            e.stopPropagation();
            saveHistory(loadHistory().filter(h => h.id !== entry.id));
            renderHistory();
        });

        item.addEventListener('click', () => {
            showMockResult(entry.image, entry);
            closeHistory();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        item.append(thumb, info, del);
        listEl.appendChild(item);
    });
}

const historyDrawer = document.getElementById('historyDrawer');
const historyMask = document.getElementById('historyMask');

function openHistory() {
    renderHistory();
    historyDrawer.classList.add('open');
    historyMask.classList.add('open');
    historyDrawer.setAttribute('aria-hidden', 'false');
}

function closeHistory() {
    historyDrawer.classList.remove('open');
    historyMask.classList.remove('open');
    historyDrawer.setAttribute('aria-hidden', 'true');
}

document.getElementById('historyBtn').addEventListener('click', openHistory);
document.getElementById('historyClose').addEventListener('click', closeHistory);
historyMask.addEventListener('click', closeHistory);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHistory();
});
document.getElementById('historyClear').addEventListener('click', () => {
    if (loadHistory().length && confirm('确定清空全部历史记录吗？')) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }
});

// 拖拽上传功能
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.querySelector('.upload-btn');

// 点击上传框触发文件选择
uploadBox.addEventListener('click', (e) => {
    if (e.target !== uploadBtn) {
        fileInput.click();
    }
});

// 上传按钮点击
uploadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// 文件选择
fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            showMockResult(e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
});

// 拖拽上传
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.background = '#e0dcd0';
    uploadBox.style.borderColor = '#6b5b42';
});

uploadBox.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadBox.style.background = '';
    uploadBox.style.borderColor = '';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.background = '';
    uploadBox.style.borderColor = '';
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                showMockResult(e.target.result);
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('请上传图片文件');
        }
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderExampleGrid();
    renderExamplesGrid();
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});