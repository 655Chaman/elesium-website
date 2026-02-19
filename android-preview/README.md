# Elesium Website - Android Preview

This is a minimal Android app that wraps your local Vite dev server in a WebView.

## Setup & Run

1.  **Start Vite Dev Server** (in your terminal):
    ```bash
    npm run dev -- --host
    ```
    *(The `--host` flag is critical so the Android emulator can access your Mac's localhost)*

2.  **Open in Android Studio**:
    - Open Android Studio
    - Select **Open** and choose this `android-preview` folder

3.  **Create Emulator (if needed)**:
    - Go to **Tools > Device Manager**
    - Click **+** (Create Virtual Device)
    - Select a phone (e.g., Pixel 8) and a system image (e.g., API 34)
    - Finish

4.  **Run the App**:
    - Select your device in the top toolbar
    - Click the **Run ▶️** button

The app will launch and load `http://10.0.2.2:5173`, showing your live website.
