const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");

const seedPermissions = async () => {
  try {
    // 1. Create permissions
    const permissionsData = [
      {
        name: "View Analytics",
        category: "DASHBOARD OPERATIONS",
        slug: "view_analytics",
        description: "Access to revenue and growth charts",
      },
      {
        name: "Export Reports",
        category: "DASHBOARD OPERATIONS",
        slug: "export_reports",
        description: "Download CSV/PDF reports",
      },
      {
        name: "View Products",
        category: "INVENTORY OPERATIONS",
        slug: "view_products",
        description: "Browse all seller inventory",
      },
      {
        name: "Moderate Products",
        category: "INVENTORY OPERATIONS",
        slug: "moderate_products",
        description: "Edit or remove platform listings",
      },
      {
        name: "Manage Categories",
        category: "INVENTORY OPERATIONS",
        slug: "manage_categories",
        description: "Create and map product categories",
      },
    ];

    for (const p of permissionsData) {
      await Permission.findOrCreate({ where: { slug: p.slug }, defaults: p });
    }

    // 2. Create roles
    const superAdmin = await Role.findOrCreate({
      where: { name: "Super Admin" },
      defaults: { description: "Full access to all modules" },
    });
    const contentEditor = await Role.findOrCreate({
      where: { name: "Content Editor" },
      defaults: { description: "Access to manage content and inventory" },
    });
    const viewOnly = await Role.findOrCreate({
      where: { name: "View Only" },
      defaults: { description: "Read-only access for reporting" },
    });

    // 3. Assign permissions to Super Admin (All)
    const allPermissions = await Permission.findAll();
    for (const p of allPermissions) {
      await RolePermission.findOrCreate({
        where: { roleId: superAdmin[0].id, permissionId: p.id },
      });
    }

    // 4. Assign permissions to Content Editor (Moderate Products, Manage Categories, View Products, View Analytics)
    const editorSlugs = [
      "view_products",
      "moderate_products",
      "manage_categories",
      "view_analytics",
    ];
    for (const slug of editorSlugs) {
      const p = await Permission.findOne({ where: { slug } });
      if (p) {
        await RolePermission.findOrCreate({
          where: { roleId: contentEditor[0].id, permissionId: p.id },
        });
      }
    }

    // 5. Assign permissions to View Only (View Products, View Analytics)
    const viewSlugs = ["view_products", "view_analytics"];
    for (const slug of viewSlugs) {
      const p = await Permission.findOne({ where: { slug } });
      if (p) {
        await RolePermission.findOrCreate({
          where: { roleId: viewOnly[0].id, permissionId: p.id },
        });
      }
    }

    console.log("Roles and Permissions seeded successfully!");
  } catch (error) {
    console.error("Error seeding roles and permissions:", error);
  }
};

module.exports = seedPermissions;
