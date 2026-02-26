import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const RESUME_URL = "/Wahiduzzaman_Nayem_CV.pdf";
const PORTFOLIO_URL = "https://wahidalways.github.io";

const ResumeDropdown = ({ mobile = false }: { mobile?: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const baseClass = mobile
    ? "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity w-fit cursor-pointer"
    : "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-1 cursor-pointer";

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={baseClass}
      >
        <Download className={mobile ? "w-4 h-4" : "w-3.5 h-3.5"} />
        Resume
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]"
          >
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-primary" />
              View Resume
            </a>
            <a
              href={RESUME_URL}
              download
              onClick={() => {
                toast.success("Download started!", { description: "Your resume is being downloaded." });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors border-t border-border cursor-pointer"
            >
              <Download className="w-4 h-4 text-accent" />
              Download PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeDropdown;
