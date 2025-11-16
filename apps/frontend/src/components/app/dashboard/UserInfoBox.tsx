import { User } from "@/lib/api/user";
import { motion } from "motion/react";
import { User as UserIcon, Shield, Crown } from "lucide-react";

interface UserInfoBoxProps {
  user: User | null;
  loading: boolean;
}

export function UserInfoBox({ user, loading }: UserInfoBoxProps) {
  if (loading) {
    return (
      <div className="px-4 py-2 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 animate-pulse">
        <div className="h-5 w-32 bg-neutral-800 rounded"></div>
      </div>
    );
  }

  if (!user) return null;

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "premium":
      case "pro":
        return "text-yellow-400";
      case "free":
      default:
        return "text-neutral-400";
    }
  };

  const getAuthMethodDisplay = (method: string) => {
    switch (method?.toLowerCase()) {
      case "google":
        return "Google";
      case "traditional":
        return "Email";
      default:
        return method;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-3 py-2 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 flex items-center gap-2 sm:gap-3 max-w-full"
    >
      <UserIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs sm:text-sm text-white font-medium truncate">
          {user.email}
        </span>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {getAuthMethodDisplay(user.authMethod)}
          </span>
          <span className="text-neutral-600">•</span>
          <span className={`flex items-center gap-1 ${getTierColor(user.tier)}`}>
            <Crown className="h-3 w-3" />
            {user.tier}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
