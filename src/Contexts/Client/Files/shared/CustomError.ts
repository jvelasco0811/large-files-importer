export class CustomError extends Error {
    constructor(
      public type: string,
      public message: string,
      public code?: number,
      public metadata?: any
    ) {
      super(message);
      this.name = 'CustomError';
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }
  
  