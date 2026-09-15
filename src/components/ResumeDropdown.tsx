import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useDismissable } from "@/hooks/useDismissable";

const RESUME_URL = "/Wahiduzzaman_Nayem_CV.pdf";

const ResumeDropdown = ({ mobile = false }: { mobile?: boolean }) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { containerRef, triggerRef } = useDismissable<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={`btn btn-accent cursor-pointer ${mobile ? "h-12 px-6 text-sm" : "h-10 px-5 text-[13px]"}`}
      >
        <span>Resume</span>
        <ChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            role="menu"
            aria-label="Resume options"
            initial={{ opacity: 0, y: mobile ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: mobile ? 6 : -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 w-60 rounded-lg border border-border bg-popover p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] ${
              mobile ? "left-0 bottom-full mb-3" : "right-0 top-full mt-3"
            }`}
          >
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors"
            >
              <span>View Resume</span>
              <ArrowUpRight
                aria-hidden="true"
                className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={RESUME_URL}
              download
              role="menuitem"
              onClick={() => {
                toast.success("Download started!", { description: "Your resume is being downloaded." });
                setOpen(false);
              }}
              className="group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors"
            >
              <span>
                Download PDF <span className="label ml-1">CV</span>
              </span>
              <Download
                aria-hidden="true"
                className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeDropdown;
