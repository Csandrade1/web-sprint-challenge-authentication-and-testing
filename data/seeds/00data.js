exports.seed = async function (knex) {
  await knex("users").insert([
    {
      username: "cynthia",
      password: "1234",
    },
  ]);
};
