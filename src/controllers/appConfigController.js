const AppConfig = require("../models/AppConfig");
const { logActivity } = require("../utils/loggingUtils");

exports.getAppConfig = async (req, res) => {
  try {
    const { key } = req.params;
    const config = await AppConfig.findOne({ where: { key } });

    if (!config) {
      return res
        .status(404)
        .json({ message: `Config for key '${key}' not found` });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving app config" });
  }
};

exports.updateAppConfig = async (req, res) => {
  try {
    const { key, value } = req.body;

    const [config, created] = await AppConfig.findOrCreate({
      where: { key },
      defaults: { value },
    });

    if (!created) {
      await config.update({ value });
    }

    await logActivity(req, "UPDATE_APP_CONFIG", { key, created });

    res.status(200).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating app config" });
  }
};
