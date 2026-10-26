import type { ComponentType } from "react";
import { Briefcase, Camera, Music2, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelPlatform } from "@/features/channels/types/channel";

export const PLATFORM_ICONS: Record<
  ChannelPlatform,
  ComponentType<{ size?: number; className?: string }>
> = {
  youtube: Play,
  tiktok: Music2,
  instagram: Camera,
  linkedin: Briefcase,
};

export const PLATFORM_TEXT_COLOR_CLASS: Record<ChannelPlatform, string> = {
  youtube: "text-platform-youtube",
  instagram: "text-platform-instagram",
  linkedin: "text-platform-linkedin",
  tiktok: "text-platform-tiktok",
};

export interface PlatformIconProps {
  platform: ChannelPlatform;
  size?: number;
  className?: string;
  withColor?: boolean;
}

export function PlatformIcon({
  platform,
  size = 14,
  className,
  withColor = true,
}: PlatformIconProps) {
  const IconComponent = PLATFORM_ICONS[platform] || Radio;
  const colorClass = withColor ? PLATFORM_TEXT_COLOR_CLASS[platform] : "";

  return <IconComponent aria-hidden="true" className={cn(colorClass, className)} size={size} />;
}

