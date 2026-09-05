/* ============================================================
   CrediGaMi — data.js
   Capa de datos de demostración (localStorage).
   En producción esto se reemplaza por llamadas a tu API/backend.
   ============================================================ */
(function(){

  function leer(clave, porDefecto){
    try{
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : porDefecto;
    }catch(e){ return porDefecto; }
  }
  function guardar(clave, valor){
    localStorage.setItem(clave, JSON.stringify(valor));
  }
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

  const CLIENTES_SEMILLA = [
    { id:'CLI-1001', nombre:'María Fernanda López', dni:'0501-1990-04521', telefono:'9988-2345', direccion:'Barrio El Centro, San Pedro Sula', tipoNegocio:'Venta de ropa', referencia:'Ana Gómez — 9977-1122', creado:fechaHoy(-40) },
    { id:'CLI-1002', nombre:'Carlos Eduardo Martínez', dni:'0501-1985-01187', telefono:'9654-7712', direccion:'Col. Rivera Hernández, SPS', tipoNegocio:'Taller mecánico', referencia:'Luis Martínez — 9911-3344', creado:fechaHoy(-33) },
    { id:'CLI-1003', nombre:'Rosa Elvira Suazo', dni:'0501-1978-06693', telefono:'9812-9930', direccion:'Col. Satélite, SPS', tipoNegocio:'Pulpería / abarrotería', referencia:'Pedro Suazo — 9800-1212', creado:fechaHoy(-20) },
    { id:'CLI-1004', nombre:'José Manuel Cáceres', dni:'0501-1993-02244', telefono:'9700-5541', direccion:'Chamelecón, SPS', tipoNegocio:'Repostería', referencia:'Karen Cáceres — 9744-8899', creado:fechaHoy(-9) }
  ];

  const PRESTAMOS_SEMILLA = [
    { id:'PR-2026-014', clienteId:'CLI-1001', cliente:'María Fernanda López', monto:8000, tasa:12, plazoMeses:6, cuota:1478.67, saldo:4436, estado:'activo', mora:0, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(-30) },
    { id:'PR-2026-015', clienteId:'CLI-1002', cliente:'Carlos Eduardo Martínez', monto:15000, tasa:14, plazoMeses:12, cuota:1444.06, saldo:11552.48, estado:'activo', mora:1, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(-25) },
    { id:'PR-2026-016', clienteId:'CLI-1003', cliente:'Rosa Elvira Suazo', monto:5000, tasa:10, plazoMeses:4, cuota:1302.08, saldo:0, estado:'pagado', mora:0, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(-70) },
    { id:'PR-2026-017', clienteId:'CLI-1004', cliente:'José Manuel Cáceres', monto:20000, tasa:15, plazoMeses:12, cuota:1941.67, saldo:20000, estado:'pendiente', mora:0, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(-2) }
  ];

  const PAGOS_SEMILLA = [
    { id:'PG-0091', prestamoId:'PR-2026-014', cliente:'María Fernanda López', cuotaNo:1, monto:1478.67, fecha:fechaHoy(-2), metodo:'Efectivo', estado:'pagada' },
    { id:'PG-0092', prestamoId:'PR-2026-015', cliente:'Carlos Eduardo Martínez', cuotaNo:2, monto:1444.06, fecha:fechaHoy(-1), metodo:'Transferencia', estado:'pagada' },
    { id:'PG-0093', prestamoId:'PR-2026-015', cliente:'Carlos Eduardo Martínez', cuotaNo:3, monto:1444.06, fecha:fechaHoy(4), metodo:'—', estado:'pendiente' },
    { id:'PG-0094', prestamoId:'PR-2026-014', cliente:'María Fernanda López', cuotaNo:2, monto:1478.67, fecha:fechaHoy(9), metodo:'—', estado:'pendiente' }
  ];

  const CAJA_SEMILLA = {
    abierta:true,
    saldoInicial:5000,
    fechaApertura:fechaHoy(0),
    movimientos:[
      { id:'MV-01', tipo:'ingreso', concepto:'Pago cuota PR-2026-015', monto:1444.06, fecha:fechaHoy(-1) },
      { id:'MV-02', tipo:'egreso', concepto:'Compra de papelería', monto:320, fecha:fechaHoy(0) },
      { id:'MV-03', tipo:'ingreso', concepto:'Pago cuota PR-2026-014', monto:1478.67, fecha:fechaHoy(-2) }
    ]
  };

  const CONFIG_SEMILLA = {
    empresa:'CrediGaMi',
    eslogan:'Tu apoyo crece',
    subtitulo:'Préstamos pequeños',
    tasaDefault:12,
    moraDefault:5,
    moneda:'HNL',
    usuarios:[
      { id:'USR-1', nombre:'Asesor Demo', usuario:'asesor', rol:'Asesor de crédito', iniciales:'AD' },
      { id:'USR-2', nombre:'Brayan Admin', usuario:'admin', rol:'Administrador', iniciales:'BA' }
    ]
  };

  function inicializar(){
    if (!localStorage.getItem('cg_clientes')) guardar('cg_clientes', CLIENTES_SEMILLA);
    if (!localStorage.getItem('cg_prestamos')) guardar('cg_prestamos', PRESTAMOS_SEMILLA);
    if (!localStorage.getItem('cg_pagos')) guardar('cg_pagos', PAGOS_SEMILLA);
    if (!localStorage.getItem('cg_caja')) guardar('cg_caja', CAJA_SEMILLA);
    if (!localStorage.getItem('cg_config')) guardar('cg_config', CONFIG_SEMILLA);
    if (!localStorage.getItem('cg_usuario')) guardar('cg_usuario', { nombre:'Asesor Demo', rol:'Asesor de crédito', iniciales:'AD' });
  }
  inicializar();

  window.CG_DATA = {
    leer, guardar, id, moneda, fechaHoy,
    clientes: {
      listar: () => leer('cg_clientes', []),
      guardarTodo: (arr) => guardar('cg_clientes', arr),
      agregar(cliente){
        const arr = leer('cg_clientes', []);
        const nuevo = Object.assign({ id:id('CLI'), creado:fechaHoy(0) }, cliente);
        arr.unshift(nuevo);
        guardar('cg_clientes', arr);
        return nuevo;
      },
      eliminar(clienteId){
        guardar('cg_clientes', leer('cg_clientes', []).filter(c => c.id !== clienteId));
      }
    },
    prestamos: {
      listar: () => leer('cg_prestamos', []),
      guardarTodo: (arr) => guardar('cg_prestamos', arr),
      agregar(p){
        const arr = leer('cg_prestamos', []);
        const nuevo = Object.assign({ id:id('PR-2026'), estado:'pendiente', mora:0, firmaAsesor:null, firmaCliente:null, huella:null, creado:fechaHoy(0) }, p);
        arr.unshift(nuevo);
        guardar('cg_prestamos', arr);
        return nuevo;
      },
      actualizar(prestamoId, cambios){
        const arr = leer('cg_prestamos', []);
        const i = arr.findIndex(p => p.id === prestamoId);
        if (i>-1){ arr[i] = Object.assign({}, arr[i], cambios); guardar('cg_prestamos', arr); return arr[i]; }
        return null;
      }
    },
    pagos: {
      listar: () => leer('cg_pagos', []),
      agregar(pg){
        const arr = leer('cg_pagos', []);
        const nuevo = Object.assign({ id:id('PG') }, pg);
        arr.unshift(nuevo);
        guardar('cg_pagos', arr);
        return nuevo;
      },
      marcarPagada(pagoId, metodo){
        const arr = leer('cg_pagos', []);
        const i = arr.findIndex(p => p.id === pagoId);
        if (i>-1){ arr[i].estado='pagada'; arr[i].metodo = metodo || 'Efectivo'; arr[i].fecha = fechaHoy(0); guardar('cg_pagos', arr); return arr[i]; }
        return null;
      }
    },
    caja: {
      obtener: () => leer('cg_caja', CAJA_SEMILLA),
      guardar: (c) => guardar('cg_caja', c),
      movimiento(tipo, concepto, monto){
        const c = leer('cg_caja', CAJA_SEMILLA);
        c.movimientos.unshift({ id:id('MV'), tipo, concepto, monto:Number(monto), fecha:fechaHoy(0) });
        guardar('cg_caja', c);
        return c;
      }
    },
    config: {
      obtener: () => leer('cg_config', CONFIG_SEMILLA),
      guardar: (c) => guardar('cg_config', c)
    }
  };

})();
