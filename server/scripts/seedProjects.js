const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Project = require("../models/Project");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const seedProjects = [
  {
    name: "Orbitfolio 3D",
    description: "A cinematic portfolio engine with lazy-loaded 3D modules, motion choreography, and component-driven storytelling.",
    techStack: ["React", "R3F", "Framer Motion", "Tailwind", "Vite"],
    features: ["Scene chunk lazy-loading", "Parallax layers", "3D holographic cards", "Responsive interaction modes"],
    githubLink: "#",
    liveLink: "https://sateeshyadav.netlify.app",
    tags: ["Showcase", "3D", "UX"],
    isActive: true,
  },
  {
    name: "AgriSignal Intelligence",
    description: "A weather-to-crop decision UI for farmers with actionable advisories, forecast analysis, and risk visibility.",
    techStack: ["React", "REST APIs", "Charting", "Node"],
    features: ["Forecast ingestion", "Crop recommendation logic", "Location-driven dashboard", "Low-friction mobile layout"],
    githubLink: "#",
    liveLink: "https://agriweatherly.netlify.app/",
    tags: ["Utility", "Data", "Impact"],
    isActive: true,
  },
  {
    name: "YojnaWatch Control",
    description: "A governance-focused fund tracking interface for transparent monitoring of scheme allocation and usage.",
    techStack: ["MERN", "Role-based routes", "Analytics widgets"],
    features: ["Scheme health board", "Budget movement snapshots", "Admin workflows", "Citizen-facing views"],
    githubLink: "#",
    liveLink: "https://yojanawatch.netlify.app/",
    tags: ["Fullstack", "GovTech", "Dashboard"],
    isActive: true,
  },
  {
    name: "ResumeForge ATS",
    description: "A clean resume generation flow tuned for ATS parsing with formatting constraints and print-safe export behavior.",
    techStack: ["React", "html2pdf", "Tailwind"],
    features: ["ATS-first typography", "Section templates", "PDF output controls", "Single-page optimization"],
    githubLink: "#",
    liveLink: "#",
    tags: ["Tooling", "Productivity", "Career"],
    isActive: true,
  },
];

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in server/.env");
  }

  await mongoose.connect(mongoUri);
  let upserts = 0;

  for (const project of seedProjects) {
    await Project.updateOne({ name: project.name }, { $set: project }, { upsert: true });
    upserts += 1;
  }

  console.log(`Seed complete. Upserted ${upserts} projects.`);
}

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  });
