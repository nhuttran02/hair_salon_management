// const userService = require("../services/users.service");
// const ApiError = require("../api-error");
// const JSend = require("../jsend");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const knex = require("../database/knex");

// // // Tạo một người dùng mới
// // async function createUser(req, res, next) {
// //   if (
// //     !req.body?.user_username ||
// //     typeof req.body.user_username !== "string" ||
// //     req.body.user_username.trim() === ""
// //   ) {
// //     return next(new ApiError(400, "Username should be a non-empty string"));
// //   }

// //   if (
// //     !req.body?.user_password ||
// //     typeof req.body.user_password !== "string" ||
// //     req.body.user_password.trim() === ""
// //   ) {
// //     return next(new ApiError(400, "Password should be a non-empty string"));
// //   }

// //   try {
// //     // Kiểm tra address_id có tồn tại trước khi tạo user mới
// //     if (req.body.user_address_id) {
// //       const addressExists = await knex("address")
// //         .where("address_id", req.body.user_address_id)
// //         .first();
// //       if (!addressExists) {
// //         return next(
// //           new ApiError(400, "Invalid address_id: Address does not exist")
// //         );
// //       }
// //     }

// //     // Gọi đến userService để tạo người dùng
// //     const user = await userService.createUser({ ...req.body });
// //     return res
// //       .status(201)
// //       .set({
// //         Location: `${req.baseUrl}/${user.user_id}`,
// //       })
// //       .json(
// //         JSend.success({
// //           user,
// //         })
// //       );
// //   } catch (error) {
// //     console.log(error);
// //     return next(new ApiError(500, "An error occurred while creating the user"));
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
//     // Tạo người dùng mới trước
//     const { user_address, ...userData } = req.body;

//     const user = await userService.createUser({ ...userData });

//     // Chèn thông tin địa chỉ vào bảng address nếu được cung cấp
//     if (user_address) {
//       const [address_id] = await knex("address").insert(user_address).returning("address_id");
//       if (!address_id) {
//         return next(new ApiError(500, "Failed to create address information"));
//       }

//       // Cập nhật địa chỉ vào user vừa được tạo
//       await userService.updateUser(user.user_id, { user_address_id: address_id });
//       user.user_address_id = address_id;
//     }

//     return res
//       .status(201)
//       .set({
//         Location: `${req.baseUrl}/${user.user_id}`,
//       })
//       .json(
//         JSend.success({
//           user,
//         })
//       );
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(500, "An error occurred while creating the user"));
//   }
// }


// // Lấy danh sách người dùng theo tiêu chí tìm kiếm và phân trang
// async function getUsersByFilter(req, res, next) {
//   let result = {
//     users: [],
//     metadata: {
//       totalRecords: 0,
//       firstPage: 1,
//       lastPage: 1,
//       page: 1,
//       limit: 5,
//     },
//   };

//   try {
//     result = await userService.getManyUsers(req.query);
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(500, "An error occurred while retrieving users"));
//   }

//   return res.json(
//     JSend.success({
//       users: result.users,
//       metadata: result.metadata,
//     })
//   );
// }

// // Lấy thông tin người dùng theo ID
// async function getUser(req, res, next) {
//   try {
//     const user = await userService.getUserById(req.params.user_id);
//     if (!user) {
//       return res.status(404).json(JSend.fail("User not found"));
//     }

//     // Loại bỏ mật khẩu trước khi trả về phản hồi
//     const { user_password, ...userWithoutPassword } = user;

//     return res.json(JSend.success({ user: userWithoutPassword }));
//   } catch (error) {
//     console.log("Error while fetching user:", error.message);
//     return next(
//       new ApiError(500, "An error occurred while fetching user information")
//     );
//   }
// }

// // Cập nhật thông tin người dùng
// async function updateUser(req, res, next) {
//   if (Object.keys(req.body).length === 0) {
//     return next(new ApiError(400, "Data to update cannot be empty"));
//   }

//   const { user_id } = req.params;

//   try {
//     // Nếu address_id được gửi kèm, kiểm tra tính hợp lệ
//     if (req.body.user_address_id) {
//       const addressExists = await knex("address")
//         .where("address_id", req.body.user_address_id)
//         .first();
//       if (!addressExists) {
//         return next(
//           new ApiError(400, "Invalid address_id: Address does not exist")
//         );
//       }
//     }

//     // Nếu mật khẩu được gửi kèm, mã hóa mật khẩu
//     if (req.body.user_password) {
//       req.body.user_password = await bcrypt.hash(req.body.user_password, 10);
//     }

//     const updated = await userService.updateUser(user_id, { ...req.body });
//     if (!updated) {
//       return next(new ApiError(404, "User not found"));
//     }
//     return res.json(
//       JSend.success({
//         user: updated,
//       })
//     );
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(500, `Error updating user with id=${user_id}`));
//   }
// }

// // Xóa người dùng theo ID
// async function deleteUser(req, res, next) {
//   const { user_id } = req.params;

//   try {
//     const deletedUser = await userService.deleteUser(user_id);
//     if (!deletedUser) {
//       return next(new ApiError(404, `User with id=${user_id} not found`));
//     }
//     return res.json(
//       JSend.success({
//         message: `User with id=${user_id} has been deleted`,
//       })
//     );
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(500, `Could not delete user with id=${user_id}`));
//   }
// }

// // Xóa tất cả người dùng
// async function deleteAllUsers(req, res, next) {
//   try {
//     const deletedCount = await userService.deleteAllUsers();
//     return res.json(
//       JSend.success({
//         message: `${deletedCount} users have been deleted`,
//       })
//     );
//   } catch (error) {
//     console.log(error);
//     return next(
//       new ApiError(500, "An error occurred while removing all users")
//     );
//   }
// }

// // Đăng nhập người dùng
// async function loginUser(req, res, next) {
//   const { user_username, user_password } = req.body;

//   try {
//     // Lấy user từ cơ sở dữ liệu
//     const user = await userService.getUserByUsername(user_username);

//     if (!user) {
//       console.log("User not found in database for username:", user_username);
//       return next(new ApiError(404, "Username or password is incorrect"));
//     }

//     // Kiểm tra mật khẩu
//     const isMatch = await bcrypt.compare(user_password, user.user_password);
//     if (!isMatch) {
//       return next(new ApiError(401, "Username or password is incorrect"));
//     }

//     // Tạo JWT token sử dụng secret key từ file .env
//     const token = jwt.sign(
//       { user_id: user.user_id, user_role: user.user_role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" } // Token có thời hạn 1 giờ
//     );

//     // Trả về thông tin user và token cho client
//     return res.json(
//       JSend.success({ message: "Login successful", token, user })
//     );
//   } catch (error) {
//     console.log("Error during login process:", error);
//     return next(new ApiError(500, "An error occurred while logging in"));
//   }
// }

// module.exports = {
//   createUser,
//   getUsersByFilter,
//   getUser,
//   updateUser,
//   deleteUser,
//   deleteAllUsers,
//   loginUser,
// };

const userService = require("../services/users.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("../database/knex");

// Tạo một người dùng mới
async function createUser(req, res, next) {
  try {
    // Tạo người dùng mới từ req.body
    const { user_address, ...userData } = req.body;

    // Gọi service để tạo người dùng
    const user = await userService.createUser({ ...userData });

    // Chèn thông tin địa chỉ vào bảng address nếu được cung cấp
    if (user_address) {
      const [address_id] = await knex("address")
        .insert(user_address)
        .returning("address_id");
      if (!address_id) {
        return next(new ApiError(500, "Failed to create address information"));
      }

      // Cập nhật địa chỉ vào user vừa được tạo
      await userService.updateUser(user.user_id, {
        user_address_id: address_id,
      });
      user.user_address_id = address_id;
    }

    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${user.user_id}`,
      })
      .json(
        JSend.success({
          user,
        })
      );
  } catch (error) {
    console.error("Error during user creation:", error.message);
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
}

// Lấy danh sách người dùng theo tiêu chí tìm kiếm và phân trang
async function getUsersByFilter(req, res, next) {
  try {
    const result = await userService.getManyUsers(req.query);
    return res.json(
      JSend.success({
        users: result.users,
        metadata: result.metadata,
      })
    );
  } catch (error) {
    console.error("Error while retrieving users:", error.message);
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }
}

// Lấy thông tin người dùng theo ID
async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.user_id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Loại bỏ mật khẩu trước khi trả về phản hồi
    const { user_password, ...userWithoutPassword } = user;

    return res.json(JSend.success({ user: userWithoutPassword }));
  } catch (error) {
    console.error("Error while fetching user:", error.message);
    return next(
      new ApiError(500, "An error occurred while fetching user information")
    );
  }
}

// Cập nhật thông tin người dùng
async function updateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  const { user_id } = req.params;

  try {
    const updated = await userService.updateUser(user_id, { ...req.body });
    if (!updated) {
      return next(new ApiError(404, "User not found"));
    }
    return res.json(JSend.success({ user: updated }));
  } catch (error) {
    console.error("Error while updating user:", error.message);
    return next(new ApiError(500, `Error updating user with id=${user_id}`));
  }
}

// Xóa người dùng theo ID
async function deleteUser(req, res, next) {
  const { user_id } = req.params;

  try {
    const deletedUser = await userService.deleteUser(user_id);
    if (!deletedUser) {
      return next(new ApiError(404, `User with id=${user_id} not found`));
    }
    return res.json(
      JSend.success({ message: `User with id=${user_id} has been deleted` })
    );
  } catch (error) {
    console.error("Error while deleting user:", error.message);
    return next(new ApiError(500, `Could not delete user with id=${user_id}`));
  }
}

// Xóa tất cả người dùng
async function deleteAllUsers(req, res, next) {
  try {
    const deletedCount = await userService.deleteAllUsers();
    return res.json(
      JSend.success({ message: `${deletedCount} users have been deleted` })
    );
  } catch (error) {
    console.error("Error while removing all users:", error.message);
    return next(
      new ApiError(500, "An error occurred while removing all users")
    );
  }
}

// Đăng nhập người dùng
async function loginUser(req, res, next) {
  const { user_username, user_password } = req.body;

  try {
    const user = await userService.getUserByUsername(user_username);
    if (!user) {
      return next(new ApiError(404, "Username or password is incorrect"));
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return next(new ApiError(401, "Username or password is incorrect"));
    }

    // Tạo JWT token sử dụng secret key từ file .env
    const token = jwt.sign(
      { user_id: user.user_id, user_role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token có thời hạn 1 giờ
    );

    // Loại bỏ mật khẩu trước khi trả về phản hồi
    const { user_password: _, ...userWithoutPassword } = user;

    return res.json(
      JSend.success({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      })
    );
  } catch (error) {
    console.error("Error during login process:", error.message);
    return next(new ApiError(500, "An error occurred while logging in"));
  }
}

module.exports = {
  createUser,
  getUsersByFilter,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  loginUser,
};
