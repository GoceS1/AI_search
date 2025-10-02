# Travel AI Search

This is an AI-powered travel discovery platform designed to help users find their perfect journey through natural language search. The application leverages AI to interpret user queries, apply relevant filters, and display a curated list of travel experiences.

## ✨ Features

-   **AI-Powered Search**: Users can type complex queries in natural language (e.g., "luxury trips in Asia under $4000").
-   **Dynamic Filtering**: The AI automatically parses queries to generate filters for price, duration, destination, trip type, and more.
-   **Interactive UI**: A clean, responsive interface built with React and Tailwind CSS for a seamless user experience.
-   **Filter Management**: Users can view the filters applied by the AI and remove them to refine the search results.
-   **Fallback Logic**: Includes a robust fallback to keyword-based searching if the AI service is unavailable.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [OpenAI GPT-3.5 Turbo](https://openai.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Build Tool**: [Craco](https://craco.js.org/) for Create React App configuration overrides.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later recommended)
-   [npm](https://www.npmjs.com/)

### Environment Variables

This project requires an OpenAI API key to function. You'll need to create a `.env` file in the `travel-ai-search` directory and add your key.

1.  Create a new file named `.env` at the root of the `travel-ai-search` project.
2.  Add the following line to the file, replacing `your_openai_api_key_here` with your actual key:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### Installation & Running

1.  **Clone the repository**
    ```sh
    git clone https://github.com/GoceS1/AI_search.git
    cd AI_search/travel-ai-search
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Run the development server**
    The application will be available at `http://localhost:3000`.
    ```sh
    npm start
    ```

## 📂 Project Structure

```
travel-ai-search/
├── public/              # Static assets and index.html
├── src/
│   ├── components/      # Reusable UI components
│   ├── data/            # Static data like trip information
│   ├── services/        # AI service logic and API calls
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Entry point of the React app
├── .env                 # Environment variables (needs to be created)
├── craco.config.js      # Craco configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies and scripts
```
