/* ============================================================
   CrediGaMi — layout.js
   Genera el sidebar y la barra superior en todas las páginas
   del módulo (evita repetir el mismo HTML en cada archivo).
   ============================================================ */
(function(){

  const ICONOS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    clientes:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="8.5" r="2.4"/><path d="M21.5 20c0-2.6-1.8-4.8-4.3-5.6"/></svg>',
    prestamos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h4l2.5-6 4 12 2.5-6H21"/></svg>',
    pagos:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.5h19"/><path d="M6 14h4"/></svg>',
    caja:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M3 11h18"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"/></svg>',
    reportes:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M11 20V4M18 20v-6"/></svg>',
    configuracion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.4.8a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.9a8 8 0 0 0-1.7 1l-2.4-.8-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.4-.8a8 8 0 0 0 1.7 1L11 21h4l.3-2.9a8 8 0 0 0 1.7-1l2.4.8 2-3.4-2-1.5Z"/></svg>'
  };

  const MODULOS = [
    { id:'dashboard',     nombre:'Panel general',      ruta:'dashboard/index.html' },
    { id:'clientes',      nombre:'Clientes',            ruta:'clientes/index.html' },
    { id:'prestamos',     nombre:'Préstamos',           ruta:'prestamos/index.html' },
    { id:'pagos',         nombre:'Pagos y cuotas',      ruta:'pagos/index.html' },
    { id:'caja',          nombre:'Caja',                ruta:'caja/index.html' },
    { id:'reportes',      nombre:'Reportes',            ruta:'reportes/index.html' },
    { id:'configuracion', nombre:'Configuración',       ruta:'configuracion/index.html' }
  ];

  function usuarioActual(){
    try{
      return JSON.parse(localStorage.getItem('cg_usuario')) || { nombre:'Asesor Demo', rol:'Asesor de crédito', iniciales:'AD' };
    }catch(e){
      return { nombre:'Asesor Demo', rol:'Asesor de crédito', iniciales:'AD' };
    }
  }

  window.CG_LAYOUT = {
    iconoSVG: (id) => ICONOS[id] || '',

    render(activo, tituloPagina, rutaTexto){
      const raiz = '../../'; // desde frontend/<modulo>/index.html
      const user = usuarioActual();
      const enlaces = MODULOS.map(m => `
        <a class="sidebar__link${m.id===activo?' activo':''}" href="${raiz}frontend/${m.ruta}">
          ${ICONOS[m.id]}<span>${m.nombre}</span>
        </a>`).join('');

      const shell = document.createElement('div');
      shell.innerHTML = `
        <aside class="sidebar" id="cg-sidebar">
          <div class="sidebar__marca">
            <img src="${raiz}assets/img/logo-credigami.jpeg" alt="Logo CrediGaMi">
            <div class="sidebar__marca-texto">
              <strong>CrediGaMi</strong>
              <span>TU APOYO CRECE</span>
            </div>
          </div>
          <nav class="sidebar__nav">${enlaces}</nav>
          <div class="sidebar__pie">
            <div class="sidebar__usuario">
              <div class="sidebar__avatar">${user.iniciales}</div>
              <div class="sidebar__usuario-info">
                <strong>${user.nombre}</strong>
                <span>${user.rol}</span>
              </div>
            </div>
            <button class="sidebar__salir" id="cg-salir">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
              Cerrar sesión
            </button>
          </div>
        </aside>
        <div class="contenido">
          <header class="topbar">
            <div style="display:flex;align-items:center;">
              <button class="menu-movil" id="cg-menu-movil" aria-label="Abrir menú">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div>
                <div class="topbar__titulo">${tituloPagina}</div>
                <div class="topbar__ruta">CrediGaMi / ${rutaTexto}</div>
              </div>
            </div>
            <div class="topbar__acciones">
              <button class="topbar__icono-btn" title="Notificaciones">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
                <span class="punto"></span>
              </button>
              <button class="topbar__icono-btn" title="Ayuda">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.7 2.2c-.9.6-1.2 1-1.2 2"/><path d="M12 17h.01"/></svg>
              </button>
            </div>
          </header>
          <main class="main" id="cg-main"></main>
        </div>
        <div class="toast-envoltura" id="cg-toasts"></div>
      `;

      document.body.prepend(...shell.children);

      const btnMenu = document.getElementById('cg-menu-movil');
      if (btnMenu) btnMenu.addEventListener('click', () => {
        document.getElementById('cg-sidebar').classList.toggle('abierto');
      });

      document.getElementById('cg-salir').addEventListener('click', () => {
        if (confirm('¿Cerrar sesión y volver al inicio de sesión?')){
          window.location.href = raiz + 'frontend/login/index.html';
        }
      });

      return document.getElementById('cg-main');
    }
  };

  window.CG_TOAST = function(mensaje, tipo){
    const cont = document.getElementById('cg-toasts');
    if (!cont) return;
    const el = document.createElement('div');
    el.className = 'toast' + (tipo ? ' ' + tipo : '');
    el.textContent = mensaje;
    cont.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };

})();
