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

const handle = async (req, res) => {
  const flags = await prisma.featureFlag.findMany({
    where: {
      projectId: String(req.query.projectId),
    },
  });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).json(flags);
};

module.exports = allowCors(handle);
