const columns = [
  {name: "ID MEDIDOR", uid: "meter_id", sortable: true},
  {name: "CODIGO MEDIDOR", uid: "meter_code", sortable: true},
  {name: "TIPO DE MEDIDOR", uid: "meter_type", sortable: true},
  {name: "CREADOR", uid: "creator", sortable: true},
  {name: "FECHA INSTALACION", uid: "create_date", sortable: true},
  {name: "LATITUDE", uid : "latitude", sortable: true},
  {name: "LONGITUDE",uid : "longitude", sortable: false},
  {name: "ESTATUS", uid : "status", sortable : true},
  {name: "TAPA", uid : "tapa_desc", sortable: true},
  {name: "ACCION", uid : "actions", sortable: true},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];

const columnsAlarms = [
  {name: "ID", uid: "id", sortable: true},
  {name: "CODIGO MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FECHA DE REPORTE", uid: "fecha", sortable: true},
  {name: "DESC. FALLA", uid : "falla_desc", sortable: true},
  {name: "CATEGORIA", uid : "tipo", sortable: true},
  {name: "TIPO FALLA", uid: "falla_type", sortable: true},
  {name: "ACCIONES", uid : "actions", sortable: true},
];

const columnsStatus = [
  {name: "ID ALARMA", uid: "alarm_pk", sortable: true},
  {name: "CODIGO MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FECHA DE ALARMA", uid: "alarm_date", sortable: true},
  {name: "DESC. FALLA", uid : "falla_desc", sortable: true},
  {name: "TIPO FALLA", uid : "falla_type", sortable: true},
];

const columnsGateways = [
  {name: "ID GATEWAY", uid: "equip_id", sortable: true},
  {name: "ESTATUS", uid: "online_status", sortable: true},
  {name: "LATITUDE", uid: "latitude", sortable: true},
  {name: "LONGITUDE", uid : "longitude", sortable: true},
  {name: "BASE", uid: "service_center", sortable : true},
  {name: "ACTUALIZACIÓN", uid: "last_update_time", sortable : true},
  {name: "ACCIONES", uid : "actions", sortable: true},
];

const columsGatewayLogs = [
  {name: "ID REGISTRO", uid: "log_id", sortable: true},
  {name: "ID DEL EQUIPO", uid: "equip_id", sortable: true},
  {name: "ACTUALIZACIÓN", uid: "status_time", sortable: true},
  {name: "ESTATUS", uid : "online_status", sortable: true}
];

export {columns, statusOptions, columnsAlarms, columnsStatus, columnsGateways, columsGatewayLogs};
