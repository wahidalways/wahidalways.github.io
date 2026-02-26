import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Linkedin, Twitter, Mail, Link } from "lucide-react";
import { toast } from "sonner";

const FloatingShare = () => {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = [
    { icon: Linkedin, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { icon: Twitter, label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out this portfolio!` },
    { icon: Mail, label: "Email", href: `mailto:?subject=Portfolio&body=${encodeURIComponent(url)}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!", { description: "Portfolio URL has been copied to clipboard." });
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="p-3 rounded-full glass hover-lift cursor-pointer"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5 text-primary" />
      </motion.button>
      <AnimatePresence>
        {open && shareLinks.map((item, i) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
            exit={{ opacity: 0, y: 20 }}
            className="p-2.5 rounded-full glass hover-lift"
            aria-label={item.label}
          >
            <item.icon className="w-4 h-4 text-foreground" />
          </motion.a>
        ))}
        {open && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, y: 20 }}
            onClick={copyLink}
            className="p-2.5 rounded-full glass hover-lift cursor-pointer"
            aria-label="Copy link"
          >
            <Link className="w-4 h-4 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingShare;
