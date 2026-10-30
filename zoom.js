/**
 * Zoom interactivo para diagramas UML
 * Vanilla JS puro - sin dependencias externas
 */
(function() {
  'use strict';

  console.log('[Zoom] Iniciando...'); alert('Zoom script loaded');

  // Esperar a que el DOM esté listo
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      setTimeout(callback, 100);
    }
  }

  onReady(function() {
    console.log('[Zoom] DOM listo');

    // Agregar estilos del modal
    const style = document.createElement('style');
    style.textContent = `
      .diagram-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.92);
        display: none;
        z-index: 99999;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
      }
      .diagram-modal-overlay.active { display: flex; }
      .diagram-modal-overlay img {
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
        transition: transform 0.2s ease;
        transform-origin: center center;
        border-radius: 8px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        user-select: none;
        -webkit-user-drag: none;
      }
      .diagram-modal-overlay img.zoomed { transform: scale(2); cursor: grab; }
      .diagram-modal-overlay img.grabbing { cursor: grabbing; }
      .diagram-modal-controls {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 100000;
      }
      .diagram-modal-btn {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        font-size: 1.25rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        backdrop-filter: blur(4px);
      }
      .diagram-modal-btn:hover { background: rgba(255, 255, 255, 0.3); }
      .diagram-modal-info {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 100000;
        backdrop-filter: blur(4px);
      }
      .diagram-zoomable {
        cursor: zoom-in !important;
        transition: opacity 0.2s, box-shadow 0.2s;
      }
      .diagram-zoomable:hover {
        opacity: 0.9;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    `;
    document.head.appendChild(style);

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'diagram-modal-overlay';
    modal.id = 'diagram-modal';
    modal.innerHTML = `
      <div class="diagram-modal-backdrop"></div>
      <img src="" alt="Diagrama UML ampliado" id="diagram-modal-img">
      <div class="diagram-modal-controls">
        <button class="diagram-modal-btn" id="zoom-in-btn" title="Acercar (+)">+</button>
        <button class="diagram-modal-btn" id="zoom-out-btn" title="Alejar (-)">−</button>
        <button class="diagram-modal-btn" id="zoom-reset-btn" title="Restablecer (0)">⊙</button>
        <button class="diagram-modal-btn" id="zoom-close-btn" title="Cerrar (Esc)">✕</button>
      </div>
      <div class="diagram-modal-info" id="zoom-info">100%</div>
    `;
    document.body.appendChild(modal);

    const modalImg = document.getElementById('diagram-modal-img');
    const backdrop = modal.querySelector('.diagram-modal-backdrop');
    let currentZoom = 1;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let panOffset = { x: 0, y: 0 };
    let lastPanOffset = { x: 0, y: 0 };

    function openModal(src, alt) {
      console.log('[Zoom] Abriendo modal:', src);
      modalImg.src = src;
      modalImg.alt = alt || 'Diagrama UML ampliado';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      currentZoom = 1;
      panOffset = { x: 0, y: 0 };
      lastPanOffset = { x: 0, y: 0 };
      updateTransform();
      document.getElementById('zoom-info').textContent = '100%';
    }

    function closeModal() {
      console.log('[Zoom] Cerrando modal');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateTransform() {
      modalImg.style.transform = `scale(${currentZoom}) translate(${panOffset.x / currentZoom}px, ${panOffset.y / currentZoom}px)`;
      document.getElementById('zoom-info').textContent = Math.round(currentZoom * 100) + '%';
    }

    function zoomIn() {
      if (currentZoom < 5) {
        currentZoom = Math.min(currentZoom + 0.25, 5);
        updateTransform();
      }
    }

    function zoomOut() {
      if (currentZoom > 1) {
        currentZoom = Math.max(currentZoom - 0.25, 1);
        if (currentZoom === 1) {
          panOffset = { x: 0, y: 0 };
          lastPanOffset = { x: 0, y: 0 };
        }
        updateTransform();
      }
    }

    function resetZoom() {
      currentZoom = 1;
      panOffset = { x: 0, y: 0 };
      lastPanOffset = { x: 0, y: 0 };
      updateTransform();
    }

    // Event listeners
    backdrop.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });

    document.getElementById('zoom-close-btn').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });

    document.getElementById('zoom-in-btn').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      zoomIn();
    });

    document.getElementById('zoom-out-btn').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      zoomOut();
    });

    document.getElementById('zoom-reset-btn').addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      resetZoom();
    });

    modal.addEventListener('wheel', function(e) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }, { passive: false });

    modalImg.addEventListener('mousedown', function(e) {
      if (currentZoom <= 1) return;
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      modalImg.classList.add('grabbing');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      panOffset = { x: lastPanOffset.x + dx, y: lastPanOffset.y + dy };
      updateTransform();
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        lastPanOffset = { ...panOffset };
        modalImg.classList.remove('grabbing');
      }
    });

    modalImg.addEventListener('dblclick', function(e) {
      e.preventDefault();
      resetZoom();
    });

    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('active')) return;
      switch (e.key) {
        case 'Escape': closeModal(); break;
        case '+': case '=': zoomIn(); break;
        case '-': zoomOut(); break;
        case '0': resetZoom(); break;
      }
    });

    // Touch events
    let touchStartDist = 0;
    let touchStartZoom = 1;
    let touchStartPan = { x: 0, y: 0 };

    modalImg.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx*dx + dy*dy);
        touchStartZoom = currentZoom;
      } else if (e.touches.length === 1 && currentZoom > 1) {
        isDragging = true;
        dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPan = { ...lastPanOffset };
      }
    }, { passive: false });

    modalImg.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        currentZoom = Math.min(Math.max(touchStartZoom * (dist / touchStartDist), 1), 5);
        updateTransform();
      } else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        panOffset = { x: touchStartPan.x + dx, y: touchStartPan.y + dy };
        updateTransform();
      }
    }, { passive: false });

    modalImg.addEventListener('touchend', function() {
      if (currentZoom === 1) {
        panOffset = { x: 0, y: 0 };
        lastPanOffset = { x: 0, y: 0 };
        updateTransform();
      } else {
        lastPanOffset = { ...panOffset };
      }
      isDragging = false;
    });

    // Adjuntar click a todas las imágenes de diagramas
    function attachClickHandlers() {
      const selectors = [
        '.diagram-container img',
        '.bg-slate-50.rounded-2xl.p-4 img',
        'img[src*="images/"]'
      ];

      let count = 0;
      selectors.forEach(function(selector) {
        document.querySelectorAll(selector).forEach(function(img) {
          if (img.closest('.diagram-modal-overlay')) return;
          if (img.dataset.zoomAttached) return;
          img.dataset.zoomAttached = 'true';
          img.classList.add('diagram-zoomable');
          count++;

          // Prevenir navegación por defecto
          img.style.cursor = 'zoom-in';

          img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Click detectado en: ' + img.src); console.log('[Zoom] Click en:', img.src);
            openModal(img.src, img.alt);
            return false;
          });
        });
      });
      console.log('[Zoom] Click handlers adjuntados a', count, 'imágenes');
    }

    // Ejecutar inmediatamente y con delay
    attachClickHandlers();
    setTimeout(attachClickHandlers, 300);
    setTimeout(attachClickHandlers, 1000);

    console.log('[Zoom] Inicializado correctamente');
  });

})();
HTMLEOF
echo "zoom.js reescrito (vanilla JS puro)"