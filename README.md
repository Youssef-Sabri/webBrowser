# 🌍 ATLAS Browser Project

A modern, React-based web browser simulation built as a comprehensive Web Programming project. ATLAS mimics the functionality of a real browser environment entirely within the web, featuring a robust tab system, history management, and a custom "Midnight Matte" interface.

> **Course:** CSE211 - Web Programming  
> **Institution:** Alamein International University  
> **Status:** Phase 1 (Front-End) Complete | Phase 2 (Back-End) In Progress

## ✨ Key Features

* **🖥️ Multi-Tab Interface:** Fully functional tab management allowing users to open, close, and switch between multiple browsing contexts.
* **🎨 Midnight Matte Theme:** A custom-designed, high-contrast dark theme optimized for visual comfort and professional aesthetics.
* **⏱️ History & Bookmarks:** Integrated history logging and bookmarking system that persists using local storage (Front-End implementation).
* **🏠 Smart Start Page:** A dashboard featuring a search bar and customizable "Speed Dial" shortcuts to favorite sites.
* **🔍 Omnibox Address Bar:** Validates URLs, supports search queries, and provides visual security indicators (Lock/Search icons).
* **📱 Responsive Design:** Adaptive layout that works across various screen sizes, from desktop to mobile.

## 🚀 Getting Started

### Prerequisites
* Node.js (v14.0.0 or higher)
* npm (v6.0.0 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    [git clone https://github.com/Youssef-Sabri/webBrowser]
    cd webBrowser
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the application**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the browser in your browser.

## 🛠️ Tech Stack

* **Core:** React.js (Create React App)
* **Styling:** CSS3 with CSS Variables & Flexbox
* **Icons:** Lucide React
* **State Management:** Custom React Hooks (`useBrowser`)

## 📂 Project Structure

```text
src/
├── components/       # UI Components (BrowserWindow, Tabs, AddressBar)
├── hooks/           # Custom Logic (useBrowser.js for state management)
├── styles/          # CSS Modules (Midnight Matte theme)
├── utils/           # Helper functions (URL normalization)
└── App.js           # Main application entry
