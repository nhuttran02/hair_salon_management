const knex = require("../database/knex");
const Paginator = require("./paginator");

function branchRepository() {
  return knex("branch");
}

function readBranch(payload) {
  return {
    branch_name: payload.branch_name,
    branch_address: payload.branch_address,
    branch_created_at: payload.branch_created_at,
    branch_updated_at: payload.branch_updated_at,
  };
}

async function createBranch(payload) {
  const branch = readBranch(payload);
  const [branch_id] = await branchRepository().insert(branch);
  return { branch_id, ...branch };
}

async function getManyBranches(query) {
  const { branch_name, branch_address, page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  let results = await branchRepository()
    .where((builder) => {
      if (branch_name) {
        builder.where("branch_name", "like", `%${branch_name}%`);
      }
      if (branch_address) {
        builder.where("branch_address", "like", `%${branch_address}%`);
      }
    })
    .select(
      knex.raw("count(branch_id) OVER() AS recordCount"),
      "branch_id",
      "branch_name",
      "branch_address",
      "branch_created_at",
      "branch_updated_at"
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    branch: results,
  };
}

async function getBranchById(branch_id) {
  return branchRepository().where("branch_id", branch_id).select("*").first();
}

async function updateBranch(branch_id, payload) {
  const existingBranch = await branchRepository()
    .where("branch_id", branch_id)
    .select("*")
    .first();

  if (!existingBranch) {
    return null;
  }

  const update = { ...payload };

  await branchRepository().where("branch_id", branch_id).update(update);

  return { ...existingBranch, ...update };
}

async function deleteBranch(branch_id) {
  const deletedBranch = await branchRepository()
    .where("branch_id", branch_id)
    .first();

  if (!deletedBranch) {
    return null;
  }

  await branchRepository().where("branch_id", branch_id).del();

  return deletedBranch;
}

async function deleteAllBranches() {
  return await branchRepository().del();
}

module.exports = {
  branchRepository,
  readBranch,
  createBranch,
  getManyBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  deleteAllBranches,
};