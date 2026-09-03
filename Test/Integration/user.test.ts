import request from "supertest";
import { app } from "../../src/App/app.js";
import { SUPER_USER, SUPER_USER_PW } from "../../src/App/config.js";

let code: string;
beforeAll(async () => {
  const response = await request(app)
    .post("/API/user/login")
    .send({ username: SUPER_USER, password: SUPER_USER_PW });
  code = response.body.token;
});
const user = {
  username: "jhondoe",
  email: "john.doe@example.com",
  password: "password123",
  tel: "1234567890",
};
describe("User API", () => {
  test("Create new user", async () => {
    const response = await request(app)
      .post("/API/user/create")
      .send({ user })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("User registered successfully");
  });

  test("get users", async () => {
    const response = await request(app)
      .get("/API/user/jhondoe")
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("john.doe@example.com");
  });

  test("update one user", async () => {
    const response3 = await request(app)
      .post("/API/user/login")
      .send({ username: user.username, password: user.password });
    const code2 = response3.body.token;
    const response = await request(app)
      .patch("/API/user/update/jhondoe")
      .send({
        user: {
          email: "jhondoe@example.com",
        },
      })
      .set("Authorization", `Bearer ${code2}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe("User updated successfully");

    const response2 = await request(app)
      .get("/API/user/jhondoe")
      .set("Authorization", `Bearer ${code}`);
    expect(response2.status).toBe(200);
    expect(response2.body.email).toBe("jhondoe@example.com");
  });

  test("delete one user", async () => {
    const response = await request(app)
      .delete("/API/user/delete/jhondoe")
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe("User deleted successfully");

    const response2 = await request(app)
      .get("/API/user/jhondoe")
      .set("Authorization", `Bearer ${code}`);
    expect(response2.status).toBe(200);
    expect(response2.body.error).toBe("User not found");
  });
});
