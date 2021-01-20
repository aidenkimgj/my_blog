import mongoose from 'mongoose';

// Create Shema
const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    default: 'Unclassified',
  },
  // 하나의 카테고리에 여러가지 글이 올라갈 수 있기 때문에 배열로 만드는 것
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
});

const Category = mongoose.model('category, CategorySchema');

export default Category;
