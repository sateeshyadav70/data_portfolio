import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-white/10 bg-slate-950/75 py-10 backdrop-blur">
      <div className="mx-auto w-[min(1120px,94%)] text-center">
        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Sateesh Kumar. Designed and engineered as a 3D product portfolio.</p>
      </div>
    </footer>
  );
};

export default Footer;
