import {
    CollaboratorDetails,
    InvestorDetails,
    ProjectCollaboration,
    ProjectInvestment,
} from "@/lib/definitions";
import ProjectCollaborators from "./project-collaborators";
import ProjectInvestors from "./project-investors";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

interface ProjectStakeHoldersProps {
    collaborators: CollaboratorDetails[];
    collaborations: ProjectCollaboration[];
    investors: InvestorDetails[];
    investments: ProjectInvestment[];
}

export default function ProjectStakeHolders({
    collaborators,
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
                <ProjectCollaborators
                    collaborators={collaborators}
                    collaborations={collaborations}
                />
            </TabsContent>
            <TabsContent value="investors">
                <ProjectInvestors
                    investors={investors}
                    investments={investments}
                />
            </TabsContent>
        </Tabs>
    );
}
