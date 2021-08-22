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

const purchasesMock = { purchasesByUser: [] };

export const handlers = [
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(ctx.json(sessionMock));
  }),
];
