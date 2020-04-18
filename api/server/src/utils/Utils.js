export default class Util {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
    this.eventName = null;
  }

  setSuccess(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(response) {
    const result = {
      status: this.type,
      message: this.message,
      data: this.data,
    };

    if (this.type === 'success') {
      return response.status(this.statusCode).json(result);
    }
    return response.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    });
  }

  write(response, eventName) {
    const result = {
      status: this.type,
      message: this.message,
      data: this.data,
    };

    if (this.type === 'success') {
      return response.write(`data: ${result}\n\n
      event: ${eventName}\n`);
    }
    return response.write(
      `data: ${{
        status: this.type,
        message: this.message,
      }}\n\n
      event: ${eventName}\n`,
    );
  }
}
