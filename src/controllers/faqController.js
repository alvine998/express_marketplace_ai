const Faq = require("../models/Faq");
const { logActivity } = require("../utils/loggingUtils");

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await Faq.create({ question, answer, order });

    await logActivity(req, "CREATE_FAQ", { faqId: faq.id });

    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating FAQ" });
  }
};

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      order: [
        ["order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving FAQs" });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await Faq.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await faq.update({ question, answer, order });
    await logActivity(req, "UPDATE_FAQ", { faqId: faq.id });

    res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating FAQ" });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await faq.destroy();
    await logActivity(req, "DELETE_FAQ", { faqId: req.params.id });

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting FAQ" });
  }
};
