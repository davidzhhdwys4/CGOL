# About

Deployed to https://davidzhhdwys4.github.io/CGOL/

I'm interested in learning how web apps can fill the role traditionally reserved for desktop apps. Attributes of this role, in my opinion, are
- High performance by running native code
- Offline availability, no internet required
- Local data storage

This project is an implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) that delves into each of these topics.

-- begin AI-generated content --

# Conway's Game of Life Web & WASM Project

This project is an interactive web-based implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), leveraging both Rust and Angular. The core simulation logic is written in Rust and compiled to WebAssembly (WASM) for high performance, while the user interface is built with Angular and Angular Material for a modern, responsive experience.

## Features

- **High-performance simulation:** The Game of Life logic is implemented in Rust and runs in the browser via WebAssembly.
- **Modern UI:** The frontend is built with Angular and Angular Material, providing a clean and intuitive interface.
- **Create and play games:** Start new games or load previously saved ones.
- **Save and load universes:** Persist your favorite patterns using IndexedDB (via Dexie.js).
- **Import/export:** Load universe states from PNG images or save your current universe as an image.
- **Responsive controls:** Play, pause, and interact with the universe grid in real time.

## Project Structure

- [`cgol-rust/`](cgol-rust/) — Rust crate containing the Game of Life logic, compiled to WASM for use in the web app.
- [`cgol-web/`](cgol-web/) — Angular frontend that loads the WASM module and provides the user interface.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Rust](https://www.rust-lang.org/) toolchain
- [wasm-pack](https://rustwasm.github.io/wasm-pack/) (for building the Rust WASM package)
- [Angular CLI](https://angular.io/cli)

### Build and Run

1. **Build the Rust WASM package:**
   ```sh
   cd cgol-rust
   wasm-pack build --target web --out-dir pkg
   ```

2. **Install frontend dependencies:**
   ```sh
   cd ../cgol-web
   npm install
   ```

3. **Start the Angular development server:**
   ```sh
   npm start
   ```
   Then open [http://localhost:4200](http://localhost:4200) in your browser.

## Usage

- Use the navigation drawer to start a new game, view saved games, or read about the project.
- Click on cells to toggle their state.
- Use the play/pause controls to run or stop the simulation.
- Save your universe to IndexedDB or load a previously saved one.

## Technologies Used

- **Rust** & **WASM** for simulation logic
- **Angular** & **Angular Material** for the frontend
- **Dexie.js** for IndexedDB storage
- **TypeScript** for frontend logic

## License

This project is licensed under the MIT License.

---

Enjoy exploring Conway's Game of Life in your browser!