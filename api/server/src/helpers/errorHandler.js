import isString from 'lodash/isString';

export default function errorHandler(error, request, response) {
  if (isString(error)) {
    return response.status(400).json({ message: error });
  }

  // default to 500 server error
  return response.status(500).json({ message: error.message });
}
