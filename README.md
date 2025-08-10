# Tenaye - Responsive Website

A modern, fully responsive website built with HTML5, CSS3, and JavaScript. This project demonstrates best practices for responsive web design across desktop, tablet, and mobile devices.

## 🌟 Features

### Responsive Design
- **Mobile-First Approach**: Built with mobile-first CSS methodology
- **Flexible Grid System**: CSS Grid layouts that adapt to all screen sizes
- **Responsive Typography**: Font sizes that scale appropriately across devices
- **Touch-Friendly Interface**: Optimized for touch interactions on mobile devices

### Cross-Device Compatibility
- **Desktop (1024px+)**: Full navigation, 3-column layouts, enhanced typography
- **Tablet (768px+)**: 2-column layouts, optimized spacing, touch-friendly elements
- **Mobile (<768px)**: Single-column layouts, hamburger navigation, stacked elements

### User Experience
- **Smooth Animations**: CSS transitions and JavaScript-powered animations
- **Accessibility**: Keyboard navigation, focus states, screen reader support
- **Performance**: Optimized loading, debounced scroll events, efficient animations
- **Interactive Elements**: Hover effects, form validation, smooth scrolling

## 📱 Responsive Breakpoints

| Device Type | Breakpoint | Layout | Features |
|-------------|------------|--------|----------|
| Mobile | < 768px | Single column | Hamburger menu, stacked cards |
| Tablet | 768px - 1023px | Two columns | Side-by-side content, larger buttons |
| Desktop | 1024px - 1439px | Three columns | Full navigation, enhanced spacing |
| Large Desktop | 1440px+ | Three columns | Maximum container width |

## 🛠️ Technical Implementation

### CSS Features
- **CSS Grid**: Flexible layouts that adapt to content and screen size
- **Flexbox**: Component-level layouts and alignment
- **CSS Custom Properties**: Consistent theming and easy customization
- **Media Queries**: Device-specific optimizations
- **Backdrop Filter**: Modern glass-morphism effects

### JavaScript Features
- **Intersection Observer**: Scroll-triggered animations
- **Event Delegation**: Efficient event handling
- **Debouncing**: Performance optimization for scroll events
- **Touch Gestures**: Swipe support for mobile navigation
- **Form Validation**: Client-side validation with user feedback

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG compliant color combinations

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tenaye
   ```

2. **Open the website**
   - Open `index.html` in your browser
   - Or use a local server: `python3 -m http.server 8000`

3. **Test responsive design**
   - Open `test-responsive.html` to test different viewport sizes
   - Use browser dev tools to simulate different devices
   - Test on actual mobile and tablet devices

## 📋 Testing Checklist

### Mobile Testing (< 768px)
- [ ] Hamburger menu opens/closes correctly
- [ ] Touch targets are at least 44px
- [ ] Text is readable without zooming
- [ ] Buttons stack vertically
- [ ] Images scale properly
- [ ] Form inputs are touch-friendly

### Tablet Testing (768px - 1023px)
- [ ] 2-column layouts display correctly
- [ ] Navigation is accessible
- [ ] Content spacing is appropriate
- [ ] Touch interactions work smoothly
- [ ] Typography scales appropriately

### Desktop Testing (1024px+)
- [ ] 3-column layouts display correctly
- [ ] Full navigation is visible
- [ ] Hover effects work properly
- [ ] Content is well-spaced
- [ ] Animations are smooth

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Colors
The website uses CSS custom properties for easy color customization:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --text-light: #666;
  --background-light: #f8f9fa;
}
```

### Typography
Font sizes scale with viewport using responsive units:

```css
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
}
```

### Layout
Grid layouts automatically adapt to screen size:

```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android Chrome 90+)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices and browsers
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for responsive web design excellence**