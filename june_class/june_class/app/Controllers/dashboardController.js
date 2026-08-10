const path = require('path');
const rootDir = path.join(__dirname, '..');

// Exact Spelled Models
const Product = require(path.join(rootDir, 'models', 'Product'));
const Category = require(path.join(rootDir, 'models', 'Category'));

exports.getDashboardHome = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          "totals": [{ $group: { _id: null, totalProducts: { $sum: 1 } } }],
          "categoryBreakdown": [
            { $group: { _id: "$categoryId", count: { $sum: 1 } } },
            { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
            { $unwind: "$cat" },
            { $project: { name: "$cat.name", count: 1 } }
          ],
          "subcategoryBreakdown": [
            { $group: { _id: "$subcategoryId", count: { $sum: 1 } } },
            { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "sub" } },
            { $unwind: "$sub" },
            { $project: { name: "$sub.name", count: 1 } }
          ]
        }
      }
    ]);

    const itemsCount = await Category.aggregate([
      {
        $group: {
          _id: { $cond: [{ $ifNull: ["$parentId", false] }, "subcategory", "category"] },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalCats = 0, totalSubs = 0;
    itemsCount.forEach(i => {
      if(i._id === 'category') totalCats = i.count;
      if(i._id === 'subcategory') totalSubs = i.count;
    });

    res.render('dashboard/home', { 
      stats: stats[0], 
      totalCats, 
      totalSubs 
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};