<p align="center">
  <img src="https://github.com/iamvishalrathi/Podcastr/blob/main/public/icons/logo.svg" width="50" alt="PODCASTR-logo">
</p>
<p align="center">
    <h1 align="center">PODCASTR</h1>
</p>
<p align="center">
    <em><code><a href="https://my-podcastr.vercel.app/" target="_blank" >❯ Live</a></code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/iamvishalrathi/Podcastr?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/iamvishalrathi/Podcastr?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/iamvishalrathi/Podcastr?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/iamvishalrathi/Podcastr?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_._JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-OpenAI-black?style=for-the-badge&logoColor=white&logo=openai&color=412991" alt="openai" />
</p>

<br>

##### 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [⚙️ Tech Stack](#tech-stack)
- [🔍 Website Preview](#-website-preview)
- [📂 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
    - [🔖 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
    - [🧪 Tests](#-tests)
- [📞 Contact](#-contact)

---

## 📍 Overview
A cutting-edge AI SaaS platform that enables users to create, discover, and enjoy podcasts with advanced features like text-to-audio conversion with multi-voice AI, podcast thumbnail image generation and seamless playback.

---

## 👾 Features

- **Robust Authentication** : Secure and reliable user login and registration system.

- **Modern Home Page** : Showcases trending podcasts with a sticky podcast player for continuous listening.

- **Discover Podcasts Page** : Dedicated page for users to explore new and popular podcasts.

- **Fully Functional Search** : Allows users to find podcasts easily using various search criteria.

- **Create Podcast Page** : Enables podcast creation with text- **to- **audio conversion, AI image generation, and previews.

- **Multi Voice AI Functionality** : Supports multiple AI- **generated voices for dynamic podcast creation.

- **Profile Page** : View all created podcasts with options to delete them.

- **Podcast Details Page** : Displays detailed information about each podcast, including creator details, number of listeners, and transcript.

- **Podcast Player** : Features backward/forward controls, as well as mute/unmute functionality for a seamless listening experience.

- **Responsive Design** : Fully functional and visually appealing across all devices and screen sizes.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- Convex
- OpenAI
- Clerk
- ShadCN
- Tailwind CSS
- Freepik

---

## 🔍 Website Preview

You can explore Podcastr live by visiting the website:

[**Podcastr - Preview the App**](https://my-podcastr.vercel.app/)

### 📸 Screenshot
![image](https://github.com/iamvishalrathi/Podcastr/blob/main/public/sns.png)

---

## 📂 Repository Structure

```sh
└── Podcastr/
    ├── README.md
    ├── app
    │   ├── (auth)
    │   ├── (root)
    │   ├── globals.css
    │   └── layout.tsx
    ├── components
    │   ├── Carousel.tsx
    │   ├── EmblaCarouselDotButton.tsx
    │   ├── EmptyState.tsx
    │   ├── GeneratePodcast.tsx
    │   ├── GenerateThumbnail.tsx
    │   ├── Header.tsx
    │   ├── LeftSidebar.tsx
    │   ├── LoaderSpinner.tsx
    │   ├── MobileNav.tsx
    │   ├── PodcastCard.tsx
    │   ├── PodcastDetailPlayer.tsx
    │   ├── PodcastPlayer.tsx
    │   ├── ProfileCard.tsx
    │   ├── RightSidebar.tsx
    │   ├── Searchbar.tsx
    │   └── ui
    ├── components.json
    ├── constants
    │   └── index.ts
    ├── convex
    │   ├── _generated
    │   ├── auth.config.ts
    │   ├── files.ts
    │   ├── freepik.ts
    │   ├── http.ts
    │   ├── openai.ts
    │   ├── podcasts.ts
    │   ├── schema.ts
    │   ├── tasks.ts
    │   ├── unreal.ts
    │   └── users.ts
    ├── lib
    │   ├── formatTime.ts
    │   ├── useDebounce.ts
    │   └── utils.ts
    ├── middleware.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── providers
    │   ├── AudioProvider.tsx
    │   └── ConvexClerkProvider.tsx
    ├── public
    │   ├── Amy.mp3
    │   ├── Dan.mp3
    │   ├── Liv.mp3
    │   ├── Scarlett.mp3
    │   ├── Will.mp3
    │   ├── icons
    │   └── images
    ├── sampleData.jsonl
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── types
        └── index.ts
```

## 🚀 Getting Started

### 🔖 Prerequisites

**TypeScript**: `version x.y.z`

### 📦 Installation

Build the project from source:

1. Clone the Podcastr repository:
```sh
❯ git clone https://github.com/iamvishalrathi/Podcastr
```

2. Navigate to the project directory:
```sh
❯ cd Podcastr
```

3. Install the required dependencies:
```sh
❯ npm install
```

### 🤖 Usage

To run the project, execute the following command:

```sh
❯ npm run build && node dist/main.js
```

### 🧪 Tests

Execute the test suite using the following command:

```sh
❯ npm test
```

---

## **📞 Contact**
For any questions, suggestions, or feedback, feel free to reach out:
- **Email:** [rajatrathi029@gmail.com](mailto:rajatrathi029@gmail.com)
