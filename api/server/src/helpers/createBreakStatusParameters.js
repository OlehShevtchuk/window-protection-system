export default function createOpenCloseStatusParameters(completeSersorData) {
  const {
    windowDatabaseName,
    zoneDatabaseName,
    sensorDatabaseStatus,
    sensorDatabaseIsActive,
    isBroken,
    isActive,
  } = completeSersorData;

  let issueText;
  let isSilence;
  let windowStatus;
  let sensorStatus;
  let sensorMessage;

  // Window is broken
  if (isBroken && isActive) {
    issueText = `BREAK ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Broken`;
    isSilence = false;
    windowStatus = 'broken';
    sensorStatus = 'alarm';
    sensorMessage = 'Window is broken';
  }
  // Sensor is not active but was in Alarm status
  if (!issueText && sensorDatabaseStatus === 'alarm' && !isActive) {
    issueText = `BREAK ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Broken. But now connection with this sensor lost`;
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
    issueText = `Break sensor on ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Inactive, connection with this sensor lost`;
    isSilence = true;
    windowStatus = 'inactive';
    sensorStatus = 'inactive';
    sensorMessage = 'Connection with sensor lost';
  }

  return {
    issueText,
    isSilence,
    windowStatus,
    sensorStatus,
    sensorMessage,
  };
}
