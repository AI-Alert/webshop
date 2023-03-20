export const EXAMPLE_USER = {
  id: '123',
  photoUrl:
    'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
  name: 'Tom Sample Org.',
  description: 'Tom sample description',
  contactName: 'Tom',
  email: 'tom@sample.com',
  phoneNumber: '1234567890',
  address: 'Fake str. 17',
  websiteUrl: 'https://tom-sample.com',
  category: {},
  status: 'active',
  verification: {},
};

export const EXAMPLE_PRODUCT = {
  id: '123',
  name: 'HP Pavilion VII',
  photoUrl:
    'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
  description: 'Great laptop to office work',
  oldPrice: 0,
  newPrice: 0,
  discount: 0,
  rate: 0,
  manufacturer: 'HP',
  manufacturerCountry: 'India',
  brand: {
    id: '123',
    name: 'HP',
    photoUrl:
      'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
    description: 'Big company, which produces devices for a different goals',
  },
  category: {
    id: '123',
    name: 'Laptops',
    photoUrl:
      'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
    description: 'Portable computer for different tasks',
  },
  reviews: [
    {
      id: '123',
      advantage: 'Advantage text',
      disadvantage: 'Disadvantage text',
      comment: 'Comment text',
      rate: 0,
      deletedAt: '',
    },
  ],
};

export const EXAMPLE_CATEGORY = {
  id: '123',
  name: 'Laptops',
  photoUrl:
    'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
  description: 'Portable computer for different tasks',
};

export const EXAMPLE_BRAND = {
  id: '123',
  name: 'HP',
  photoUrl:
    'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
  description: 'Big company, which produces devices for a different goals',
};

export const EXAMPLE_REVIEWS = {
  id: '123',
  advantage: 'Advantage text',
  disadvantage: 'Disadvantage text',
  comment: 'Comment text',
  rate: 0,
  deletedAt: '',
  product: {
    id: '123',
    name: 'HP Pavilion VII',
    photoUrl:
      'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
    description: 'Great laptop to office work',
    oldPrice: 0,
    newPrice: 0,
    discount: 0,
    rate: 0,
    manufacturer: 'HP',
    manufacturerCountry: 'India',
    brand: {
      id: '123',
      name: 'HP',
      photoUrl:
        'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
      description: 'Big company, which produces devices for a different goals',
    },
    category: {
      id: '123',
      name: 'Laptops',
      photoUrl:
        'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
      description: 'Portable computer for different tasks',
    },
    reviews: [
      {
        id: '123',
        advantage: 'Advantage text',
        disadvantage: 'Disadvantage text',
        comment: 'Comment text',
        rate: 0,
        deletedAt: '',
      },
    ],
  },
};

export const EXAMPLE_CART = {
  id: '123',
  total: 'Advantage text',
};
