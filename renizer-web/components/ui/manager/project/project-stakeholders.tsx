import ProjectCollaborators from "./project-collaborators";
import ProjectInvestors from "./project-investors";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

export default function ProjectStakeHolders() {
    return (
        <Tabs defaultValue="contributors">
            <TabsList>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="investors">Investors</TabsTrigger>
            </TabsList>
            <TabsContent value="contributors">
                <ProjectCollaborators />
            </TabsContent>
            <TabsContent value="investors">
                <ProjectInvestors  />
            </TabsContent>
        </Tabs>
    );
}
