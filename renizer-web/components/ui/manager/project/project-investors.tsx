import { ProjectInvestment } from "@/lib/definitions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectInvestorsProps {
    investments: ProjectInvestment[];
}

export default function ProjectInvestors({
    investments,
}: ProjectInvestorsProps) {
    return (
        <div className="flex space-x-1 items-center">
            <div className="flex -space-x-3">
                {investments.slice(0, 5).map((inv, idx) => (
                    <Avatar key={inv.investor + idx}>
                        <AvatarImage src="" alt="" />
                        <AvatarFallback>
                            {getInitial(inv.investor)}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {investments.length > 5 && (
                    <Avatar>
                        <AvatarFallback>
                            +{investments.length - 5}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
            <Button variant="ghost" size="icon">
                <PlusIcon className="size-4" />
            </Button>
        </div>
    );
}
