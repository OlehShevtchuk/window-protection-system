export default function createOpenCloseStatusParameters(completeSersorData) {
  const {
    sensorDatabaseIsOpen,
    windowDatabaseName,
    zoneDatabaseName,
    sensorDatabaseStatus,
    sensorDatabaseIsActive,
    isOpen,
    isActive,
  } = completeSersorData;

  let issueText;
  let isSilence;
  let windowStatus;
  let sensorStatus;
  let sensorMessage;
  
  // Window is opened and sensor active and sensor in db closed
  if (isOpen && isActive && !sensorDatabaseIsOpen) {
    issueText = `BURGLARY ALARM (${windowDatabaseName} in Zone ${zoneDatabaseName} - Opened)`;
    isSilence = false;
    windowStatus = 'hacked';
    sensorStatus = 'alarm';
    sensorMessage = 'Window is hacked';
  }

  // Event(Window closed) existing  data in database (sensor active and sensor in db open)
  if (!isOpen && isActive && sensorDatabaseIsOpen) {
    issueText = `BURGLARY ALARM (${windowDatabaseName} in Zone ${zoneDatabaseName} - Closed)`;
    isSilence = false;
    windowStatus = 'hacked';
    sensorStatus = 'alarm';
    sensorMessage = 'Window is hacked';
  }

  // Sensor is not active but was in Alarm status
  if (!issueText && sensorDatabaseStatus === 'alarm' && !isActive) {
    issueText = `BURGLARY ALARM (${windowDatabaseName} in Zone ${zoneDatabaseName}, but now connection with this sensor lost)`;
    isSilence = true;
    windowStatus = 'inactive';
    sensorStatus = 'inactive';
    sensorMessage = 'Sensor was in alarm status but now connection lost';
  }

  // Sensor is not active and sensor was not in Alarm status and sensor not inactive in sensor table(Issue notification show only once)
  if (
    !issueText &&
    sensorDatabaseStatus !== 'alarm' &&
    !isActive &&
    sensorDatabaseIsActive
  ) {
    issueText = `WARNING(Open/close sensor on ${windowDatabaseName} in Zone ${zoneDatabaseName} - Inactive, connection with this sensor lost)`;
    isSilence = true;
    windowStatus = 'inactive';
    sensorStatus = 'inactive';
    sensorMessage = 'Connection with sensor lost';
  }
  return { issueText, isSilence, windowStatus, sensorStatus, sensorMessage };
}
