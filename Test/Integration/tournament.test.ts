import request from "supertest";
import { app } from "../../src/App/app.js";
import { SUPER_USER, SUPER_USER_PW } from "../../src/App/config.js";
import mongoose from "mongoose";
export const teams = [
  {
    name: "Atlético Norte",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2011-03-15",
  },
  {
    name: "Deportivo Caribe",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2013-07-21",
  },
  {
    name: "Real Sincelejo",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2010-11-08",
  },
  {
    name: "Unión Barranquilla",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2012-04-18",
  },
  {
    name: "Academia Sucre",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2014-06-30",
  },
  {
    name: "Titanes FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2009-01-25",
  },
  {
    name: "Leones FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2015-09-10",
  },
  {
    name: "Halcones United",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2011-12-05",
  },
  {
    name: "Águilas Doradas",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2016-02-14",
  },
  {
    name: "Sporting Costa",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2013-10-22",
  },
  {
    name: "Costa Azul FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2008-08-19",
  },
  {
    name: "Racing Caribe",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2017-05-11",
  },
  {
    name: "Inter Montería",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2012-07-03",
  },
  {
    name: "Juventud Córdoba",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2010-09-17",
  },
  {
    name: "Atlético Bolívar",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2014-12-01",
  },
  {
    name: "Guerreros FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2011-01-09",
  },
  {
    name: "Club Aurora",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2015-04-27",
  },
  {
    name: "Real Cartagena",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2013-02-16",
  },
  {
    name: "Deportivo Atlántico",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2018-06-08",
  },
  {
    name: "Barranquilla Stars",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2009-10-13",
  },
  {
    name: "Caimanes FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2012-11-20",
  },
  {
    name: "Tiburones FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2016-08-28",
  },
  {
    name: "Jaguares Juniors",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2014-05-14",
  },
  {
    name: "Centauros FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2011-06-01",
  },
  {
    name: "Piratas del Caribe",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2017-09-23",
  },
  {
    name: "Academia del Norte",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2010-02-07",
  },
  {
    name: "Olímpicos FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2013-08-31",
  },
  {
    name: "Canarios FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2015-03-12",
  },
  {
    name: "Lobos FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2012-12-24",
  },
  {
    name: "Toros Unidos",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2016-01-30",
  },
  {
    name: "Estrella Roja",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2014-07-19",
  },
  {
    name: "Náuticos FC",
    edition: "2026",
    category: "2016",
    country: "Colombia",
    founded: "2011-05-26",
  },
];
const positions = ["Portero", "Defensa", "Medio", "Delantero"];
let code: string;
let teamsCreated: any[] = [];
let tournamentCreated: any;
let groups: any[] = [];
let of: any[] = [];
let pc: any[] = [];
let cf: any[] = [];
let ps: any[] = [];
let sf: any[] = [];
let f: any[] = [];
const teamsToChoose = ["A", "B"];
beforeAll(async () => {
  const response = await request(app)
    .post("/API/user/login")
    .send({ username: SUPER_USER, password: SUPER_USER_PW });
  code = response.body.token;
});
describe("Tournament working 32", () => {
  test("Create 32 teams", async () => {
    for (const team of teams) {
      const response = await request(app)
        .post("/API/team/create/" + SUPER_USER)
        .field("name", team.name)
        .field("edition", team.edition)
        .field("category", team.category)
        .field("country", team.country)
        .field("founded", team.founded)
        .set("Authorization", `Bearer ${code}`);
    }

    const response = await request(app).get("/API/teamsWN");
    expect(response.body.length).toBe(32);
    teamsCreated = response.body;
  });

  test("create players", async () => {
    let j = 0;
    for (const team of teamsCreated) {
      for (let i = 0; i < 20; i++) {
        const response = await request(app)
          .post("/API/player/create/")
          .field("id", "10567890" + j)
          .field("dorsal", i + 1)
          .field("name", "Jugador " + (i + 1))
          .field(
            "position",
            positions[Math.floor(Math.random() * positions.length)],
          )
          .field("team", team.id)
          .field("teamName", team.name)
          .field("nation", "Colombia")
          .field("editionPlayed", "2026")
          .field("age", 10)
          .field("birthYear", 2016)
          .field("talla", "S")
          .set("Authorization", `Bearer ${code}`);

        j++;
      }
    }
    const response = await request(app).get("/API/playersWN");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(640);
  }, 60000);

  test("create tournament", async () => {
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 8,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Octavos de final") {
        of.push(match);
      }
      if (response.body[0].phase == "Cuartos de final") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }

    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/tournaments");

    const response7 = await request(app).get("/API/matchQuery?code=OF1");
    expect(response7.body[0].teamA).toBe(
      response6.body[0].boardGroups[0][0].team,
    );
  }, 100000);

  test("octavos de final", async () => {
    for (const match of of) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/tournaments");
    const response7 = await request(app).get("/API/matchQuery?code=CF1");
    expect(response7.body[0].teamA).toBe(
      response6.body[0].boardGroups[0][0].team,
    );
  }, 40000);

  test("Cuartos de final", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/tournaments");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).toBe(
      response6.body[0].boardGroups[0][0].team,
    );
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/tournaments");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(
      response6.body[0].boardGroups[0][0].team,
    );
  }, 40000);
  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 28", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 29).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 7,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Pre-cuartos") {
        pc.push(match);
      }
      if (response.body[0].phase == "Cuartos de final") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 29)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/tournaments");

    const response7 = await request(app).get("/API/matchQuery?code=PC1");
    expect(response7.body[0].teamA).not.toBe("3");
  }, 100000);

  test("pre-cuartos", async () => {
    for (const match of pc) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=PC1");
    const response7 = await request(app).get("/API/matchQuery?code=CF2");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Cuartos de final", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=CF1");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 24", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 25).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 6,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Pre-cuartos") {
        pc.push(match);
      }
      if (response.body[0].phase == "Cuartos de final") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 25)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }

    const response7 = await request(app).get("/API/matchQuery?code=PC1");
    expect(response7.body[0].teamA).not.toBe("5");
  }, 100000);

  test("pre-cuartos", async () => {
    for (const match of pc) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );

      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=PC1");
    const response7 = await request(app).get("/API/matchQuery?code=CF3");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Cuartos de final", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=CF1");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 20", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 21).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 5,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Pre-cuartos") {
        pc.push(match);
      }
      if (response.body[0].phase == "Cuartos de final") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 21)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }

    const response7 = await request(app).get("/API/matchQuery?code=PC1");
    expect(response7.body[0].teamA).not.toBe("7");
  }, 100000);

  test("pre-cuartos", async () => {
    for (const match of pc) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );

      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=PC1");
    const response7 = await request(app).get("/API/matchQuery?code=CF4");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Cuartos de final", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=CF1");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 16", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 17).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 4,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Cuartos de final") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 17)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }

    const response2 = await request(app).get("/API/tournaments");
    const response7 = await request(app).get("/API/matchQuery?code=CF2");
    expect(response7.body[0].teamA).toBe(
      response2.body[0].boardGroups[1][0].team,
    );
  }, 100000);

  test("Cuartos de final", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=CF1");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 12", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 13).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 3,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Pre-semifinal") {
        cf.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 13)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }

    const response7 = await request(app).get("/API/matchQuery?code=PS1");
    expect(response7.body[0].teamA).not.toBe("3");
  }, 100000);

  test("Pre-semifinal", async () => {
    for (const match of cf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=PS1");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamB).toBe(response6.body[0].teamA);
  }, 40000);

  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});

describe("Tournament working 8", () => {
  test("create tournament", async () => {
    groups = [];
    of = [];
    pc = [];
    cf = [];
    ps = [];
    sf = [];
    f = [];
    const response = await request(app)
      .post("/API/tournament/create")
      .send({
        name: "Copa Caribe",
        category: "2016",
        edition: "2026",
        city: "Barranquilla",
        department: "Atlántico",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        teams: teamsCreated.slice(0, 9).map((team) => team.id),
        teamsPerGroup: 4,
        numberGroups: 2,
        numberPlayers: 7,
        matchLong: 45,
        AutomatedSorteo: true,
        boardGroups: [],
        isParent: false,
        parent: null,
      })
      .set("Authorization", `Bearer ${code}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("tournament done");

    const response2 = await request(app).get("/API/tournaments");

    expect(response2.status).toBe(200);
    expect(response2.body[0].name).toBe("Copa Caribe");
    tournamentCreated = response2.body[0];
  });

  test("groups stage", async () => {
    for (const match of tournamentCreated.matches) {
      const response = await request(app).get("/API/match/" + match);

      if (response.body[0].phase == "Grupos") {
        groups.push(match);
      }
      if (response.body[0].phase == "Semifinal") {
        sf.push(match);
      }
      if (response.body[0].phase == "Final") {
        f.push(match);
      }
    }

    // inscribe all the teams
    for (const team of teamsCreated.slice(0, 8)) {
      await request(app)
        .patch("/API/tournament/inscribeTeam/" + tournamentCreated.id)
        .send({ team: team.id, players: team.players });
    }
    for (const match of groups) {
      const response = await request(app).get("/API/match/" + match);

      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      for (let i = 0; i < 2; ++i) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        const response5 = await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "5",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      const response5 = await request(app).get("/API/match/" + match);

      if (
        response5.body[0].result.split("-")[0] ==
        response5.body[0].result.split("-")[1]
      ) {
        const teamS =
          teamsToChoose[Math.floor(Math.random() * teamsToChoose.length)];
        let player;
        if (teamS == "A") {
          player = response3.body[0].players[4];
        }
        if (teamS == "B") {
          player = response2.body[0].players[4];
        }
        await request(app)
          .patch("/API/match/addEvent/" + match)
          .send({
            event: {
              description: "Gol",
              team: teamS,
              tipo: "Penalty Goal",
              playersRelated: [player],
              minute: "30",
            },
          })
          .set("Authorization", `Bearer ${code}`);
      }

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }

    const response2 = await request(app).get("/API/tournaments");
    const response7 = await request(app).get("/API/matchQuery?code=SF1");
    expect(response7.body[0].teamA).not.toBe(response2.body[0].boardGroups[0][0]);
  }, 100000);


  test("Semifinal", async () => {
    for (const match of sf) {
      const response = await request(app).get("/API/match/" + match);
      const response2 = await request(app).get(
        "/API/team/" + response.body[0].teamA,
      );
      const response3 = await request(app).get(
        "/API/team/" + response.body[0].teamB,
      );

      const response4 = await request(app)
        .patch("/API/match/update/" + match)
        .send({
          match: {
            formacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            finalFormacionA: {
              starters: response2.body[0].players.slice(0, 8),
              subPlayers: response2.body[0].players.slice(7, 15),
              distribution: "3-3",
            },
            formacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
            finalFormacionB: {
              starters: response3.body[0].players.slice(0, 8),
              subPlayers: response3.body[0].players.slice(7, 15),
              distribution: "3-2-1",
            },
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response5 = await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Gol",
            team: "A",
            tipo: "Penalty Goal",
            playersRelated: [response2.body[0].players[4]],
            minute: "5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Final",
            playersRelated: response2.body[0].players
              .slice(0, 8)
              .concat(response3.body[0].players.slice(0, 8)),
            minute: "90+5",
          },
        })
        .set("Authorization", `Bearer ${code}`);

      await request(app)
        .patch("/API/match/addEvent/" + match)
        .send({
          event: {
            description: "Fin del partido",
            team: "NA",
            tipo: "Positions",
            playersRelated: [],
          },
        })
        .set("Authorization", `Bearer ${code}`);

      const response6 = await request(app).get("/API/match/" + match);
      expect(response6.body[0].status).toBe("Finalizado");
    }
    const response6 = await request(app).get("/API/matchQuery?code=SF1");
    const response7 = await request(app).get("/API/matchQuery?code=F");
    expect(response7.body[0].teamA).toBe(response6.body[0].teamA);
  }, 40000);

  test("Delete tournament", async () => {
    const response6 = await request(app)
      .delete("/API/tournament/delete/" + tournamentCreated.id)
      .set("Authorization", `Bearer ${code}`);
    expect(response6.body.success).toBe("Tournament was successfully deleted");
  });
});
