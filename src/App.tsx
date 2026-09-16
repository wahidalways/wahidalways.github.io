import { LazyMotion, domAnimation } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";

/*
 * A single static page on a static host. A client router bought nothing here:
 * GitHub Pages answers an unknown path with its own 404 before any JS runs, so
 * a catch-all route could never render. public/404.html covers that instead.
 *
 * LazyMotion + domAnimation drops framer-motion's drag and layout-projection
 * engines, which nothing on this page uses. `strict` makes the bare `motion.*`
 * component throw at development time, so a future edit cannot quietly pull the
 * full bundle back in: use `m.*` instead.
 */
const App = () => (
  <ThemeProvider>
    <LazyMotion features={domAnimation} strict>
      <Index />
    </LazyMotion>
    <Toaster />
  </ThemeProvider>
);

export default App;
