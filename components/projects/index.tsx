import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Link from "next/link";
import { FeatureFlag, Project } from "@prisma/client";

const Breadcrumbs = ({
  project,
  selectedFlag,
}: {
  project: Project;
  selectedFlag: FeatureFlag;
}) => {
  return (
    <>
      {" "}
      <Breadcrumb mb={8}>
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Projects</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem color={selectedFlag ? undefined : "gray.400"}>
          <Link
            href={`/projects/[id]`}
            as={`/projects/${project?.id}`}
            passHref
          >
            <BreadcrumbLink>{project?.name}</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        {selectedFlag && (
          <BreadcrumbItem color="gray.500">
            <BreadcrumbLink>{selectedFlag?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
