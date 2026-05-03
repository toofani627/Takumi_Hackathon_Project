# 🍄 Takumi Hackathon Project - Mario-Themed WebOS Interface

A retro-inspired, Mario-themed web operating system featuring a collection of interactive applications built with vanilla JavaScript, HTML5, and CSS3.

## 🎮 Project Overview

This project is a creative take on a desktop operating system, featuring a classic Mario aesthetic combined with modern web technologies. The interface provides a fully functional WebOS environment where users can interact with multiple applications, manage user accounts, and enjoy a nostalgic gaming experience—all from their browser.

The project demonstrates advanced vanilla JavaScript techniques, responsive web design, and creative UI/UX implementation without relying on heavy frameworks.

## 🌟 Core Features

### WebOS Desktop Environment
- **Login System**: Custom authentication interface with persistent user accounts
- **Taskbar Navigation**: Quick access to installed applications
- **Window Management**: Draggable, resizable application windows
- **Storage System**: Local data persistence using browser storage
- **Retro Aesthetic**: Authentic Mario color scheme and typography

### Integrated Applications

#### 🎵 Mario's Music Player
A full-featured local music player with:
- **Folder Picker**: Select and scan music folders recursively
- **Playback Controls**: Play, pause, next, previous, seek, and volume
- **Song Search**: Real-time filtering by title or artist
- **Audio Visualization**: Animated visualizations matching the beat
- **Multi-Format Support**: MP3, WAV, M4A, OGG, AAC, and FLAC

#### 🎮 Classic Mario Game
An interactive platformer game featuring:
- Multiple levels with progressive difficulty
- Player character with jump mechanics
- Enemy AI (Goombas, Koopas)
- Collectibles (coins, power-ups)
- Physics-based gameplay
- Sound effects and background music

#### 🧮 Retro Calculator
A vintage-styled calculator application with:
- Full arithmetic operations
- Responsive button layout
- Period-appropriate UI design

## 📁 Project Structure

```
Front-end/
├── index.html                 # Main entry point with WebOS shell
├── mario-theme.css            # Mario color scheme and typography
├── Css_login_page.css         # Login interface styling
├── home_screen.css            # Desktop/home screen styling
├── webos-backend.js           # Core WebOS system logic
├── webos-storage.js           # Local storage management
├── login.js                   # Authentication and user management
├── mario-music-player/        # Music player application
│   ├── mario-music-player.html
│   ├── mario-music-player.css
│   ├── mario-music-player.js
│   └── MARIO_PLAYER_README.md
├── mario-game/                # Classic game implementation
│   ├── index.html
│   ├── css/
│   └── js/
├── Retro-Calculator/          # Calculator application
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── Assets/                    # Media resources
    └── images/
        └── Wallpapers/
```

## 🚀 How to Use

### Getting Started

1. **Open the Application**: Launch `Front-end/index.html` in a Chrome-based browser
2. **Create an Account**: Register with a username and password on the login screen
3. **Access Applications**: Click app icons in the taskbar to launch integrated applications

### Browser Requirements

- **Primary**: Chrome, Edge, Brave, or Opera (Chromium-based)
- **Minimum**: HTTPS or localhost for File System Access API (Music Player)
- **Recommended Resolution**: 1024x768 or higher

### Features by Application

- **Music Player**: Click folder picker to scan your music library
- **Game**: Use arrow keys to move and spacebar to jump
- **Calculator**: Standard calculator operations with numeric keypad

## 💻 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **APIs**: File System Access API, HTML5 Audio API, LocalStorage
- **Animation**: GSAP (GreenSock Animation Platform)
- **Architecture**: MVC-inspired pattern with modular components

## 🔒 Security & Privacy

- All files remain on your device
- No external data transmission
- Permission-based file system access
- No tracking or analytics

## ✨ Key Achievements

- ✅ Fully functional multi-app environment
- ✅ Persistent user data management
- ✅ Advanced music scanning and playback
- ✅ Interactive game with physics
- ✅ Responsive retro UI design
- ✅ Zero dependencies beyond GSAP

## 🎯 Future Enhancements

- Multi-user save states for games
- Customizable themes and wallpapers
- Audio equalizer for music player
- Game level editor
- System notifications
- File explorer integration

---

**Project Status**: Complete hackathon submission featuring a fully functional WebOS environment with multiple interactive applications.

**Let's-a-go! 🍄🎮**
