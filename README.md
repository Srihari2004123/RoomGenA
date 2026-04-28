🏡 RoomGenAI

RoomGenAI is an AI-powered interior visualization web application that transforms room images into realistic 3D-style redesigned spaces using generative AI. Users can upload a room image and instantly generate a modern, enhanced visualization, compare before/after, and export results.

✨ Features
🎨 AI-powered room redesign (image → 3D-style render)
🧠 Gemini-based image generation integration
📸 Before / After comparison slider
💾 Save and manage projects
📤 Export generated designs as images
🔗 Shareable project links (via ID routing)
⚡ Fast modern React + Vite frontend
☁️ Cloud-based storage using Puter.js worker APIs
🧱 Tech Stack
Frontend
React 18+
TypeScript
React Router (file-based routing)
Vite
Tailwind CSS (or custom CSS)
Lucide Icons
AI & Backend
Puter.js AI API
Gemini 2.5 Flash Image Model
Custom Puter Worker API (KV storage)
Image hosting service integration
UI Libraries
react-compare-slider (before/after comparison)
📁 Project Structure
app/
└── routes/
├── home.tsx
├── root.tsx
├── routes.ts
└── visualizer.$id.tsx

lib/
├── ai.action.ts
├── puter.action.ts
├── puter.hosting.ts
└── utils.ts

components/
└── ui/
└── Button.tsx
🚀 Getting Started
1. Clone the repository
   git clone https://github.com/your-username/roomgenai.git
   cd roomgenai
2. Install dependencies
   npm install
3. Set environment variables

Create a .env file:

VITE_PUTER_WORKER_URL=your_worker_url_here
4. Run development server
   npm run dev
   🧠 How It Works
   User uploads a room image
   Image is converted to base64
   Sent to Gemini AI via Puter.js
   AI generates a redesigned room
   Result is stored in KV database
   User can view:
   Original image
   AI-generated design
   Before/After comparison slider
   🖼️ Visualizer Page

Dynamic route:

/visualizer/:id

Features:

AI rendering status
Side-by-side comparison
Export image
Project persistence
⚙️ AI Model

Uses:

gemini-2.5-flash-image-preview

Prompt-driven transformation:

Converts interior images into modern, realistic architectural redesigns.

💾 Data Storage
Projects stored using Puter KV storage
Images hosted via Puter hosting service
Each project has:
id
sourceImage
renderedImage
ownerId
timestamp
📤 Export Feature

Users can download generated designs:

PNG format
Auto-named: roomify-{id}.png
🔮 Future Improvements
🌐 Public gallery of designs
🧑‍🤝‍🧑 Multi-user collaboration
🎨 Style presets (modern, luxury, minimalist)
🎥 3D walkthrough generation
📱 Mobile optimization
🐛 Common Issues
❌ "No route matches /visualizer/:id"

✔ Ensure route exists in routes.ts

❌ AI not generating image

✔ Check Gemini model access
✔ Verify VITE_PUTER_WORKER_URL

❌ Module not found errors
npm install
👨‍💻 Author

Built by Sri Hari 🚀
Full Stack Java + React Developer in progress

📜 License

This project is for educational and portfolio use.