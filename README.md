# Mac_Inspired_Ai_Dashboard
Ai Dashboard with live data

Personal AI Agent Console
A browser-based personal dashboard that combines live widgets, a desktop-style interface, and
an AI assistant into a single interactive experience.
Overview
Personal AI Agent Console is a web project designed to feel like a lightweight operating system
inside the browser. Instead of presenting information in a traditional dashboard layout, it uses
a macOS-inspired desktop with draggable windows, app-style controls, and a dock for
navigation.
The goal of the project is to combine useful daily information with a more engaging interface. It
brings together weather updates, crypto tracking, tech news, GitHub activity, tasks, system
information, and an on-screen AI assistant in one place.
Features
Desktop-style interface
macOS-inspired visual design
Draggable app windows
Close, minimize, and fullscreen controls
Dock-based window launching and switching
Layered window focus with z-index management
Live widgets
Weather panel for current conditions such as temperature, wind, and humidity
Crypto panel for Bitcoin and Ethereum pricing with trend visualization
Tech News panel for current headlines
GitHub Activity panel for recent public developer activity
Tasks panel for lightweight daily task management
System Monitor panel for browser-visible device and environment details
AI assistant
On-screen assistant interface
Supports prompt-based summaries and questions
Can be connected to Gemini using an API key
Designed to answer using the dashboard's current data context
Project Goals
This project focuses on three ideas:
1. Building a polished front-end experience using only web technologies.
2. Combining multiple real-time information sources into one personal workspace.
3. Enhancing the dashboard with an AI layer that can summarize and explain the visible data.
Tech Stack
HTML5 for the structure of the app
CSS3 for styling, layout, glassmorphism, and desktop-inspired visuals
Vanilla JavaScript for window management, widget logic, and AI interactions
Chart.js for chart rendering
External APIs for live data integration
Google Gemini API for the assistant experience
Main Modules
1. Window Manager
Handles window opening, closing, minimizing, maximizing, dragging, focus order, and dock
interaction.
2. Data Widgets
Each widget is responsible for fetching and displaying one type of live information, such as
weather, markets, or headlines.
3. Agent Panel
Provides a chat-style interface where users can ask questions and receive AI-generated
responses based on the current dashboard state.
4. Visual Layer
Creates the overall desktop experience through background imagery, translucent surfaces,
typography, shadows, spacing, and responsive adjustments.
Use Cases
This project can be used as:
A personal command center
A front-end portfolio project
A browser-based productivity dashboard
A concept demo for AI-assisted interfaces
A base template for more advanced dashboard systems
How It Works
1. The page loads a desktop-style interface.
2. Individual windows display different categories of information.
3. Live widgets fetch data from their respective sources.
4. The dock allows windows to be opened, focused, or minimized.
5. The AI assistant can answer questions using dashboard context.
Setup
1. Clone or download the project files.
2. Open the project in a browser, or serve it using a local development server.
3. If AI features are enabled, add a valid Gemini API key in the assistant window.
Example with a simple local server:
python -m http.server 8000
Then open 
http://localhost:8000 in the browser.
Future Improvements
Persistent storage for tasks and preferences
Better layout presets such as dashboard mode
More widgets like calendar, notes, and finance summaries
Theme switching between light and dark modes
Improved mobile adaptation
More advanced AI workflows and tool integrations
Why This Project Stands Out
Unlike a standard dashboard, this project focuses heavily on interaction design and
presentation. The desktop metaphor makes the experience feel more like a small operating
environment than a static web page, while the AI assistant adds an intelligent layer on top of
the live data.
License
Add your preferred license here, such as MIT, Apache-2.0, or a personal-use license.
Author
Add your name, GitHub profile, LinkedIn, or portfolio link here.