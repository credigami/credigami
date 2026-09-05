/* ============================================================
   CrediGaMi — firma.js
   Módulo de FIRMA DIGITAL (asesor / cliente) y VERIFICACIÓN
   POR HUELLA DIGITAL, habilitado y funcional.

   FIRMAS: lienzo <canvas> donde se dibuja con mouse/dedo. Se
   guarda como imagen (dataURL) dentro del préstamo.

   HUELLA DIGITAL: los navegadores no permiten leer el sensor
   de huella directamente por seguridad. La forma real y
   soportada de usar la huella del dispositivo (Windows Hello,
   Touch ID, huella de Android) desde una página web es la
   API estándar WebAuthn, que activa el lector de huella del
   equipo para verificar identidad. Aquí se usa esa API. Si el
   equipo no tiene lector de huella, se ofrece un respaldo
   manual (adjuntar imagen) para no bloquear el proceso.
   ============================================================ */
(function(){

  function crearFirmaPad(canvas){
    const ctx = canvas.getContext('2d');
    let dibujando = false, tieneTrazo = false;
    let ultimoX = 0, ultimoY = 0;

    function ajustarTamano(){
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#181C22';
    }
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);

    function posicion(evt){
      const rect = canvas.getBoundingClientRect();
      const punto = evt.touches ? evt.touches[0] : evt;
      return { x: punto.clientX - rect.left, y: punto.clientY - rect.top };
    }
    function iniciar(evt){
      evt.preventDefault();
      dibujando = true; tieneTrazo = true;
      const p = posicion(evt); ultimoX = p.x; ultimoY = p.y;
    }
    function mover(evt){
      if (!dibujando) return;
      evt.preventDefault();
      const p = posicion(evt);
      ctx.beginPath();
      ctx.moveTo(ultimoX, ultimoY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ultimoX = p.x; ultimoY = p.y;
    }
    function terminar(){ dibujando = false; }

    canvas.addEventListener('mousedown', iniciar);
    canvas.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', terminar);
    canvas.addEventListener('touchstart', iniciar, {passive:false});
    canvas.addEventListener('touchmove', mover, {passive:false});
    canvas.addEventListener('touchend', terminar);

    return {
      limpiar(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        tieneTrazo = false;
      },
      estaVacio(){ return !tieneTrazo; },
      exportarPNG(){ return canvas.toDataURL('image/png'); }
    };
  }

  /* -------- Verificación por huella digital (WebAuthn) -------- */
  function textoAB(bytesLen){
    // genera un challenge aleatorio (Uint8Array) — no requiere red
    const arr = new Uint8Array(bytesLen);
    window.crypto.getRandomValues(arr);
    return arr;
  }

  async function verificarHuella({ nombreUsuario, etiqueta }){
    if (!window.PublicKeyCredential){
      return { ok:false, motivo:'no-soportado' };
    }
    try{
      const disponible = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!disponible) return { ok:false, motivo:'sin-lector' };

      const credencial = await navigator.credentials.create({
        publicKey: {
          challenge: textoAB(32),
          rp: { name: 'CrediGaMi' },
          user: {
            id: textoAB(16),
            name: nombreUsuario || 'usuario@credigami',
            displayName: etiqueta || 'Usuario CrediGaMi'
          },
          pubKeyCredParams: [{ type:'public-key', alg:-7 }, { type:'public-key', alg:-257 }],
          authenticatorSelection: { authenticatorAttachment:'platform', userVerification:'required' },
          timeout: 60000
        }
      });
      if (credencial) return { ok:true, id:credencial.id, cuando:new Date().toISOString() };
      return { ok:false, motivo:'cancelado' };
    }catch(err){
      return { ok:false, motivo:'cancelado', detalle:err.message };
    }
  }

  window.CG_FIRMA = { crearFirmaPad, verificarHuella };

})();
