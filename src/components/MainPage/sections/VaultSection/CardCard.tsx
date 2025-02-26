import { useEffect, useRef } from "react";
import type { Card } from "@/types/Card";
import { CardType } from "@/types/Card";
import { cn } from "@/lib/utils";
import { Card as UICard, CardContent } from "@/components/ui/card";

const getCardProcessorLogo = (cardType: CardType): string => {
  switch (cardType) {
    case CardType.VISA:
      return "VISA";
    case CardType.MASTERCARD:
      return "Mastercard";
    case CardType.AMEX:
      return "Amex";
    case CardType.DISCOVER:
      return "Discover";
    case CardType.DINERS:
      return "Diners";
    case CardType.JCB:
      return "JCB";
    case CardType.RUPAY:
      return "RuPay";
    case CardType.OTHERS:
    default:
      return "Card";
  }
};

const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, "");
  const last4 = cleaned.slice(-4);
  return "•••• •••• •••• " + last4;
};

const getCardThemeColor = (cardType: CardType): string => {
  switch (cardType) {
    case CardType.VISA:
      return "from-blue-500/20 via-blue-400/10 to-blue-600/20";
    case CardType.MASTERCARD:
      return "from-red-500/20 via-orange-400/10 to-red-600/20";
    case CardType.AMEX:
      return "from-blue-600/20 via-blue-400/10 to-blue-500/20";
    case CardType.DISCOVER:
      return "from-orange-500/20 via-orange-400/10 to-orange-600/20";
    case CardType.DINERS:
      return "from-indigo-900/20 via-indigo-700/10 to-indigo-800/20";
    case CardType.JCB:
      return "from-blue-500/20 via-green-500/10 to-red-500/20";
    case CardType.RUPAY:
      return "from-orange-500/20 via-blue-500/10 to-orange-600/20";
    case CardType.OTHERS:
    default:
      return "from-slate-500/20 via-slate-400/10 to-slate-600/20";
  }
};

const getBlobPositions = (cardType: CardType) => {
  const seed = Object.values(CardType).indexOf(cardType);
  return {
    blob1: {
      top: `${(seed * 13) % 80}%`,
      left: `${(seed * 17) % 60}%`,
      size: `${120 + ((seed * 7) % 80)}px`,
    },
    blob2: {
      bottom: `${(seed * 19) % 70}%`,
      right: `${(seed * 23) % 50}%`,
      size: `${100 + ((seed * 11) % 60)}px`,
    },
    blob3: {
      top: `${(seed * 29) % 50}%`,
      right: `${(seed * 31) % 70}%`,
      size: `${150 + ((seed * 13) % 70)}px`,
    },
  };
};

interface CardCardProps {
  card: Card;
  onClick?: () => void;
  className?: string;
}

/*
  Here’s what we do:
  • The card’s “base” design size is 340px (width) × 215px (height). (This ratio is close to 3.375 : 2.125.)
  • A wrapper div has a max-width of 340px and is set to the same aspect ratio.
  • Inside, we have an inner container fixed at 340x215 that is scaled down/up via CSS transform.
  • A ResizeObserver computes the current wrapper width and sets a CSS variable --scale = currentWidth / 340.
  • Because every size (including fonts) is defined relative to the base (px sizes), the entire card scales uniformly.
*/
export const CardCard = ({ card, onClick, className }: CardCardProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Define the base dimensions that you designed for.
  const baseWidth = 400;
  const baseHeight = 215;
  const themeColor = getCardThemeColor(card.cardType);
  const blobPositions = getBlobPositions(card.cardType);

  useEffect(() => {
    if (!wrapperRef.current) return;
    // Create a ResizeObserver to update the scale factor.
    const resizeObserver = new ResizeObserver((entries) => {
      // There will be one observed entry – the wrapper.
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const scale = width / baseWidth;
        if (wrapperRef.current) {
          wrapperRef.current.style.setProperty("--scale", scale.toString());
        }
      }
    });
    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, [baseWidth]);

  return (
    <div
      ref={wrapperRef}
      // This wrapper always has the correct aspect ratio (baseWidth:baseHeight) and
      // prevents the outer container from causing distortions.
      className="relative w-full max-w-[340px] overflow-visible"
      style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}
    >
      {/* The inner container is fixed at the base design size.
          All design elements (including font sizes) are based on these dimensions.
          The entire inner container scales uniformly via transform: scale(var(--scale)). */}
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: "scale(var(--scale))",
        }}
      >
        <UICard
          onClick={onClick}
          // All inner spacing, font sizes, etc. are defined relative to the base design.
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all",
            "hover:shadow-lg border border-opacity-30",
            "bg-white/40 dark:bg-black/30 backdrop-blur-xl",
            "shadow-sm hover:shadow-md",
            className,
          )}
          style={{ width: baseWidth, height: baseHeight }}
        >
          {/* Background gradient with card brand colors */}
          <div
            className={cn("absolute inset-0 bg-gradient-to-br", themeColor)}
          />

          {/* CSS-based animated blobs */}
          <div
            className="absolute rounded-full opacity-70 blur-3xl bg-current animate-blob-pulse-slow"
            style={{
              top: blobPositions.blob1.top,
              left: blobPositions.blob1.left,
              width: blobPositions.blob1.size,
              height: blobPositions.blob1.size,
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute rounded-full opacity-70 blur-3xl bg-current animate-blob-pulse-slow"
            style={{
              bottom: blobPositions.blob2.bottom,
              right: blobPositions.blob2.right,
              width: blobPositions.blob2.size,
              height: blobPositions.blob2.size,
              animationDelay: "2s",
            }}
          />
          <div
            className="absolute rounded-full opacity-70 blur-3xl bg-current animate-blob-pulse-slow"
            style={{
              top: blobPositions.blob3.top,
              right: blobPositions.blob3.right,
              width: blobPositions.blob3.size,
              height: blobPositions.blob3.size,
              animationDelay: "4s",
            }}
          />

          {/* Frosted glass overlay */}
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm" />

          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-center">
              {/* Display the logo based on the card type */}
              <div className="text-xl font-medium tracking-tight font-sans">
                {getCardProcessorLogo(card.cardType)}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-2xl tracking-widest font-mono">
                {maskCardNumber(card.cardNumber)}
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide font-medium">
                  Card Holder
                </p>
                <p className="font-medium text-sm tracking-wide">
                  {card.cardHolder}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-muted-foreground tracking-wide font-medium">
                  Expires
                </p>
                <p className="font-medium text-sm tracking-wide">
                  {card.expirationMonth.toString().padStart(2, "0")}/
                  {card.expirationYear}
                </p>
              </div>
            </div>
          </CardContent>
        </UICard>
      </div>
    </div>
  );
};

export default CardCard;
