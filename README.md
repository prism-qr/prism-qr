# Prism QR / Dynamic Link

> **The High-Performance IoT Redirection Engine.**

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Performance](https://img.shields.io/badge/performance-blazing%20fast-brightgreen.svg)

## 📖 Overview

**Prism QR** is a blazing fast, open-source dynamic link/QR code management system designed for the **IoT era**. It features a powerful **Redirection Engine** capable of handling high-volume traffic with minimal latency. Prism QR delivers instant redirects and robust API controls.

## ✨ Key Features

-   **⚡ Blazing Fast Redirection Engine**: Optimized for speed and low latency, ensuring instant user redirection.
-   **🌐 IoT-Ready API**: Full programmatic control over your QR codes and links, perfect for integrating with smart devices and automated workflows.
-   **🔄 Dynamic Linking**: Update destination URLs instantly in real-time without changing the physical QR code.
-   **🆓 Free & Open Source**: No hidden fees, no subscription locks. You own your data and your infrastructure.
-   **📊 Link Management**: Centralized dashboard to manage all your dynamic links.
-   **🔐 Secure Authentication**: Robust user authentication system.

## 🛠️ Tech Stack

This project is a **monorepo** built for performance and scalability.

### 🎨 Frontend (`apps/frontend`)

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Icons**: [Lucide React](https://lucide.dev/)

### ⚙️ Backend (`apps/backend`)

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Language**: TypeScript
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: JWT (JSON Web Tokens)
-   **Documentation**: Swagger / OpenAPI

## 📂 Project Structure

```bash
.
├── apps
│   ├── frontend    # Next.js web application
│   └── backend     # NestJS API server (Redirection Engine)
├── package.json    # Root dependencies and scripts
└── README.md       # Project documentation
```

## 🚀 Getting Started

Follow these steps to deploy your own instance.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **yarn** or **pnpm**
-   **MongoDB** (running locally or a cloud instance URI)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd dynamic-link
    ```

2.  **Install dependencies:**

    Navigate to the root directory and install dependencies for all workspaces.

    ```bash
    npm install
    ```

### Running the Application

You can run the frontend and backend independently.

#### Frontend

1.  Navigate to the frontend directory:

    ```bash
    cd apps/frontend
    ```

2.  Start the development server:

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:3000`.

#### Backend

1.  Navigate to the backend directory:

    ```bash
    cd apps/backend
    ```

2.  Set up environment variables:
    Create a `.env` file in `apps/backend` and configure your MongoDB URI and other secrets.

3.  Start the development server:

    ```bash
    npm run start:dev
    ```

    The API will be available at `http://localhost:3001` (default NestJS port, check `main.ts` to confirm).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
