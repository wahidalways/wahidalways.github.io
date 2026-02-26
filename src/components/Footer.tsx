import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <motion.a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <span className="font-heading text-[10px] font-bold text-primary-foreground">M</span>
          </div>
          <span className="font-heading font-bold text-base text-foreground">MWN</span>
          <span className="font-heading font-bold text-base text-accent">.</span>
        </motion.a>
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Md. Wahiduzzaman Nayem. All rights reserved.
        </p>
        <p className="text-xs">
          Designed & Developed by MWN
        </p>
      </div>
    </footer>
  );
};

export default Footer;
