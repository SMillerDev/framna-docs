"use client"

import { SelectChangeEvent, Select, MenuItem, FormControl } from "@mui/material"
import IOpenApiSpecification from "../../domain/IOpenApiSpecification"

interface SpecificationSelectorProps {
  specifications: IOpenApiSpecification[]
  selection: string
  onSelect: (specificationId: string) => void
}

const SpecificationSelector: React.FC<
  SpecificationSelectorProps
> = ({
  specifications,
  selection,
  onSelect
}) => {
  const handleVersionChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value)
  }
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select defaultValue={selection} onChange={handleVersionChange}>
        {specifications.map(specification =>
          <MenuItem key={specification.id} value={specification.id}>
            {specification.name}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default SpecificationSelector
