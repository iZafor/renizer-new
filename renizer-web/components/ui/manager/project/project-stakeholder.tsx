import { ProjectCollaboration, ProjectInvestment } from "@/lib/definitions";
import ProjectCollaborators from "./project-collaborators";
import ProjectInvestors from "./project-investors";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

interface ProjectStakeHoldersProps {
    collaborations: ProjectCollaboration[];
    investments: ProjectInvestment[];
}

export default function ProjectStakeHolders({
    collaborations,
    investments,
}: ProjectStakeHoldersProps) {
    return (
        <Tabs defaultValue="contributors">
            <TabsList>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="investors">Investors</TabsTrigger>
            </TabsList>
            <TabsContent value="contributors">
                <ProjectCollaborators collaborations={collaborations} />
            </TabsContent>
            <TabsContent value="investors">
                <ProjectInvestors investments={investments} />
            </TabsContent>
        </Tabs>
    );
}
