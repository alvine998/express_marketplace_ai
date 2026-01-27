const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const { logActivity } = require("../utils/loggingUtils");
const sequelize = require("../config/database");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM role_permissions AS rp
              WHERE rp.roleId = Role.id
            )`),
            "permissionsEnabled",
          ],
        ],
      },
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving roles" });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const allPermissions = await Permission.findAll();
    const enabledPermissions = await RolePermission.findAll({
      where: { roleId: id },
      attributes: ["permissionId"],
    });

    const enabledIds = enabledPermissions.map((p) => p.permissionId);

    // Group permissions by category
    const grouped = allPermissions.reduce((acc, p) => {
      const category = p.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        ...p.toJSON(),
        isEnabled: enabledIds.includes(p.id),
      });
      return acc;
    }, {});

    res.status(200).json({
      role,
      permissions: grouped,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error retrieving role permissions" });
  }
};

exports.toggleRolePermission = async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const { permissionId } = req.body;

    const role = await Role.findByPk(id);
    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      return res.status(404).json({ message: "Role or Permission not found" });
    }

    const existing = await RolePermission.findOne({
      where: { roleId: id, permissionId },
    });

    if (existing) {
      await existing.destroy();
      await logActivity(req, "REMOVE_PERMISSION_FROM_ROLE", {
        role: role.name,
        permission: permission.name,
      });
      return res
        .status(200)
        .json({ message: "Permission removed", isEnabled: false });
    } else {
      await RolePermission.create({ roleId: id, permissionId });
      await logActivity(req, "ADD_PERMISSION_TO_ROLE", {
        role: role.name,
        permission: permission.name,
      });
      return res
        .status(200)
        .json({ message: "Permission added", isEnabled: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error toggling role permission" });
  }
};
