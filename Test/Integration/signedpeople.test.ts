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
describe("SignedPeople API", () => {
  test("Create new signed person", async () => {
    const response = await request(app)
      .post("/API/signed/create")
      .send({
        name: "Juan",
        id: "1234567899455",
        lastName: "Pérez",
        email: "juan.perez@example.com",
        tel: "3001234567",
        teamName: "Atlético Barranquilla",
        multiplesCat: false,
        oneCat: true,
        date: new Date("2026-07-04T10:00:00Z"),
        fase: "Inscrito",
        cargo: "Entrenador",
      })
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);

    expect(response.body.success).toBe("registered people");
  });

  test("get signed people", async () => {
    const response = await request(app)
      .get("/API/signed/1234567899455")
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);
    expect(response.body[0].email).toBe("juan.perez@example.com");
  });

  test("update one signed person", async () => {
    const response = await request(app)
      .patch("/API/signed/update/1234567899455")
      .send({
        fase: "Aceptado",
      })
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe("Signed Person updated");

    const response2 = await request(app)
      .get("/API/signed/1234567899455")
      .set("Authorization", `Bearer ${code}`);
    expect(response2.status).toBe(200);
    expect(response2.body[0].fase).toBe("Aceptado");
  });

  test("delete one signed person", async () => {
    const response = await request(app)
      .delete("/API/signed/delete/1234567899455")
      .set("Authorization", `Bearer ${code}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe("Signed person deleted successfully");

    const response2 = await request(app)
      .get("/API/signed/1234567899455")
      .set("Authorization", `Bearer ${code}`);
    expect(response2.status).toBe(200);
    expect(response2.body.error).toBe("There are not signed people");
  });
});
