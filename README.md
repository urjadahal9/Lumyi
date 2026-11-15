# LUMYI 

**Making overlooked climate vulnerabilities visible.**

---

##  About Lumyi

Climate-related risks do not affect every community equally.

Communities with limited accessibility, inadequate geographical data, and exposure to changing rainfall patterns may remain overlooked during climate-risk assessment and disaster preparedness.

**Lumyi** is a climate vulnerability intelligence platform designed to bring these invisible vulnerabilities into focus.

It combines rainfall information, accessibility indicators, geographical mapping gaps, and community observations to highlight locations that may require greater attention.

Our goal is to make climate-risk awareness more inclusive by considering not only environmental exposure but also the vulnerabilities that can make communities more difficult to reach and support.

##  The Problem

Traditional climate-risk assessments may overlook important differences between communities.

For example:
- Two locations may experience similar rainfall but have very different levels of accessibility.
- Some communities may have limited geographical information available.
- Areas with inadequate infrastructure may face additional challenges during emergencies.
- Community-level observations may not be reflected in broader assessments.

Lumyi explores how combining these factors can provide a more comprehensive approach to climate vulnerability prioritisation.

##  What Lumyi Does

- **Rainfall Monitoring:** Retrieves precipitation forecast information for selected geographical locations.
- **Accessibility Indicators:** Incorporates hospital-access difficulty indicators.
- **Geographical Data Gaps:** Considers mapping-coverage gaps as an additional prioritisation factor.
- **Community Observations:** Accepts text-based reports and identifies potential concerns using predefined keywords.
- **Vulnerability Prioritisation:** Combines multiple indicators into a visual prioritisation score.

##  How It Works

Lumyi currently uses a transparent, rule-based weighted scoring system.

The prioritisation formula combines three indicators:

| Indicator | Weight |
|---|---:|
| Rainfall signal | 50% |
| Hospital-access difficulty | 30% |
| Geographical mapping-data gap | 20% |

The application generates a combined score out of 100 and categorises locations into Low, Moderate, or High priority levels.

Community reports are additionally analysed using predefined keyword matching to identify potential concerns such as flooding, blocked roads, heavy rainfall, and water shortages.

**Important:** The current prototype does not use a trained machine-learning model. Some accessibility and mapping indicators are illustrative inputs rather than verified real-world measurements. The prioritisation score is not an official disaster warning or a validated prediction of disaster probability.

##  Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| React DOM | Rendering the application |
| Vite | Development and build tooling |
| Lucide React | Icons and interface elements |
| Open-Meteo API | Daily precipitation forecast data |
| JavaScript | Application logic and scoring system |

##  Data Sources

- [Open-Meteo Weather API](https://open-meteo.com/en/docs) — precipitation forecast information.
- Hospital-access and geographical mapping indicators — illustrative values manually defined in the current prototype.
- Community observations — text entered by users.

## Getting Started

To run Lumyi locally:

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/urjadahal9/Lumyi.git
```

2. Navigate into the project directory:

```bash
cd Lumyi
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### Production Build

To generate an optimised production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

##  Future Development

We aim to expand Lumyi through:

- Integration of verified, higher-resolution local climate and geographical datasets.
- Incorporation of historical disaster records and accessibility information.
- Development and evaluation of a trained machine-learning model.
- Improved multilingual community-report analysis.
- Validation across different geographical and community conditions.
- Better decision-support features for local authorities and disaster preparedness organisations.

##  Intended Users

- Local authorities
- Disaster preparedness organisations
- Climate-risk researchers
- Community development organisations

##  Project Information

**Project:** Lumyi — The Invisible Crisis Detector  
**Track:** AI + Climate  
**Project Type:** Original project idea  
**Developer:** [Your Full Name]

##  Acknowledgements

- Open-Meteo for providing weather forecast data.
- React, Vite, and Lucide React for development tools and libraries.
- ChatGPT (OpenAI) for development guidance, debugging assistance, and documentation support.

---

**Lumyi — Because the communities most overlooked should not remain invisible.** 🌍
