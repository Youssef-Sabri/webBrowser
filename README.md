# 🌍 ATLAS Browser Project

A modern, React-based web browser simulation built as a comprehensive Web Programming project. ATLAS mimics the functionality of a real browser environment entirely within the web, featuring a robust tab system, history management, user authentication, and a custom "Midnight Matte" interface.

> **Course:** CSE211 - Web Programming  
> **Institution:** Alamein International University  

## ✨ Key Features

* **🖥️ Multi-Tab Interface:** Fully functional tab management allowing users to open, close, and switch between multiple browsing contexts with independent history stacks.
* **🎨 Midnight Matte Theme:** A custom-designed, high-contrast dark theme optimized for visual comfort and professional aesthetics with CSS variables for easy customization.
* **⏱️ History & Bookmarks:** Integrated history logging and bookmarking system with persistent cloud storage via MongoDB backend.
* **🏠 Smart Start Page:** A personalized dashboard featuring a search bar, customizable "Speed Dial" shortcuts, and user authentication status.
* **🔍 Omnibox Address Bar:** Validates URLs, supports search queries via configurable search engines (Google, Bing, DuckDuckGo), and provides visual security indicators.
* **👤 User Authentication:** Secure login and registration system with MongoDB backend, allowing users to sync their data across sessions.
* **📱 Responsive Design:** Adaptive layout that works across various screen sizes from desktop to mobile.
* **🔧 Browser Controls:** Back/Forward navigation, refresh, home, and zoom controls (25% - 300%).
* **⚙️ Settings Panel:** Configure default search engine and manage browser preferences.

## 🚀 Getting Started

### Prerequisites
* Node.js (v14.0.0 or higher)
* npm (v6.0.0 or higher)
* MongoDB (local or cloud instance via MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Youssef-Sabri/webBrowser
   cd webBrowser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   PORT=3000
   ```
   
   Create a `.env` file in the `Backend/` directory:
   ```
   MONGO_URI=mongodb://localhost:27017/atlas-browser
   PORT=5000
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your machine or provide a cloud MongoDB URI.


5. **Running the Application** 
To run the application in development mode (React + Electron + Backend):
   ```bash
   npm run electron:dev
   ```

## 🛠️ Tech Stack

* **Frontend:** React.js (Create React App) with Hooks for state management
* **Desktop Wrapper:** Electron.js
* **Backend:** Node.js with Express.js
* **Database:** MongoDB with Mongoose ODM
* **Styling:** CSS3 with CSS Variables & Flexbox
* **Icons:** Lucide React
* **State Management:** React Context API (`BrowserContext`) with localStorage + API sync
* **Authentication:** Username/password-based with MongoDB persistence

## 📂 Project Structure

```
webProject/
├── webBrowser/
│   ├── Backend/
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login/Register logic
│   │   │   ├── syncController.js     # Data synchronization logic
│   │   │   └── userController.js     # User data retrieval
│   │   ├── models/
│   │   │   └── db.js                 # Mongoose schemas (User, History, etc.)
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── userRoutes.js         # User data endpoints
│   │   ├── utils/
│   │   │   └── helpers.js            # Data formatting helpers
│   │   ├── server.js                 # Express server entry point
│   │   └── .env                      # Backend environment variables
│   ├── public/
│   │   ├── electron.js               # Electron main process
│   │   ├── preload.js                # Electron preload script
│   │   ├── manifest.json             # Web app manifest
│   │   ├── index.html                # React entry HTML
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddressBar.js         # URL input & search
│   │   │   ├── AuthModal.js          # Authentication popup
│   │   │   ├── BrowserMenu.js        # Main menu dropdown
│   │   │   ├── BrowserView.js        # WebView wrapper component
│   │   │   ├── BrowserWindow.js      # Main app layout
│   │   │   ├── HistoryModal.js       # History viewer
│   │   │   ├── Modal.js              # Reusable modal wrapper
│   │   │   ├── NavigationControls.js # Back/Forward/Refresh buttons
│   │   │   ├── SettingsModal.js      # Search engine options
│   │   │   ├── StartPage.js          # New tab dashboard
│   │   │   ├── Tabs.js               # Tab management bar
│   │   │   └── WindowControls.js     # Min/Max/Close buttons (Win/Linux)
│   │   ├── contexts/
│   │   │   ├── AuthContext.js        # User auth state provider
│   │   │   └── BrowserContext.js     # Browser state (Tabs, history) provider
│   │   ├── services/
│   │   │   └── api.js                # Centralized API service
│   │   ├── styles/
│   │   │   ├── AddressBar.css
│   │   │   ├── Browser.css           # Global theme & layout
│   │   │   ├── BrowserView.css
│   │   │   ├── NavigationControls.css
│   │   │   ├── Tabs.css
│   │   │   └── WindowControls.css
│   │   ├── utils/
│   │   │   ├── constants.js          # Configuration (Search engines)
│   │   │   └── urlHelper.js          # URL processing logic
│   │   ├── App.js                    # Root React component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── package.json
│   └── README.md
```

## 🗄️ Database Schema

The application uses six MongoDB collections:

* **Users:** Stores user credentials and account information
* **Settings:** Stores user preferences (default search engine)
* **Shortcuts:** Custom speed dial shortcuts created by users
* **History:** Browsing history with timestamps
* **Bookmarks:** User-saved bookmarks
* **Tabs:** Session state including open tabs and navigation history

## 🔌 API Endpoints

The backend provides the following REST API endpoints:

* `POST /api/register` - User registration
* `POST /api/login` - User login
* `GET /api/user/:userId` - Fetch all user data
* `POST /api/user/:userId/settings` - Update settings
* `POST /api/user/:userId/shortcuts` - Save shortcuts
* `POST /api/user/:userId/history` - Add history item
* `DELETE /api/user/:userId/history` - Clear history
* `POST /api/user/:userId/bookmarks` - Save bookmarks
* `POST /api/user/:userId/tabs` - Save tab state

## 🎨 Theme Customization

The "Midnight Matte" theme uses CSS variables defined in `src/styles/Browser.css`. Modify these variables to customize the appearance:

```css
:root {
  /* Modern Dark Palette (Zinc-inspired) */
  --bg-primary: #09090b;   /* Deepest black */
  --bg-secondary: #18181b; /* Sidebar/Toolbar */
  --bg-tertiary: #27272a;  /* Hover states */
  --border-color: #3f3f46;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --accent-color: #38bdf8;
}
```

## 📝 Features in Detail

### Authentication
Users can create accounts and log in to sync their browsing data (history, bookmarks, shortcuts) across sessions. All data is encrypted and stored securely in MongoDB.

### Browsing
The browser supports standard navigation with back/forward buttons, page refresh, and home button. Users can open multiple tabs with independent navigation histories and zoom levels.

### History & Bookmarks
Browsing history is automatically logged with timestamps and can be viewed or cleared. Bookmarks can be saved and accessed from the bookmarks bar.

### Speed Dial
Users can customize their start page with frequently visited sites. Custom shortcuts are persistent and synced to the server.

### Search
The address bar intelligently handles URLs, domain names, and search queries. Users can configure their preferred search engine from the settings menu.

## 🚀 Future Enhancements

* Extensions/Plugin system
* Sync across devices
* Private browsing mode
* Download manager
* Password manager integration
* Theme marketplace
* Improved security indicators
* Performance optimizations
