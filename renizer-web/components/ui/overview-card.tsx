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
    TitleIcon?: () => React.JSX.Element;
    description: string;
    DescriptionIcon?: () => React.JSX.Element;
    footer?: string;
}

export default function OverviewCard({
    className,
    title,
    TitleIcon = () => <></>,
    description,
    DescriptionIcon = () => <></>,
    footer,
}: OverviewCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{title}</CardTitle>
                <TitleIcon />
            </CardHeader>
            <CardContent className="flex gap-2 items-center">
                <DescriptionIcon />
                <p className="font-2xl font-bold">{description}</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">{footer}</p>
            </CardFooter>
        </Card>
    );
}
