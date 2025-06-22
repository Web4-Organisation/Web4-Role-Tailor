# Web4RoleTailor

Welcome to **Web4RoleTailor**, an intelligent tool designed to help you define user roles and permissions for your applications with ease. By leveraging AI, Web4RoleTailor guides you through an interactive process, suggesting roles and generating ready-to-use configuration files in JSON or YAML format.

## ✨ Features

- **🤖 AI-Powered Role Suggestions**: Describe your application, and our AI will suggest a set of relevant user roles to get you started.
- **📝 Intuitive Role Editor**: A user-friendly interface to create, edit, and delete roles, manage their permissions, and define inheritance.
- **🎨 Visual Role Hierarchy**: Instantly understand the relationships between roles with a clear and interactive hierarchy visualization.
- **📄 Configuration File Generation**: Generate valid and well-formatted JSON or YAML configuration files based on your defined roles.
- **📋 Copy & Download**: Easily copy the generated configuration to your clipboard or download it as a file to integrate into your project.
- **💅 Beautifully Designed**: A clean, modern interface with a thoughtful color palette and typography to make your work pleasant and productive.

## 🚀 Getting Started

To get the application up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/web4-roletailor.git
    cd web4-roletailor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your necessary environment variables, such as your Genkit/Google AI API keys.
    ```
    GOOGLE_API_KEY=your_google_ai_api_key
    ```
    
4. **Start the development server:**
    The Genkit flows are part of the Next.js application, so you only need to run the Next.js dev server.
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 🛠️ How to Use

1.  **Describe Your App**: On the main page, you'll find a text area. Write a description of your application and its users' needs.
2.  **Get AI Suggestions**: Click the "Suggest Roles with AI" button. The AI will analyze your description and populate the editor with a suggested set of roles.
3.  **Refine Roles**: Use the "Define Roles" editor to add new roles, modify the suggested ones, or delete them. You can define permissions and inheritance for each role.
4.  **Visualize**: As you edit roles, the "Role Hierarchy" panel on the right will update in real-time, showing you a visual representation of your role structure.
5.  **Generate Config**: Once you are satisfied with your roles, go to the "Generate Configuration" panel.
6.  **Choose Format**: Select either JSON or YAML as your desired output format.
7.  **Export**: Click "Generate" and then use the "Copy" or "Download" buttons to get your configuration file.

---

Built with Next.js, Genkit, and shadcn/ui.
