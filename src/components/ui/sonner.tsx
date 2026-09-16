import { CircleAlert, CircleCheck, CircleX, Info, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const iconClass = "h-4 w-4";

/*
 * Notifications as a plain inverted card (ink on the paper theme, paper on the
 * graphite one) with a small outline icon as the only colour. They appear
 * top-centre so they never sit on the floating buttons in the bottom corners.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      offset={80}
      gap={8}
      className="toaster"
      icons={{
        success: <CircleCheck aria-hidden="true" className={iconClass} strokeWidth={2} />,
        error: <CircleX aria-hidden="true" className={iconClass} strokeWidth={2} />,
        warning: <CircleAlert aria-hidden="true" className={iconClass} strokeWidth={2} />,
        info: <Info aria-hidden="true" className={iconClass} strokeWidth={2} />,
        loading: <Loader2 aria-hidden="true" className={`${iconClass} animate-spin`} strokeWidth={2} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "toast-card flex w-full items-start gap-3 rounded-xl px-4 py-3",
          icon: "toast-icon mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "text-[14px] font-medium leading-5",
          description: "toast-description text-[13px] leading-5",
          actionButton: "rounded-md bg-background px-2.5 py-1 text-[13px] font-medium text-foreground",
          cancelButton: "rounded-md px-2.5 py-1 text-[13px] opacity-70",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
