import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import profileImg from '../assets/202212101725146188_PhotoPath_PHOTO SAT.jpg';
import { useTheme } from './DarkModeToggle';

export default function ResumeCard() {
  const { theme } = useTheme();
  const resumeRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadPDF = async () => {
    if (isDownloading) return; // Prevent multiple clicks

    setIsDownloading(true);

    try {
      console.log('Download PDF called');
      const element = resumeRef.current;
      console.log('Element:', element);
      if (!element) {
        console.error('Resume content element not found');
        setIsDownloading(false);
        return;
      }

      const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF and get the blob
      const pdf = await html2pdf().set(opt).from(element).outputPdf('blob');
      console.log('PDF generated successfully');

      // Create a blob URL and open in new tab
      const url = URL.createObjectURL(pdf);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const data = {
    name: "Sateesh Kumar",
    role: "Web Developer",
    email: "sateeshkumardoc@gmail.com",
    phone: "7250348807",
    location: "Dehradun, India",
    portfolio: "https://sateesh-portfolio.netlify.app/",
    summary: "Motivated Computer Science student with expertise in full-stack web development, IoT, and cybersecurity. Proficient in JavaScript, React.js, Node.js, and database management. Passionate about building innovative solutions and eager to contribute to dynamic teams.",
    skills: [
      "HTML5", "CSS3", "JavaScript (ES6+)", "Tailwind CSS", "React.js", "Node.js", "Express.js", "MySQL", "SQL", "Git", "GitHub", "REST API", "IoT Sensors", "Cybersecurity"
    ],
    experience: [
      {
        title: "Internship - Web Development",
        company: "Self-Employed / Freelance Projects",
        duration: "Jan 2024 – Present",
        desc: "Developed responsive web applications using React.js and Node.js. Implemented REST APIs for data handling and integrated MySQL databases. Collaborated on IoT-based projects, enhancing system reliability by 30%."
      },
      {
        title: "Project Lead - IoT Accident Detection",
        company: "Academic Project",
        duration: "Sep 2023 – Dec 2023",
        desc: "Led a team to build a real-time accident detection system using IoT sensors. Integrated GPS for location tracking and automated alert systems, reducing response time by 40%."
      }
    ],
    projects: [
      {
        name: "Smart Night Vision Accident Detection System",
        desc: "Developed a real-time accident detection solution using IoT sensors, GPS, and Node.js backend. Implemented automated alerts to control rooms, improving emergency response efficiency. Technologies: JavaScript, Node.js, IoT, REST API.",
        link: "#"
      },
      {
        name: "Weatherly – Smart Weather & Farming Advisory App",
        desc: "Built a responsive weather and farming advisory app with real-time data, crop suggestions, and rain prediction. Integrated APIs for accurate forecasts and user-friendly UI. Technologies: React.js, JavaScript, CSS3, REST API.",
        link: "#"
      }
    ],
    education: {
      degree: "B.Tech in Computer Science and Engineering",
      college: "Tula’s Institute, Dehradun (UTU)",
      duration: "Aug 2022 – June 2026",
      cgpa: "5.5"
    },
    certifications: [
      "AI for Beginners – HP LIFE (2025)",
      "Cybersecurity Analyst Job Simulation – Forage (2024)"
    ],
    languages: ["Hindi", "Bhojpuri", "English"]
  };

  return (
    <div className={`w-full min-h-screen flex items-center justify-center p-4 font-sans print:p-2 print:bg-white ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div ref={resumeRef} className={`resume-content w-full max-w-4xl shadow-xl rounded-xl p-8 border print:shadow-none print:border-none print:p-4 print:max-w-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <div className={`text-center mb-6 print:mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <img src={profileImg} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 print:w-24 print:h-24 print:mb-2" />
          <h1 className={`text-4xl font-bold mb-2 print:text-3xl print:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data.name}</h1>
          <p className={`text-xl font-medium mb-1 print:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{data.role}</p>
          <p className={`text-sm mb-2 print:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{data.location}</p>
          <p className={`text-sm print:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}><strong>Email:</strong> {data.email} | <strong>Phone:</strong> {data.phone} | <strong>Portfolio:</strong> <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.portfolio}</a></p>
        </div>

        {/* Summary */}
        <div className="mb-6 print:mb-4">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1 print:text-xl print:mb-2 print:pb-0.5">Professional Summary</h2>
          <p className={`leading-relaxed print:text-sm print:leading-tight ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{data.summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
          {/* Left Column */}
          <div className="lg:col-span-1 print:col-span-1">
            {/* Contact */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-xl font-semibold mb-3 text-blue-600 print:text-lg print:mb-2">Contact</h2>
              <p className={`print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>Email:</strong> {data.email}</p>
              <p className={`print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>Phone:</strong> {data.phone}</p>
              <p className={`print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><strong>Location:</strong> {data.location}</p>
            </div>

            {/* Skills */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-xl font-semibold mb-3 text-blue-600 print:text-lg print:mb-2">Skills</h2>
              <ul className={`list-disc ml-5 space-y-1 print:text-sm print:space-y-0.5 print:ml-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {data.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-xl font-semibold mb-3 text-blue-600 print:text-lg print:mb-2">Languages</h2>
              <p className={`print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{data.languages.join(", ")}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 print:col-span-1">
            {/* Experience */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-2xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1 print:text-xl print:mb-2 print:pb-0.5">Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} className="mb-4 print:mb-2">
                  <h3 className={`font-bold text-lg print:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h3>
                  <p className={`font-medium print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{exp.company}</p>
                  <p className={`text-sm mb-2 print:text-xs print:mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{exp.duration}</p>
                  <p className={`leading-relaxed print:text-sm print:leading-tight ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{exp.desc}</p>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-2xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1 print:text-xl print:mb-2 print:pb-0.5">Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} className="mb-4 print:mb-2">
                  <h3 className={`font-bold text-lg print:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{proj.name}</h3>
                  <p className={`mt-1 leading-relaxed print:text-sm print:leading-tight print:mt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{proj.desc}</p>
                  {proj.link !== "#" && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm mt-2 inline-block print:text-xs print:mt-1">View Project</a>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-2xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1 print:text-xl print:mb-2 print:pb-0.5">Education</h2>
              <p className={`font-medium text-lg print:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{data.education.degree}</p>
              <p className={`print:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{data.education.college}</p>
              <p className={`text-sm print:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{data.education.duration} | CGPA: {data.education.cgpa}</p>
            </div>

            {/* Certifications */}
            <div className="mb-6 print:mb-4">
              <h2 className="text-2xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1 print:text-xl print:mb-2 print:pb-0.5">Certifications</h2>
              <ul className={`list-disc ml-5 space-y-1 print:text-sm print:space-y-0.5 print:ml-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="text-center mt-8 print:hidden space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition font-semibold"
            >
              PRINT → PDF Download (Recommended for ATS)
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`px-6 py-2 rounded-xl shadow-md transition font-semibold ${
                isDownloading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isDownloading ? 'Downloading...' : 'Download Resume (One-Click PDF)'}
            </button>
          </div>
          <p className="text-sm max-w-md mx-auto text-gray-600">
            <strong>ATS Tip:</strong> Use "PRINT → PDF Download" for better Applicant Tracking System compatibility. Text remains selectable and searchable.
          </p>
        </div>
      </div>
    </div>
  );
}
