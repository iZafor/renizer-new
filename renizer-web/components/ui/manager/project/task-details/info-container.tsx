interface InfoContainerProps {
    IdentifierIcon: React.ComponentType<{ className?: string }>;
    identifierText: string;
    children: React.ReactNode;
}

export default function InfoContainer({
    IdentifierIcon,
    identifierText,
    children,
}: InfoContainerProps) {
    return (
        <div className="flex items-center h-[3rem]">
            <div className="flex items-center space-x-1.5 min-w-[16rem]">
                <IdentifierIcon className="size-6 stroke-muted-foreground" />
                <p className="text-muted-foreground">{identifierText}</p>
            </div>
            {children}
        </div>
    );
}