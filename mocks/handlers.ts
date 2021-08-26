import { rest } from "msw";

const sessionMock = {
  expires: "1",
  user: {
    email: "alpha@me.com",
    name: "Alpha",
    image: null,
    createdAt: "2021-06-30T14:39:05.904Z",
  },
};
const flagMock = [
  {
    id: "123",
    name: "project link",
    isActive: true,
  },
];

export const handlers = [
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(ctx.json(sessionMock));
  }),
  rest.get(
    "https://flags.stackonfire.dev/api/flags/cksm0s3kg000412l2licbbh8s",
    (req, res, ctx) => {
      return res(ctx.json(flagMock));
    }
  ),
];
