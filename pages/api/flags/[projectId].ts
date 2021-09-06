import { Heat } from "@prisma/client";
import prisma from "lib/prisma";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

function isHeatApplicable(customHeat: Heat, config: Map<string, string>) {
  const value = config[customHeat.property];
  if (value) {
    switch (customHeat.strategy) {
      case "IN":
        return customHeat.values.includes(value);
      case "NOT_IN":
        return !customHeat.values.includes(value);
      default:
        return false;
    }
  }
}

const handle = async (req, res) => {
  const { projectId, ...config } = req.query;

  const flags = await prisma.featureFlag.findMany({
    where: {
      projectId: String(projectId),
    },
    include: {
      heats: true,
    },
  });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res
    .status(200)
    .json(
      flags.filter((flag) =>
        flag.heats.every((heat) => isHeatApplicable(heat, config))
      )
    );
};

module.exports = allowCors(handle);
