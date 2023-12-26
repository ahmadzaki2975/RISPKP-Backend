class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  /**
   * Create an error response object.
   * @returns {Object} - Error response object.
   */
  toResponse() {
    return {
      error: {
        message: this.message,
        status: this.status,
      },
    };
  }
}

module.exports = CustomError;
