const columns = [
  {name: "ID CLIENTE", uid: "meter_id", sortable: true},
  {name: "ID MEDIDOR", uid: "meter_code", sortable: true},
  {name: "USUARIO", uid: "creator", sortable: true},
  {name: "FECHA REGISTRO", uid: "create_date", sortable: true},
  {name: "CONDICION", uid : "status", sortable : true},
  {name: "ACCION", uid : "actions", sortable: true},
];

const columnsError = [
  {name: "ID", uid: "incidencia_id", sortable: true},
  {name: "ID MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FALLA", uid: "falla_desc", sortable: true},
  {name: "ENCARGADO", uid: "encargado", sortable: true},
  {name: "FECHA DE REPORTE", uid: "fecha_incidencia", sortable: true},
]

const columnsAlarmsFetch = [
  {name: "ID", uid: "alarm_id", sortable: true},
  {name: "ID MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FALLA", uid: "falla_desc", sortable: true},
  {name: "CATEGORIA ALARMA", uid: "falla_type", sortable: true},
  {name: "TIPO", uid: "tipo", sortable: true},
  {name: "FECHA DE REPORTE", uid: "alarm_date", sortable: true},
  {name: "ACCION", uid: "actions", sortable: true},
]

const columnsErrorFetch = [
  {name: "ID", uid: "incidencia_id", sortable: true},
  {name: "ID MEDIDOR", uid: "meter_code", sortable: true},
  {name: "FALLA", uid: "falla_desc", sortable: true},
  {name: "ENCARGADO", uid: "encargado", sortable: true},
  {name: "CATEGORIA", uid: "tipo", sortable: true},
  {name: "FECHA DE REPORTE", uid: "fecha_incidencia", sortable: true},
  {name: "ACCION", uid: "actions", sortable: true},
]

const userColumns = [
  {name: "CODIGO DE USUARIO", uid: "owner_username", sortable: true},
  {name: "CORREO", uid: "owner_email", sortable: true},
  {name: "SUPERUSUARIO", uid: "owner_isSuperuser", sortable: true},
  {name: "FECHA CREACION", uid: "owner_dateJoined", sortable: true},
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

export {columns, columnsErrorFetch, columnsError, userColumns, statusOptions, columnsAlarmsFetch, columnsAlarms, columnsStatus, columnsGateways, columsGatewayLogs};
