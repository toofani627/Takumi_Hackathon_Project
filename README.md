# 🍄 Mario's Music Player 🍄

A Mario-themed local music player built with vanilla JavaScript, featuring folder picker functionality, modern UI, and full playback controls.

## Features

✨ **Mario-Themed UI**
- Classic Mario color scheme (Red, Blue, Yellow, Gold)
- Animated Mario character (🍄) that jumps with the beat
- Audio visualization bars
- Retro-inspired button styling with 3D effects

🎵 **Music Player Features**
- **Folder Picker**: Select any folder containing audio files from your computer
- **Recursive Folder Scanning**: Automatically finds all audio files in subfolders
- **Full Playback Controls**: Play, pause, next, previous, seek, volume
- **Progress Bar**: Visual progress indicator with seek functionality
- **Song Search**: Real-time filtering of songs by title or artist
- **Playlist Display**: Shows all songs from selected folder
- **Current Song Info**: Displays title and artist while playing

🎧 **Supported Audio Formats**
- `.mp3` - MP3 Audio
- `.wav` - WAV Audio
- `.m4a` - M4A/AAC Audio
- `.ogg` - Ogg Vorbis
- `.aac` - AAC Audio
- `.flac` - FLAC Audio (lossless)

📱 **Responsive Design**
- Desktop optimized (primary)
- Tablet friendly
- Mobile responsive
- Adapts to all screen sizes

## Files Included

1. **mario-music-player.html** - Main HTML structure
2. **mario-music-player.css** - Complete styling with Mario theme
3. **mario-music-player.js** - Vanilla JavaScript player logic
4. **MARIO_PLAYER_README.md** - This file

## How to Use

### Starting the Music Player

1. **From WebOS Home**: Click the Music app icon in the taskbar or apps menu
2. **Standalone**: Open `mario-music-player.html` directly in your browser

### Picking a Music Folder

1. Click the **📁 Pick Music Folder** button
2. Select a folder containing audio files
3. The player will scan the folder and subfolders recursively
4. All supported audio formats will be added to your library

### Playing Music

1. **Play/Pause**: Click the green play button (▶️/⏸️)
2. **Next Song**: Click the next button (⏭️)
3. **Previous Song**: Click the previous button (⏮️)
4. **Seek**: Click anywhere on the progress bar to jump to that time
5. **Volume**: Adjust with the volume slider (🔊)

### Searching Songs

- Type in the search box to filter songs by:
  - Song title
  - Artist name
- Results update in real-time
- Click any song in the list to play it

## Technical Details

### API Used
- **File System Access API**: For secure folder and file access
- **HTML5 Audio API**: For playback control
- **Vanilla JavaScript**: No frameworks or dependencies

### Browser Requirements
- Chrome/Chromium browsers (Recommended)
- Edge, Brave, Opera (Chromium-based)
- HTTPS or localhost (File System Access API requirement)

### File Naming Convention
For better artist detection, use this naming format:
```
Artist Name - Song Title.mp3
Song Title.mp3
```

The player will extract the artist name from the filename (everything before the dash).

## Features Breakdown

### 1. Folder Picker
- Uses modern File System Access API
- Secure: User must manually grant permission
- Recursive scanning of subfolders
- Supports all audio formats

### 2. Playlist Management
- Automatically organized by filename
- Artist metadata extracted from filename
- Quick search/filter functionality
- Shows song count

### 3. Player Controls
- **Play/Pause Toggle**: One-click play control
- **Navigation**: Move through playlist smoothly
- **Progress Seeking**: Click to jump to any position
- **Volume Control**: Smooth volume adjustment with visual feedback

### 4. Visual Feedback
- Animated Mario character (jumping 🍄)
- Audio visualization bars
- Active song highlighting in playlist
- Real-time progress indication
- Time display (current/total duration)

## Installation

### Option 1: Standalone Use
1. Save `mario-music-player.html`, `mario-music-player.css`, and `mario-music-player.js` in same folder
2. Open `mario-music-player.html` in a Chrome browser
3. Click "Pick Music Folder" to get started

### Option 2: Integrated with WebOS UI
Already integrated into the WebOS-style interface:
1. The Music app in the taskbar opens the Mario Music Player
2. It runs in an iframe within the WebOS window manager
3. Fully draggable and resizable

## Keyboard Tips

- **Space** (in browser): Toggle play/pause
- **Arrow Keys**: Navigate volume/progress (browser dependent)
- **Tab**: Focus navigation through controls

## Troubleshooting

### Folder Picker Not Working
- Ensure you're using Chrome or Chromium-based browser
- Check that you're on `localhost` or `https://` (not plain `http://`)
- Look for browser permission prompts

### No Songs Showing
- Verify folder contains supported audio formats
- Check file permissions (should be readable)
- Try opening browser DevTools console for errors
- Ensure files aren't in restricted system folders

### Audio Not Playing
- Check browser volume isn't muted
- Verify file format is supported
- Try a different audio file
- Check browser console for error messages

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended, all features work |
| Edge | ✅ Full | Chromium-based, all features |
| Firefox | ⚠️ Partial | File System API not supported |
| Safari | ⚠️ Partial | File System API not supported |
| Mobile | ⚠️ Limited | File System API varies by platform |

## Performance Notes

- **Fast Loading**: Lightweight (~20KB combined)
- **Efficient Scanning**: Quick folder traversal even with large libraries
- **Smooth Playback**: Native HTML5 audio performance
- **Low Memory**: Single audio context, minimal DOM elements
- **Responsive UI**: 60fps animations and interactions

## Security & Privacy

- 🔒 **No Data Upload**: All files stay on your device
- 🔐 **Permission-Based**: You control folder access
- 🚫 **No Tracking**: No analytics or external requests
- 📁 **Local Only**: Works completely offline after first load

## Future Enhancements

Possible features for future versions:
- Shuffle and repeat modes
- Playlist creation and saving
- Theme customization
- Keyboard shortcuts display
- Song duration caching
- Now Playing notifications
- Equalizer controls

## Credits

- **Original UI Inspiration**: Online Local Media Player (toofani627)
- **Mario Theme**: Classic Nintendo styling adapted for web
- **Technology**: HTML5, CSS3, Vanilla JavaScript

## License

Open source - Feel free to modify and use as needed!

---

**Enjoy your music! 🍄🎵**

Let's-a-go! 🍄
