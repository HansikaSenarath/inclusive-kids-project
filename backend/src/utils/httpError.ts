export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }

  static notFound(message = 'Resource not found') {
    return new HttpError(404, message);
  }

  static badRequest(message = 'Invalid request', details?: unknown) {
    return new HttpError(400, message, details);
  }
}
