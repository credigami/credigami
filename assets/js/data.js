/* ============================================================
   CrediGaMi — data.js (versión Firestore / producción)
   Reemplaza la capa de localStorage por Firestore, manteniendo
   la MISMA API que ya usan todas las páginas:
     CG_DATA.clientes.listar() / .agregar() / .eliminar()
     CG_DATA.prestamos.listar() / .agregar() / .actualizar()
     CG_DATA.pagos.listar() / .agregar() / .marcarPagada()
     CG_DATA.caja.obtener() / .guardar() / .movimiento()
     CG_DATA.config.obtener() / .guardar()
   ============================================================ */
(function(){

  const firebaseConfig = {
    apiKey: "AIzaSyA2-6_rMoOVxjRZcdtj16BupF4WikqwRvI",
    authDomain: "credigami.firebaseapp.com",
    projectId: "credigami",
    storageBucket: "credigami.firebasestorage.app",
    messagingSenderId: "220920282240",
    appId: "1:220920282240:web:a7abd4e46535ebf17a7a65",
  };
  if (!window.firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  function id(prefijo){
    return prefijo + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
  }
  function moneda(n){
    return 'L. ' + Number(n||0).toLocaleString('es-HN', {minimumFractionDigits:2, maximumFractionDigits:2});
  }
  function fechaHoy(offsetDias){
    const d = new Date();
    d.setDate(d.getDate() + (offsetDias||0));
    return d.toISOString().slice(0,10);
  }
  function avisar(nombre){
    window.dispatchEvent(new CustomEvent('cg:datos-actualizados', { detail: { coleccion: nombre } }));
  }

  let cacheClientes  = [];
  let cachePrestamos = [];
  let cachePagos     = [];
  let cacheCaja       = { abierta:true, saldoInicial:0, fechaApertura:fechaHoy(0), movimientos:[] };
  let cacheConfig     = {
    empresa:'CrediGaMi', eslogan:'Tu apoyo crece', subtitulo:'Préstamos pequeños',
    tasaDefault:12, moraDefault:5, moneda:'HNL',
    usuarios:[
      { id:'USR-1', nombre:'Administrador 1', usuario:'admi1', rol:'Administrador', iniciales:'A1' },
      { id:'USR-2', nombre:'Administrador 2', usuario:'admi2', rol:'Administrador', iniciales:'A2' }
    ]
  };

  db.collection('clientes').orderBy('creado','desc').onSnapshot(snap => {
    cacheClientes = snap.docs.map(d => d.data());
    avisar('clientes');
  }, err => console.error('Error leyendo clientes:', err));

  db.collection('prestamos').orderBy('creado','desc').onSnapshot(snap => {
    cachePrestamos = snap.docs.map(d => d.data());
    avisar('prestamos');
  }, err => console.error('Error leyendo prestamos:', err));

  db.collection('pagos').orderBy('fecha','desc').onSnapshot(snap => {
    cachePagos = snap.docs.map(d => d.data());
    avisar('pagos');
  }, err => console.error('Error leyendo pagos:', err));

  db.collection('caja').doc('actual').onSnapshot(doc => {
    if (doc.exists) cacheCaja = doc.data();
    else db.collection('caja').doc('actual').set(cacheCaja);
    avisar('caja');
  }, err => console.error('Error leyendo caja:', err));

  db.collection('configuracion').doc('general').onSnapshot(doc => {
    if (doc.exists) cacheConfig = doc.data();
    else db.collection('configuracion').doc('general').set(cacheConfig);
    avisar('config');
  }, err => console.error('Error leyendo configuracion:', err));

  window.CG_DATA = {
    leer: () => null, guardar: () => null,
    id, moneda, fechaHoy,

    clientes: {
      listar: () => cacheClientes,
      agregar(cliente){
        const nuevo = Object.assign({ id:id('CLI'), creado:fechaHoy(0) }, cliente);
        return db.collection('clientes').doc(nuevo.id).set(nuevo).then(() => nuevo);
      },
      eliminar(clienteId){
        return db.collection('clientes').doc(clienteId).delete();
      }
    },

    prestamos: {
      listar: () => cachePrestamos,
      agregar(p){
        const nuevo = Object.assign({ id:id('PR-2026'), estado:'pendiente', mora:0, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(0) }, p);
        return db.collection('prestamos').doc(nuevo.id).set(nuevo).then(() => nuevo);
      },
      actualizar(prestamoId, cambios){
        return db.collection('prestamos').doc(prestamoId).update(cambios);
      }
    },

    pagos: {
      listar: () => cachePagos,
      agregar(pg){
        const nuevo = Object.assign({ id:id('PG') }, pg);
        return db.collection('pagos').doc(nuevo.id).set(nuevo).then(() => nuevo);
      },
      marcarPagada(pagoId, metodo){
        const cambios = { estado:'pagada', metodo: metodo || 'Efectivo', fecha: fechaHoy(0) };
        return db.collection('pagos').doc(pagoId).update(cambios)
          .then(() => Object.assign({}, cachePagos.find(p => p.id === pagoId), cambios));
      }
    },

    caja: {
      obtener: () => cacheCaja,
      guardar: (c) => db.collection('caja').doc('actual').set(c),
      movimiento(tipo, concepto, monto){
        const nuevoMov = { id:id('MV'), tipo, concepto, monto:Number(monto), fecha:fechaHoy(0) };
        const actualizada = Object.assign({}, cacheCaja, {
          movimientos:[nuevoMov, ...(cacheCaja.movimientos||[])]
        });
        return db.collection('caja').doc('actual').set(actualizada).then(() => actualizada);
      }
    },

    config: {
      obtener: () => cacheConfig,
      guardar: (c) => db.collection('configuracion').doc('general').set(c)
    }
  };

})();
