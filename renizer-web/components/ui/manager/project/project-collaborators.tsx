import { ProjectCollaboration } from "@/lib/definitions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCollaboratorsProps {
    collaborations: ProjectCollaboration[];
}

export default function ProjectCollaborators({
    collaborations,
}: ProjectCollaboratorsProps) {
    return (
        <div className="flex space-x-1 items-center">
            <div className="flex -space-x-3">
                {collaborations.slice(0, 5).map((col, idx) => (
                    <Avatar key={col.contributor + idx}>
                        <AvatarImage src="" alt="" />
                        <AvatarFallback>
                            {getInitial(col.contributor)}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {collaborations.length > 5 && (
                    <Avatar>
                        <AvatarFallback>
                            +{collaborations.length - 5}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
            <Button variant="outline" size="icon">
                <PlusIcon className="size-4" />
            </Button>
        </div>
    );
}
