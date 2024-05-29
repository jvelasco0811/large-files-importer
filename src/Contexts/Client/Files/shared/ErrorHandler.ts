export class ErrorHandler extends Error {
    constructor(
      public type: string,
      public message: string,
      public code: number,
    ) {
      super(message);
      Object.setPrototypeOf(this, ErrorHandler.prototype);
    }
  }
  
  