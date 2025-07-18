


# ![logo.png](logo.png)DAssigner AI


An AI-powered design tool that generates stunning UI designs and corresponding HTML code from natural language prompts, supporting both text and voice input.

## 🌟 Features

- **AI-Powered Design Generation**: Generate UI designs from natural language prompts.
- **Voice Input Support**: Use voice commands to describe your design.
- **Code Conversion**: Convert generated HTML to React or Vue components.
- **Real-Time Preview**: See your designs come to life in real-time.
- **Code Export**: Export your designs as HTML, React, or Vue code.
- **Responsive Design**: Ensure your designs look great on any device.

## 🚀 Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/dassigner-ai.git
   cd dassigner-ai
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.**

4. **Run the app:**

   ```sh
   npm run dev
   ```

## 🎨 Usage

1. **Set Your API Key**: Configure your Google Gemini API key in the settings.
2. **Describe Your Design**: Use text or voice input to describe the UI component or webpage you want to create.
3. **Generate Design**: Let DAssigner AI generate the design and corresponding HTML code.
4. **Preview and Edit**: Preview the design in real-time and make any necessary adjustments.
5. **Export Code**: Export the final design as HTML, React, or Vue code.

## 📁 Project Structure

```
├── README.md
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── tsconfig.json
├── types.ts
├── vite.config.ts
├── components/
│   ├── CodePreview.tsx
│   ├── MainContent.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── Toast.tsx
│   ├── VisualPreview.tsx
│   └── icons/
│       └── Icons.tsx
├── hooks/
│   └── useVoiceRecognition.ts
├── services/
│   └── geminiService.ts
└── src/
    └── styles/
        └── global.css
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch for your feature or bug fix.**

   ```sh
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit them with descriptive messages.**

   ```sh
   git commit -m "Add your commit message here"
   ```

4. **Push your changes to your fork.**

   ```sh
   git push origin feature/your-feature-name
   ```

5. **Submit a pull request to the main repository.**



## 📅 Changelog

### Version 1.0.0

- Initial release of DAssigner AI.
- Added support for text and voice input.
- Integrated code conversion for React and Vue.
- Real-time preview and code export functionality.

### Version 1.1.0

- Improved AI-powered design generation.
- Enhanced voice input support.
- Added more customization options for code conversion.
- Bug fixes and performance improvements.

---

## 📋 Roadmap

### Upcoming Features

- **Advanced Design Customization**: More options for customizing designs.
- **Collaboration Tools**: Real-time collaboration with team members.
- **Template Library**: A library of pre-designed templates for quick start.
- **Enhanced Analytics**: More detailed analytics and reporting.

### Future Enhancements

- **AI-Powered Suggestions**: AI-driven suggestions for improving designs.
- **Integration with Design Tools**: Seamless integration with popular design tools.
- **Mobile App**: A dedicated mobile app for on-the-go design.
- **Community Features**: Features for sharing and discovering designs within the community.

---

