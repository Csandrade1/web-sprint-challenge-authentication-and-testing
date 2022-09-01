exports.seed = async function (knex) {
  await knex("users").insert([
    {
      username: "Cynthia",
      password: "1234",
    },
  ]);
};
