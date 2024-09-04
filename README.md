# FetchGeolocation Utility Integration Tests
This project contains a Cypress test suite designed to test the integration of a geolocation utility with the OpenWeatherMap API. The test suite covers various scenarios including valid and invalid city/state and ZIP code inputs, handling of empty inputs, and fetching geolocation data for multiple locations.

## Prerequisites
Before running the tests, ensure that you have the following installed:

[Node.js:](https://nodejs.org/en) This is a JavaScript runtime used for running Cypress. You can install it from the official Node.js website.


This will render as:

## Installation on macOS:

1. Open Terminal.
2. Install Node.js using Homebrew (if Homebrew is installed):

```bash
brew install node
````

## Installation on Windows:
1. Download the Windows installer from the official Node.js website.
2. Run the installer, following the setup instructions.

## Verify Installation:

After installation, verify that Node.js is installed by running the following commands in your terminal or command prompt:
```bash
node -v
npm -v
````

## Setup

1. Clone the repository:
```bash
git clone https://github.com/msehhar/Fetch.git
````

## Navigate to the project directory:
```bash
cd Fetch_todo
````

## Install dependencies:
```bash
npm install
````

## The Cypress test suite is located at:
```bash
Fetch_todo\cypress\e2e\geolocation.spec.cy.js
````

## Running the Tests
To execute the test suite:
1. Open your terminal and navigate to the project directory.
2. Run the Cypress tests:
```bash
npx cypress open
````
3. Click E2E Testing Configured
4. Click E2E Testing
5. Click Chrome or the desired browser
6. Click geolocation.spec
7. Click green check mark to view all the output/ log

## Test Scenarios
The test suite covers the following scenarios:

1. Fetching geolocation data for a valid city/state input.
2. Fetching geolocation data for a valid ZIP code input.
3. Handling empty ZIP code input.
4. Handling invalid city/state input.
5. Fetching geolocation data for multiple valid locations.
6. Fetching geolocation data for multiple locations including valid, empty, and invalid inputs.
7. Handling invalid ZIP code input.
8. Handling empty city/state input.

## Notes
The apiKey is hardcoded in the test file for simplicity. You can also save it in a .env file and reference it within the test file.

## Demo Video

[Watch the demo video](./media/fetch_demo.mp4)


