import { List, Divider} from "@mui/material";
import ProjectComponent from "./ProjectComponent";
import { IProjectRepository } from "../projects/IProjectRepository";

interface ProjectListComponentProps {
  projectRepository: IProjectRepository;
}

const ProjectListComponent: React.FC<ProjectListComponentProps> = async ({
  projectRepository,
}) => {
  const projects = await projectRepository.getProjects();
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);
  // projects.push(...projects);

  return (
    <List
      sx={{
        overflowY: "scroll",
        width: "100%",
        height: "100%"
      }}
    >
      {projects.map((project, index) => (
        <div>
        <ProjectComponent project={project} key={index} />
        {index < projects.length - 1 &&
          <Divider />
        }
        </div>
      ))}
    </List>
  );
};

export default ProjectListComponent;
