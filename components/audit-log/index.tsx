import { Heading } from "@chakra-ui/react";
import { AuditLog, FeatureFlag, User } from "@prisma/client";
import { useLogs } from "hooks/useLogs";
import { useRouter } from "next/dist/client/router";
import React from "react";
import LogRenderer from "./log-renderer";

const AuditLogComponent = () => {
  const router = useRouter();
  const {
    data: logs,
  }: {
    data: ReadonlyArray<
      AuditLog & { before: FeatureFlag; after: FeatureFlag; User: User }
    >;
  } = useLogs({ id: router.query.flag });

  return (
    <>
      <Heading mb={4} fontSize="2xl">
        Audit log
      </Heading>
      {logs?.map((log) => {
        return <LogRenderer key={log.id} log={log} />;
      })}
    </>
  );
};

export default AuditLogComponent;
