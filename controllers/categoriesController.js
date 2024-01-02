const fs = require("fs");
const slugify = require("slugify");
const Categories = require("../models/categoriesModel");
const SubCategory = require("../models/subCategoryModel");
const SubSubCategory = require("../models/subSubCategoryModel");

// ---------------------------------------------------------------------------------------------------------
// category
// ---------------------------------------------------------------------------------------------------------

exports.addCategory = async (req, res) => {
  try {
    const { name, order } = req.body;
    const icon = req?.file?.filename ? req.file.filename : "";

    const category = {
      name,
      order,
      slug: slugify(name),
      icon,
    };

    const result = await Categories.create(category);

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    let categories = await Categories.find({})
      .sort({ order: 1 })
      .populate({
        path: "subCategories",
        populate: { path: "subSubCategories", select: "name slug" },
        select: "name slug",
      });

    res.status(200).json({
      success: true,
      message: "All categories",
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Category found successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req?.params;
    const data = req?.body;
    const icon = req.file?.filename;

    const category = await Categories.findById(id);
    const categoryIcon = category?.icon;

    let categoryData;

    if (icon) {
      categoryData = {
        ...data,
        slug: slugify(data?.name),
        icon: icon,
      };
    } else {
      categoryData = {
        ...data,
        slug: slugify(data?.name),
        icon: categoryIcon,
      };
    }

    const result = await Categories.findByIdAndUpdate(id, categoryData, {
      new: true,
    });

    if (icon && categoryIcon) {
      fs.unlink(`./uploads/categories/${categoryIcon}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req?.params;

    const category = await Categories.findById(id);
    const categoryIcon = category?.icon;

    if (categoryIcon) {
      fs.unlink(`./uploads/categories/${categoryIcon}`, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });

      res.status(200).json({
        success: true,
        message: "Delete success",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Category not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ---------------------------------------------------------------------------------------------------------
// Sub category
// ---------------------------------------------------------------------------------------------------------

exports.addSubCategory = async (req, res) => {
  try {
    const { name, categorySlug } = req.body;
    const sub_category = {
      name,
      slug: slugify(`${categorySlug}-${name}`),
    };

    const result = await SubCategory.create(sub_category);
    await Categories.updateOne(
      { slug: categorySlug },
      { $push: { subCategories: result?._id } }
    );

    res.status(200).json({
      success: true,
      message: "Sub Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ---------------------------------------------------------------------------------------------------------
// Sub SubCategory
// ---------------------------------------------------------------------------------------------------------

exports.addSubSubCategory = async (req, res) => {
  try {
    const { name, subcategorySlug } = req.body;
    const sub_subCategory = {
      name,
      slug: slugify(`${subcategorySlug}-${name}`),
    };

    const result = await SubSubCategory.create(sub_subCategory);
    await SubCategory.updateOne(
      { slug: subcategorySlug },
      { $push: { subSubCategories: result?._id } }
    );

    res.status(200).json({
      success: true,
      message: "Sub SubCategory created success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
