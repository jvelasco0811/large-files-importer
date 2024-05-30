## Overview

This File Import Service is a Node.js application designed to handle file imports, track their status, and allow for cancellations of ongoing imports. This project uses TypeScript for type safety and organization. 

## Endpoints

### 1. Start File Import
**Endpoint:** POST /api/v1/file

**Description:** Initiates a file import process.

**Controller:** FileImportController

### 2. Get Import Status
**Endpoint:** GET /api/v1/file/:fileImportId/status

**Description:** Retrieves the current status of a specified file import.

**Controller:** StatusFileImportController

### 3. Cancel File Import
**Endpoint:** DELETE /api/v1/file/:fileImportId/cancel

**Description:** Cancels an ongoing file import process.

**Controller:** CancelFileImportController

## Setup

### Prerequisites

- Node.js (>=18.x)
- npm (>=7.x)

### Installation

1. Clone the repository:
\`\`\`
git clone https://github.com/yourusername/file-import-service.git
cd file-import-service
\`\`\`

2. Install dependencies:
\`\`\`
npm install
\`\`\`

3. Build the TypeScript code:
\`\`\`
npm run build
\`\`\`

### Running the Application

To start the server, use the following command:

\`\`\`sh
./startServer.sh
\`\`\`

The server will start on the port defined in your configuration (default: 3000).

### Running Tests

To run tests, use the following command:

\`\`\`
npm test
\`\`\`

## Usage

### Starting a File Import

To initiate a file import, make a POST request to the root endpoint (/api/v1/file). The request body should contain the necessary details for the file import.

### Checking Import Status

To check the status of an ongoing or completed file import, make a GET request to /api/v1/file/:fileImportId/status where :fileImportId is the ID of the file import you wish to check.

### Canceling a File Import

To cancel an ongoing file import, make a DELETE request to /api/v1/file/:fileImportId/cancel where :fileImportId is the ID of the file import you wish to cancel.

## Contributing

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/fooBar).
3. Commit your changes (git commit -am 'Add some fooBar').
4. Push to the branch (git push origin feature/fooBar).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please open an issue or contact the maintainer." > README.md

