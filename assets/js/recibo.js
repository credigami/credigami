/* ============================================================
   CrediGaMi — recibo.js
   Genera un recibo de pago imprimible/descargable con:
   datos del recibo, emisor/receptor, número de cliente,
   fechas, monto y un código QR que confirma que está pagado.
   ============================================================ */
(function(){

  function numeroRecibo(pago){
    return 'REC-' + String(pago.id).replace('PG-', '');
  }

  function textoQR(datos){
    return [
      'CREDIGAMI',
      'RECIBO:' + datos.numero,
      'CLIENTE:' + datos.clienteId,
      'MONTO:' + datos.monto,
      'ESTADO:PAGADO',
      'FECHA:' + datos.fechaPago
    ].join('|');
  }

  function mostrar(pago){
    const prestamo = (CG_DATA.prestamos.listar().find(p => p.id === pago.prestamoId)) || {};
    const cliente = (CG_DATA.clientes.listar().find(c => c.id === prestamo.clienteId)) || { nombre: pago.cliente };
    const config = CG_DATA.config.obtener();

    const numero = numeroRecibo(pago);
    const fechaEmision = CG_DATA.fechaHoy(0);
    const qrTexto = textoQR({ numero, clienteId: cliente.id || '—', monto: pago.monto, fechaPago: pago.fecha });
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=6&data=' + encodeURIComponent(qrTexto);

    let fondo = document.getElementById('cg-recibo-fondo');
    if (!fondo){
      fondo = document.createElement('div');
      fondo.id = 'cg-recibo-fondo';
      fondo.className = 'modal-fondo';
      document.body.appendChild(fondo);
    }

    fondo.innerHTML = `
      <div class="modal" style="max-width:420px;">
        <div class="modal__cabeza no-imprimir">
          <h3>Recibo de pago</h3>
          <button class="modal__cerrar" id="cg-recibo-cerrar">✕</button>
        </div>

        <div class="modal__cuerpo" id="recibo-imprimir">
          <div style="text-align:center; margin-bottom:14px;">
            <img src="../../assets/img/logo-credigami.jpeg" style="height:52px; border-radius:8px;" alt="CrediGaMi">
            <div style="font-family:var(--f-titulo); font-weight:800; font-size:17px; margin-top:6px;">
              <span style="color:var(--azul-oscuro);">Credi</span><span style="color:var(--naranja);">GaMi</span>
            </div>
            <div class="texto-tenue" style="font-size:11px;">${config.subtitulo || 'Préstamos pequeños'} · ${config.eslogan || 'Tu apoyo crece'}</div>
          </div>

          <div style="text-align:center; margin-bottom:14px;">
            <span class="badge badge-exito" style="font-size:12px;">✔ PAGADO</span>
          </div>

          <table style="width:100%; font-size:12.5px; margin-bottom:10px; border-collapse:collapse;">
            <tr><td class="texto-tenue" style="padding:3px 0;">N.º de recibo</td><td style="text-align:right;" class="celda-fuerte">${numero}</td></tr>
            <tr><td class="texto-tenue" style="padding:3px 0;">N.º de cliente</td><td style="text-align:right;">${cliente.id || '—'}</td></tr>
            <tr><td class="texto-tenue" style="padding:3px 0;">Fecha de emisión</td><td style="text-align:right;">${fechaEmision}</td></tr>
            <tr><td class="texto-tenue" style="padding:3px 0;">Fecha de pago</td><td style="text-align:right;">${pago.fecha}</td></tr>
          </table>

          <hr style="border:none; border-top:1px dashed var(--borde); margin:12px 0;">

          <div style="font-size:12.5px; margin-bottom:4px;"><strong>Emisor:</strong> ${config.empresa || 'CrediGaMi'} — Sistema de préstamos pequeños</div>
          <div style="font-size:12.5px; margin-bottom:12px;"><strong>Receptor:</strong> ${cliente.nombre} ${cliente.dni ? '(' + cliente.dni + ')' : ''}</div>

          <div style="font-size:12.5px; margin-bottom:4px;"><strong>Detalle del consumo</strong></div>
          <div class="texto-suave" style="font-size:12.5px; margin-bottom:12px;">
            Pago de cuota N.º ${pago.cuotaNo} del préstamo ${pago.prestamoId} — método de pago: ${pago.metodo}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-top:1px solid var(--borde); border-bottom:1px solid var(--borde); margin-bottom:14px;">
            <span class="texto-tenue" style="font-size:12.5px;">Monto total (HNL)</span>
            <span class="celda-fuerte" style="font-size:18px;">${CG_DATA.moneda(pago.monto)}</span>
          </div>

          <div style="text-align:center;">
            <img src="${qrUrl}" alt="Código QR de verificación de pago" style="width:120px; height:120px;">
            <div class="texto-tenue" style="font-size:10.5px; margin-top:6px;">Escanea el código para verificar que este recibo está pagado</div>
          </div>
        </div>

        <div class="modal__pie no-imprimir">
          <button class="btn btn-linea" id="cg-recibo-cerrar-2">Cerrar</button>
          <button class="btn btn-primario" id="cg-recibo-imprimir">Imprimir / Guardar PDF</button>
        </div>
      </div>
    `;

    fondo.classList.add('visible');
    document.getElementById('cg-recibo-cerrar').addEventListener('click', () => fondo.classList.remove('visible'));
    document.getElementById('cg-recibo-cerrar-2').addEventListener('click', () => fondo.classList.remove('visible'));
    document.getElementById('cg-recibo-imprimir').addEventListener('click', () => window.print());
  }

  window.CG_RECIBO = { mostrar };

})();
