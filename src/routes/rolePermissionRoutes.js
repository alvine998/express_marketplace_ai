const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles with enabled permissions count
 *     tags: [Role Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get("/", auth, admin, rolePermissionController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Get all permissions and their status for a specific role
 *     tags: [Role Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role permissions data
 */
router.get(
  "/:id/permissions",
  auth,
  admin,
  rolePermissionController.getRolePermissions,
);

/**
 * @swagger
 * /api/roles/{id}/permissions/toggle:
 *   post:
 *     summary: Toggle a permission for a role
 *     tags: [Role Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission toggled successfully
 */
router.post(
  "/:id/permissions/toggle",
  auth,
  admin,
  rolePermissionController.toggleRolePermission,
);

module.exports = router;
