import { m, AnimatePresence } from "framer-motion";
import { Download, Eye, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useDismissable } from "@/hooks/useDismissable";

const RESUME_URL = "/Wahiduzzaman_Nayem_CV.pdf";

const ResumeDropdown = ({ mobile = false }: { mobile?: boolean }) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { containerRef, triggerRef } = useDismissable<HTMLDivElement>(open, () => setOpen(false));

  const baseClass = mobile
    ? "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity w-fit cursor-pointer"
    : "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-1 cursor-pointer";

  return (
    <div ref={containerRef} className="relative">
      <m.button
        ref={triggerRef}
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={baseClass}
      >
        <Download aria-hidden="true" className={mobile ? "w-4 h-4" : "w-3.5 h-3.5"} />
        Resume
        <ChevronDown aria-hidden="true" className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </m.button>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            role="menu"
            aria-label="Resume options"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]"
          >
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary focus-visible:bg-secondary transition-colors cursor-pointer"
            >
              <Eye aria-hidden="true" className="w-4 h-4 text-primary" />
              View Resume
            </a>
            <a
              href={RESUME_URL}
              download
              role="menuitem"
              onClick={() => {
                toast.success("Download started!", { description: "Your resume is being downloaded." });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary focus-visible:bg-secondary transition-colors border-t border-border cursor-pointer"
            >
              <Download aria-hidden="true" className="w-4 h-4 text-accent" />
              Download PDF
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeDropdown;
