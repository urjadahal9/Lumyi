# Lumyi — Invisible Crisis Detector

A responsive React + Vite prototype for exploring environmental signals, community reports, and underserved-community indicators in Nepal.

## Important honesty note

This is a hackathon prototype, not an operational emergency-warning system.

- **Connected live source:** Open-Meteo daily precipitation forecast for the selected location.
- **Rule-based demo:** Community report keyword matching. This is not a trained NLP model.
- **Illustrative inputs:** Hospital-access difficulty and mapped-data coverage values are sample inputs for interface demonstration.
- **Not implemented:** Satellite computer vision, historical disaster ingestion, river-discharge integration, and a trained/validated disaster-prediction model.
- **Scores:** The combined score is a transparent prioritisation indicator, not a calibrated probability of a disaster.

Never use this prototype as the sole basis for emergency decisions.

## Run in VS Code

1. Install **Node.js LTS** from https://nodejs.org/.
2. Download and unzip this project.
3. Open VS Code.
4. Select **File → Open Folder** and choose the `lumyi-rebuilt` folder.
5. Open **Terminal → New Terminal**.
6. Run:

   ```bash
   npm install
   ```

7. Start the local website:

   ```bash
   npm run dev
   ```

8. Vite prints a local address, usually `http://localhost:5173`. Ctrl-click it or copy it into your browser.
9. To stop the server, click the terminal and press `Ctrl + C`.

## Build check

Run:

```bash
npm run build
```

The production website is created in the `dist` folder. Preview it with:

```bash
npm run preview
```

## Upload to GitHub

### Option A — VS Code source control

1. Create a new **empty** repository on GitHub. Do not add a README there because this project already has one.
2. Open this folder in VS Code.
3. Click the Source Control icon on the left.
4. Click **Initialize Repository**.
5. Stage the files using the `+` next to Changes.
6. Enter a commit message such as `Build Lumyi crisis detector prototype`.
7. Click **Commit**.
8. Click **Publish Branch** / **Publish to GitHub** and follow the sign-in prompts.
9. Open the repository on GitHub and confirm `src`, `package.json`, and `README.md` are visible.

### Option B — Git terminal

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details:

```bash
git init
git add .
git commit -m "Build Lumyi crisis detector prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

If Git asks you to authenticate, complete the browser sign-in flow.

## Deploy with GitHub Pages (optional)

This Vite project needs a build/deployment step; simply uploading source files to GitHub does not publish the running site. The simplest beginner-friendly option is to connect the GitHub repository to a static hosting service that supports Vite builds. Use:
- Build command: `npm run build`
- Output directory: `dist`

## How the demo score works

`src/App.jsx` contains the transparent formula:

`combined = 0.50 × rainfall signal + 0.30 × access input + 0.20 × mapped-data-gap input`

The rainfall signal is scaled from the forecast amount using a simple illustrative scale. Access and mapping inputs are hand-entered sample values in the `PLACES` array. These weights and inputs are **not scientifically validated**. Do not report the score as model accuracy or disaster probability.

## Project structure

```text
lumyi-rebuilt/
├── index.html
├── package.json
├── README.md
├── .gitignore
└── src/
    ├── App.jsx
    ├── main.jsx
    └── style.css
```

## Suggested next research steps

1. Obtain a properly documented historical disaster dataset.
2. Define a prediction target and a time window before training anything.
3. Split data by time or geography so test examples are genuinely unseen.
4. Compare against a simple rainfall-only baseline.
5. Report precision, recall, false alarms, missed events, and uncertainty.
6. Test whether coverage gaps create unequal errors across communities.
7. Ask domain experts and local authorities to review the design before any real-world use.
