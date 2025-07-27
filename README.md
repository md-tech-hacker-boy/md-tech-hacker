
Built by https://www.blackbox.ai

---

# MD TECH HACKER

## Project Overview
MD TECH HACKER is a web application providing users with information about various VPN providers and a blog for sharing posts on tech topics. It features a backend built with Flask and a frontend utilizing Tailwind CSS for styling. The application includes RESTful APIs for managing VPN data and user posts, along with an interactive UI for easy navigation.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your_username/MD_TECH_HACKER.git
   cd MD_TECH_HACKER
   ```

2. **Install the required dependencies**

   Make sure you have Python and Node.js installed. To set up the Python environment:
   ```bash
   pip install Flask flask-cors
   ```

   Next, install the Node.js dependencies:
   ```bash
   cd client
   npm install
   ```

3. **Run the Flask backend**
   ```bash
   python app.py
   ```

4. **Start the frontend**
   ```bash
   npx http-server -p 8080 .
   ```

5. **Access the application**
   Open your web browser and navigate to `http://localhost:8080` for the frontend and `http://localhost:5000/api/vpn` for API testing.

## Usage

1. **Access VPN Data**: Navigate to `/api/vpn` to get detailed information about various VPN providers, including their features and credentials.

2. **Manage Posts**: The blog functionality allows users to create, read, update, and delete posts via the `/api/posts` endpoints. 

   - To create a post, make a `POST` request to `/api/posts` with post data.
   - Retrieve all posts using a `GET` request to `/api/posts`.
   - Update a post by sending a `PUT` request to `/api/posts/{post_id}`.
   - Delete a post by using a `DELETE` request to `/api/posts/{post_id}`.

## Features

- **VPN Information**: View detailed information about various VPN providers including features, credentials, and images.
- **Post Management**: Create, read, update, and delete posts.
- **RESTful API**: Full API support for interactions with the VPN and post data.
- **Responsive Design**: User-friendly interface that adapts to various screen sizes.

## Dependencies

The project has the following dependencies:

- **Backend**:
  - Flask
  - Flask-CORS

- **Frontend (via `package.json`)**:
  - http-server: ^14.1.1

## Project Structure

```
MD_TECH_HACKER/
│
├── app.py               # Flask application with routes and logic
├── index.html           # Main HTML page for the application
├── js/
│   ├── main.js          # JavaScript for handling API interactions and dynamic content
│   └── vpn.js           # JavaScript for managing VPN displays
├── css/
│   └── styles.css       # CSS files for styling the application
├── data/
│   └── posts.json       # JSON file to store posts data
├── package.json          # Node.js dependencies and project metadata
└── package-lock.json     # Exact versions of Node.js dependencies
```

## License

This project is open source and available under the [MIT License](LICENSE).