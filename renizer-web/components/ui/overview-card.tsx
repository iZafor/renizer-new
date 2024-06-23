import {
    Card,
    CardTitle,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

interface OverviewCardProps {
    className?: string;
    title: string;
    titleIcon?: React.ElementType<{ className?: string }>;
    description: string;
    descriptionIcon?: React.ElementType<{ className?: string }>;
    footer?: string;
}

export default function OverviewCard({
    className,
    title,
    titleIcon: TitleIcon,
    description,
    descriptionIcon: DescriptionIcon,
    footer,
}: OverviewCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {TitleIcon && (
                        <TitleIcon className="text-muted-foreground size-6" />
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex gap-2 items-center">
                {DescriptionIcon && <DescriptionIcon />}
                <p className="font-2xl font-bold">{description}</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">{footer}</p>
            </CardFooter>
        </Card>
    );
}
