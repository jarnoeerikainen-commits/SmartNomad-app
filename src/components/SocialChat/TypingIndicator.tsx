interface TypingIndicatorProps {
  name: string;
  avatar?: string;
}

export const TypingIndicator = ({ name, avatar }: TypingIndicatorProps) => (
  <div className="flex gap-3 items-end animate-fade-in">
    {avatar ? (
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
        }}
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
        {name.slice(0, 2)}
      </div>
    )}
    <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-2">{name} is typing</span>
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '120ms' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '240ms' }} />
    </div>
  </div>
);
