import React from "react";
import { Navbar } from "components";

import { Heading } from "@chakra-ui/react";

const CourseDetail = (props) => {
  console.log(props);
  return (
    <>
      <Navbar />
      <Heading>Project</Heading>
    </>
  );
};

export default CourseDetail;

export async function getServerSideProps({ query }) {
  const { slug } = query;
  console.log(slug);
  return {
    props: { project: { title: "blah", id: 123 } },
  };
}
