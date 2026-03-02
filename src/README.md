# Bhakti Steps - React Native

A React Native (Expo) implementation of the Bhakti Steps spiritual progress tracking app for ISKCON London.

## Project Structure

```
bhakti-steps-rn/
├── App.js                      # Main entry with role switching
├── package.json                # Dependencies
├── app.json                    # Expo configuration
├── src/
│   ├── theme.js               # Design tokens (colors, spacing, typography)
│   ├── mockData.js            # Mock data for all roles
│   ├── components/
│   │   ├── Card.js            # Card variants (form, dashboard, attention)
│   │   ├── Button.js          # Button with haptics
│   │   ├── ToggleSwitch.js    # Animated toggle switch
│   │   ├── StepperControl.js  # Increment/decrement with haptics
│   │   ├── MoodChipGroup.js   # Mood selection chips
│   │   ├── HeaderBand.js      # App header with greeting
│   │   ├── BottomTabBar.js    # Floating tab navigation
│   │   └── BottomSheet.js     # Modal bottom sheets
│   └── screens/
│       ├── MenteeScreens.js   # Today, Progress, SevaBooks, Profile
│       ├── MentorScreens.js   # Dashboard, BatchDetail, MenteeDetail, Approvals
│       └── AdminScreens.js    # Dashboard, Users, Batches, Settings
```

## Features

### Design System
- **Colors**: Saffron (#E8732A), Cream (#FFF8F0), full palette per design spec
- **Typography**: Source Serif 4 (headings) + DM Sans (body)
- **Spacing**: 4dp base scale (xs:4, sm:8, md:12, lg:16, xl:24, etc.)
- **Components**: All components from §5 of design spec

### Screens by Role

**Mentee:**
- Today (Sadhana Form) - japa rounds, morning programme, books, mood, notes
- Progress - chart, stats, submission history
- Seva & Books - service logs, book tracker, courses
- Profile - personal details

**Mentor:**
- Dashboard - metrics, needs attention, batches
- Batch Detail - members, attendance grid, modules
- Mentee Detail - 5 sub-tabs (sadhana, seva, courses, attendance, notes)
- Approvals - pending course reviews
- Profile

**Admin:**
- Dashboard - 6 KPI cards
- Users - search, filter, list
- Batch Oversight - all batches, pending approvals
- Settings - reference data management

### Interactions
- Haptic feedback on buttons, toggles, steppers
- Animated tab switching
- Bottom sheets for forms
- Drill-down navigation (Dashboard → Batch → Mentee)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
i

# Run on Android emulator
a
```

## Demo Controls

The app includes a demo role switcher bar at the top:
- Tap **Mentee** / **Mentor** / **Admin** to switch roles
- Each role has its own tab navigation
- Drill-down screens work within each role context

## Design Spec Alignment

This implementation follows the Bhakti Steps UI/UX Design Specification v3.0:
- §1: Role Model (mutually exclusive roles)
- §2: Design Principles
- §4: Design Token System
- §5: Component Library
- §6: Screen-by-Screen Specifications
- §7: Motion Design (haptics, animations)

## Notes

- All data is mocked in `mockData.js`
- No backend connectivity
- No authentication flow
- Fonts need to be added to `assets/fonts/` before running