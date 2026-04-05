// Server URL
const API_URL = (window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000') + '/api';

var cheatsheets = [];
var currentFilter = 'all';

var modal = document.getElementById('cheatsheetModal');
var openModalBtn = document.getElementById('openModal');
var closeModalBtn = document.getElementById('closeModal');
var cancelBtn = document.getElementById('cancelBtn');
var form = document.getElementById('cheatsheetForm');
var grid = document.getElementById('cheatsheetGrid');
var emptyState = document.getElementById('emptyState');
var filterBtns = document.querySelectorAll('.tabs-filter button');
var modalTitle = document.getElementById('modalTitle');
var previewBtn = document.getElementById('previewBtn');
var previewContainer = document.getElementById('previewContainer');
var previewFrame = document.getElementById('previewFrame');
var exportBtn = document.getElementById('exportBtn');
var importBtn = document.getElementById('importBtn');
var importFile = document.getElementById('importFile');
var serverStatus = document.getElementById('serverStatus');
var searchInput = document.getElementById('searchInput');
var searchToggle = document.getElementById('searchToggle');
var searchWrapper = document.getElementById('searchWrapper');
var searchTimeout = null;

if (searchInput) {
  searchInput.oninput = function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderCheatsheets, 300);
  };
}

if (searchToggle && searchWrapper && searchInput) {
  searchToggle.addEventListener('click', function() {
    if (!searchWrapper.classList.contains('active')) {
      searchWrapper.classList.add('active');
      searchInput.focus();
    } else if (!searchInput.value.trim()) {
      searchWrapper.classList.remove('active');
    }
  });

  searchInput.addEventListener('blur', function() {
    if (!searchInput.value.trim()) {
      searchWrapper.classList.remove('active');
    }
  });
}

if (openModalBtn) {
  openModalBtn.addEventListener('click', function() {
    modal.classList.add('active');
    modalTitle.textContent = 'Додати шпаргалку';
    document.getElementById('editId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    htmlToggle.checked = false;
    cssToggle.checked = false;
    jsToggle.checked = false;
    htmlCode.value = '';
    cssCode.value = '';
    jsCode.value = '';
    htmlCode.disabled = true;
    cssCode.disabled = true;
    jsCode.disabled = true;
    previewContainer.classList.remove('active');
    previewBtn.textContent = '👁 Перегляд';
  });
}

// Search functionality
searchInput.oninput = function() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(renderCheatsheets, 300);
};

// Check server status
function checkServerStatus() {
  fetch(API_URL + '/cheatsheets')
    .then(response => {
      if (response.ok) {
        serverStatus.style.background = '#44aa44';
        serverStatus.textContent = '🟢 Сервер увімкнено';
        return response.json();
      }
    })
    .then(data => {
      cheatsheets = data || [];
      renderCheatsheets();
    })
    .catch(err => {
      serverStatus.style.background = '#ff4444';
      serverStatus.textContent = '🔴 Сервер вимкнено';
      console.error('Server not available:', err);
    });
}

// Check status every 5 seconds
setInterval(checkServerStatus, 5000);
checkServerStatus(); // Initial check

// Code toggles
var htmlToggle = document.getElementById('htmlToggle');
var cssToggle = document.getElementById('cssToggle');
var jsToggle = document.getElementById('jsToggle');
var htmlCode = document.getElementById('htmlCode');
var cssCode = document.getElementById('cssCode');
var jsCode = document.getElementById('jsCode');

// Load cheatsheets from server
function loadFromServer() {
  fetch(API_URL + '/cheatsheets')
    .then(response => response.json())
    .then(data => {
      cheatsheets = data;
      renderCheatsheets();
    })
    .catch(err => {
      console.error('Error loading from server:', err);
      alert('Сервер не доступний. Переконайтесь, що server.js запущено!');
    });
}

// Save to server
function saveToServer(data) {
  return fetch(API_URL + '/cheatsheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

// Update on server
function updateOnServer(id, data) {
  return fetch(API_URL + '/cheatsheets/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

// Delete from server
function deleteFromServer(id) {
  return fetch(API_URL + '/cheatsheets/' + id, {
    method: 'DELETE'
  }).then(response => response.json());
}

// Initialize
loadFromServer();

// Toggle code areas
if (htmlToggle && htmlCode) {
  htmlToggle.onchange = function() {
    htmlCode.disabled = !htmlToggle.checked;
    if (htmlToggle.checked) htmlCode.focus();
  };
}

if (cssToggle && cssCode) {
  cssToggle.onchange = function() {
    cssCode.disabled = !cssToggle.checked;
    if (cssToggle.checked) cssCode.focus();
  };
}

if (jsToggle && jsCode) {
  jsToggle.onchange = function() {
    jsCode.disabled = !jsToggle.checked;
    if (jsToggle.checked) jsCode.focus();
  };
};

// Copy code function
window.copyCode = function(id) {
  var textarea = document.getElementById(id);
  if (textarea.value) {
    textarea.select();
    document.execCommand('copy');
    alert('Код скопійовано в буфер обміну!');
  } else {
    alert('Немає коду для копіювання!');
  }
};

// Export cheatsheets to JSON file
if (exportBtn) {
  exportBtn.onclick = function() {
    if (cheatsheets.length === 0) {
      alert('Немає шпаргалок для експорту!');
      return;
    }
    var dataStr = JSON.stringify(cheatsheets, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'cheatsheets-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };
}

// Import cheatsheets from JSON file
if (importBtn && importFile) {
  importBtn.onclick = function() {
    importFile.click();
  };

  importFile.onchange = function() {
  var file = importFile.files[0];
  if (!file) return;
  
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        fetch(API_URL + '/cheatsheets/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imported)
        }).then(response => response.json())
          .then(result => {
            if (result.success) {
              cheatsheets = imported;
              renderCheatsheets();
              alert('Імпортовано ' + imported.length + ' шпаргалок!');
            }
          });
      } else {
        alert('Невірний формат файлу!');
      }
    } catch(err) {
      alert('Помилка читання файлу: ' + err.message);
    }
  };
  reader.readAsText(file);
  importFile.value = '';
  };
}

if (closeModalBtn && modal) {
  closeModalBtn.onclick = function() { modal.classList.remove('active'); };
}
if (cancelBtn && modal) {
  cancelBtn.onclick = function() { modal.classList.remove('active'); };
}
if (modal) {
  modal.onclick = function(e) { if (e.target === modal) modal.classList.remove('active'); };
}

if (previewBtn && previewFrame && previewContainer && htmlCode && cssCode && jsCode) {
  previewBtn.onclick = function() {
    var html = htmlCode.value;
    var css = cssCode.value;
    var js = jsCode.value;
    
    if (!html && !css && !js) { alert('Введіть хоча б один код!'); return; }
    
    var combinedHTML = '<!DOCTYPE html><html><head><style>' + (css || 'body{font-family:Arial;margin:20px;}') + '</style></head><body>' + (html || '') + '<script>try{' + (js || '') + '}catch(e){console.error(e);}<\/script></body></html>';
    
    previewFrame.srcdoc = combinedHTML;
    previewContainer.classList.add('active');
    previewBtn.textContent = '👁 Закрити';
  };
}

if (form) {
  form.onsubmit = function(e) {
  e.preventDefault();
  var editId = document.getElementById('editId').value;
  var title = document.getElementById('title').value.trim();
  var description = document.getElementById('description').value.trim();
  var htmlVal = htmlCode.value.trim();
  var cssVal = cssCode.value.trim();
  var jsVal = jsCode.value.trim();
  
  if (!title) { alert('Введіть назву!'); return; }
  if (!htmlVal && !cssVal && !jsVal) { alert('Додайте хоча б один блок коду (HTML, CSS або JS)!'); return; }
  
  var data = {
    title: title,
    description: description,
    htmlCode: htmlVal,
    cssCode: cssVal,
    jsCode: jsVal
  };
  
  var submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Збереження...';
  
  if (editId) {
    // Update existing
    updateOnServer(editId, data)
      .then(result => {
        if (result.success) {
          var index = cheatsheets.findIndex(cs => cs.id == editId);
          if (index !== -1) {
            cheatsheets[index] = { id: Number(editId), ...data };
          }
          modal.classList.remove('active');
          loadFromServer();
        } else {
          alert('Помилка збереження! Переконайтесь, що сервер запущено (npm start)');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Помилка: Сервер не доступний. Запустіть: npm start');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зберегти';
      });
  } else {
    // Add new
    saveToServer(data)
      .then(result => {
        if (result.success) {
          cheatsheets.push(result.data);
          modal.classList.remove('active');
          loadFromServer();
        } else {
          alert('Помилка збереження! Переконайтесь, що сервер запущено (npm start)');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Помилка: Сервер не доступний. Запустіть: npm start');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зберегти';
      });
  }
};
}

function renderCheatsheets() {
  var searchTerm = searchInput.value.toLowerCase().trim();
  
  var filtered;
  if (currentFilter === 'all') {
    filtered = cheatsheets;
  } else {
    filtered = cheatsheets.filter(function(cs) {
      if (currentFilter === 'html' && cs.htmlCode) return true;
      if (currentFilter === 'css' && cs.cssCode) return true;
      if (currentFilter === 'js' && cs.jsCode) return true;
      return false;
    });
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(function(cs) {
      var titleMatch = cs.title.toLowerCase().includes(searchTerm);
      var descMatch = cs.description && cs.description.toLowerCase().includes(searchTerm);
      var htmlMatch = cs.htmlCode && cs.htmlCode.toLowerCase().includes(searchTerm);
      var cssMatch = cs.cssCode && cs.cssCode.toLowerCase().includes(searchTerm);
      var jsMatch = cs.jsCode && cs.jsCode.toLowerCase().includes(searchTerm);
      return titleMatch || descMatch || htmlMatch || cssMatch || jsMatch;
    });
  }
  
  if (filtered.length === 0) { 
    grid.style.display = 'none'; 
    emptyState.style.display = 'block';
    emptyState.innerHTML = searchTerm 
      ? '<h3>Нічого не знайдено</h3><p>За запитом: "' + escapeHtml(searchTerm) + '"</p>'
      : '<h3>Немає шпаргалок</h3>';
  } else {
    grid.style.display = 'grid'; 
    emptyState.style.display = 'none';
    var html = '';
    filtered.forEach(function(cs) {
      var badges = '';
      
      if (cs.htmlCode) {
        badges += '<span class="type-badge type-badge--html">HTML</span>';
      }
      if (cs.cssCode) {
        badges += '<span class="type-badge type-badge--css">CSS</span>';
      }
      if (cs.jsCode) {
        badges += '<span class="type-badge type-badge--js">JS</span>';
      }
      
      // Generate preview HTML
      var previewHtml = '<!DOCTYPE html><html><head><style>' + (cs.cssCode || 'body{font-family:Arial;margin:10px;}') + '</style></head><body style="margin:0;padding:0;">' + (cs.htmlCode || '') + '<script>try{' + (cs.jsCode || '') + '}catch(e){console.error(e);}<\/script></body></html>';
      
      html += '<div class="cheatsheet-card">';
      html += '<div class="cheatsheet-card__header">';
      html += '<h3 class="cheatsheet-card__title">' + escapeHtml(cs.title) + '</h3>';
      html += '<div class="cheatsheet-card__actions">';
      html += '<button type="button" class="cheatsheet-card__action-btn" data-action="view" data-id="' + cs.id + '" title="Перегляд">👁</button>';
      html += '<button type="button" class="cheatsheet-card__action-btn" data-action="edit" data-id="' + cs.id + '" title="Редагувати">✏</button>';
      html += '<button type="button" class="cheatsheet-card__action-btn delete" data-action="delete" data-id="' + cs.id + '" title="Видалити">🗑</button>';
      html += '</div></div>';
      html += '<div class="cheatsheet-card__body">';
      html += '<div class="type-badges-container" style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">' + badges + '</div>';
      // html += '<iframe srcdoc="' + previewHtml.replace(/"/g, '&quot;') + '" style="width:100%;height:400px;border:1px solid #ddd;border-radius:5px;"></iframe>';
      if (cs.description) {
        html += '<div class="cheatsheet-card__description">' + escapeHtml(cs.description) + '</div>';
      }
      html += '</div></div>';
    });
    grid.innerHTML = html;
  }
  
  filterBtns.forEach(function(btn) { 
    btn.classList.toggle('active', btn.dataset.filter === currentFilter); 
  });
}

if (filterBtns && filterBtns.length) {
  filterBtns.forEach(function(btn) { 
    btn.onclick = function() { 
      currentFilter = btn.dataset.filter; 
      renderCheatsheets(); 
    }; 
  });
}

if (grid) {
  grid.addEventListener('click', function(e) {
    var target = e.target;
    if (target.nodeType !== 1) {
      target = target.parentNode;
    }
    var button = target && target.closest ? target.closest('button[data-action]') : null;
    if (!button) return;

    var id = button.dataset.id;
    if (!id) return;

    if (button.dataset.action === 'view') {
      viewPreview(id);
    } else if (button.dataset.action === 'edit') {
      editItem(id);
    } else if (button.dataset.action === 'delete') {
      deleteItem(id);
    }
  });
}

window.viewPreview = function(id) {
  var item = cheatsheets.find(function(cs) { return cs.id == id; });
  if (item) {
    modal.classList.add('active');
    modalTitle.textContent = 'Перегляд';
    document.getElementById('editId').value = item.id;
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description || '';
    
    htmlToggle.checked = !!item.htmlCode;
    htmlCode.value = item.htmlCode || '';
    htmlCode.disabled = !item.htmlCode;
    
    cssToggle.checked = !!item.cssCode;
    cssCode.value = item.cssCode || '';
    cssCode.disabled = !item.cssCode;
    
    jsToggle.checked = !!item.jsCode;
    jsCode.value = item.jsCode || '';
    jsCode.disabled = !item.jsCode;
    
    setTimeout(function() {
      previewContainer.classList.add('active');
      previewBtn.textContent = '👁 Закрити';
      var combinedHTML = '<!DOCTYPE html><html><head><style>' + (item.cssCode || 'body{font-family:Arial;margin:20px;}') + '</style></head><body>' + (item.htmlCode || '') + '<script>try{' + (item.jsCode || '') + '}catch(e){console.error(e);}<\/script></body></html>';
      previewFrame.srcdoc = combinedHTML;
    }, 300);
  }
};

window.editItem = function(id) {
  var item = cheatsheets.find(function(cs) { return cs.id == id; });
  if (item) {
    modal.classList.add('active');
    modalTitle.textContent = 'Редагувати шпаргалку';
    document.getElementById('editId').value = item.id;
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description || '';
    
    htmlToggle.checked = !!item.htmlCode;
    htmlCode.value = item.htmlCode || '';
    htmlCode.disabled = !item.htmlCode;
    
    cssToggle.checked = !!item.cssCode;
    cssCode.value = item.cssCode || '';
    cssCode.disabled = !item.cssCode;
    
    jsToggle.checked = !!item.jsCode;
    jsCode.value = item.jsCode || '';
    jsCode.disabled = !item.jsCode;
  }
};

window.deleteItem = function(id) {
  if (confirm('Ви впевнені що хочете видалити цю шпаргалку?')) {
    deleteFromServer(id)
      .then(result => {
        if (result.success) {
          // Видалити з локального масиву
          cheatsheets = cheatsheets.filter(function(cs) { return cs.id !== id; });
          renderCheatsheets();
        } else {
          alert('Помилка видалення! Переконайтесь, що сервер запущено (npm start)');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Помилка: Сервер не доступний. Запустіть: npm start');
      });
  }
};

function escapeHtml(text) {
  if (!text) { return ''; }
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightSyntax(code, type) {
  if (!code) return '';
  
  var highlighted = escapeHtml(code);
  
  // HTML highlighting
  if (type === 'html') {
    highlighted = highlighted.replace(/(&lt;\/?[a-z0-9]+)(&gt;)?/gi, '<span class="code-tag">$1</span>$2');
    highlighted = highlighted.replace(/([a-z-]+)=/gi, '<span class="code-attr">$1</span>=');
    highlighted = highlighted.replace(/(&quot;.*?&quot;)/g, '<span class="code-string">$1</span>');
    highlighted = highlighted.replace(/(&lt;!--.*?--&gt;)/g, '<span class="code-comment">$1</span>');
  }
  // CSS highlighting
  else if (type === 'css') {
    highlighted = highlighted.replace(/([.#]?[a-z0-9_-]+)\s*\{/gi, '<span class="code-selector">$1</span> {');
    highlighted = highlighted.replace(/([a-z-]+)\s*:/gi, '<span class="code-property">$1</span>:');
    highlighted = highlighted.replace(/:\s*([^;]+);/gi, ': <span class="code-value">$1</span>;');
    highlighted = highlighted.replace(/(\/\*.*?\*\/)/g, '<span class="code-comment">$1</span>');
  }
  // JS highlighting
  else if (type === 'js') {
    highlighted = highlighted.replace(/\b(function|var|let|const|if|else|for|while|return|try|catch|new|this|class|import|from|export|default)\b/gi, '<span class="code-keyword">$1</span>');
    highlighted = highlighted.replace(/\b([a-z_][a-z0-9_]*)\s*\(/gi, '<span class="code-function">$1</span>(');
    highlighted = highlighted.replace(/\b([0-9]+)\b/g, '<span class="code-number">$1</span>');
    highlighted = highlighted.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="code-string">$1</span>');
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>');
  }
  
  return highlighted;
}
