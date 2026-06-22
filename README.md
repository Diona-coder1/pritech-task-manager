# PRITECH Task Manager

React Native task manager app built for the PRITECH React Native technical challenge.

## Features

- Task list screen with empty state
- Add a new task with input validation
- Mark tasks as completed or active
- Delete tasks
- Task details screen
- Search tasks by title
- Filter tasks by status
- Persist tasks locally with AsyncStorage
- Fetch task suggestions from the public DummyJSON API
- Simple navigation between screens

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- React Navigation
- AsyncStorage

## Setup

```bash
npm install
npm start
```

Then open the project with Expo Go on a physical device, or run it on an emulator:

```bash
npm run android
```

For iOS on macOS:

```bash
npm run ios
```

## What Was Implemented

The app manages personal tasks with title, description, status, and created date. Tasks are stored locally on the device, so they remain available after restarting the app. The home screen includes search and status filtering, plus task suggestions loaded from a public API. Users can open each task in a details screen, toggle its completion status, or delete it.

## Notes

The public API used in this project is:

```text
https://dummyjson.com/todos?limit=5&skip=10
```
