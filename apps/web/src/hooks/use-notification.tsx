import { createContext, useContext, useCallback, ReactNode } from "react";
import { toast, Toaster } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface NotificationAction {
  label: string;
  onClick: () => void;
}

interface NotificationOptions {
  description?: string;
  action?: NotificationAction;
  duration?: number;
  icon?: ReactNode;
}

interface NotificationContextType {
  showSuccess: (
    message: string,
    options?: NotificationOptions
  ) => string | number;
  showError: (
    message: string,
    options?: NotificationOptions
  ) => string | number;
  showInformation: (
    message: string,
    options?: NotificationOptions
  ) => string | number;
  showWarning: (
    message: string,
    options?: NotificationOptions
  ) => string | number;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NOTIFICATION_CONFIG = {
  success: {
    toastFn: toast.success,
    defaultDuration: 4000,
    defaultIcon: <CheckCircle className="h-4 w-4" />,
  },
  error: {
    toastFn: toast.error,
    defaultDuration: 4000,
    defaultIcon: <AlertCircle className="h-4 w-4" />,
  },
  info: {
    toastFn: toast.info,
    defaultDuration: 4000,
    defaultIcon: <Info className="h-4 w-4" />,
  },
  warning: {
    toastFn: toast.warning,
    defaultDuration: 4000,
    defaultIcon: <AlertTriangle className="h-4 w-4" />,
  },
} as const;

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const createNotification = useCallback(
    (
      type: keyof typeof NOTIFICATION_CONFIG,
      message: string,
      options: NotificationOptions = {}
    ) => {
      const config = NOTIFICATION_CONFIG[type];
      return config.toastFn(message, {
        description: options.description,
        action: options.action,
        duration: options.duration || config.defaultDuration,
        icon: options.icon || config.defaultIcon,
        ...options,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, options?: NotificationOptions) =>
      createNotification("success", message, options),
    [createNotification]
  );

  const showError = useCallback(
    (message: string, options?: NotificationOptions) =>
      createNotification("error", message, options),
    [createNotification]
  );

  const showInformation = useCallback(
    (message: string, options?: NotificationOptions) =>
      createNotification("info", message, options),
    [createNotification]
  );

  const showWarning = useCallback(
    (message: string, options?: NotificationOptions) =>
      createNotification("warning", message, options),
    [createNotification]
  );

  const contextValue: NotificationContextType = {
    showSuccess,
    showError,
    showInformation,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Toaster position="top-center" expand={true} richColors={true} />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};
