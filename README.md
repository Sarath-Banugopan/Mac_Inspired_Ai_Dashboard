# Personal AI Agent Console

A macOS-inspired AI dashboard that combines real-time information, desktop-style interactions, and an intelligent assistant into a single browser-based workspace.

## Overview

**Personal AI Agent Console** is a modern web application designed to transform the browser into a lightweight personal operating environment. Instead of a traditional dashboard layout, it provides a desktop-inspired experience with draggable windows, application controls, and a dock-based navigation system.

The platform brings together live information sources such as weather, cryptocurrency markets, technology news, GitHub activity, task management, and system information while integrating an AI assistant capable of analyzing and explaining the displayed data.

---

## Key Features

### Desktop-Style Experience

* macOS-inspired user interface
* Draggable and resizable application windows
* Window controls (close, minimize, maximize)
* Dock-based application launcher
* Window focus and z-index management
* Smooth desktop-like interactions

### Real-Time Data Widgets

#### Weather Dashboard

* Current temperature and conditions
* Humidity and wind information
* Live weather updates

#### Cryptocurrency Tracker

* Bitcoin and Ethereum market data
* Price monitoring
* Trend visualization and charts

#### Technology News Feed

* Latest technology headlines
* Real-time news updates
* Curated information display

#### GitHub Activity Monitor

* Recent public GitHub activity
* Repository and developer insights
* Developer-focused updates

#### Task Manager

* Lightweight daily task tracking
* Quick productivity management
* Simple workflow organization

#### System Monitor

* Browser-accessible device information
* Environment and performance details
* Runtime system insights

---

## AI Assistant

The built-in AI assistant provides an intelligent layer on top of the dashboard's live data.

### Capabilities

* Natural language interaction
* Data summarization
* Context-aware explanations
* Question answering based on dashboard content
* Live information analysis

### AI Integration

The assistant can be connected to the Google Gemini API, enabling advanced conversational and analytical capabilities directly within the dashboard environment.

---

## Architecture

The application is organized into four primary modules:

### 1. Window Manager

Responsible for:

* Window creation and destruction
* Drag-and-drop interactions
* Minimize and maximize functionality
* Focus management
* Dock integration
* Layer ordering

### 2. Data Widgets

Independent modules that:

* Fetch live information from external APIs
* Process incoming data
* Render dynamic visualizations
* Update content in real time

### 3. AI Agent Panel

Provides:

* Chat-based interaction
* Prompt processing
* Dashboard-aware responses
* AI service integration

### 4. Visual Layer

Handles:

* Desktop-style rendering
* Glassmorphism effects
* Responsive layouts
* Typography and spacing
* Animation and visual polish

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Visualization

* Chart.js

### APIs & Services

* Weather APIs
* Cryptocurrency market APIs
* News APIs
* GitHub API
* Google Gemini API

---

## Use Cases

### Personal Command Center

Monitor important daily information from a single interface.

### Portfolio Project

Demonstrates advanced frontend development, UI/UX design, API integration, and AI-powered features.

### Productivity Workspace

Provides a centralized environment for information consumption and lightweight task management.

### AI Interface Prototype

Serves as a foundation for experimenting with AI-assisted desktop experiences.

---

## How It Works

1. The application loads a desktop-style workspace.
2. Users launch widgets through the dock interface.
3. Each widget fetches and displays live data from its respective source.
4. Windows can be moved, minimized, focused, or closed.
5. The AI assistant accesses dashboard context to answer questions and generate insights.

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/personal-ai-agent-console.git
cd personal-ai-agent-console
```

### Start a Local Server

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

in your browser.

### Configure AI Features

To enable AI functionality:

1. Obtain a Google Gemini API key.
2. Add the API key to the assistant configuration.
3. Launch the dashboard and start interacting with the AI panel.

---

## Future Roadmap

* Persistent task and preference storage
* Calendar integration
* Notes application
* Advanced financial dashboards
* Multiple desktop layouts
* Theme switching (Light/Dark)
* Enhanced mobile experience
* AI-powered workflows and automation
* Additional productivity widgets

---

## Why This Project?

Most dashboards focus solely on displaying information. Personal AI Agent Console focuses equally on **interaction, usability, and presentation**.

By combining:

* Desktop-inspired UI design
* Real-time information feeds
* Modular widget architecture
* AI-powered insights

the project creates a more immersive and intelligent user experience than a conventional dashboard.

---

## License

This project is licensed under the MIT License.

---

## Author

**Your Name**

* GitHub: https://github.com/your-username
* LinkedIn: https://linkedin.com/in/your-profile
* Portfolio: https://your-portfolio.com
