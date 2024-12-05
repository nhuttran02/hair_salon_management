// const knex = require("../database/knex");
// const Paginator = require("./paginator");
// const bcrypt = require("bcryptjs");
// const Joi = require("joi");
// const ApiError = require("../api-error");


// function userRepository() {
//   return knex("user_system");
// }

// function readUser(payload) {
//   return {
//     user_username: payload.user_username,
//     user_password: payload.user_password,
//     user_name: payload.user_name,
//     gender_id: payload.gender_id, // Chuyển từ user_gender sang gender_id
//     user_role: payload.user_role,
//     user_phone: payload.user_phone,
//     user_email: payload.user_email,
//     user_created_at: payload.user_created_at,
//     user_updated_at: payload.user_updated_at,
//   };
// }

// // // Schema kiểm tra dữ liệu đầu vào cho user
// // const userSchema = Joi.object({
// //   user_username: Joi.string().required(),
// //   user_password: Joi.string().min(5).required(),
// //   user_name: Joi.string().optional(),
// //   gender_id: Joi.number().integer().optional(), // Thay đổi từ user_gender sang gender_id
// //   user_role: Joi.number().optional(),
// //   user_phone: Joi.string()
// //     .pattern(/^[0-9]{10,15}$/)
// //     .optional(),
// //   user_email: Joi.string().email().optional(),
// //   province_code: Joi.string().required(), // Add address-related fields for creating address after user
// //   district_code: Joi.string().required(),
// //   ward_code: Joi.string().required(),
// //   street: Joi.string().required(),
// // });

// // Schema kiểm tra dữ liệu đầu vào cho user
// const userSchema = Joi.object({
//   user_username: Joi.string().required(),
//   user_password: Joi.string().min(5).required(),
//   user_name: Joi.string().optional(),
//   gender_id: Joi.number().integer().optional(), // Thay đổi từ user_gender sang gender_id
//   user_role: Joi.number().optional(),
//   user_phone: Joi.string()
//     .pattern(/^[0-9]{10,15}$/)
//     .optional(),
//   user_email: Joi.string().email().optional(),
//   user_address: Joi.object({
//     street: Joi.string().required(),
//     province_code: Joi.number().integer().required(),
//     district_code: Joi.number().integer().required(),
//     ward_code: Joi.number().integer().required(),
//   }).required(), // Address is now a required object with its fields being required as well
// });


// // // Tạo một user mới
// // async function createUser(payload) {
// //   const { error } = userSchema.validate(payload);
// //   if (error) {
// //     console.error("Validation error:", error.details[0].message);
// //     throw new Error(error.details[0].message);
// //   }

// //   // Kiểm tra gender_id có tồn tại
// //   if (payload.gender_id) {
// //     const genderExists = await knex("gender")
// //       .where("gender_id", payload.gender_id)
// //       .first();
// //     if (!genderExists) {
// //       throw new Error("Invalid gender_id: Gender does not exist");
// //     }
// //   }

// //   const user = readUser(payload);
// //   user.user_password = await bcrypt.hash(user.user_password, 10); // Mã hóa mật khẩu
// //   user.user_created_at = new Date().toISOString();
// //   user.user_updated_at = new Date().toISOString();

// //   try {
// //     // Tạo người dùng trước tiên, không có user_address_id
// //     const [user_id] = await userRepository().insert(user);

// //     // Thêm thông tin địa chỉ vào bảng address
// //     const address = {
// //       province_code: payload.province_code,
// //       district_code: payload.district_code,
// //       ward_code: payload.ward_code,
// //       street: payload.street,
// //     };
// //     const [address_id] = await knex("address").insert(address);

// //     // Cập nhật user với user_address_id
// //     await userRepository().where("user_id", user_id).update({
// //       user_address_id: address_id,
// //     });

// //     const { user_password, ...userWithoutPassword } = user; // Loại bỏ mật khẩu khi trả về
// //     return { user_id, user_address_id: address_id, ...userWithoutPassword };
// //   } catch (error) {
// //     console.error("Error inserting user to DB:", error.message);
// //     throw error;
// //   }
// // }

// // Tạo một người dùng mới
// async function createUser(req, res, next) {
//   if (
//     !req.body?.user_username ||
//     typeof req.body.user_username !== "string" ||
//     req.body.user_username.trim() === ""
//   ) {
//     return next(new ApiError(400, "Username should be a non-empty string"));
//   }

//   if (
//     !req.body?.user_password ||
//     typeof req.body.user_password !== "string" ||
//     req.body.user_password.trim() === ""
//   ) {
//     return next(new ApiError(400, "Password should be a non-empty string"));
//   }

//   try {
//     // Gọi đến userService để tạo người dùng
//     const user = await userService.createUser({ ...req.body });

//     // Insert address into the address table
//     const address = req.body.user_address;
//     const [address_id] = await knex("address").insert({
//       street: address.street,
//       province_code: address.province_code,
//       district_code: address.district_code,
//       ward_code: address.ward_code,
//     });

//     // Update user with address_id
//     await knex("user_system").where("user_id", user.user_id).update({
//       user_address_id: address_id,
//     });

//     return res
//       .status(201)
//       .set({
//         Location: `${req.baseUrl}/${user.user_id}`,
//       })
//       .json(
//         JSend.success({
//           user: { ...user, user_address_id: address_id }, // Include address_id in response
//         })
//       );
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(500, "An error occurred while creating the user"));
//   }
// }


// // Lấy danh sách users theo các tiêu chí tìm kiếm và phân trang
// async function getManyUsers(query) {
//   const {
//     user_username,
//     user_name,
//     gender_id,
//     user_phone,
//     user_role,
//     page = 1,
//     limit = 5,
//     sortBy = "user_created_at",
//     order = "desc",
//   } = query;

//   const paginator = new Paginator(page, limit);

//   let results = await knex("user_system as u")
//     .leftJoin("address as a", "u.user_address_id", "a.address_id")
//     .leftJoin("gender as g", "u.gender_id", "g.gender_id") // Liên kết với bảng gender
//     .where((builder) => {
//       if (user_username) {
//         builder.where("user_username", "like", `%${user_username}%`);
//       }
//       if (user_name) {
//         builder.where("user_name", "like", `%${user_name}%`);
//       }
//       if (user_role) {
//         builder.where("user_role", "=", user_role);
//       }
//       if (gender_id) {
//         builder.where("u.gender_id", "=", gender_id);
//       }
//       if (user_phone) {
//         builder.where("user_phone", "like", `%${user_phone}%`);
//       }
//     })
//     .select(
//       knex.raw("count(u.user_id) OVER() AS recordCount"),
//       "u.user_id",
//       "u.user_username",
//       "u.user_name",
//       "g.gender_name as user_gender", // Lấy tên giới tính từ bảng gender
//       "u.user_role",
//       "u.user_phone",
//       "u.user_email",
//       "a.street",
//       "a.province_code",
//       "a.district_code",
//       "a.ward_code",
//       "u.user_created_at",
//       "u.user_updated_at"
//     )
//     .orderBy(sortBy, order)
//     .limit(paginator.limit)
//     .offset(paginator.offset);

//   let totalRecords = 0;
//   results = results.map((result) => {
//     totalRecords = result.recordCount;
//     delete result.recordCount;
//     return result;
//   });

//   return {
//     metadata: paginator.getMetadata(totalRecords),
//     users: results,
//   };
// }

// // Lấy thông tin user theo ID
// async function getUserById(user_id) {
//   return await userRepository()
//     .leftJoin("address as a", "user_system.user_address_id", "a.address_id")
//     .select(
//       "user_system.*",
//       "a.street",
//       "a.province_code",
//       "a.district_code",
//       "a.ward_code"
//     )
//     .where("user_id", user_id)
//     .first();
// }

// // Update user by ID
// async function updateUser(user_id, payload) {
//   const { error } = userSchema.validate(payload);
//   if (error) {
//     console.error("Validation error:", error.details[0].message);
//     throw new Error(error.details[0].message);
//   }

//   const existingUser = await userRepository()
//     .where("user_id", user_id)
//     .select("*")
//     .first();

//   if (!existingUser) {
//     return null;
//   }

//   const updatedFields = readUser(payload);

//   // Validate address_id if provided
//   if (updatedFields.user_address_id) {
//     const addressExists = await knex("address")
//       .where("address_id", updatedFields.user_address_id)
//       .first();
//     if (!addressExists) {
//       throw new Error("Invalid address_id: Address does not exist");
//     }
//   }

//   // Validate gender_id if provided
//   if (updatedFields.gender_id) {
//     const genderExists = await knex("gender")
//       .where("gender_id", updatedFields.gender_id)
//       .first();
//     if (!genderExists) {
//       throw new Error("Invalid gender_id: Gender does not exist");
//     }
//   }

//   // Hash the password if it's being updated
//   if (updatedFields.user_password) {
//     updatedFields.user_password = await bcrypt.hash(
//       updatedFields.user_password,
//       10
//     );
//   }

//   updatedFields.user_updated_at = new Date().toISOString();

//   await userRepository().where("user_id", user_id).update(updatedFields);

//   return { ...existingUser, ...updatedFields };
// }

// // Delete user by ID
// async function deleteUser(user_id) {
//   const userToDelete = await userRepository().where("user_id", user_id).first();

//   if (!userToDelete) {
//     return null;
//   }

//   await userRepository().where("user_id", user_id).del();
//   return userToDelete;
// }

// // Delete all users
// async function deleteAllUsers() {
//   const deletedCount = await userRepository().del();
//   return deletedCount;
// }

// // Get user by username
// async function getUserByUsername(user_username) {
//   return await userRepository()
//     .where("user_username", user_username)
//     .select("*")
//     .first();
// }


// module.exports = {
//   userRepository,
//   readUser,
//   createUser,
//   getManyUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   deleteAllUsers,
//   getUserByUsername,
// };

const knex = require("../database/knex");
const Paginator = require("./paginator");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const ApiError = require("../api-error");

function userRepository() {
  return knex("user_system");
}

function readUser(payload) {
  return {
    user_username: payload.user_username,
    user_password: payload.user_password,
    user_name: payload.user_name,
    gender_id: payload.gender_id, // Chuyển từ user_gender sang gender_id
    user_role: payload.user_role,
    user_phone: payload.user_phone,
    user_email: payload.user_email,
    user_created_at: payload.user_created_at,
    user_updated_at: payload.user_updated_at,
  };
}

// Schema kiểm tra dữ liệu đầu vào cho user
const userSchema = Joi.object({
  user_username: Joi.string().required(),
  user_password: Joi.string().min(5).required(),
  user_name: Joi.string().optional(),
  gender_id: Joi.number().integer().optional(), // Thay đổi từ user_gender sang gender_id
  user_role: Joi.number().optional(),
  user_phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  user_email: Joi.string().email().optional(),
  user_address: Joi.object({
    street: Joi.string().required(),
    province_code: Joi.number().integer().required(),
    district_code: Joi.number().integer().required(),
    ward_code: Joi.number().integer().required(),
  }).required(), // Address is now a required object with its fields being required as well
});

// Tạo một người dùng mới
async function createUser(payload) {
  const { error } = userSchema.validate(payload);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Kiểm tra gender_id có tồn tại
  if (payload.gender_id) {
    const genderExists = await knex("gender")
      .where("gender_id", payload.gender_id)
      .first();
    if (!genderExists) {
      throw new ApiError(400, "Invalid gender_id: Gender does not exist");
    }
  }

  // Hash mật khẩu người dùng
  payload.user_password = await bcrypt.hash(payload.user_password, 10);
  payload.user_created_at = new Date().toISOString();
  payload.user_updated_at = new Date().toISOString();

  // Tạo người dùng trong bảng user_system
  const user = readUser(payload);
  let user_id;

  try {
    [user_id] = await userRepository().insert(user);
  } catch (error) {
    console.error("Error inserting user to DB:", error.message);
    throw new ApiError(500, "An error occurred while creating the user");
  }

  // Thêm địa chỉ vào bảng address
  let address_id;
  try {
    [address_id] = await knex("address").insert(payload.user_address);
  } catch (error) {
    console.error("Error inserting address to DB:", error.message);
    throw new ApiError(
      500,
      "An error occurred while adding the user's address"
    );
  }

  // Cập nhật bảng user_system với address_id
  try {
    await userRepository().where("user_id", user_id).update({
      user_address_id: address_id,
    });
  } catch (error) {
    console.error("Error updating user with address_id:", error.message);
    throw new ApiError(
      500,
      "An error occurred while updating the user's address information"
    );
  }

  const { user_password, ...userWithoutPassword } = user; // Loại bỏ mật khẩu khi trả về
  return { user_id, user_address_id: address_id, ...userWithoutPassword };
}

// Lấy danh sách users theo các tiêu chí tìm kiếm và phân trang
async function getManyUsers(query) {
  const {
    user_username,
    user_name,
    gender_id,
    user_phone,
    user_role,
    page = 1,
    limit = 5,
    sortBy = "user_created_at",
    order = "desc",
  } = query;

  const paginator = new Paginator(page, limit);

  let results = await knex("user_system as u")
    .leftJoin("address as a", "u.user_address_id", "a.address_id")
    .leftJoin("gender as g", "u.gender_id", "g.gender_id")
    .where((builder) => {
      if (user_username) {
        builder.where("user_username", "like", `%${user_username}%`);
      }
      if (user_name) {
        builder.where("user_name", "like", `%${user_name}%`);
      }
      if (user_role) {
        builder.where("user_role", "=", user_role);
      }
      if (gender_id) {
        builder.where("u.gender_id", "=", gender_id);
      }
      if (user_phone) {
        builder.where("user_phone", "like", `%${user_phone}%`);
      }
    })
    .select(
      knex.raw("count(u.user_id) OVER() AS recordCount"),
      "u.user_id",
      "u.user_username",
      "u.user_name",
      "g.gender_name as user_gender",
      "u.user_role",
      "u.user_phone",
      "u.user_email",
      "a.street",
      "a.province_code",
      "a.district_code",
      "a.ward_code",
      "u.user_created_at",
      "u.user_updated_at"
    )
    .orderBy(sortBy, order)
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
    users: results,
  };
}

// Lấy thông tin user theo ID
async function getUserById(user_id) {
  return await userRepository()
    .leftJoin("address as a", "user_system.user_address_id", "a.address_id")
    .select(
      "user_system.*",
      "a.street",
      "a.province_code",
      "a.district_code",
      "a.ward_code"
    )
    .where("user_id", user_id)
    .first();
}

// Update user by ID
async function updateUser(user_id, payload) {
  const { error } = userSchema.validate(payload);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const existingUser = await userRepository().where("user_id", user_id).first();
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  if (payload.user_password) {
    payload.user_password = await bcrypt.hash(payload.user_password, 10);
  }

  payload.user_updated_at = new Date().toISOString();

  try {
    await userRepository().where("user_id", user_id).update(payload);
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new ApiError(500, "An error occurred while updating the user");
  }

  return { ...existingUser, ...payload };
}

// Delete user by ID
async function deleteUser(user_id) {
  const userToDelete = await userRepository().where("user_id", user_id).first();
  if (!userToDelete) {
    throw new ApiError(404, "User not found");
  }

  try {
    await userRepository().where("user_id", user_id).del();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw new ApiError(500, "An error occurred while deleting the user");
  }

  return userToDelete;
}

// Delete all users
async function deleteAllUsers() {
  try {
    const deletedCount = await userRepository().del();
    return deletedCount;
  } catch (error) {
    console.error("Error deleting all users:", error.message);
    throw new ApiError(500, "An error occurred while deleting all users");
  }
}

// Get user by username
async function getUserByUsername(user_username) {
  return await userRepository().where("user_username", user_username).first();
}

module.exports = {
  userRepository,
  readUser,
  createUser,
  getManyUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
  getUserByUsername,
};
