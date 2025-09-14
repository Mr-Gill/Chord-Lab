# Chord Lab

An interactive music learning application that teaches piano and guitar chords through progressive lessons, visual guides, and audio feedback. Built for students, teachers, and self-learners who want to master chord playing with proper technique.

**[Launch App](https://Mr-Gill.github.io/Chord-Lab/)** |

![GitHub Pages](https://img.shields.io/github/deployments/SquidgyG/Chord-Lab/github-pages?label=deployment)
![License](https://img.shields.io/github/license/SquidgyG/Chord-Lab)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)

## Features

### For Students
- **Interactive Instrument Visualization**: Click piano keys or see guitar chord diagrams with finger positions
- **Progressive Lesson System**: Start with proper posture and build up to complex chord progressions
- **Audio Feedback**: Hear each chord and individual notes as you learn
- **Mobile-Friendly**: Practice on any device - phone, tablet, or desktop
- **No Installation Required**: Runs directly in your web browser

### For Teachers
- **Structured Curriculum**: Lessons progress logically from basics to advanced techniques
- **Visual Learning Aids**: Clear finger numbering and chord diagrams
- **Practice Tracking**: Students can see their progress and completed lessons
- **Accessibility Features**: Keyboard navigation and screen reader support

## How to Use

1. **Choose Your Instrument**: Select piano or guitar from the main interface
2. **Start a Lesson**: Begin with "Piano Basics" or "Guitar Essentials" for structured learning
3. **Practice Individual Chords**: Use the chord library to explore specific chords
4. **Follow Visual Guides**: Finger numbers and chord diagrams show proper technique
5. **Listen and Play**: Click notes/strings to hear sounds and practice timing

### Supported Chords
- **Major chords**: C, F, G, D, A, E, B
- **Minor chords**: Am, Em, Dm, Bm, F#m, C#m, G#m
- **Extensions coming soon**: 7th chords, suspended chords, and more

## Browser Compatibility

- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Android Chrome
- **Audio Requirements**: Web Audio API support (available in all modern browsers)
- **Progressive Web App**: Can be installed on mobile devices for offline use

## Screenshots

<!-- Add these screenshots to your repository and link them -->
*Piano Interface*
![Piano chord visualization with finger numbers](screenshots/piano-interface.png)

*Guitar Chord Diagrams*
![Guitar chord diagrams with fret positions](screenshots/guitar-interface.png)

*Lesson System*
![Progressive lesson interface](screenshots/lessons.png)

*Mobile View*
![Responsive design on mobile devices](screenshots/mobile-view.png)

## Educational Approach

Chord Lab uses a progressive learning methodology:

1. **Proper Foundation**: Start with correct posture and hand positioning
2. **Visual Learning**: See exactly where fingers go with clear diagrams
3. **Audio Reinforcement**: Hear what chords should sound like
4. **Muscle Memory**: Practice chord transitions and progressions
5. **Real Application**: Learn chords used in actual songs

## Technical Details

### Architecture
- **Frontend**: React 18 with hooks and functional components
- **Build Tool**: Vite for fast development and optimized production builds
- **Audio**: Web Audio API for real-time sound generation
- **Styling**: Tailwind CSS for responsive design
- **Deployment**: GitHub Pages for reliable hosting

### Distribution Targets
- **Hosted (Recommended)**: GitHub Pages static site - no installation needed for students

## Development Setup

### Prerequisites
- Node.js 20.19–22.x (enforced via `package.json` `engines` field)
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/SquidgyG/Chord-Lab.git
cd Chord-Lab

# Install dependencies
npm ci

# Start development server
npm run dev
# Open http://localhost:5173
```

### Build Commands
```bash
# Production build for GitHub Pages
npm run build

# Create standalone single-file version
npm run build:standalone
# Output: chord-lab-standalone.html
```

### Project Structure
```
src/                 # React application source code
offline/             # Sources for single-file build
scripts/             # Build utilities
archive/             # Legacy versions (reference only)
.github/workflows/   # GitHub Actions for deployment
```

## Deployment

### GitHub Pages (Automatic)
The app deploys automatically to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions (`.github/workflows/deploy.yml`).

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## Contributing

We welcome contributions! Here's how you can help:

### Adding New Chords
1. Update chord data in the relevant configuration file
2. Add finger positions for both piano and guitar
3. Include chord in appropriate lesson progressions
4. Test audio playback and visual display

### Adding New Lessons
1. Follow the existing lesson structure
2. Include proper technique tips and common mistakes
3. Ensure progressive difficulty increase
4. Add practice exercises and assessments

### Bug Reports
Please include:
- Browser and version
- Device type (desktop/mobile)
- Steps to reproduce
- Expected vs actual behavior

### Development Guidelines
- Use TypeScript for new components
- Follow existing code style and component patterns
- Test on multiple devices and browsers
- Ensure accessibility compliance

## Accessibility

Chord Lab is designed to be inclusive:
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Supports system high contrast modes
- **Reduced Motion**: Respects user's motion preferences
- **Touch Targets**: Appropriately sized for mobile interaction

## Troubleshooting

### Audio Issues
- **No sound**: Check browser audio permissions and system volume
- **Distorted audio**: Try refreshing the page to reset Web Audio context
- **Mobile audio**: Some mobile browsers require user interaction before audio plays

### Performance Issues
- **Slow loading**: Check internet connection; try the offline version
- **Laggy interactions**: Close other browser tabs and applications

### Browser Compatibility
- **Old browsers**: Upgrade to a modern browser version
- **iOS Safari**: Requires iOS 14+ for full functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Web Audio API documentation and examples
- Music theory resources from various educational institutions
- Open source community for React and Vite tooling
- Beta testers and music educators who provided feedback

## Future Improvements

Based on comprehensive analysis of the current application, here are prioritized improvements that could significantly enhance the user experience:

### 🎯 **High Priority - User Experience**

#### Performance Optimization
- [ ] Bundle size reduction through code splitting by routes
- [ ] Lazy loading of heavy components (chord diagrams, audio)
- [ ] Virtual scrolling for large chord lists
- [ ] Image optimization and caching strategies
- [ ] Web Workers for audio processing

#### Mobile Experience Enhancement
- [ ] Touch-optimized chord diagram interactions
- [ ] Improved responsive design for small screens
- [ ] Better mobile navigation patterns
- [ ] Touch gestures for chord switching
- [ ] Mobile-specific metronome controls

#### Accessibility Improvements
- [ ] Complete keyboard navigation support
- [ ] Screen reader compatibility for chord diagrams
- [ ] High contrast mode enhancements
- [ ] Focus management and ARIA announcements
- [ ] Voice control integration

### 🎵 **Medium Priority - Music Features**

#### Advanced Audio System
- [ ] MIDI keyboard input support
- [ ] Audio recording and playback functionality  
- [ ] Higher quality instrument samples
- [ ] Volume controls and audio mixing
- [ ] Real-time audio effects

#### Expanded Chord Library
- [ ] 7th chords (maj7, min7, dom7)
- [ ] Extended chords (9ths, 11ths, 13ths)
- [ ] Suspended chords (sus2, sus4)
- [ ] Diminished and augmented chords
- [ ] Jazz chord voicings and inversions
- [ ] Custom chord builder with interval selection

#### Enhanced Practice Tools
- [ ] Intelligent chord progression generator
- [ ] Circle of fifths integration
- [ ] Tempo trainer with gradual speed increases
- [ ] Practice session recording and analysis
- [ ] Chord transition exercises
- [ ] Rhythm pattern practice

### 📚 **Learning & Gamification**

#### Comprehensive Learning System
- [ ] Structured video tutorial integration
- [ ] Interactive exercises with real-time feedback
- [ ] Skill assessment and adaptive difficulty
- [ ] Progress tracking with detailed analytics
- [ ] Personalized learning paths
- [ ] Music theory lessons integration

#### Gamification Features
- [ ] Expanded achievement system with badges
- [ ] Practice streaks and daily goals
- [ ] Leaderboards for classroom competitions
- [ ] Challenge modes and timed exercises
- [ ] Social features and progress sharing
- [ ] Virtual rewards and unlockables

#### Personalization
- [ ] Custom practice routine builder
- [ ] Favorite chords and progression lists
- [ ] Learning style preference settings
- [ ] Personal goal tracking
- [ ] Practice history and insights

### 🛠 **Technical Improvements**

#### Code Quality & Performance
- [ ] Comprehensive error handling with user feedback
- [ ] Performance monitoring and analytics
- [ ] Automated testing coverage (unit, integration, E2E)
- [ ] TypeScript strict mode compliance
- [ ] Component performance optimization
- [ ] Memory leak prevention

#### Data Management
- [ ] Local storage for user preferences
- [ ] Optional cloud sync for progress data
- [ ] Offline mode improvements
- [ ] Import/export functionality for practice data
- [ ] Data backup and restore features

#### Developer Experience
- [ ] Comprehensive component documentation
- [ ] Storybook component library
- [ ] E2E testing with Playwright/Cypress
- [ ] CI/CD pipeline improvements
- [ ] Automated deployment testing

### 🎨 **Visual & Design Enhancements**

#### Interactive Design
- [ ] Smooth chord transition animations
- [ ] Enhanced visual feedback for interactions  
- [ ] Customizable color themes
- [ ] Dark mode optimization
- [ ] Advanced chord diagram customization
- [ ] Interactive fretboard with highlighting

#### Content Management
- [ ] Comprehensive song database with progressions
- [ ] User-generated content system
- [ ] Chord chart sharing community
- [ ] Custom chord creation and sharing
- [ ] Playlist creation for practice sessions

### 🏫 **Educational Platform Features**

#### Teacher Tools
- [ ] Lesson plan creation and management
- [ ] Student progress monitoring dashboard
- [ ] Bulk chord assignment system
- [ ] Assessment tools and automated grading
- [ ] Classroom management features
- [ ] Parent/guardian progress reports

#### Multi-language Support
- [ ] Full internationalization (i18n) framework
- [ ] Multiple chord naming conventions
- [ ] Educational content translation
- [ ] Cultural music adaptation
- [ ] Right-to-left language support

### 📱 **Platform & Integration**

#### Progressive Web App
- [ ] Enhanced offline functionality
- [ ] Native app installation experience
- [ ] Push notifications for practice reminders
- [ ] Background audio support
- [ ] Device integration (camera, microphone)

#### Third-party Integrations
- [ ] Music streaming service integration
- [ ] Social media sharing capabilities
- [ ] Integration with popular DAWs
- [ ] Export to common music formats
- [ ] Calendar integration for practice scheduling

#### Community Features
- [ ] User forums and discussion boards
- [ ] Practice buddy matching system
- [ ] Teacher-student connection platform
- [ ] Community challenges and events
- [ ] User-generated lesson sharing

### 🚀 **Advanced Features**

#### AI/ML Integration
- [ ] AI-powered chord recommendation
- [ ] Automatic difficulty adjustment
- [ ] Performance analysis and feedback
- [ ] Personalized practice suggestions
- [ ] Voice recognition for singing along

#### Hardware Integration
- [ ] Physical MIDI controller support
- [ ] Integration with guitar/piano hardware
- [ ] Foot pedal support for hands-free control
- [ ] External display support for teachers
- [ ] Bluetooth audio device optimization

---

### Implementation Priority Matrix

**Phase 1 (Next 3 months)**: Performance optimization, mobile experience, expanded chord library
**Phase 2 (3-6 months)**: Audio system enhancement, gamification, teacher tools
**Phase 3 (6-12 months)**: AI integration, advanced features, community platform
**Phase 4 (Long-term)**: Hardware integration, enterprise features, platform expansion

### Contribution Opportunities

Each improvement area offers opportunities for community contribution:
- **Beginners**: Documentation, testing, chord data entry
- **Intermediate**: UI/UX improvements, new features, performance optimization  
- **Advanced**: Architecture improvements, AI integration, complex feature development
- **Music Educators**: Curriculum development, lesson creation, pedagogical improvements

## Version History & Roadmap

### Current Version (v2.1)
- ✅ Fixed chord diagram display issues
- ✅ Improved guitar and piano diagram accuracy
- ✅ Enhanced visual consistency with reference designs

### Planned Releases
- **v2.2**: Performance optimization and mobile improvements
- **v2.3**: Extended chord library and audio enhancements
- **v3.0**: AI integration and advanced learning features

---

**Questions or feedback?** Open an issue or start a discussion in this repository.
