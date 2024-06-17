import { InvestorDetails, ProjectCollaboration, ProjectInvestment } from "@/lib/definitions";
import ProjectCollaborators from "./project-collaborators";
import ProjectInvestors from "./project-investors";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

interface ProjectStakeHoldersProps {
    collaborations: ProjectCollaboration[];
    investors: InvestorDetails[],
    investments: ProjectInvestment[];
}

export default function ProjectStakeHolders({
    collaborations,
    investors,
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
                <ProjectInvestors investors={investors} investments={investments} />
            </TabsContent>
        </Tabs>
    );
}
