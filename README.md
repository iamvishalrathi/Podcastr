<p align="center">
  <img src="https://github.com/iamvishalrathi/Podcastr/blob/main/public/icons/logo.svg" width="50" alt="PODCASTR-logo">
</p>
<p align="center">
    <h1 align="center">PODCASTR</h1>
</p>
<p align="center">
    <em><code><a href="https://podcastr-two-rho.vercel.app/">❯ Live</a></code></em>
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
- [🧩 Modules](#-modules)
- [🚀 Getting Started](#-getting-started)
    - [🔖 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
    - [🧪 Tests](#-tests)
- [📞 Contact](#-contact)

---

## 📍 Overview
A cutting-edge AI SaaS platform that enables users to create, discover, and enjoy podcasts with advanced features like text-to-audio conversion with multi-voice AI, podcast thumbnail Image generation and seamless playback.

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

---

## 🔍 Website Preview

You can explore Podcastr live by visiting the website:

[**Podcastr - Preview the App**](https://podcastr-two-rho.vercel.app/)

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

---

## 🧩 Modules

<details closed><summary>.</summary>

| File | Summary |
| --- | --- |
| [middleware.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/middleware.ts) | <code>❯ REPLACE-ME</code> |
| [postcss.config.mjs](https://github.com/iamvishalrathi/Podcastr/blob/main/postcss.config.mjs) | <code>❯ REPLACE-ME</code> |
| [tailwind.config.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/tailwind.config.ts) | <code>❯ REPLACE-ME</code> |
| [components.json](https://github.com/iamvishalrathi/Podcastr/blob/main/components.json) | <code>❯ REPLACE-ME</code> |
| [sampleData.jsonl](https://github.com/iamvishalrathi/Podcastr/blob/main/sampleData.jsonl) | <code>❯ REPLACE-ME</code> |
| [tsconfig.json](https://github.com/iamvishalrathi/Podcastr/blob/main/tsconfig.json) | <code>❯ REPLACE-ME</code> |
| [package.json](https://github.com/iamvishalrathi/Podcastr/blob/main/package.json) | <code>❯ REPLACE-ME</code> |
| [next.config.mjs](https://github.com/iamvishalrathi/Podcastr/blob/main/next.config.mjs) | <code>❯ REPLACE-ME</code> |
| [package-lock.json](https://github.com/iamvishalrathi/Podcastr/blob/main/package-lock.json) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>constants</summary>

| File | Summary |
| --- | --- |
| [index.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/constants/index.ts) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>types</summary>

| File | Summary |
| --- | --- |
| [index.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/types/index.ts) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>components</summary>

| File | Summary |
| --- | --- |
| [GenerateThumbnail.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/GenerateThumbnail.tsx) | <code>❯ REPLACE-ME</code> |
| [ProfileCard.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ProfileCard.tsx) | <code>❯ REPLACE-ME</code> |
| [PodcastPlayer.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/PodcastPlayer.tsx) | <code>❯ REPLACE-ME</code> |
| [PodcastCard.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/PodcastCard.tsx) | <code>❯ REPLACE-ME</code> |
| [Header.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/Header.tsx) | <code>❯ REPLACE-ME</code> |
| [Searchbar.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/Searchbar.tsx) | <code>❯ REPLACE-ME</code> |
| [Carousel.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/Carousel.tsx) | <code>❯ REPLACE-ME</code> |
| [RightSidebar.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/RightSidebar.tsx) | <code>❯ REPLACE-ME</code> |
| [MobileNav.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/MobileNav.tsx) | <code>❯ REPLACE-ME</code> |
| [EmptyState.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/EmptyState.tsx) | <code>❯ REPLACE-ME</code> |
| [EmblaCarouselDotButton.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/EmblaCarouselDotButton.tsx) | <code>❯ REPLACE-ME</code> |
| [LeftSidebar.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/LeftSidebar.tsx) | <code>❯ REPLACE-ME</code> |
| [PodcastDetailPlayer.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/PodcastDetailPlayer.tsx) | <code>❯ REPLACE-ME</code> |
| [GeneratePodcast.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/GeneratePodcast.tsx) | <code>❯ REPLACE-ME</code> |
| [LoaderSpinner.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/LoaderSpinner.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>components.ui</summary>

| File | Summary |
| --- | --- |
| [toaster.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/toaster.tsx) | <code>❯ REPLACE-ME</code> |
| [use-toast.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/use-toast.ts) | <code>❯ REPLACE-ME</code> |
| [label.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/label.tsx) | <code>❯ REPLACE-ME</code> |
| [textarea.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/textarea.tsx) | <code>❯ REPLACE-ME</code> |
| [sheet.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/sheet.tsx) | <code>❯ REPLACE-ME</code> |
| [toast.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/toast.tsx) | <code>❯ REPLACE-ME</code> |
| [progress.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/progress.tsx) | <code>❯ REPLACE-ME</code> |
| [select.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/select.tsx) | <code>❯ REPLACE-ME</code> |
| [input.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/input.tsx) | <code>❯ REPLACE-ME</code> |
| [button.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/button.tsx) | <code>❯ REPLACE-ME</code> |
| [form.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/components/ui/form.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>providers</summary>

| File | Summary |
| --- | --- |
| [ConvexClerkProvider.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/providers/ConvexClerkProvider.tsx) | <code>❯ REPLACE-ME</code> |
| [AudioProvider.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/providers/AudioProvider.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>convex</summary>

| File | Summary |
| --- | --- |
| [podcasts.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/podcasts.ts) | <code>❯ REPLACE-ME</code> |
| [schema.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/schema.ts) | <code>❯ REPLACE-ME</code> |
| [unreal.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/unreal.ts) | <code>❯ REPLACE-ME</code> |
| [auth.config.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/auth.config.ts) | <code>❯ REPLACE-ME</code> |
| [users.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/users.ts) | <code>❯ REPLACE-ME</code> |
| [freepik.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/freepik.ts) | <code>❯ REPLACE-ME</code> |
| [http.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/http.ts) | <code>❯ REPLACE-ME</code> |
| [files.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/files.ts) | <code>❯ REPLACE-ME</code> |
| [openai.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/openai.ts) | <code>❯ REPLACE-ME</code> |
| [tasks.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/tasks.ts) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>convex._generated</summary>

| File | Summary |
| --- | --- |
| [api.js](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/_generated/api.js) | <code>❯ REPLACE-ME</code> |
| [dataModel.d.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/_generated/dataModel.d.ts) | <code>❯ REPLACE-ME</code> |
| [server.js](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/_generated/server.js) | <code>❯ REPLACE-ME</code> |
| [api.d.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/_generated/api.d.ts) | <code>❯ REPLACE-ME</code> |
| [server.d.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/convex/_generated/server.d.ts) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>lib</summary>

| File | Summary |
| --- | --- |
| [utils.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/lib/utils.ts) | <code>❯ REPLACE-ME</code> |
| [formatTime.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/lib/formatTime.ts) | <code>❯ REPLACE-ME</code> |
| [useDebounce.ts](https://github.com/iamvishalrathi/Podcastr/blob/main/lib/useDebounce.ts) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app</summary>

| File | Summary |
| --- | --- |
| [globals.css](https://github.com/iamvishalrathi/Podcastr/blob/main/app/globals.css) | <code>❯ REPLACE-ME</code> |
| [layout.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/layout.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(auth)</summary>

| File | Summary |
| --- | --- |
| [layout.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(auth)/layout.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(auth).sign-in.[[...sign-in]]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(auth)/sign-in/[[...sign-in]]/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(auth).sign-up.[[...sign-up]]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(auth)/sign-up/[[...sign-up]]/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(root)</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/page.tsx) | <code>❯ REPLACE-ME</code> |
| [layout.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/layout.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(root).discover</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/discover/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(root).create-podcast</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/create-podcast/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(root).profile.[profileId]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/profile/[profileId]/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

<details closed><summary>app.(root).podcasts.[podcastId]</summary>

| File | Summary |
| --- | --- |
| [page.tsx](https://github.com/iamvishalrathi/Podcastr/blob/main/app/(root)/podcasts/[podcastId]/page.tsx) | <code>❯ REPLACE-ME</code> |

</details>

---

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
