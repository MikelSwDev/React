# Task 3 — Answers

## 1. What does the `visible` prop of `Modal` do and why do we control it with `useState`?

`visible` decides whether the modal is on screen: `true` shows it, `false` hides it. `Modal` keeps no open/closed state of its own, so we store that value in `useState`. Changing the state re-renders the component, and the modal appears or disappears as a result.

## 2. What is `onRequestClose` for? What happens on Android if you do not close the modal in it?

`onRequestClose` is called when the system asks to dismiss the modal, mainly when the user presses the Android *back* button. It is only a request: the modal stays open unless we set `visible` to `false` inside it. If we don't, the back button does nothing and the user feels stuck, which is why we pass `closeModal` to it.

## 3. What is the effect of `transparent={true}`? Name the three values of `animationType`.

With `transparent={true}` the modal does not paint its own opaque background, so the screen behind it stays visible. Our overlay (black at 50% opacity) then dims it and the card sits on top. The three values of `animationType` are `none`, `slide` and `fade`.

## 4. Why does `ScrollView` exist? What happens with a long `View` without it? When would you choose `FlatList` instead?

In React Native a `View` never scrolls, so content taller or wider than the screen is cut off and the user can't reach it. `ScrollView` makes its content scrollable, vertically or horizontally. It renders all of its children at once, so for long or unknown-length lists (for example data from an API) `FlatList` is better, because it only renders the items that are visible.

## 5. What is the difference between the `style` and the `contentContainerStyle` props of a `ScrollView`?

`style` applies to the scroll container itself, the fixed "window" you look through: its size, background, border or `maxHeight` (like `contactList`). `contentContainerStyle` applies to the inner view that wraps the children and moves when you scroll: padding, alignment, `gap` or `flexGrow` (like `projectsRow`, where the `gap` separates the cards).

## 6. What is `SafeAreaView` for and which zones of the device does it protect? Why do we use `react-native-safe-area-context`?

`SafeAreaView` adds padding so the content stays inside the area the user can actually see and touch. It protects the notch or camera cutout, the status bar, the home indicator on iPhones, rounded corners and the Android navigation bar. We use `react-native-safe-area-context` because it works on both iOS and Android and is the option Expo recommends; the `SafeAreaView` built into React Native only works on iOS and is deprecated.

## 7. Best practices from Step 5, and when a modal is not a good idea

- **Use modals sparingly:** only one modal on the screen, and only for a short, focused action (like choosing who to share the profile with).
- **Keep `ScrollView` content limited:** our lists are small (5 projects, 8 contacts), so rendering everything at once is fine. Large lists should use `FlatList`.
- **Respect the safe area:** the whole screen is wrapped in `SafeAreaView` so nothing is hidden behind the notch or the system bars.

A modal is **not** a good idea for long or main content, for example showing the full profile or a long multi-step form in a modal. That should be its own screen, because modals block the rest of the app and are meant to be closed quickly. Opening a modal on top of another modal is also a bad idea.
