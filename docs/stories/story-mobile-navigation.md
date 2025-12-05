# Story: Mobile Navigation Redesign

**Epic:** User Experience Enhancement

## User Story
**Jako mobile user** chcę łatwo nawigować po stronie na telefonie, aby szybko znaleźć potrzebne informacje.

## Business Value  
- **Mobile Traffic**: 70% użytkowników korzysta z mobile - kluczowe dla conversions
- **User Experience**: Intuicyjna nawigacja = dłuższe sesje
- **Accessibility**: Touch-friendly interface dla wszystkich users
- **Brand Perception**: Profesjonalna mobile experience

## Acceptance Criteria

### Must Have
- [ ] **Hamburger menu**: Smooth animated hamburger → X transition
- [ ] **Touch-friendly buttons**: Minimum 44px touch targets
- [ ] **Sticky navigation**: Nav bar pozostaje visible podczas scroll
- [ ] **Quick contact access**: Phone/email dostępne w 1 tap
- [ ] **Current page indicator**: Clear visual indication gdzie user się znajduje
- [ ] **Smooth animations**: 60fps transitions bez lag

### Should Have
- [ ] **Breadcrumbs**: Navigation path na sub-pages
- [ ] **Search functionality**: Quick search w nav menu
- [ ] **Social links**: Easy access do Instagram/Facebook
- [ ] **Language switcher**: PL/EN toggle (future-ready)

### Nice to Have
- [ ] **Gesture support**: Swipe gestures dla navigation
- [ ] **Voice search**: "Mówię co szukam" functionality
- [ ] **Dark mode toggle**: Theme switcher w navigation
- [ ] **Favorites**: Save/bookmark portfolio items

## Technical Implementation

### Phase 1: Navigation Structure
```typescript
// components/MobileNavigation.tsx
interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { label: 'Strona główna', href: '/', icon: <Home /> },
  { label: 'Portfolio', href: '/portfolio', icon: <Gallery /> },
  { label: 'Usługi', href: '/services', icon: <Brush /> },
  { label: 'O firmie', href: '/firma', icon: <Info /> },
  { label: 'Proces', href: '/process', icon: <Timeline /> },
  { label: 'Kontakt', href: '/kontakt', icon: <Phone /> },
];
```

### Phase 2: Animation Implementation
```typescript
// Using Framer Motion for smooth animations
const menuVariants = {
  closed: {
    x: '100%',
    transition: { type: 'tween', duration: 0.3 }
  },
  open: {
    x: 0,
    transition: { type: 'tween', duration: 0.3 }
  }
};

const hamburgerVariants = {
  closed: { rotate: 0 },
  open: { rotate: 45 }
};
```

### Phase 3: Touch Interaction
```css
/* Touch-friendly button styles */
.mobile-nav-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
  margin: 4px;
  border-radius: 8px;
  touch-action: manipulation;
}

.mobile-nav-item {
  padding: 16px 20px;
  font-size: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
```

### Phase 4: Sticky Navigation
```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## Design Requirements

### Visual Design
- **Color scheme**: Consistent z brand colors
- **Typography**: Clear, readable fonts (min 16px)
- **Iconography**: Consistent icon style (Lucide React)
- **Spacing**: Adequate white space między items

### Interaction Design
- **Touch feedback**: Visual feedback na touch events
- **Loading states**: Smooth transitions między pages
- **Error states**: Clear communication gdy navigation fails
- **Offline support**: Basic navigation działa offline

## Mobile Breakpoints
```css
/* Tailwind breakpoints */
xs: 375px   /* iPhone SE */
sm: 768px   /* iPad portrait */
md: 1024px  /* iPad landscape / small laptop */
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- [ ] **Keyboard navigation**: Full navigation możliwa z keyboard
- [ ] **Screen reader support**: Proper ARIA labels i roles
- [ ] **Focus indicators**: Visible focus dla keyboard users
- [ ] **Color contrast**: 4.5:1 minimum ratio
- [ ] **Touch targets**: 44px minimum size
- [ ] **Motion preference**: Respect prefers-reduced-motion

### Implementation Example
```typescript
<nav
  role="navigation" 
  aria-label="Main navigation"
  className="mobile-navigation"
>
  <button
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    onClick={toggleMenu}
  >
    <HamburgerIcon />
  </button>
  
  <ul 
    id="mobile-menu"
    role="menu"
    aria-hidden={!isOpen}
  >
    {navigationItems.map((item) => (
      <li key={item.href} role="none">
        <Link 
          href={item.href}
          role="menuitem"
          tabIndex={isOpen ? 0 : -1}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

## Performance Considerations

### Optimization Targets
- **Animation frame rate**: 60fps dla all transitions
- **Touch response time**: <100ms dla button presses
- **Menu open time**: <300ms dla full menu reveal
- **Memory usage**: <5MB dla navigation state

### Implementation Strategy
```typescript
// Optimize re-renders
const MobileNavigation = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return (
    // Navigation JSX
  );
});
```

## Testing Strategy

### Manual Testing Devices
- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13 (390px width) 
- [ ] iPhone 12/13 Pro Max (428px width)
- [ ] Samsung Galaxy S21 (360px width)
- [ ] iPad Mini (768px width)

### Automated Testing
```typescript
// Jest + Testing Library tests
describe('Mobile Navigation', () => {
  it('opens menu when hamburger clicked', () => {
    render(<MobileNavigation />);
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('menu')).toBeVisible();
  });
  
  it('closes menu when menu item clicked', () => {
    render(<MobileNavigation />);
    // Test implementation
  });
});
```

## Definition of Done
- [ ] ✅ All Acceptance Criteria met
- [ ] ✅ Design review approved by UX team  
- [ ] ✅ Accessibility audit passed (WCAG 2.1 AA)
- [ ] ✅ Performance test on 5+ real devices
- [ ] ✅ Cross-browser testing completed
- [ ] ✅ Navigation analytics tracking implemented
- [ ] ✅ User testing conducted (3+ users)
- [ ] ✅ Documentation updated

## Risk Assessment

### Risk: Touch Performance na Older Devices
**Probability:** Medium | **Impact:** Medium
**Mitigation:** Lightweight animations, throttled scroll listeners

### Risk: iOS Safari Quirks
**Probability:** High | **Impact:** Low  
**Mitigation:** Extensive iOS testing, webkit-specific CSS

### Risk: Accessibility Issues
**Probability:** Low | **Impact:** High
**Mitigation:** Early accessibility review, screen reader testing

## Dependencies
- **Requires:** Design system components ready
- **Blocks:** Portfolio gallery mobile optimizations
- **Related:** Mobile contact form improvements

## Estimate: 8 Story Points
**Breakdown:**
- Design implementation: 3 SP
- Animation & interactions: 2 SP
- Accessibility features: 2 SP  
- Testing & polish: 1 SP

## Success Metrics
- **Mobile bounce rate**: <35% (down from current 45%)
- **Navigation clicks**: +40% increase w menu usage
- **Session duration**: +30% na mobile devices
- **Accessibility score**: 100 w Lighthouse
- **Touch response time**: <100ms average
- **User satisfaction**: 4.5/5 w mobile usability testing