"use client"
import {
  Box,
  Typography,
} from "@mui/material"
import NewProjectForm from "./NewProjectForm"
import { splitOwnerAndRepository } from "@/common"
import Link from "next/link"
import HighlightText from "@/common/ui/HighlightText"
import { BASE_COLORS } from "@/common/theme/theme"
import { Fragment } from "react"

interface NewProjectStepsProps {
  repositoryNameSuffix: string
  templateName?: string
  ownerRepository?: string
  helpURL?: string
}

type StepType = {
  id?: string,
  content: string,
  highlight: string,
  helpURL?: string
}

const NewProjectSteps = ({
  repositoryNameSuffix,
  templateName,
  ownerRepository,
  helpURL,
}: NewProjectStepsProps) => {
  const steps: StepType[] = [
    {
      id: "create-new-repository",
      content: `Create a new repository using our ${templateName ? splitOwnerAndRepository(templateName)?.repository : ""} template`,
      highlight: "Create a new repository",
      helpURL: helpURL ? `${helpURL}/Adding-Documentation-to-Shape-Docs#create-a-repository` : undefined
    },
    {
      content: "Add OpenAPI specification",
      highlight: "Add OpenAPI",
      helpURL: helpURL ? `${helpURL}/Adding-Documentation-to-Shape-Docs#add-an-openapi-specification` : undefined
    },
    {
      content: "Customize Your Project",
      highlight: "Customize",
      helpURL: helpURL ? `${helpURL}/Adding-Documentation-to-Shape-Docs#customize-the-project` : undefined

    },
    {
      content: "Ready to start!",
      highlight: "",
    }
  ]

  const isCreateRepositoryStep = (step: StepType) => step.id && step.id === steps[0].id

  const getStepContent = (step: StepType, index: number) => (
    <Box
      display={{ xs: "inline", md: "flex"}}
      flexDirection="row"
      alignItems="center"
      gap={2}
      width={1}
    >
      {step.highlight ? 
        <HighlightText
          content={`${index + 1}. ${step.content}`}
          highlight={step.highlight}
          color={BASE_COLORS[2]}
          height="80%"
          sx={{ fontSize: 20, marginRight: { xs: 1 } }}
          isBoldText
        /> :
        <Typography sx={{
          display: { md: "flex" },
          fontSize: 20,
          marginRight: { xs: 4 }
        }}>
          {`${index + 1}. `}
          {step.content}
        </Typography>
      }
      {step.helpURL && 
        <Typography
          sx={{ 
            fontSize: { xs: 16, sm: 14 },
            color: "gray",
          }}
          component={Link}
          aria-label="help"
          href={step.helpURL}
          target="_blank" 
          rel="noopener noreferrer"  
        >
          (?)
        </Typography>
      }
    </Box>
  )

return (
    <Box display="flex" alignItems="start" justifyContent="center" flexDirection="column" gap={4}>
        {steps.map((step: StepType, index: number) => 
          <Fragment key={`box-step-${index}`}>
            {isCreateRepositoryStep(step) ? 
              <Box display="flex" flexDirection="column" gap={2}>
                  {getStepContent(step, index)}
                <NewProjectForm
                  repositoryNameSuffix={repositoryNameSuffix}
                  templateName={templateName}
                  ownerRepository={ownerRepository}
                />
              </Box> :
              getStepContent(step, index)
            }
          </Fragment>
        )}
    </Box>
  )}

export default NewProjectSteps