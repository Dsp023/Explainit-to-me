# 🚀 The "Explain It To Me" Engine

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

An intelligent web application that transforms complex text into simple, easy-to-understand explanations using the power of AI. Built with React, Vite, and Tailwind CSS, and powered by the Groq API for lightning-fast responses.


---

## ✨ Features

- **🤖 AI-Powered Explanations**: Leverages the Groq API to provide high-quality explanations for any text you provide.
- **🎚️ Adjustable Complexity**: Choose from five different explanation levels, from a simple explanation for a child to an expert-level breakdown.
- **🎨 Sleek & Modern UI**: A beautiful and responsive interface built with Tailwind CSS, providing a great user experience.
- **⚡ Blazing Fast**: Built with Vite for a rapid development experience and optimized performance.
- **📥 Export & Clear**: Easily clear the text and explanation, or export the generated explanation to a `.txt` file.
- **🔒 Secure API Key Handling**: Uses environment variables to keep your API keys safe and secure.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Groq API](https://groq.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Dsp023/Explain-It-To-Me.git
    cd Explain-It-To-Me
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of your project and add your Groq API key:
    ```env
    VITE_GROQ_API_KEY=YOUR_API_KEY_HERE
    ```
    You can get a free API key from [Groq](https://console.groq.com/keys).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

---

## 📖 Usage

1.  Paste the text you want to be explained into the "Your Text" text area.
2.  Use the slider to select your desired level of explanation.
3.  Click the "Explain" button.
4.  The explanation will appear in the "Explanation" section below.
5.  Use the "Clear" button to reset the fields or the "Export" button to save the explanation as a text file.

---

## 👤 Author

**Nakka Devi Sri Prasad**

- GitHub: [@Dsp023](https://github.com/Dsp023)

---
