# Expense Tracker

Expo (React Native + Expo Router) app for tracking personal expenses. Data is stored on-device (AsyncStorage).

- **Categories** – add, rename/recolor, delete (blocked while expenses use it).
- **Add expense** – pick a category, amount and date, optional note.
- **Report** – current month (with ‹ › to pick any month) or a custom from/to period: total, per-category breakdown and the expense list (delete supported).

## Run

```bash
npm install
npx expo start      # scan the QR code with Expo Go, or press a / i / w
npm test            # unit tests for report/date logic
npm run typecheck
```
