# Bhakti Steps

A React Native (Expo) spiritual progress tracking app for ISKCON London. Track sadhana, seva, book distribution, and courses across Mentee, Mentor, and Admin roles.

## Prerequisites

- **Node.js** 18 or later — [download here](https://nodejs.org/)
- **Expo Go** app on your phone — [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) | [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Run the Demo on Your Phone

1. **Clone the repo and install dependencies**

   ```bash
   git clone https://github.com/RyanZhang-64/bhakti-steps.git
   cd bhakti-steps
   npm install
   ```

2. **Start the dev server**

   ```bash
   npx expo start
   ```

3. **Open on your phone**

   - A QR code will appear in the terminal.
   - **Android** — Open the Expo Go app and tap "Scan QR code".
   - **iPhone** — Open your Camera app and point it at the QR code. Tap the Expo banner that appears.
   - Make sure your phone and computer are on the **same Wi-Fi network**.

4. **If Wi-Fi doesn't work** (e.g. corporate/university network blocking traffic)

   ```bash
   npx expo start --tunnel
   ```
   This routes traffic through an Expo tunnel so the QR code works even across different networks. You may be prompted to install `@expo/ngrok` — accept the install.

> **Tip:** The first load takes a moment while the JavaScript bundle is built. Subsequent reloads are faster.

## Demo Controls

The app includes a role switcher bar at the top of the screen:

- Tap **Mentee** / **Mentor** / **Admin** to switch between roles
- Each role has its own tab navigation and screens
- Drill-down navigation works within each role (e.g. Dashboard → Batch → Mentee)

## Screens by Role

| Role | Screens |
|------|---------|
| **Mentee** | Today (Sadhana Form), Progress, Seva & Books, Profile |
| **Mentor** | Dashboard, Batch Detail, Mentee Detail, Approvals, Profile |
| **Admin** | Dashboard, Users, Batch Oversight, Settings |

## Running on Emulators/Simulators (Optional)

If you prefer to use an emulator instead of a physical phone:

```bash
# iOS Simulator (macOS only, requires Xcode)
npx expo start --ios

# Android Emulator (requires Android Studio)
npx expo start --android
```

## Project Structure

```
├── App.js                 # Entry point with role switching
├── app.json               # Expo configuration
├── assets/fonts/          # DM Sans + Source Serif 4 font files
├── src/
│   ├── theme.js           # Design tokens (colors, spacing, typography)
│   ├── ThemeContext.js     # Theme provider
│   ├── mockData.js        # Mock data for all roles
│   ├── components/        # Reusable UI components
│   └── screens/           # Role-specific screen sets
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| QR code won't connect | Ensure phone and computer are on the same Wi-Fi, or use `--tunnel` mode |
| `expo: command not found` | Run `npm install` first — Expo is a project dependency |
| Fonts look wrong / fallback fonts | The required font files are already in `assets/fonts/`. If you see fallback fonts, try restarting the dev server |
| Red error screen on phone | Read the error message — usually a missing dependency. Run `npm install` and reload |
| Slow first load | Normal — the JS bundle is being built. Subsequent reloads are faster |

## Notes

- All data is mocked — no backend or authentication required
- Haptic feedback works on physical devices (not simulators)
- Built with Expo SDK 54, React Native 0.81