import {
  BedDouble,
  Briefcase,
  CarFront,
  Droplets,
  House,
  PaintRoller,
  Scissors,
  Smile,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Industry } from "@/content/industries";

export const industryIcon: Record<Industry["icon"], LucideIcon> = {
  roof: House,
  floor: PaintRoller,
  salon: Sparkles,
  barber: Scissors,
  restaurant: UtensilsCrossed,
  hotel: BedDouble,
  car: CarFront,
  wash: Droplets,
  dental: Smile,
  medical: Stethoscope,
  firm: Briefcase,
};
