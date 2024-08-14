# Dance On Location

**Dance On Location** is a web application that merges dance and location-based experiences, allowing users to explore unique dance videos triggered by their proximity to specific GPS coordinates. The project is built using Angular for the frontend and Rust with the Axum framework for the backend, with the integration of Vimeo for hosting and streaming videos.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Usage](#usage)
  - [Manage Videos](#manage-videos)
  - [Playback Page](#playback-page)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Overview

**Dance On Location** allows users to interact with dance videos based on their geographical location. The platform is designed to present videos when a user is within a specific range of a GPS coordinate, making the experience location-sensitive. Administrators can manage the videos through a dedicated interface, specifying details like the video’s Vimeo ID and its corresponding GPS coordinates.

## Tech Stack

- **Frontend**: Angular (Standalone components)
- **Backend**: Rust, Axum, Shuttle for deployment
- **Database**: PostgreSQL with SQLx
- **Video Hosting**: Vimeo
- **APIs & Libraries**:
  - `navigator.geolocation` for GPS data
  - `rxjs` for handling reactive extensions in Angular
  - `DomSanitizer` for securely embedding Vimeo videos

## Features

- **Location-Based Video Playback**: Automatically play videos based on the user’s current GPS location.
- **Admin Interface**: Secure login for admins to manage video details, including adding, editing, and deleting video entries.
- **Vimeo Integration**: Embed unlisted Vimeo videos seamlessly.
- **Responsive Design**: Mobile-friendly and optimized for various screen sizes.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Rust and Cargo installed
- PostgreSQL database setup
- Shuttle CLI installed for deployment

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/dance-on-location.git
   cd dance-on-location
   ```

2. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```
   
3. **Set up the backend**:

* Create a .env file in the backend directory with your database URL and any other necessary environment variables.
* Update the database schema using migrations:

  ```bash
  sqlx migrate run
  ```

### Running Locally

1. **Start the backend server**:

   ```bash
   cd backend
   cargo shuttle run
   ```

2. **Start the frontend server**:

   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**:

Open `http://localhost:4200` in your web browser.

## Deployment

The project is deployed using Shuttle. To deploy the project:

1. Ensure your database is set up and migrations are applied.
2. Deploy using the Shuttle CLI:
   ```bash
   cargo shuttle deploy
   ```
3. Follow any additional instructions provided by Shuttle during deployment.
4. Deploy the frontend as you see fit (I used Netlify).

## Usage

### Manage Videos

* Admin Login: Use the login page to authenticate as an admin.
* Manage Interface: Add new videos by entering a title, description, Vimeo ID, and GPS coordinates. Edit or delete existing entries as needed.

### Playback Page

* Location Detection: The application will request access to your location. Once you’re within range of a video location, the corresponding video will be displayed and played.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Make sure to follow the existing code style and include relevant tests.

## License

This project is licensed under the MIT License. See the LICENSE.md file for details.

## Acknowledgements

*	Vimeo for providing an accessible video hosting and embedding solution.
*	Shuttle for simplifying the deployment process.
* Angular and Rust communities for their continuous support and development of these robust frameworks.
