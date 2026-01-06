# Neudit MD

**Neudit MD** is a lightweight, high-performance Markdown editor for Windows built with [Tauri v2](https://v2.tauri.app/). It features a beautiful **Neumorphic** design, a hybrid Rich Text/Split-Code editing experience, and full local file system integration.

![Neudit MD Screenshot](./screenshot.png) <!-- You can add a screenshot here later -->

## ✨ Features

*   **Neumorphic UI:** Soft shadows, rounded corners, and a clean, distraction-free aesthetic.
*   **Hybrid Editing Modes:**
    *   **Rich Editor:** WYSIWYG editing (Bold, Italic, Images) without seeing the syntax.
    *   **Split View:** Raw Markdown code on the left (Monaco font), Live Preview on the right.
    *   **View Mode:** A clean, paper-like reading experience.
*   **Local Image Handling:**
    *   Paste images from clipboard directly into the editor (saves to `./assets`).
    *   Insert images via file dialog.
    *   No broken links—uses custom Blob rendering for local assets.
*   **Math Support:** Renders LaTeX equations (e.g., `$E=mc^2$`) using Katex.
*   **Themes:** Switch between Classic, Glacier, Sepia, Rouge, and Holographic themes.
*   **Productivity:**
    *   Focus Mode (Hide UI).
    *   Search & Replace.
    *   Global Zoom (Ctrl +/-).
    *   Export to PDF (Clean print).

## 🛠 Tech Stack

*   **Core:** [Tauri v2](https://tauri.app) (Rust + WebView2)
*   **Frontend:** React (Vite)
*   **Styling:** Tailwind CSS (v4)
*   **Editor Engine:** TipTap (Headless Prosemirror wrapper)
*   **Rendering:** React-Markdown + Rehype-Katex

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or newer)
2.  **Rust** (Install via [rustup.rs](https://rustup.rs/))
3.  **Build Tools:**
    *   **Windows:** Microsoft Visual Studio C++ Build Tools.
    *   **Linux:** WebKit2GTK (see Linux section below).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/neudit-md.git
cd neudit-md
npm install